/**
 * Page-side extraction.
 *
 * These are written as ordinary functions and stringified for injection, so
 * there is no nested-escaping to get wrong — an earlier hand-escaped version
 * silently matched nothing and reported all six sites as unreadable.
 *
 * Extraction works on rendered innerText rather than the DOM, because the six
 * pricing pages share no markup conventions but all render the same visual
 * shape: plan name, price, billing period, close together and in that order.
 */

function extractPricing() {
  const PRICE_SRC = '(?:US)?\\$\\s?\\d[\\d,]*(?:\\.\\d{1,2})?|\\d[\\d,]*(?:\\.\\d{1,2})?\\s?(?:USD|EUR|GBP)';
  const PERIOD = /\b(month|mo|year|yr|annually|annual|week|wk)\b/i;

  const raw = document.body ? document.body.innerText : '';
  const lines = raw.split('\n').map((s) => s.trim()).filter(Boolean);

  // Every currency amount, in document order. This is the signal that
  // survives a redesign even when plan-name detection breaks.
  const prices = [];
  for (const line of lines) {
    const found = line.match(new RegExp(PRICE_SRC, 'gi'));
    if (found) for (const f of found) prices.push(f.replace(/\s+/g, ''));
  }

  // Plan candidates: for each price, the nearest preceding line that reads
  // like a name (short, alphabetic, not itself a price or a period word).
  const plans = [];
  const priceRe = new RegExp(PRICE_SRC, 'i');
  for (let i = 0; i < lines.length; i++) {
    if (!priceRe.test(lines[i])) continue;
    const price = (lines[i].match(priceRe) || [''])[0].replace(/\s+/g, '');
    let name = null;
    for (let j = i - 1; j >= 0 && j >= i - 6; j--) {
      const c = lines[j];
      if (priceRe.test(c)) continue;
      if (PERIOD.test(c) && c.length < 24) continue;
      if (c.length > 30 || c.length < 2) continue;
      if (!/[A-Za-z]/.test(c)) continue;
      // Reject prose: FAQ headings and marketing sentences sit next to
      // prices on several of these pages and are not plan names.
      if (/[?.!]$/.test(c)) continue;
      if (/^(how|what|can|why|which|does|is|are|do)\b/i.test(c)) continue;
      if (c.split(/\s+/).length > 3) continue;
      name = c;
      break;
    }
    let period = null;
    for (let j = i; j < Math.min(lines.length, i + 3); j++) {
      const m = lines[j].match(PERIOD);
      if (m) {
        period = m[1].toLowerCase();
        break;
      }
    }
    plans.push({ name, price, period });
  }

  return {
    title: document.title || '',
    prices,
    plans,
    hasMonthly: /\b(month|monthly)\b/i.test(raw),
    hasYearly: /\b(year|yearly|annual|annually)\b/i.test(raw),
    text: raw
      .replace(/\s+/g, ' ')
      .replace(/\b\d{4}-\d{2}-\d{2}\b/g, '')
      .replace(/\b[a-f0-9]{16,}\b/gi, '')
      .replace(/\b\d+\s*(days?|hours?|hrs?|minutes?|mins?|seconds?|secs?)\s*(left|remaining)\b/gi, '')
      .trim(),
  };
}

function clickPeriodToggle(want) {
  const re = new RegExp('^\\s*' + want + '(ly)?\\s*$', 'i');
  const nodes = [...document.querySelectorAll('button,[role="tab"],[role="switch"],label,a,span,div')];
  const hits = nodes.filter((el) => {
    const t = (el.textContent || '').trim();
    if (!re.test(t)) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.width < 400;
  });
  if (!hits.length) return false;
  hits.sort((a, b) => (a.textContent || '').length - (b.textContent || '').length);
  hits[0].click();
  return true;
}

export const EXTRACT_FN = `(${extractPricing.toString()})()`;
export const TOGGLE_FN = (word) => `(${clickPeriodToggle.toString()})(${JSON.stringify(word)})`;
