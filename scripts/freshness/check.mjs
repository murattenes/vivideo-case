/**
 * Pricing freshness watcher — deterministic, no API, no model.
 *
 *   launch Chrome per target  →  render the pricing page  →  read each
 *   declared plan in the monthly view  →  flip the billing toggle  →  read
 *   the yearly view  →  merge into one row per plan  →  hash  →  diff
 *
 *   node scripts/freshness/check.mjs
 *   node scripts/freshness/check.mjs --only pollo,revid
 *   node scripts/freshness/check.mjs --dry
 */

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { launch } from './browser.mjs';
import { extractPlans, clickPeriod } from './extract.mjs';
import { TARGETS } from './targets.mjs';

const DATA_DIR = new URL('../../site/src/data/freshness/', import.meta.url);
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const onlyIndex = args.indexOf('--only');
const onlyValue = onlyIndex >= 0 ? args[onlyIndex + 1] : null;
if (onlyIndex >= 0 && (!onlyValue || onlyValue.startsWith('--'))) {
  console.error('--only requires a comma-separated product list');
  process.exit(2);
}
const only = onlyValue ? onlyValue.split(',') : null;
if (only && !dry) {
  console.error('--only must be used with --dry so a partial run cannot replace the full snapshot');
  process.exit(2);
}
const now = new Date().toISOString();

const sha = (s) => createHash('sha256').update(s, 'utf8').digest('hex');
const readJson = (name, fallback) => {
  const p = new URL(name, DATA_DIR);
  if (!existsSync(p)) return fallback;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return fallback; }
};

/** Poll until the declared plans actually carry prices — pages hydrate late. */
async function settle(page, target) {
  let stable = 0;
  let last = '';
  for (let i = 0; i < 25; i++) {
    await sleep(1000);
    let snap;
    try { snap = await page.evaluate(extractPlans(target.plans)); } catch { continue; }
    if (/just a moment|checking your browser|attention required/i.test(snap.title)) {
      stable = 0; last = ''; continue;
    }
    const priced = snap.plans.filter((p) => p.found && p.price).length;
    const sig = snap.plans.map((p) => `${p.name}:${p.price ?? ''}`).join('|');
    // Every declared plan should price up. Free tiers legitimately show $0.
    if (priced >= Math.max(1, target.plans.length - 1) && sig === last) {
      if (++stable >= 2) return snap;
    } else stable = 0;
    last = sig;
  }
  return null;
}

async function switchPeriod(page, target, words) {
  if (!words.length) return false;
  // A dropdown must be opened before its options exist in the DOM.
  if (target.dropdownToggle) {
    await page.evaluate(clickPeriod([...target.monthlyWords, ...target.yearlyWords]));
    await sleep(900);
  }
  const clicked = await page.evaluate(clickPeriod(words, Boolean(target.perCardToggle)));
  await sleep(1200);
  return clicked.length > 0;
}

async function capture(page, target) {
  let monthly = null;
  for (let attempt = 0; attempt < 2 && !monthly; attempt++) {
    await page.goto(target.url);
    const first = await settle(page, target);
    if (!first) continue;
    // Never trust the default state. Vivideo and InVideo both loaded already
    // showing yearly pricing, which silently inverted the two columns.
    // Explicitly select monthly before reading the monthly view.
    if (target.monthlyWords.length) {
      const clicked = await switchPeriod(page, target, target.monthlyWords);
      monthly = clicked ? ((await settle(page, target)) ?? first) : first;
    } else {
      monthly = first;
    }
  }
  if (!monthly) return null;

  let yearly = null;
  for (let attempt = 0; attempt < 2 && !yearly; attempt++) {
    const ok = await switchPeriod(page, target, target.yearlyWords);
    if (!ok) break;
    // Wait for the switched view to settle rather than sampling once: Pollo
    // animates the price change and a fixed delay caught it mid-transition
    // ("$ $15.00" with the new digits still counting up).
    const snap = await settle(page, target);
    if (!snap) continue;
    const changed =
      snap.plans.map((p) => p.price).join('|') !== monthly.plans.map((p) => p.price).join('|') ||
      snap.plans.some((p) => p.billedTotal);
    if (changed) yearly = snap;
  }

  return { monthly, yearly };
}

/** Merge the two views into one row per plan. */
function mergePlans(target, monthly, yearly) {
  return target.plans.map((name) => {
    const m = monthly.plans.find((p) => p.name === name) ?? {};
    const y = yearly?.plans.find((p) => p.name === name) ?? {};
    return {
      name,
      monthly: m.found ? { price: m.price, period: m.period ?? target.priceUnit ?? 'month' } : null,
      yearly: y.found && y.price
        ? {
            price: y.price,
            period: y.period ?? target.priceUnit ?? 'month',
            billedTotal: y.billedTotal ?? null,
            was: y.wasPrice ?? null,
          }
        : null,
    };
  });
}

// ── run ──────────────────────────────────────────────────────────────────
const targets = only ? TARGETS.filter((t) => only.includes(t.id)) : TARGETS;
const previous = readJson('current.json', null);
const current = { checkedAt: now, products: {} };
const status = { checkedAt: now, products: {} };
const diffs = { checkedAt: now, products: {} };

console.log(`Pricing watcher — ${targets.length} target(s), ${now}\n`);

