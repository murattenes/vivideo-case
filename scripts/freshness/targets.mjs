/**
 * Per-product freshness targets.
 *
 * URLs verified reachable 2026-08-01 with a browser User-Agent:
 *   vivideo.ai/pricing      200
 *   heygen.com/pricing      200
 *   invideo.io/pricing/     200
 *   pollo.ai/pricing        403  ← Cloudflare blocks datacenter IPs
 *   revid.ai/pricing        200
 *   runwayml.com/pricing    200 → redirects to runway.com/pricing (canonical below)
 *
 * Pollo is expected to fail from GitHub Actions runners. That is a reported
 * `fetch_failed` status, not a bug — see scripts/freshness/README.md.
 */

/**
 * Patterns stripped before hashing. These are the things that change on a
 * page without the pricing changing: rotating promo bars, session tokens,
 * cache-busting query strings, build IDs, and timestamps.
 *
 * Getting this list right is what makes the hash stable. An unstable hash
 * makes the whole checker cry wolf on every run.
 */
export const GLOBAL_NOISE = [
  // Cache-busting / build hashes in asset URLs
  /[?&](v|t|ts|cb|_|build|hash)=[A-Za-z0-9._-]+/g,
  // Long hex/base64 blobs (build IDs, nonces, CSRF tokens, integrity hashes)
  /\b[a-f0-9]{16,}\b/gi,
  /\b[A-Za-z0-9+/]{40,}={0,2}\b/g,
  // ISO timestamps and dates
  /\b\d{4}-\d{2}-\d{2}T[\d:.]+Z?\b/g,
  /\b\d{4}-\d{2}-\d{2}\b/g,
  // Countdown / urgency copy that ticks without the price changing
  /\b\d+\s*(days?|hours?|hrs?|minutes?|mins?|seconds?|secs?)\s*(left|remaining|only)\b/gi,
  // Visitor / social-proof counters
  /\b[\d,]+\+?\s*(users?|creators?|customers?|videos? created)\b/gi,
];

export const TARGETS = [
  {
    id: 'vivideo',
    name: 'Vivideo',
    url: 'https://vivideo.ai/pricing',
    // Narrow the hash+parse input to the pricing region. Falls through the
    // list until one matches; `null` means "use <body>" as a last resort.
    containerSelectors: ['main', '[class*="pricing" i]', 'body'],
    noise: [
      // Promo banners observed on Vivideo marketing surfaces
      /save\s*\d+%/gi,
    ],
  },
  {
    id: 'heygen',
    name: 'HeyGen',
    url: 'https://www.heygen.com/pricing',
    containerSelectors: ['main', '[class*="pricing" i]', 'body'],
    noise: [],
  },
  {
    id: 'invideo',
    name: 'InVideo AI',
    url: 'https://invideo.io/pricing/',
    containerSelectors: ['main', '[class*="pricing" i]', 'body'],
    noise: [],
    // Verified 2026-08-01: the page is fully client-rendered (Next.js RSC).
    // Static HTML contains no prices AND no plan names — body text is ~2.2KB
    // with no "Plus", "Free", or "/mo". The `$18`/`$36` tokens visible in the
    // raw source are React Server Component reference markers ("$L2",
    // "$undefined"), not currency.
    //
    // Consequence: the text hash still detects page changes, but price changes
    // are invisible to a no-JS watcher. Reported honestly rather than guessed.
    staticPricing: false,
    staticPricingNote:
      'Pricing is client-rendered; no prices in static HTML. Page-level changes are still detected, but price values require a manual check.',
  },
  {
    id: 'pollo',
    name: 'Pollo AI',
    url: 'https://pollo.ai/pricing',
    containerSelectors: ['main', '[class*="pricing" i]', 'body'],
    noise: [
      // The live "Up to 60% Off Seedance 2.0" subscriber-perk bar rotates.
      /up to \d+% off[^<]{0,80}/gi,
    ],
    // Documented so the site can explain the failure rather than look broken.
    knownBlocked: true,
    blockedNote:
      'Returns HTTP 403 to non-browser clients (Cloudflare). Expected to fail from CI; verify manually in a browser.',
  },
  {
    id: 'revid',
    name: 'Revid.ai',
    url: 'https://www.revid.ai/pricing',
    containerSelectors: ['main', '[class*="pricing" i]', 'body'],
    noise: [],
  },
  {
    id: 'runway',
    name: 'Runway',
    // runwayml.com/pricing 301s here; use the canonical URL directly.
    url: 'https://runway.com/pricing',
    containerSelectors: ['main', '[class*="pricing" i]', 'body'],
    noise: [],
  },
];

export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
