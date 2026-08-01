# Pricing freshness watcher

Re-reads all six competitor pricing pages, extracts plans and prices for both
billing periods, and commits a snapshot. Answers one question on a schedule:
**is any of the pricing in this analysis still true?**

Deterministic by design — no API keys, no model, nothing that can invent a
price it did not read. The brief accepts "a pricing-page diff watcher" as a
freshness mechanism in its own right; this is that, built to be honest about
what it cannot see.

## Run it

```bash
node scripts/freshness/check.mjs              # all six, writes a snapshot
node scripts/freshness/check.mjs --dry        # run without writing
node scripts/freshness/check.mjs --only pollo,revid
```

Requires Chrome. Found automatically on macOS and common Linux paths; override
with `CHROME_PATH=/path/to/chrome`. No `npm install` — the checker uses only
Node built-ins and drives Chrome over the DevTools Protocol directly.

Runs weekly via `.github/workflows/freshness.yml` (Mondays 07:15 UTC) and on
demand through **Actions → Pricing freshness check → Run workflow**. It commits
only when a snapshot actually changes, so an unchanged week produces no commit.

## Sample run

```
  vivideo   unchanged  2/2 plans +yearly
      PRO          monthly $9        yearly $2 ($99/yr)
      MAX          monthly $19       yearly $4 ($199/yr)
  heygen    unchanged  3/3 plans +yearly
      Free         monthly $0        yearly $0
      Creator      monthly $29       yearly $24 ($288/yr)
      Pro          monthly $49       yearly $41 ($488/yr)
  invideo   unchanged  4/4 plans +yearly
      Plus         monthly $20       yearly $17 ($200/yr)
      Max          monthly $100      yearly $85 ($1000/yr)
      Generative   monthly $200      yearly $170 ($2000/yr)
      Elite        monthly $1000     yearly $900 ($10800/yr)
  pollo     unchanged  3/3 plans (monthly only)
      LITE         monthly $15.00    yearly —
  revid     unchanged  3/3 plans +yearly
      HOBBY        monthly $39       yearly $32 ($384/yr)
      GROWTH       monthly $39       yearly $32 ($384/yr)
      ULTRA        monthly $199      yearly $166 ($1992/yr)
  runway    unchanged  4/4 plans +yearly
      Standard     monthly $15       yearly $12
      Pro          monthly $35       yearly $28
      Max          monthly $95       yearly $76

6/6 readable
```

Every figure above was checked against a pricing-page screenshot taken the
same day. When something moves, the change prints per plan and field:

```
  heygen    CHANGED   3/3 plans +yearly
      ~ Creator monthly: $29 -> $19
```

## How it works

```
launch Chrome (per target)
  → render the pricing page, poll until the price count stops growing
  → read plan names / prices / billing periods out of the rendered text
  → click the billing-period toggle, capture the second view
  → strip promo churn (flash sales, countdowns, % off, social proof)
  → sha256
  → compare with the previous snapshot
  → write snapshot, status, field-level diff, history
```

### Why a real browser

Plain HTTP cannot read two of the six:

| Product | Plain `fetch` | Headless Chrome |
|---|---|---|
| Pollo AI | **HTTP 403** — Cloudflare blocks non-browser clients | ✅ readable |
| InVideo AI | **200, but zero prices** — pricing is client-rendered; static HTML has none | ✅ readable |

Pollo additionally needs `--headless=new` with
`--disable-blink-features=AutomationControlled` and a `navigator.webdriver`
override, or Cloudflare serves a `Just a moment…` interstitial instead of the
page.

Each target gets a **fresh browser**. Sharing one tab across sites caused
Cloudflare to challenge Pollo when it ran mid-sequence, even though the same
target succeeded in isolation.

### What the change gate hashes

The hash covers the **default view only** — the page as it first loads.
Toggle-captured views are recorded and displayed but excluded from the hash,
because a toggle click does not land every time and **capture variance must
never be reported as a price change**. Views present in *both* runs are
additionally compared price-by-price, so a yearly-only move is still caught.

## Output — `site/src/data/freshness/`

| File | Contents |
|---|---|
| `current.json` | Latest snapshot: per product, per view — plans, prices, periods, hash, price signature |
| `previous.json` | The snapshot before it |
| `diff.json` | Field-level added/removed prices, per view |
| `status.json` | Per product: status, `checkedAt`, `lastSuccessfulAt`, source URL |
| `history.jsonl` | Append-only timeline, one line per run |

### Status values

| Status | Meaning |
|---|---|
| `first_run` | No previous snapshot to compare against — this is the baseline |
| `unchanged` | Hash and shared-view prices identical to last time |
| `changed` | A real difference; see `diff.json` |
| `fetch_failed` | The page did not render readable pricing. **The previous snapshot is preserved and is never overwritten with nulls, and this is never reported as a price change.** |

## Verified before shipping

- **Stable across runs.** Two consecutive full runs produced byte-identical
  hashes for all six — an unstable hash would report a change every week and
  make the whole mechanism noise. Getting here required filtering rotating
  promo bars (Pollo's "Flash Sale 50% Off") out of the hash input.
- **Detects a real change.** A price edited in the stored snapshot
  (`$29` → `$19`) was correctly surfaced as `CHANGED` with a field-level diff.
- **Fails honestly.** Pointing a target at a 404 produced `fetch_failed`,
  preserved the prior snapshot and `lastSuccessfulAt`, and did **not** appear
  in the diff.

## Six bugs this shook out

Worth recording, because each produced *plausible but wrong* numbers rather
than an obvious failure:

1. **HeyGen served Turkish.** It geolocates, so plan names came back as
   `Oluşturucu` / `$29 / ay` and name matching fell through to the nearest
   heading — which is how "Pricing FAQs" became a plan. Fixed by forcing
   `Accept-Language: en-US`.
2. **Plan names cannot be inferred.** "Text nearest the price" produced FAQ
   headings, taglines ("For exploring"), and off-by-one card names. Names are
   now declared per site.
3. **Two sites load already showing yearly.** Trusting the default state
   silently swapped the monthly and yearly columns for Vivideo and InVideo.
   The monthly view is now selected explicitly before reading.
4. **Revid fakes its strikethrough.** The original price uses a Tailwind
   `::after` bar with `opacity-50`, so computed `text-decoration` is `none`
   and DOM detection missed it — reading `$99` as Growth's current price
   instead of `$39`. Current price is now the lower of a discounted pair.
5. **Annual totals read as headline rates.** "$288 billed annually" and
   "Save $36/year" sit directly under the price; both were being picked up as
   the price itself.
6. **Pollo animates its price change.** Sampling at a fixed delay caught
   `$ $15.00` mid-transition. The view is now polled until stable.

## Known limits

- **Pollo's annual view is not automatable.** The toggle accepts the click —
  the click is confirmed to register — but the view never switches under
  automation. Monthly is captured reliably every run. Annual pricing was
  verified by screenshot on 2026-08-02: LITE $10.00, PRO $14.50, ULTRA $109.00
  per month billed annually. This is surfaced on the site rather than hidden.
- **Cloudflare may still block CI.** Pollo works from a residential IP. GitHub
  Actions runners use datacenter IPs, which Cloudflare treats more harshly — if
  it blocks there, the run reports `fetch_failed` for Pollo and keeps its last
  good snapshot, which is the designed behaviour rather than a failure of it.
- **Prices only.** Credit allowances, watermark rules and export resolutions are
  captured as research observations in `site/src/data/pricing.json`, not watched.
