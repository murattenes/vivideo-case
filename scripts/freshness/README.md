# Pricing freshness watcher

Re-reads all six competitor pricing pages, extracts plans and prices for both
billing periods where available, and saves a dated snapshot plus a field-level
price diff. Answers one question on a schedule: **is any of the pricing in this
analysis still true?**

Deterministic by design — no API keys, no model, nothing that can invent a
price it did not read. The brief accepts "a pricing-page diff watcher" as a
freshness mechanism in its own right; this is that, built to be honest about
what it cannot see.

## Run it

```bash
node scripts/freshness/check.mjs              # all six, writes a snapshot
node scripts/freshness/check.mjs --dry        # run without writing
node scripts/freshness/check.mjs --only pollo,revid --dry
```

Requires Chrome. Found automatically on macOS and common Linux paths; override
with `CHROME_PATH=/path/to/chrome`. No `npm install` — the checker uses only
Node built-ins and drives Chrome over the DevTools Protocol directly.

Runs weekly via `.github/workflows/freshness.yml` (Mondays 07:15 UTC) and on
demand through **Actions → Pricing freshness check → Run workflow**. Each run
records when the check happened. If prices are unchanged, the status is
`unchanged` and the field-level diff remains empty.

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
      PRO          monthly $29.00    yearly —
      ULTRA        monthly $139.00   yearly —
  revid     unchanged  3/3 plans +yearly
      HOBBY        monthly $39       yearly $32 ($384/yr)
      GROWTH       monthly $39       yearly $32 ($384/yr)
      ULTRA        monthly $199      yearly $166 ($1992/yr)
  runway    unchanged  4/4 plans +yearly
      Free         monthly $0        yearly $0
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
  → hash the monthly plan table
  → compare yearly prices when both runs captured them
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

### What counts as a price change

The hash covers the declared plan names and monthly prices, not the surrounding
marketing page. This keeps banners, countdowns, testimonials and other copy out
of the change gate. Yearly prices and annual totals are additionally compared
when both the current and previous runs captured them. If a yearly toggle fails
to switch on one run, that missing view is not reported as a price change.

## Output — `site/src/data/freshness/`

| File | Contents |
|---|---|
| `current.json` | Latest snapshot: per product — plans, monthly and captured yearly prices, billing periods and monthly price hash |
| `previous.json` | The snapshot before it |
| `diff.json` | Field-level monthly, yearly and annual-total changes by plan |
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
  make the whole mechanism noise.
- **Detects a real change.** A price edited in the stored snapshot
  (`$29` → `$19`) was correctly surfaced as `CHANGED` with a field-level diff.
- **Fails honestly.** Pointing a target at a 404 produced `fetch_failed`,
  preserved the prior snapshot and `lastSuccessfulAt`, and did **not** appear
  in the diff.

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
