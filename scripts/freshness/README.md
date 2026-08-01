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
Pricing watcher — 6 target(s), 2026-08-02T…

  vivideo   unchanged  4 prices, views=[default]           9b796588cc6b
  heygen    unchanged  7 prices, views=[default,yearly]    4a5cee9a6ec4
  invideo   unchanged  8 prices, views=[default]           001d56a625e4
  pollo     unchanged  6 prices, views=[default,monthly]   71fe7ed57ad8
  revid     unchanged  3 prices, views=[default]           87b6f6f2b798
  runway    unchanged 10 prices, views=[default,monthly]   b3217967c8f5

6/6 readable
```

When something moves, the field-level diff prints inline:

```
  heygen    CHANGED   7 prices, views=[default,yearly]     4a5cee9a6ec4
      + default: $29
      − default: $19
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

## Known limits

- **Plan names are best-effort.** The six pages share no markup conventions, so
  names are inferred from the text nearest each price. Prices are the reliable
  signal; a name can occasionally attach to the wrong card. The linked pricing
  page is always the authority.
- **Cloudflare may still block CI.** Pollo works from a residential IP. GitHub
  Actions runners use datacenter IPs, which Cloudflare treats more harshly — if
  it blocks there, the run reports `fetch_failed` for Pollo and keeps its last
  good snapshot, which is the designed behaviour rather than a failure of it.
- **Prices only.** Credit allowances, watermark rules and export resolutions are
  captured as research observations in `site/src/data/pricing.json`, not watched.