for (const target of targets) {
  const page = await launch(); // fresh browser: shared state trips Cloudflare
  try {
    const prev = previous?.products?.[target.id] ?? null;
    let views = null, error = null;
    try { views = await capture(page, target); }
    catch (err) { error = err.message; }

    if (!views) {
      if (prev) current.products[target.id] = prev;
      status.products[target.id] = {
        status: 'fetch_failed', checkedAt: now,
        lastSuccessfulAt: prev?.observedAt ?? null,
        sourceUrl: target.url,
        note: error ?? 'page did not render readable pricing (blocked or changed)',
      };
      console.log(`  ${target.id.padEnd(9)} FETCH_FAILED  ${error ?? 'no plans priced'}`);
      continue;
    }

    const plans = mergePlans(target, views.monthly, views.yearly);
    // Hash the monthly plan table, not the whole page: immune to marketing
    // copy edits and to whether the yearly toggle happened to land. Yearly
    // prices are compared separately only when both runs captured them.
    const sig = plans
      .map((p) => `${p.name}:${p.monthly?.price ?? ''}`)
      .join('|');
    const hash = sha(sig);
    const previousSig = (prev?.plans ?? [])
      .map((p) => `${p.name}:${p.monthly?.price ?? ''}`)
      .join('|');
    const yearlyChanged = prev
      ? plans.some((p) => {
          const before = prev.plans?.find((x) => x.name === p.name);
          if (!before?.yearly || !p.yearly) return false;
          return before.yearly.price !== p.yearly.price ||
            before.yearly.billedTotal !== p.yearly.billedTotal;
        })
      : false;
    const changed = prev ? sha(previousSig) !== hash || yearlyChanged : false;

    if (changed) {
      const changes = [];
      for (const p of plans) {
        const before = prev.plans?.find((x) => x.name === p.name);
        if (!before) { changes.push({ plan: p.name, note: 'new plan' }); continue; }
        if (before.monthly?.price !== p.monthly?.price)
          changes.push({ plan: p.name, field: 'monthly', from: before.monthly?.price ?? null, to: p.monthly?.price ?? null });
        if (before.yearly && p.yearly) {
          if (before.yearly.price !== p.yearly.price)
            changes.push({ plan: p.name, field: 'yearly', from: before.yearly.price, to: p.yearly.price });
          if (before.yearly.billedTotal !== p.yearly.billedTotal)
            changes.push({ plan: p.name, field: 'annual total', from: before.yearly.billedTotal ?? null, to: p.yearly.billedTotal ?? null });
        }
      }
      for (const b of prev.plans ?? [])
        if (!plans.find((x) => x.name === b.name)) changes.push({ plan: b.name, note: 'plan removed' });
      diffs.products[target.id] = { changes };
    }

    current.products[target.id] = {
      observedAt: now, sourceUrl: target.url, hash,
      hasYearlyView: Boolean(views.yearly), plans,
    };
    status.products[target.id] = {
      status: prev ? (changed ? 'changed' : 'unchanged') : 'first_run',
      checkedAt: now, lastSuccessfulAt: now, sourceUrl: target.url,
      plansFound: plans.filter((p) => p.monthly?.price).length,
      plansExpected: target.plans.length,
      yearlyCaptured: Boolean(views.yearly),
      yearlyNotAutomatable: Boolean(target.yearlyNotAutomatable),
      yearlyNote: target.yearlyNote ?? null,
    };

    const label = prev ? (changed ? 'CHANGED ' : 'unchanged') : 'FIRST RUN';
    console.log(
      `  ${target.id.padEnd(9)} ${label}  ${plans.filter((p) => p.monthly?.price).length}/${target.plans.length} plans` +
      `${views.yearly ? ' +yearly' : ' (monthly only)'}  ${hash.slice(0, 12)}`,
    );
    for (const p of plans) {
      const m = p.monthly?.price ?? '—';
      const y = p.yearly ? `${p.yearly.price}${p.yearly.billedTotal ? ` (${p.yearly.billedTotal}/yr)` : ''}` : '—';
      console.log(`      ${p.name.padEnd(12)} monthly ${String(m).padEnd(9)} yearly ${y}`);
    }
    if (changed) for (const c of diffs.products[target.id].changes)
      console.log(`      ~ ${c.plan} ${c.field ?? ''}: ${c.from} -> ${c.to}`);
  } finally {
    await page.close();
  }
}

const ok = Object.values(status.products).filter((s) => s.status !== 'fetch_failed').length;
console.log(`\n${ok}/${targets.length} readable`);

if (dry) { console.log('(--dry: nothing written)'); }
else {
  mkdirSync(DATA_DIR, { recursive: true });
  if (previous) writeFileSync(new URL('previous.json', DATA_DIR), JSON.stringify(previous, null, 1));
  writeFileSync(new URL('current.json', DATA_DIR), JSON.stringify(current, null, 1));
  writeFileSync(new URL('status.json', DATA_DIR), JSON.stringify(status, null, 1));
  writeFileSync(new URL('diff.json', DATA_DIR), JSON.stringify(diffs, null, 1));
  appendFileSync(new URL('history.jsonl', DATA_DIR),
    JSON.stringify({ checkedAt: now, products: Object.fromEntries(Object.entries(status.products).map(([k, v]) => [k, v.status])) }) + '\n');
  console.log('written to site/src/data/freshness/');
}
