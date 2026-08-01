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
  // Rotating promo bars: "Flash Sale 50% Off", "Up to 60% Off …", "Save 79%"
  /\b(flash\s+sale|limited\s+time|special\s+offer)\b[^.|]{0,60}/gi,
  /\b(up\s+to\s+)?\d{1,3}%\s*(off|discount)\b/gi,
  /\bsave\s+(up\s+to\s+)?\d{1,3}%/gi,
  // Countdown timers rendered as digits
  /\b\d{1,2}\s*:\s*\d{2}\s*:\s*\d{2}\b/g,
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
    // Fully client-rendered (Next.js RSC): static HTML has no prices and no
    // plan names. Solved by rendering in headless Chrome — verified 2026-08-02.
    clientRendered: true,
  },
  {
    id: 'pollo',
    name: 'Pollo AI',
    url: 'https://pollo.ai/pricing',
    containerSelectors: ['main', '[class*="pricing" i]', 'body'],
    noise: [
      // Subscriber-perk and flash-sale bars rotate independently of pricing.
      /seedance[^.|]{0,40}/gi,
      /unlock savings/gi,
    ],
    // Cloudflare serves an interstitial to plain HTTP clients (403). Solved by
    // rendering in headless Chrome with automation fingerprinting disabled —
    // verified 2026-08-02. May still fail from a datacenter IP in CI.
    cloudflare: true,
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
