/**
 * Integrity check for site/src/data/pricing.json.
 *
 * Enforces the one invariant that keeps the pricing page honest:
 * a value's provenance and its presence must agree.
 *
 *   status: 'observed'  ⇒  value MUST be present
 *   status: 'unknown'   ⇒  value MUST be null
 *
 * Without this, a field nobody recorded in July can quietly acquire an
 * August value and inherit research provenance — presenting a number we
 * never actually observed as first-hand evidence.
 *
 *   node scripts/freshness/validate-pricing.mjs
 */

import { readFileSync } from 'node:fs';

const VALID_STATUS = ['observed', 'unknown', 'not_applicable'];
const SIDES = ['researchObservation', 'latestCheck'];

const data = JSON.parse(
  readFileSync(new URL('../../site/src/data/pricing.json', import.meta.url), 'utf8'),
);

const errors = [];
const backfillRisk = [];
let observations = 0;
let researchKnown = 0;
let latestKnown = 0;

for (const [productId, product] of Object.entries(data.products)) {
  for (const [fieldName, field] of Object.entries(product.fields)) {
    for (const side of SIDES) {
      const obs = field[side];
      const path = `${productId}.${fieldName}.${side}`;

      if (!obs) {
        errors.push(`${path} — missing`);
        continue;
      }
      observations++;

      if (!VALID_STATUS.includes(obs.status)) {
        errors.push(`${path} — invalid status "${obs.status}"`);
      }
      if (obs.status === 'observed' && (obs.value === null || obs.value === undefined)) {
        errors.push(`${path} — status "observed" but value is null`);
      }
      if (obs.status === 'unknown' && obs.value !== null) {
        errors.push(`${path} — status "unknown" but a value is present`);
      }
      if (obs.status === 'observed' && !obs.observedAt) {
        errors.push(`${path} — status "observed" but no observedAt date`);
      }

      if (side === 'researchObservation' && obs.status === 'observed') researchKnown++;
      if (side === 'latestCheck' && obs.status === 'observed') latestKnown++;
    }

    if (
      field.researchObservation?.status === 'unknown' &&
      field.latestCheck?.status === 'observed'
    ) {
      backfillRisk.push(`${productId}.${fieldName}`);
    }
  }
}

console.log(`pricing.json — ${observations} observations across ${Object.keys(data.products).length} products`);
console.log(`  known during research: ${researchKnown}`);
console.log(`  known at last check:   ${latestKnown}`);

if (backfillRisk.length) {
  console.log(`\n  Unknown during research, known now — render as "not recorded during testing",`);
  console.log(`  NEVER as a detected change:`);
  for (const f of backfillRisk) console.log(`    · ${f}`);
}

if (errors.length) {
  console.log(`\n  ${errors.length} integrity error(s):`);
  for (const e of errors) console.log(`    ✗ ${e}`);
  process.exit(1);
}

console.log('\n  ✓ integrity OK');
