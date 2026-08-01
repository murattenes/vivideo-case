/**
 * Hash stability proof.
 *
 * Fetches every target N times and checks the normalized hash is identical
 * across all fetches. If it is not, the normalizer is not filtering enough
 * noise and the checker would report a change on every single run.
 *
 * Run this after ANY change to normalize.mjs or targets.mjs:
 *     node scripts/freshness/verify-stability.mjs
 *
 * Exit code 1 if any reachable target is unstable.
 */

import { TARGETS, USER_AGENT } from './targets.mjs';
import { extractText, hashText, extractPrices } from './normalize.mjs';

const ROUNDS = Number(process.env.ROUNDS ?? 3);
const DELAY_MS = Number(process.env.DELAY_MS ?? 3000);
const ONLY = process.env.ONLY?.split(',').map((s) => s.trim());

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOnce(target) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(target.url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, status: res.status, html: await res.text() };
  } catch (err) {
    return { ok: false, status: 0, error: err.name === 'AbortError' ? 'timeout' : err.message };
  } finally {
    clearTimeout(timer);
  }
}

const targets = ONLY ? TARGETS.filter((t) => ONLY.includes(t.id)) : TARGETS;
let unstable = 0;
let blocked = 0;

console.log(`Hash stability check — ${ROUNDS} rounds, ${DELAY_MS}ms apart\n`);

for (const target of targets) {
  const observations = [];

  for (let i = 0; i < ROUNDS; i++) {
    const res = await fetchOnce(target);
    if (!res.ok) {
      observations.push({ failed: true, status: res.status, error: res.error });
      break;
    }
    const text = extractText(res.html, {
      containerSelectors: target.containerSelectors,
      noise: target.noise,
    });
    observations.push({
      hash: hashText(text),
      length: text.length,
      prices: extractPrices(text),
    });
    if (i < ROUNDS - 1) await sleep(DELAY_MS);
  }

  const failure = observations.find((o) => o.failed);
  if (failure) {
    blocked++;
    const expected = target.knownBlocked ? ' (expected)' : ' (UNEXPECTED)';
    console.log(
      `  ${target.id.padEnd(9)} UNREACHABLE  HTTP ${failure.status || '—'} ${failure.error ?? ''}${expected}`,
    );
    continue;
  }

  const hashes = new Set(observations.map((o) => o.hash));
  const stable = hashes.size === 1;
  if (!stable) unstable++;

  const priceSets = new Set(observations.map((o) => o.prices.join('|')));
  const pricesStable = priceSets.size === 1;

  console.log(
    `  ${target.id.padEnd(9)} ${stable ? 'STABLE  ' : 'UNSTABLE'}  ` +
      `hash=${observations[0].hash.slice(0, 12)}  ` +
      `text=${observations[0].length}b  ` +
      `prices=${observations[0].prices.length}${pricesStable ? '' : ' (VARYING)'}`,
  );

  if (!stable) {
    console.log(`      distinct hashes across ${ROUNDS} fetches: ${hashes.size}`);
    console.log(`      lengths: ${observations.map((o) => o.length).join(', ')}`);
    console.log(
      `      → normalizer needs more noise patterns for this target; ` +
        `run with DEBUG=1 to dump text`,
    );
    if (process.env.DEBUG) {
      for (const [i, o] of observations.entries()) {
        console.log(`      [${i}] prices: ${o.prices.join(' ')}`);
      }
    }
  }
}

console.log(
  `\n${targets.length - unstable - blocked}/${targets.length} stable, ` +
    `${unstable} unstable, ${blocked} unreachable`,
);

process.exit(unstable > 0 ? 1 : 0);
