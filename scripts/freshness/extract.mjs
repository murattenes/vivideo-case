/**
 * Page-side extraction, written as real functions and stringified for
 * injection so there is no nested-escaping to get wrong.
 *
 * Extraction is CONFIG-DRIVEN, not heuristic. Each target declares its plan
 * names, and prices are read from the lines that follow each name. A purely
 * generic "nearest text above a price" heuristic was tried first and produced
 * wrong labels — FAQ headings ("Pricing FAQs"), marketing taglines ("For
 * exploring") and off-by-one card names. Plan names are stable and few; they
 * belong in config.
 */

function extractPlansImpl(planNames) {
  const PRICE = /\$\s?\d[\d,]*(?:\.\d{1,2})?/;
  const PRICE_G = /\$\s?\d[\d,]*(?:\.\d{1,2})?/g;
  const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const clean = (p) => p.replace(/\s+/g, '');

  // Find the smallest element whose entire text IS the plan name.
  function findNameEl(name) {
    const t = norm(name);
    const all = [...document.querySelectorAll('h1,h2,h3,h4,h5,div,span,p,li,strong,b')];
    const hits = all.filter((el) => {
      if (norm(el.textContent) !== t) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    hits.sort((a, b) => a.textContent.length - b.textContent.length || (a.children.length - b.children.length));
    return hits[0] || null;
  }

  // Climb to the card: nearest ancestor that contains a price.
  function findCard(el) {
    let cur = el;
    for (let i = 0; i < 8 && cur; i++) {
      cur = cur.parentElement;
      if (!cur) break;
      if (PRICE.test(cur.innerText || '')) return cur;
    }
    return el.parentElement || el;
  }

  // "Struck" = the original price shown next to a discounted one. Sites do
  // this three different ways, and only the first is real strikethrough:
  //   HeyGen/Runway — text-decoration: line-through
  //   Revid         — a Tailwind ::after pseudo-element drawing a bar, with
  //                   opacity-50 on the span (computed decoration is 'none')
  //   others        — <s>/<del> tags
  const isStruck = (el) => {
    for (let cur = el, i = 0; cur && i < 5; cur = cur.parentElement, i++) {
      const cs = getComputedStyle(cur);
      if ((cs.textDecorationLine || '').includes('line-through')) return true;
      if (cur.tagName === 'S' || cur.tagName === 'DEL' || cur.tagName === 'STRIKE') return true;
      if (/\bline-through\b|\bstrike\b/i.test((cur.className || '').toString())) return true;
      // De-emphasised price with a decorative ::after bar over it.
      const op = parseFloat(cs.opacity || '1');
      if (op > 0 && op < 0.8) {
        const after = getComputedStyle(cur, '::after');
        const hasBar =
          (after.content && after.content !== 'none') ||
          parseFloat(after.height || '0') > 0 ||
          parseFloat(after.borderTopWidth || '0') > 0;
        if (hasBar) return true;
      }
    }
    return false;
  };

  const results = [];
  for (const wanted of planNames) {
    const nameEl = findNameEl(wanted);
    if (!nameEl) { results.push({ name: wanted, found: false }); continue; }
    const card = findCard(nameEl);
    const cardText = card.innerText || '';

    // Collect price-bearing leaf elements inside the card, in document order,
    // flagging struck-through ones. Strikethrough is how every one of these
    // sites marks the ORIGINAL price next to a discounted one — reading text
    // order instead gets it backwards on some sites and right on others.
    const directText = (el) =>
      [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join(' ');
    const priceEls = [...card.querySelectorAll('*')].filter((el) => PRICE.test(directText(el)));
    // A price is "contextual" (an annual total or a saving) rather than the
    // headline rate when its surrounding line says so. HeyGen renders
    // "$288 billed annually" and Runway "Save $36/year" right under the
    // headline price; both were being read as the price itself.
    const contextual = (el) => {
      let ctx = '';
      for (let cur = el, i = 0; cur && i < 3; cur = cur.parentElement, i++) {
        ctx = (cur.innerText || cur.textContent || '').slice(0, 160);
        if (ctx.length > 8) break;
      }
      return /\bbilled\b|\bsave\b|\byearly\b|\bannually\b|\/\s*year\b/i.test(ctx)
        && !/\/\s*(mo|month|week|wk)\b/i.test(ctx);
    };

    const live = [], struck = [], ctxPrices = [];
    for (const el of priceEls) {
      const m = directText(el).match(PRICE);
      if (!m) continue;
      const v = clean(m[0]);
      if (isStruck(el)) struck.push(v);
      else if (contextual(el)) ctxPrices.push(v);
      else live.push(v);
    }

    // Fall back to text order if the card has no leaf price elements.
    // When a card shows two headline prices it is a discount display, and in
    // every one of these six the CURRENT price is the lower of the pair and
    // the ORIGINAL the higher. Using that instead of relying on markup is
    // robust: Revid fakes its strikethrough with a ::after pseudo-element, so
    // computed text-decoration reports 'none' and DOM detection alone misses it.
    const num = (v) => parseFloat(String(v).replace(/[$,]/g, ''));
    const candidates = [...live, ...struck].filter((v) => Number.isFinite(num(v)));
    let price = live[0] ?? null;
    let was = struck[0] ?? null;
    if (candidates.length > 1) {
      const sorted = [...candidates].sort((a, b) => num(a) - num(b));
      price = sorted[0];
      was = sorted[sorted.length - 1];
      if (num(price) === num(was)) was = null;
    }
    if (!price) {
      // Nothing clean left — fall back to the first price in the card that is
      // not an annual total, rather than blindly taking the first.
      const all = (cardText.match(PRICE_G) || []).map(clean);
      price = all.find((v) => !ctxPrices.includes(v)) ?? all[0] ?? null;
    }

    // Billing period, and the annual TOTAL where the card states one.
    // "Save $36/year" is a discount, not a total — exclude it explicitly.
    let period = null, billedTotal = null, billingNote = null;
    for (const line of cardText.split('\n').map((x) => x.trim()).filter(Boolean)) {
      if (!period) {
        const m = line.match(/\/\s*(mo|month|week|wk|year|yr)\b/i) || line.match(/\bper\s+(month|week|year)\b/i);
        if (m) period = m[1].toLowerCase().replace(/^mo$/, 'month').replace(/^wk$/, 'week').replace(/^yr$/, 'year');
      }
      if (!billedTotal && /\bbilled\b/i.test(line) && !/\bsave\b/i.test(line)) {
        const b = line.match(PRICE);
        if (b) { billedTotal = clean(b[0]); billingNote = line.slice(0, 90); }
      }
    }

    results.push({ name: wanted, found: true, price, wasPrice: was, period, billedTotal, billingNote });
  }

  return {
    title: document.title || '',
    lang: document.documentElement.lang || '',
    plans: results,
    text: (document.body ? document.body.innerText : '')
      .replace(/\s+/g, ' ').replace(/\b[a-f0-9]{16,}\b/gi, '').trim(),
  };
}

/**
 * Click every visible billing-period control matching a word. Several of these
 * pages put the toggle on each plan card rather than once on the page, so
 * clicking only the first match switches one card and leaves the rest.
 */
function clickPeriodImpl(words, clickAll) {
  const res = [];
  const nodes = [...document.querySelectorAll('button,[role="tab"],[role="switch"],[role="option"],label,a,span,div')];
  for (const word of words) {
    // Prefix match without a word boundary: Pollo's control renders as
    // "Annual50% OFF" with no separator, so \b between "l" and "5" never
    // matched. The length guard below keeps this from matching body copy.
    const re = new RegExp('^\\s*' + word, 'i');
    const hits = nodes.filter((el) => {
      const t = (el.textContent || '').trim();
      if (!re.test(t)) return false;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0 || r.width > 320) return false;
      if (t.length > word.length + 18) return false; // not a toggle, just copy
      // Prefer leaf-ish nodes: an ancestor wrapping the whole toggle also
      // matches, and clicking it can hit the wrong half.
      return el.querySelectorAll('button,[role="tab"],[role="switch"]').length === 0;
    });
    // A page-level toggle must be clicked ONCE. Clicking both a <span> and
    // its parent <button> flips a toggle twice and lands back where it
    // started. Per-card toggles genuinely need every match clicked.
    const interactive = hits.filter((el) =>
      el.tagName === 'BUTTON' || el.getAttribute('role') === 'tab' || el.getAttribute('role') === 'switch');
    const pick = interactive.length ? interactive : hits;
    const targets = clickAll ? pick : pick.slice(-1);
    for (const el of targets) {
      try {
        // A bare .click() is enough for most of these, but some toggles are
        // wired to pointer events and ignore it. Dispatch the full sequence.
        const r = el.getBoundingClientRect();
        const opts = { bubbles: true, cancelable: true, composed: true,
                       clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
        el.dispatchEvent(new PointerEvent('pointerdown', opts));
        el.dispatchEvent(new MouseEvent('mousedown', opts));
        el.dispatchEvent(new PointerEvent('pointerup', opts));
        el.dispatchEvent(new MouseEvent('mouseup', opts));
        el.dispatchEvent(new MouseEvent('click', opts));
        el.click();
        res.push(word);
      } catch { /* ignore */ }
    }
  }
  return res;
}

export const extractPlans = (planNames) =>
  `(${extractPlansImpl.toString()})(${JSON.stringify(planNames)})`;
export const clickPeriod = (words, clickAll = false) =>
  `(${clickPeriodImpl.toString()})(${JSON.stringify(words)}, ${JSON.stringify(clickAll)})`;
