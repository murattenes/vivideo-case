/**
 * Pricing freshness watcher — deterministic, no API, no model.
 *
 *   launch Chrome  →  render each pricing page  →  capture monthly + yearly
 *   →  normalize  →  sha256  →  diff against the last snapshot  →  write
 *
 * The brief accepts "a pricing-page diff watcher" as a freshness mechanism in
 * its own right. This one is deliberately dumb: it reports what changed and,
 * when it cannot tell, says so. It never guesses a price.
 *
 *   node scripts/freshness/check.mjs            # check all six
 *   node scripts/freshness/check.mjs --only pollo,revid
 *   node scripts/freshness/check.mjs --dry       # don't write snapshots
 */

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { launch } from './browser.mjs';
import { EXTRACT_FN, TOGGLE_FN } from './extract.mjs';
import { TARGETS, GLOBAL_NOISE } from './targets.mjs';

const DATA_DIR = new URL('../../site/src/data/freshness/', import.meta.url);
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
const dry = args.includes('--dry');
const now = new Date().toISOString();

const sha = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
const readJson = (name, fallback) => {
  const p = new URL(name, DATA_DIR);
  if (!existsSync(p)) return fallback;
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
};

/** Poll until the rendered price count stops growing — pages hydrate late. */
async function settle(page) {
  let last = -1;
  let stableFor = 0;
  for (let i = 0; i < 24; i++) {
    await sleep(1000);
    let snap;
    try {
      snap = await page.evaluate(EXTRACT_FN);
    } catch {
      continue;
    }
    const n = snap.prices.length;
    // A Cloudflare interstitial has a body but no prices and a telltale title.
    const challenged = /just a moment|checking your browser|attention required/i.test(snap.title);
    if (challenged) {
      last = -1;
      stableFor = 0;
      continue;
    }
    if (n > 0 && n === last) {
      stableFor++;
      if (stableFor >= 2) return snap;
    } else {
      stableFor = 0;
    }
    last = n;
  }
  return null;
}

async function capture(page, target) {
  let base = null;
  for (let attempt = 0; attempt < 2 && !base; attempt++) {
    await page.goto(target.url);
    base = await settle(page);
  }
  if (!base) return null;

  const views = { default: base };

  // Capture the other billing period where a toggle exists. Retried, because
  // a single click is not reliable across these six pages — and an
  // intermittently-captured view must never be allowed to move the hash
  // (see priceSignature below).
  for (const word of ['year', 'month']) {
    const key = word === 'year' ? 'yearly' : 'monthly';
    for (let attempt = 0; attempt < 3 && !views[key]; attempt++) {
      try {
        const clicked = await page.evaluate(TOGGLE_FN(word));
        if (!clicked) break;
        await sleep(2500);
        const after = await page.evaluate(EXTRACT_FN);
        if (after && after.prices.length && after.prices.join('|') !== base.prices.join('|')) {
          views[key] = after;
        }
      } catch {
        /* toggle is optional */
      }
    }
  }
  return views;
}

/**
 * Strip promo churn before hashing. These pages carry rotating sale banners,
 * countdowns and visitor counters that move without the pricing moving —
 * Pollo's "Flash Sale 50% Off" bar made it report a change on every run.
 */
