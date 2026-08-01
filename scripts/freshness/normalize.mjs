import { createHash } from 'node:crypto';
import { GLOBAL_NOISE } from './targets.mjs';

/**
 * Turn a raw HTML page into a stable, narrow, comparable text extract.
 *
 * This function is the load-bearing part of the whole checker. Both the
 * change-detection hash AND the field parser read its output, so if it is
 * noisy the checker reports phantom changes on every run, and if it is too
 * aggressive it strips the prices we are trying to watch.
 *
 * Design rule: remove things that change WITHOUT the pricing changing.
 * Never remove digits, currency symbols, or plan names.
 */

/** Elements whose contents are never pricing information. */
const DROP_ELEMENTS = [
  'script',
  'style',
  'noscript',
  'svg',
  'iframe',
  'template',
  'head',
];

export function extractText(html, { containerSelectors = [], noise = [] } = {}) {
  let working = html;

  // 1. Drop non-content elements entirely, including their inner text.
  for (const tag of DROP_ELEMENTS) {
    working = working.replace(
      new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, 'gi'),
      ' ',
    );
    // Self-closing / unclosed variants
    working = working.replace(new RegExp(`<${tag}\\b[^>]*/?>`, 'gi'), ' ');
  }

  // 2. Drop HTML comments (often contain build metadata).
  working = working.replace(/<!--[\s\S]*?-->/g, ' ');

  // 3. Narrow to the pricing region if we can find one.
  const narrowed = narrowToContainer(working, containerSelectors);

  // 4. Strip remaining tags, keeping their text.
  let text = narrowed.replace(/<[^>]+>/g, ' ');

  // 5. Decode the handful of entities that appear in prices and plan names.
  text = decodeEntities(text);

  // 6. Remove known noise — global patterns first, then per-target ones.
  for (const pattern of [...GLOBAL_NOISE, ...noise]) {
    text = text.replace(pattern, ' ');
  }

  // 7. Collapse whitespace. Case is preserved: plan names are meaningful.
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Slice the document to the first matching container so header/footer/nav
 * churn does not move the hash. Uses coarse tag-boundary matching rather than
 * a full DOM parse — good enough for a stable slice, and keeps the checker
 * dependency-free.
 */
function narrowToContainer(html, selectors) {
  for (const selector of selectors) {
    if (selector === 'body') {
      const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i);
      if (body) return body[1];
      continue;
    }

    if (selector === 'main') {
      const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
      if (main && main[1].trim().length > 200) return main[1];
      continue;
    }

    // [class*="pricing" i] — find an element whose class mentions "pricing"
    // and take a bounded window from it. Deliberately generous: we would
    // rather over-include stable content than miss a price.
    const attr = selector.match(/\[class\*=["']([^"']+)["']/i);
    if (attr) {
      const needle = attr[1].toLowerCase();
      const idx = html.toLowerCase().indexOf(`class="`) === -1
        ? -1
        : findClassMention(html, needle);
      if (idx !== -1) return html.slice(idx);
      continue;
    }
  }
  return html;
}

function findClassMention(html, needle) {
  const re = new RegExp(`class=["'][^"']*${needle}[^"']*["']`, 'i');
  const m = html.match(re);
  return m ? m.index : -1;
}

function decodeEntities(text) {
  const named = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&ndash;': '-',
    '&mdash;': '-',
    '&euro;': '€',
    '&pound;': '£',
    '&dollar;': '$',
  };
  let out = text;
  for (const [entity, char] of Object.entries(named)) {
    out = out.split(entity).join(char);
  }
  // Numeric entities
  out = out.replace(/&#(\d+);/g, (_, code) =>
    String.fromCodePoint(Number(code)),
  );
  out = out.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
    String.fromCodePoint(parseInt(code, 16)),
  );
  return out;
}

export function hashText(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Pull every currency amount out of the normalized text, in order.
 *
 * This is the change signal that survives a site redesign: even when
 * plan-card selectors break, the ordered set of prices on the page is a
 * meaningful, comparable fingerprint.
 */
export function extractPrices(text) {
  const matches = text.match(/(?:US)?\$\s?\d[\d,]*(?:\.\d{2})?|\d[\d,]*(?:\.\d{2})?\s?(?:USD|EUR|GBP)/gi);
  if (!matches) return [];
  return matches.map((m) => m.replace(/\s+/g, '').toUpperCase());
}
