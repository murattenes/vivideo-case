/**
 * Per-product watcher targets.
 *
 * Plan names are declared rather than inferred. They are stable, few, and
 * declaring them is what makes the extracted labels correct — a generic
 * "text nearest the price" heuristic produced FAQ headings and marketing
 * taglines instead of plan names.
 *
 * `monthlyWords` / `yearlyWords` are the visible labels on each site's billing
 * toggle. They differ per site ("Yearly", "Annual", "Annually"), and several
 * sites put a toggle on every plan card rather than once per page.
 *
 * URLs and plan names verified against pricing-page screenshots, 2026-08-02.
 */

export const TARGETS = [
  {
    id: 'vivideo',
    name: 'Vivideo',
    url: 'https://vivideo.ai/pricing',
    plans: ['PRO', 'MAX'],
    monthlyWords: ['Weekly'],
    yearlyWords: ['Yearly'],
    // Headline price is per WEEK in both views; the yearly view adds the
    // annual total ("Billed yearly at $99").
    priceUnit: 'week',
  },
  {
    id: 'heygen',
    name: 'HeyGen',
    url: 'https://www.heygen.com/pricing',
    plans: ['Free', 'Creator', 'Pro'],
    monthlyWords: ['Monthly'],
    yearlyWords: ['Yearly'],
    perCardToggle: true,
    // Geolocates to Turkish without an explicit Accept-Language header.
    forcesLocale: true,
  },
  {
    id: 'invideo',
    name: 'InVideo AI',
    url: 'https://invideo.io/pricing/',
    plans: ['Plus', 'Max', 'Generative', 'Elite'],
    // The control is a single 'Annual' switch: clicking it toggles. Listing it
    // as both words makes the monthly reset click it off first.
    monthlyWords: ['Annual'],
    yearlyWords: ['Annual'],
    perCardToggle: true,
    // Pricing is client-rendered (Next.js RSC); static HTML has no prices.
    clientRendered: true,
  },
  {
    id: 'pollo',
    name: 'Pollo AI',
    url: 'https://pollo.ai/pricing',
    plans: ['LITE', 'PRO', 'ULTRA'],
    monthlyWords: ['Monthly'],
    yearlyWords: ['Annual', 'Annual 50% OFF'],
    // Cloudflare 403s plain HTTP clients; readable only through a real browser
    // with automation fingerprinting disabled.
    cloudflare: true,
    // The Annual toggle accepts the click (and the click is confirmed to
    // register) but the view never switches under automation. Monthly is
    // captured reliably; annual pricing needs a manual check. Observed by
    // screenshot 2026-08-02: LITE $10.00, PRO $14.50, ULTRA $109.00 per month
    // billed annually.
    yearlyNotAutomatable: true,
    yearlyNote:
      'The Annual toggle does not switch under automation. Monthly is captured automatically; annual pricing was verified by screenshot on 2026-08-02 — LITE $10.00, PRO $14.50, ULTRA $109.00 per month billed annually.',
  },
  {
    id: 'revid',
    name: 'Revid.ai',
    url: 'https://www.revid.ai/pricing',
    plans: ['HOBBY', 'GROWTH', 'ULTRA'],
    monthlyWords: ['Monthly'],
    yearlyWords: ['Annually'],
  },
  {
    id: 'runway',
    name: 'Runway',
    url: 'https://runway.com/pricing',
    plans: ['Free', 'Standard', 'Pro', 'Max'],
    monthlyWords: ['Monthly'],
    yearlyWords: ['Yearly'],
    // Period control is a dropdown: the trigger must be opened before the
    // option exists in the DOM.
    dropdownToggle: true,
  },
];

/** Promo churn stripped before hashing — moves without pricing moving. */
export const GLOBAL_NOISE = [
  /\b(flash\s+sale|limited\s+time|special\s+offer)\b[^.|]{0,60}/gi,
  /\b(up\s+to\s+)?\d{1,3}%\s*(off|discount)\b/gi,
  /\bsave\s+(up\s+to\s+)?\d{1,3}%/gi,
  /\b\d{1,2}\s*:\s*\d{2}\s*:\s*\d{2}\b/g,
  /\b[\d,]+\+?\s*(users?|creators?|customers?|videos? created)\b/gi,
  /\b\d{4}-\d{2}-\d{2}T[\d:.]+Z?\b/g,
  /\b\d+\s*(days?|hours?|hrs?|minutes?|mins?|seconds?|secs?)\s*(left|remaining|only)\b/gi,
  /\b[a-f0-9]{16,}\b/gi,
];

export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
