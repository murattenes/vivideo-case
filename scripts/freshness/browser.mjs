/**
 * Minimal Chrome driver over the DevTools Protocol.
 *
 * No Puppeteer, no npm dependency: Node's built-in fetch and WebSocket are
 * enough to launch Chrome, navigate, and evaluate JavaScript in the page.
 *
 * A real browser is required rather than plain fetch because two of the six
 * pricing pages are unreadable without one:
 *   · Pollo AI  — Cloudflare returns HTTP 403 to non-browser clients
 *   · InVideo   — pricing is client-rendered; static HTML has no prices
 * Both were verified working through this driver on 2026-08-02.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean);

export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function findChrome() {
  const found = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      `Chrome not found. Tried:\n  ${CHROME_CANDIDATES.join('\n  ')}\nSet CHROME_PATH to override.`,
    );
  }
  return found;
}

export async function launch({ port = 9222 + Math.floor(Math.random() * 500) } = {}) {
  const bin = findChrome();
  const proc = spawn(
    bin,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      // Without this, Cloudflare fingerprints the automation and serves
      // an interstitial challenge instead of the pricing page.
      '--disable-blink-features=AutomationControlled',
      '--window-size=1440,900',
      `--user-agent=${USER_AGENT}`,
      `--remote-debugging-port=${port}`,
      'about:blank',
    ],
    { stdio: 'ignore', detached: false },
  );

  // Wait for the debugging endpoint to answer.
  let target = null;
  for (let i = 0; i < 60; i++) {
    await sleep(300);
    try {
      const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      target = tabs.find((t) => t.type === 'page');
      if (target?.webSocketDebuggerUrl) break;
    } catch {
      /* not up yet */
    }
  }
  if (!target) {
    proc.kill('SIGKILL');
    throw new Error('Chrome did not expose a debugging target in time');
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error('CDP websocket failed to open'));
  });

  let msgId = 0;
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++msgId;
      const timer = setTimeout(() => {
        ws.removeEventListener('message', onMessage);
        reject(new Error(`CDP timeout: ${method}`));
      }, 60_000);
      function onMessage(event) {
        const msg = JSON.parse(event.data);
        if (msg.id !== id) return;
        clearTimeout(timer);
        ws.removeEventListener('message', onMessage);
        if (msg.error) reject(new Error(`${method}: ${msg.error.message}`));
        else resolve(msg.result);
      }
      ws.addEventListener('message', onMessage);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send('Page.enable');
  await send('Runtime.enable');
  // Force English. HeyGen geolocates and was serving Turkish ("Oluşturucu",
  // "$29 / ay"), which broke plan-name matching and leaked FAQ headings in.
  await send('Emulation.setUserAgentOverride', {
    userAgent: USER_AGENT,
    acceptLanguage: 'en-US,en;q=0.9',
  });
  await send('Network.enable').catch(() => {});
  await send('Network.setExtraHTTPHeaders', {
    headers: { 'Accept-Language': 'en-US,en;q=0.9' },
  }).catch(() => {});
  // Hide the automation flag before any page script runs.
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `Object.defineProperty(navigator, 'webdriver', { get: () => undefined });`,
  });

  return {
    async goto(url) {
      await send('Page.navigate', { url });
    },
    async evaluate(expression) {
      const res = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (res.exceptionDetails) {
        throw new Error(res.exceptionDetails.exception?.description ?? 'evaluate failed');
      }
      return res.result.value;
    },
    async close() {
      try {
        ws.close();
      } catch {
        /* ignore */
      }
      proc.kill('SIGKILL');
    },
  };
}