function denoise(text, target) {
  let out = text;
  for (const re of [...GLOBAL_NOISE, ...(target.noise ?? [])]) {
    out = out.replace(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'), ' ');
  }
  return out.replace(/\s+/g, ' ').trim();
}

function summarise(views, target) {
  const byView = {};
  for (const [name, v] of Object.entries(views)) {
    byView[name] = {
      prices: [...new Set(v.prices)],
      plans: v.plans
        .filter((p) => p.name)
        .map((p) => ({ name: p.name, price: p.price, period: p.period })),
      hasMonthly: v.hasMonthly,
      hasYearly: v.hasYearly,
    };
  }
  // The change gate hashes the DEFAULT view only. Toggle-captured views are
  // recorded and displayed but deliberately excluded from the hash: whether a
  // toggle click lands varies between runs, and capture variance must never
  // be reported as a price change.
  const hashInput = denoise(views.default.text, target);
  return {
    views: byView,
    hash: sha(hashInput),
    // Per-view price sets, compared only when both runs captured that view.
    priceSignature: Object.fromEntries(
      Object.entries(byView).map(([k, v]) => [k, [...v.prices].sort().join('|')]),
    ),
    textLength: hashInput.length,
  };
}

function diffProduct(prev, next) {
  if (!prev) return { firstRun: true, changes: [] };
  const changes = [];
  for (const view of Object.keys(next.views ?? {})) {
    if (!prev.views?.[view]) continue; // view missing last time — not a change
    const a = prev.views[view].prices ?? [];
    const b = next.views[view].prices ?? [];
    const added = b.filter((p) => !a.includes(p));
    const removed = a.filter((p) => !b.includes(p));
    if (added.length || removed.length) changes.push({ view, added, removed });
  }
  return { firstRun: false, changes };
}

// ── run ──────────────────────────────────────────────────────────────────
const targets = only ? TARGETS.filter((t) => only.includes(t.id)) : TARGETS;
const previous = readJson('current.json', null);
const current = { checkedAt: now, products: {} };
const status = { checkedAt: now, products: {} };
const diffs = { checkedAt: now, products: {} };

console.log(`Pricing watcher — ${targets.length} target(s), ${now}\n`);

for (const target of targets) {
  // A fresh browser per target. Sharing one tab across sites made Cloudflare
  // challenge Pollo when it ran mid-sequence, even though the same target
  // succeeded in isolation — carried-over state is enough to trip it.
  const page = await launch();
  try {
    const prevEntry = previous?.products?.[target.id] ?? null;
    let views = null;
    let error = null;
    try {
      views = await capture(page, target);
    } catch (err) {
      error = err.message;
    }

    if (!views) {
      // Preserve the last good data; record the failure separately.
      if (prevEntry) current.products[target.id] = prevEntry;
      status.products[target.id] = {
        status: 'fetch_failed',
        checkedAt: now,
        lastSuccessfulAt: prevEntry?.observedAt ?? null,
        sourceUrl: target.url,
        note: error ?? 'page did not render readable pricing (blocked or changed)',
      };
      console.log(`  ${target.id.padEnd(9)} FETCH_FAILED  ${error ?? 'no prices rendered'}`);
      continue;
    }

    const summary = summarise(views, target);
    let changed = false;
    if (prevEntry) {
      changed = prevEntry.hash !== summary.hash;
      // Also compare views present in BOTH runs — catches a yearly-only change
      // without firing when a toggle simply failed to land this time.
      for (const [view, sig] of Object.entries(summary.priceSignature)) {
        const before = prevEntry.priceSignature?.[view];
        if (before !== undefined && before !== sig) changed = true;
      }
    }
    const diff = diffProduct(prevEntry, summary);

    current.products[target.id] = {
      observedAt: now,
      sourceUrl: target.url,
      hash: summary.hash,
      priceSignature: summary.priceSignature,
      views: summary.views,
    };
    status.products[target.id] = {
      status: prevEntry ? (changed ? 'changed' : 'unchanged') : 'first_run',
      checkedAt: now,
      lastSuccessfulAt: now,
      sourceUrl: target.url,
      priceCount: summary.views.default.prices.length,
      views: Object.keys(summary.views),
    };
    if (changed) diffs.products[target.id] = diff;

    const label = prevEntry ? (changed ? 'CHANGED ' : 'unchanged') : 'FIRST RUN';
    console.log(
      `  ${target.id.padEnd(9)} ${label}  ${summary.views.default.prices.length} prices, ` +
        `views=[${Object.keys(summary.views).join(',')}]  ${summary.hash.slice(0, 12)}`,
    );
    if (changed) {
      for (const c of diff.changes) {
        if (c.added.length) console.log(`      + ${c.view}: ${c.added.join(' ')}`);
        if (c.removed.length) console.log(`      − ${c.view}: ${c.removed.join(' ')}`);
      }
    }
  } finally {
    await page.close();
  }
}

const ok = Object.values(status.products).filter((s) => s.status !== 'fetch_failed').length;
console.log(`\n${ok}/${targets.length} readable`);

if (dry) {
  console.log('(--dry: nothing written)');
} else {
  mkdirSync(DATA_DIR, { recursive: true });
  if (previous) writeFileSync(new URL('previous.json', DATA_DIR), JSON.stringify(previous, null, 1));
  writeFileSync(new URL('current.json', DATA_DIR), JSON.stringify(current, null, 1));
  writeFileSync(new URL('status.json', DATA_DIR), JSON.stringify(status, null, 1));
  writeFileSync(new URL('diff.json', DATA_DIR), JSON.stringify(diffs, null, 1));
  appendFileSync(
    new URL('history.jsonl', DATA_DIR),
    JSON.stringify({
      checkedAt: now,
      products: Object.fromEntries(
        Object.entries(status.products).map(([k, v]) => [k, v.status]),
      ),
    }) + '\n',
  );
  console.log(`written to site/src/data/freshness/`);
}
