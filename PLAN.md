# Vivideo Case Study — presentation website + freshness checker

_Revision 3. Freshness checker is now **fully deterministic — no API calls**. Revision 2 incorporated review feedback: base-path handling, historical-vs-current pricing separation, review-sample wording, printable executive summary, revised build order._

## Progress

**Repo:** https://github.com/murattenes/vivideo-case (public) · **Pages URL:** https://murattenes.github.io/vivideo-case/

| Phase | Status |
|---|---|
| 1 — Repo scaffold | ✅ **Done** |
| 2 — Minimal deploy | ✅ **Done** — live at https://murattenes.github.io/vivideo-case/ |
| 3 — Pricing data model | ✅ **Done** |
| 4 — Freshness checker (no API) | ⏸️ **Deferred** by request — foundation built & verified in Phase 3; finish after the site presents well |
| 5 — Design system + executive summary | ✅ **Done** — https://murattenes.github.io/vivideo-case/executive-summary/ |
| 6 — Remaining content | ✅ **Done** — all 9 pages live |
| 7 — Media pipeline | ✅ **Done** — 30 players + 25 session-recording links live |
| 8 — Privacy pass | ☐ Not started |
| 9 — Deploy | ☐ Not started |

## Context

The research phase of the Vivideo Case Study 3 competitor analysis is complete. `/Users/murat/Desktop/vivi` holds ~1.9 GB of first-hand evidence: 30 generated benchmark videos (5 fixed prompts × 6 products), ~25 full screen recordings, 6 cancellation recordings, 59 coded user reviews with screenshots and source URLs, and finished analysis in `recommendations.md`, `cancellation.md`, `distribution.md`, and the five `*-compare.md` files.

What does not exist yet is the deliverable. The brief (`tmp/pdfs/case-3-*.png`) asks for four things — the analysis in a format that maximizes understanding, a **working** freshness mechanism with a README showing it works, a one-page executive summary ("the 10 things we must know + your top 5 recommendations"), and a spend report. Only the spend report is written. The rubric weights first-hand evidence at 35%, anti-slop insight at 25%, actionability at 20%, format at 10%, and "high agency & staying power" at 10%.

The goal: a deployed Astro site on GitHub Pages that presents the analysis, with benchmark videos streamed on demand from Google Drive (keeping the repo a few MB instead of 300+), and a scheduled GitHub Action that re-checks competitor pricing and commits versioned snapshots the site renders.

### Decisions

| | |
|---|---|
| Stack | Astro static site → GitHub Pages |
| Video | Google Drive, click-to-load `/preview` iframe, local poster frames |
| Freshness | GitHub Actions cron → fetch → narrowed extract → hash → deterministic field parse → commit snapshot + diff. **No API calls, no secrets.** |
| Repo | Visibility TBD (see below); raw recordings and receipts stay off it either way |
| Drive validation | No dedicated test phase. If an embed fails it's a sharing-setting fix, not a re-upload. |

### Repo visibility — the important nuance

A private repo hides the **source**, not the deliverable:

- GitHub Pages from a private repo requires **Pro / Team / Enterprise**. On Free, the deployment repo must be public.
- **The published site is public regardless.** Private visibility does not make the rendered evidence private.
- Private does not lift the 100 MB per-file or ~1 GB repo limits. Videos still cannot be committed.
- The brief asks for "the freshness mechanism (repo/script/checklist) with a README showing it works," which implies a reviewer reads the source — a public repo serves that better.

**Therefore:** the privacy pass (Phase 7) applies to everything rendered on the site and everything in the public Drive folder, independent of repo visibility. Build so visibility is a one-line change; confirm the account's plan tier before deploy.

### Constraints discovered during exploration

- `competitors/` is **1.8 GB**; four files exceed GitHub's 100 MB hard limit (`runway/AGENT-01` 182 MB, `revidai/AVATAR-01` 155 MB, `invideo/AVATAR-01` 144 MB, `heygen/AGENT-01` 130 MB). Nothing under `competitors/` or `cancellation/` may be committed. **Git history is permanent** — a large file committed once and deleted later still blocks every push, so `.gitignore` must be correct *before* the first `git add`.
- Cancellation recordings show name, email, card last-4, invoice IDs. Screen recordings show account name and credit balance. `competitors/polloai/image.png` has "Murat Erdoğan's Project" in the header — crop before publishing.
- **The real exposure surface is the Drive folder, not the repo.** "Anyone with the link" is permanent and unrevocable-in-practice once shared. Only the 30 generated outputs go in the public folder.
- `data/pricing.csv` is **header-only**. No structured plan/credits/watermark/resolution data for any product, no Vivideo pricing at all.
- The handoff's §8 claim that the four distribution screenshots are missing is **stale** — they are `competitors/polloai/image{,2,3}.png` and `competitors/invideo/image.png`.
- Toolchain present: node 25.9, npm 11.12, git 2.50, ffmpeg 8.1, python 3.11. **`gh` is not installed** and the workspace is **not a git repo**.

---

## Build order

Front-loads the two things that invalidate later work if wrong: the Pages base path, and the pricing data model.

| # | Step | Why here |
|---|---|---|
| 1 | Repo + Astro scaffold, `.gitignore` verified | Must precede first commit |
| 2 | Deploy a minimal page | Surfaces the base-path bug immediately |
| 3 | Pricing schema + checker proof | Two-field model shapes the pricing page |
| 4 | Executive summary + Strategy | The highest-weight deliverable |
| 5 | Benchmarks + Competitors from research | Bulk content conversion |
| 6 | Posters + Drive manifest population | Mechanical, parallelizable with content |
| 7 | Pricing, Reviews, Distribution, Methodology | Remaining pages |
| 8 | Privacy pass, link check, mobile, accuracy | Pre-deploy gate |
| 9 | Deploy + manual freshness trigger | Verify end to end |

---

## Phase 1 — Repo scaffold ✅ DONE

Initialize git in `/Users/murat/Desktop/vivi`; create `site/` as an Astro project. Research files stay put; `.gitignore` decides what ships.

### What was built

- `git init` — **no commit made yet**, so nothing is locked into history.
- `.gitignore` covering `competitors/`, `cancellation/`, `research/evidence/`, `tmp/`, all video extensions anywhere, `reviews/**/*.png|jpg`, plus build/env/OS noise.
- `site/` scaffolded manually (not via interactive `npm create astro`) for a deterministic result: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/lib/url.ts`, `src/layouts/Base.astro`, `src/pages/index.astro`, `public/base-path-probe.svg`.
- Astro **5.18.2** installed, 277 packages. Telemetry disabled.

### Verified

| Check | Result |
|---|---|
| Videos that would be staged | **0** |
| Files >10 MB that would be staged | **0** |
| `check-ignore` on 4 known-bad paths (182 MB mp4, cancellation mp4, tmp, research/evidence) | all ignored |
| `check-ignore` on 4 must-keep paths (`PLAN.md`, `recommendations.md`, `data/pricing.csv`, benchmark prompts) | all tracked |
| `node_modules/`, `dist/`, `.astro/` ignored | yes |
| `npm run build` | passes, 1 page, 323 ms |
| Every emitted `src`/`href` carries the base prefix | yes |
| Double-slash paths in output | none |

Files git would track: **65**.

### Key artifact: `src/lib/url.ts`

`asset(path)` and `route(path)` are the single choke point for the base-path bug. Both strip a leading slash before appending to `BASE_URL` (which already ends in `/`). **All public-asset paths in data files must be stored relative** — `posters/x.webp`, never `/posters/x.webp`.

`astro.config.mjs` holds the only copy of the deployment URL, in two constants:

```js
const GITHUB_USER = 'CHANGEME';   // ← must be set before deploy
const REPO_NAME   = 'vivideo-competitor-analysis';
```

```
vivi/
├─ .gitignore
├─ PLAN.md
├─ site/
│  ├─ src/content/          ← existing .md, lightly reformatted
│  ├─ src/data/*.json       ← media manifest, pricing, benchmark rows
│  ├─ src/pages/            ← 10 routes (9 sections + /executive-summary/)
│  ├─ public/posters/*.webp
│  └─ public/evidence/      ← cropped, redacted screenshots only
└─ scripts/freshness/
```

`.gitignore` excludes at minimum: `competitors/`, `cancellation/`, `tmp/`, `research/evidence/`, `reviews/**/*.png`, `*.mp4`, `.DS_Store`.

**Gate before first commit:** `git add -An | grep -E '\.(mp4|mov)$'` must be empty, and `git status --short | wc -l` must be a sane number. Confirm with `git count-objects -vH` after committing.

### Base path handling (applies everywhere)

Astro does **not** rewrite paths inside `public/`. Absolute paths break under `https://<user>.github.io/<repo>/`.

Store every public-asset path **relative, with no leading slash**:

```json
{ "poster": "posters/vivideo-agent01.webp" }
```

Resolve at render time. `BASE_URL` already includes a trailing slash:

```js
const posterUrl = `${import.meta.env.BASE_URL}${item.poster}`;
```

Same rule for nav links, evidence images, and any fetched data file. Set `site` and `base` in `astro.config.mjs` to match the final repo name.

---

## Phase 2 — Minimal deploy ✅ DONE

**Live: https://murattenes.github.io/vivideo-case/** — run #2 green, both jobs.

Verified against the deployed URL (not just local preview, which cannot catch base-path bugs): page `HTTP 200`, probe asset `HTTP 200 image/svg+xml`, all 12 emitted paths prefixed `/vivideo-case/`, zero double slashes.

Actions bumped to current majors — checkout v7, setup-node v7, upload-pages-artifact v5, deploy-pages v5 — clearing the Node 20 deprecation warnings. Input surface unchanged for the options used.

<details>
<summary>Original Phase 2 detail</summary>


Ship one page with a nav link and one image before writing real content. Confirms `base`, the Actions workflow, and Pages settings in one pass, and catches the path bug from Phase 1 while there is one asset to fix instead of forty.

### Done

- `astro.config.mjs` set to `murattenes` / `vivideo-case`; rebuilt and verified every emitted path is `/vivideo-case/…` with no double slashes.
- `.github/workflows/deploy.yml` — `withastro`-style build + `actions/deploy-pages@v4`, `concurrency: pages` with `cancel-in-progress: false`. No secrets, no untrusted input interpolated into `run:` steps.
- Pre-commit privacy scan across all staged files: no personal email, no credential-shaped strings, no card/billing digits.
- **Initial commit `408ee06` pushed.** 48 files, **5.8 MB**, zero videos, nothing over 5 MB. Git identity uses the GitHub noreply address, so no personal email in commit metadata.
- CI run #1: **`build` succeeded (16s)** — Astro config, `npm ci` lockfile path, and artifact upload all confirmed working.

### Blocked on one repo setting

`deploy` failed with `Failed to create deployment (status: 404) … Ensure GitHub Pages has been enabled`. Verified independently: `GET /repos/murattenes/vivideo-case/pages` → **404**, so Pages has never been enabled.

**Fix (user, web UI):** Settings → Pages → Build and deployment → **Source = GitHub Actions**. Then re-run the job.

### Deferred, non-blocking

`actions/checkout@v4`, `setup-node@v4`, `upload-artifact@v4`, `deploy-pages@v4` emit Node 20 deprecation warnings (GitHub force-runs them on Node 24). Cosmetic. Bump to `@v5` releases opportunistically, not as its own commit.

### Deleted research scaffolding — noted, not restored

17 files were removed from the workspace before the first commit (11 of 12 `data/` CSVs, `research/templates/`, `research/notes/`, `scoring-rubric.md`, `evidence-guide.md`, `review-coding-guide.md`) — deliberate cleanup, matching handoff §15. All primary evidence verified intact: 30 generated outputs, 6 cancellation recordings, 37 review screenshots, 30 competitor screenshots, 1.8 GB.

Nine of the CSVs were header-only. **Two held real content, captured before deletion and to be carried into the site data model rather than restored as CSVs:**

- **Vivideo capability boundary** (2026-07-25, MAX Plan): video agent, text-to-video, image-to-video, model selection, avatar+voice, brand controls = `true`; post-generation editor, existing-video upload, long-video clipping = `false`. This is the evidence behind recommendations #2 and #3.
- **Evidence records** for `VIVI-GEN-001/002` screenshots, including the note that both display account name and credit balance and must be sanitized before publication.

**Follow-up:** top-level `README.md` still documents the old research-kit workflow and points at deleted files (`data/`, `research/scoring-rubric.md`). It is the repo's front page — replace it during Phase 6.

</details>

---

## Phase 3 — Pricing data model + checker proof ✅ DONE

### Built

- `site/src/data/pricing.json` — two-observation model, 6 products, **70 observations**. 21 known from research, 9 from the live check.
- `scripts/freshness/validate-pricing.mjs` — enforces `status: observed ⇒ value present` and `status: unknown ⇒ value null`, and lists fields unknown-in-research-but-known-now so they render as *"not recorded during testing"* rather than as a detected change. **0 integrity errors.**
- `scripts/freshness/normalize.mjs` — script/style/svg removal → pricing-region narrowing → noise stripping (build hashes, tokens, timestamps, countdown copy, social-proof counters) → sha256 + ordered price extraction. Zero dependencies.
- `scripts/freshness/targets.mjs` — per-product URL, container selectors, noise patterns.
- `scripts/freshness/verify-stability.mjs` — fetches N times, fails if any hash moves.

### Verified against live pages, 2026-08-01

```
vivideo   STABLE   hash=f0092231d426  text=14670b  prices=10
heygen    STABLE   hash=271444691a0c  text=13962b  prices=16
invideo   STABLE   hash=627540ce4782  text=1290b   prices=0
pollo     UNREACHABLE  HTTP 403 (expected)
revid     STABLE   hash=34b105f87437  text=2131b   prices=4
runway    STABLE   hash=b5a522a82302  text=4842b   prices=13
→ 5/6 stable, 0 unstable, 1 unreachable
```

**Cross-validation:** extracted prices match the spend report independently — HeyGen `$29`, Revid `$39`, Runway `$15`. The extractor reads the same numbers that were actually paid.

### Two limitations found — recorded, not papered over

- **Pollo** — HTTP 403 to non-browser clients (Cloudflare). Automated checks fail by design. `knownBlocked: true`.
- **InVideo** — fully client-rendered (Next.js RSC). Static HTML has **no prices and no plan names**; body text is ~2.2 KB with no "Plus", "Free", or "/mo". The `$18`/`$36` tokens in its raw source are RSC reference markers (`$L2`, `$undefined`), **not currency** — an early naive grep produced false positives here, caught by stripping scripts before extraction. `staticPricing: false`; page changes still detected, price values need a manual check.

### New finding: Vivideo's own pricing

Absent from all prior research — `data/pricing.csv` was empty and the handoff lists it as unknown.

| Plan | Headline | Actually billed | Weekly option | Credits |
|---|---|---|---|---|
| Pro | `$2 /week` | `$99` once yearly | `$9/week` | 30/week |
| Max | `$4 /week` | `$199` once yearly | `$19/week` | 100/week |

Banner: *"Save up to 79%"*. Weekly-price anchoring on an annual commitment, with the weekly-billing alternative at 4.5× the yearly-equivalent rate. This is a **pricing-psychology finding** the brief explicitly asks for, and the tested plan was MAX — so $199/yr or $19/wk.

<details>
<summary>Original Phase 3 detail</summary>


### The two-field rule

The checker's first run must never backfill a field we did not observe in July and present it as research provenance. Every pricing field carries two independent observations:

```json
{
  "heygen": {
    "planName": {
      "researchObservation": { "value": "Creator", "observedAt": "2026-07-26", "status": "observed" },
      "latestCheck":         { "value": "Creator", "observedAt": "2026-08-01", "status": "observed" }
    },
    "maxExportResolution": {
      "researchObservation": { "value": null, "observedAt": null, "status": "unknown" },
      "latestCheck":         { "value": "1080p", "observedAt": "2026-08-01", "status": "observed" }
    }
  }
}
```

`status` ∈ `observed` | `unknown` | `not_applicable`. This matches the handoff's standing rule — *use `unknown`, `not_tested`, or `not_applicable`; never guess.*

The pricing page renders four columns: **observed during research · currently detected · difference · last checked**. A field unknown in July and known now shows as "not recorded during testing," not as a price change.

### Seeding the research column

Documented and usable now, from `spend-report.md`: HeyGen Creator $29, InVideo Plus $20, Pollo Lite $15, Revid Growth $39, Runway Standard $15. Watermark and free-plan observations are scattered through `distribution.md` and the handoff product notes. Everything else — including all Vivideo pricing — is `unknown`.

</details>

---

## Phase 4 — Freshness checker (deterministic, no API)

**No API calls, no `ANTHROPIC_API_KEY`, no model dependency.** The brief explicitly accepts this shape: *"a pricing-page diff watcher, changelog/review-stream alerts, or a repeatable checklist."* A diff watcher is a first-class answer, not a downgrade — and it removes the failure mode where a model hallucinates a price nobody published.

`scripts/freshness/check.mjs` (zero runtime deps beyond `node:` builtins + one HTML parser); `.github/workflows/freshness.yml` on cron + `workflow_dispatch`.

```
fetch pricing page
  → strip <script>/<style>/<svg>/<noscript>
  → slice to the pricing region
  → normalize (collapse whitespace, drop promo banners, tokens, session IDs, dates)
  → sha256
  → hash unchanged?  → status `unchanged`, stop
  → hash changed?    → deterministic field parse → field diff → status `changed`
```

### The narrowed extract does double duty

It is both the hash input and the parse input, so it has to be right or everything downstream is noise. These are marketing pages carrying rotating promo bars (the Pollo capture shows a live "Up to 60% Off Seedance 2.0" banner), CSRF tokens, session IDs, and A/B variants. Hashing the whole page reports a change every single run.

So: slice to the pricing region, preserve digits and plan names, discard chrome. A per-product config declares the container selector and the noise patterns to strip.

**Stability gate:** during development, print the hash input and run each product three times. If the hash moves without the page changing, the normalizer is not done — do not proceed until it holds.

### Field parsing — deterministic, and honest when it fails

Per-product config in `scripts/freshness/targets.mjs`: pricing URL, container selector, plan-card selector, and regexes for price/currency/credits. Parsing is `cheerio` + regex over the narrowed extract.

Parsers break when sites redesign — that is expected, and the design accounts for it:

- A parse that yields nothing records `parse_failed` **with the raw normalized text saved to `debug/`**, so the change is still visible and reviewable by hand.
- The hash-level signal survives independently. Even with every selector broken, the checker still correctly answers *"did this pricing page change since the last check?"* — which is the actual brief requirement.
- **A parse failure is never rendered as a price change.**

### Outputs — `site/src/data/freshness/`

`current.json` · `previous.json` · `diff.json` · `history.jsonl` · `status.json`

Each product record carries `checkedAt`, `lastSuccessfulAt`, `sourceUrl`, `sourceHash`, and `status` ∈ `changed` | `unchanged` | `fetch_failed` | `parse_failed`.

### Non-negotiable behaviors

- **A failed check never overwrites good data.** Preserve last successful values; surface the failure separately.
- **A failed parse is never a price change.** `parse_failed` and `changed` are distinct states.
- **Commit only on material change** — no empty commits from unchanged runs.
- Several of these sites sit behind Cloudflare and will block Actions runners. The Freshness page renders "no change," "changed," "fetch failed," and "parse failed" honestly. *A checker reporting 4/6 succeeded with reasons is working; one silently writing empty rows is not.*

Workflow needs only `permissions: contents: write`. No secrets.

`scripts/freshness/README.md` documents local usage, each output file, each status, and a real sample run — the brief asks for the mechanism "with a README showing it works."

### Outputs — `site/src/data/freshness/`

`current.json` · `previous.json` · `diff.json` · `history.jsonl` · `status.json`

Each product record carries `checkedAt`, `lastSuccessfulAt`, `sourceUrl`, `sourceHash`, and `status` ∈ `changed` | `unchanged` | `fetch_failed` | `extract_failed`.

### Non-negotiable behaviors

- **A failed check never overwrites good data.** Preserve the last successful values and surface the failure separately.
- **A failed extraction is never a price change.** `extract_failed` and `changed` are distinct states.
- **Commit only on material change** — no empty commits from unchanged runs.
- Several of these sites sit behind Cloudflare and will block Actions runners. The Freshness page renders "no change," "changed," and "check failed" honestly. *A checker reporting 4/6 succeeded with reasons is working; one silently writing empty rows is not.* The brief's words: small and working beats a paragraph of intentions.

`scripts/freshness/README.md` documents local usage, each output file, and a real sample run.

---

## Phase 5 — Design system + executive summary ✅ DONE

**Live: https://murattenes.github.io/vivideo-case/executive-summary/**

### Design direction

Derived from the subject, not a template. The analysis is about the gap between what an AI video product promises and what it delivers — so the **signature element is a divergence bar**: approved value as the track, delivered value drawn over it, overshoot visibly breaking past the rule. The shape of the finding is the finding.

- **Colour encodes identity, not mood.** Purple is reserved exclusively for Vivideo, so the baseline product is separable from the five competitors on every page. A single signal orange appears *only* inside divergence data, never as decoration.
- **Type:** Bricolage Grotesque (display) · IBM Plex Serif (body) · IBM Plex Mono (durations, credits, prices). Plex carries engineering-documentation DNA suiting the stated audience, and avoids both the cream/serif and Inter-sans defaults.
- **Provenance is structural:** every claim is tagged `observed` / `review claim` / `interpretation`.

Files: `src/styles/global.css` (tokens), `src/components/Divergence.astro` (signature), `src/layouts/Base.astro` (chrome + fonts).

### Verified

| Check | Result |
|---|---|
| Ten findings, numbered sequentially across four groups | 01–10 ✓ |
| Five recommendations | ✓ |
| Provenance markers | 7 observed · 3 review claim · 3 interpretation |
| Print to A4 | **exactly 1 page** (verified by rendering PDF and counting) |
| Print body size | 6.3 pt — legible, confirmed by rendering to image |
| Horizontal overflow @ 375 px | **0 elements** (CDP device emulation) |
| Horizontal overflow @ 320 px | **0 elements** |

Getting to one page took three attempts. Shrinking the base font did nothing because every print rule set absolute `pt` sizes; the fix was a **three-column findings layout** plus print rules inside `Divergence.astro` to stop the hero bars rendering at screen scale.

*Note: an early "mobile is broken" reading was a false alarm — Chrome clamps `--window-size` to a 500 px minimum, so a 500 px layout was being cropped into a 375 px image. Device emulation via CDP is the reliable check.*

<details>
<summary>Original Phase 5 detail</summary>

Its own route, print CSS, one page at A4. Contents: the 10 things Vivideo must know · the top 5 recommendations · a short methodology caveat · links to supporting evidence.

### Structuring the ten

Organizing frame — three market/customer truths, three first-hand Vivideo findings, two competitor mechanisms worth adopting, two strategic implications — with **one hard rule: every one of the ten traces to something observed, recorded, or captured.**

"The AI video market is commoditizing" is the kind of sentence the brief says it will reject. The same claim earned from evidence is not: *the same visible prompt never isolated model quality, because six products made six different orchestration decisions — prompt rewriting, model routing, clip assembly, post-processing — from identical input.*

Candidate evidence pool: Vivideo credit estimate/charge gaps (9→15, 12→21) · 18s approved plan → 34s output · T2V-01 narration despite an explicit no-audio instruction · I2V-01 PAUSE→PLAY failure and stalled pinwheel · Vivideo cancellation ending in a support email · HeyGen's ~11-minute AGENT-01 · Pollo's 50/200 two-sided referral · InVideo's expensive-by-default model selection · Revid's 25-credit publish loop · Runway quests earning back credits · the cross-product credit-opacity review theme.

Each finding states **why it matters**, not just what happened.

### Six-dimension taxonomy (used site-wide)

Keep these apart so model quality is never mistaken for product quality:

1. Underlying generation model quality
2. Product workflow and orchestration
3. User control and editability
4. Pricing and credit transparency
5. Retention and cancellation
6. Distribution and growth mechanisms

</details>

**Outstanding:** the homepage is still the Phase 2 deployment probe. Replace in Phase 6.

---

## Phase 6 — Remaining content ✅ DONE

All nine routes live and verified HTTP 200 (run #5): `/` `/executive-summary/` `/benchmarks/` `/competitors/` `/pricing/` `/reviews/` `/distribution/` `/strategy/` `/methodology/`.

### Built

- **Homepage** replaced the deployment probe: thesis, one divergence bar, stat strip, section grid, provenance legend.
- **Benchmarks** renders `benchmarks.json` (canonical numbers from the five compare files) with **two distinct failure markers**: orange duration highlight only where a numeric request was missed; a `constraint violated` chip where an explicit requirement broke (no-audio narrated, PAUSE→PLAY unchanged, stationary boat). Caught mid-build: one flag for both had wrongly highlighted Revid's on-target 8s. One-run caveat + agent-vs-manual comparability sit at the top of the page.
- **Competitors**: six profiles (strongest mechanism / weakness / first-run record / implication) + landscape incl. briefly-probed Fliki.
- **Pricing**: tested-vs-current with honest watcher failures, weekly-anchor finding, credit-feel table, ranked cancellation friction, spend report.
- **Reviews**: "themes identified in the selected review sample" framing, per-product theme counts + representative cards, cross-product themes. Revid affiliate left **unverified** (notes say 20%, earlier note said 50%).
- **Distribution**: four loop types, observed mechanisms, synthesis.
- **Strategy**: five recommendations (problem / steal / measure), trust hygiene, Steal/Avoid/Attack, roadmap, three threats **with watch indicators** (fills the handoff §14 gap).
- **Methodology**: prompt set, tested-build capability boundary (carried from deleted `capability-matrix.csv`), rules, evidence inventory.

### Exec summary strengthened from `my-observations.md`

Fourth hero bar (HeyGen 18s plan → 45s delivered) proves divergence is category-wide; the accurate 6-credit estimate sharpens finding 04 to "unreliable, not consistently inflated"; Runway's approve-only dialog added to finding 09. **Print re-verified: still exactly 1 A4 page.** `my-observations.md` committed as raw first-hand evidence, linked from methodology.

### Verified

9 pages build · **0 broken internal links** (crawler over dist) · print = 1 page · live 200s on all routes.

### Original Phase 6 table


| Page | Source | Work |
|---|---|---|
| Overview | new | Condensed landing; links into the exec summary |
| Strategy | `recommendations.md` | Steal / Avoid / Attack, roadmap, 3 threats |
| Benchmarks | 5 `*-compare.md` | Comma-rows → `benchmarks.json`; comparison grid |
| Competitors | handoff §6 + `distribution.md` | 6 profiles across the six dimensions |
| Pricing & cancellation | Phase 3 data + `cancellation.md` | Four-column table; friction comparison; retention offers |
| Reviews | `reviews/*/reviews.md` | See wording rule below |
| Distribution | `distribution.md` | Pollo referral primary; affiliate or Revid publishing secondary; InVideo Explore small |
| Methodology | `research/methodology.md`, `benchmark-prompts.md` | Tested build, prompt set, assets, single-run limit, evidence rules |

### Provenance markers

Every claim is tagged **observed** (first-hand) · **review claim** (user allegation, not verified fact) · **interpretation** (strategic reading). This is the anti-slop signal, and the handoff insists on it repeatedly.

### Reviews — sample, not statistics

9–11 hand-selected reviews per product is a qualitative sample with no sampling property. `reviews/README.md` already calls it "selected direct-review evidence"; the site must match.

- Heading: **"Themes identified in the selected review sample"** — not "theme frequency."
- Show reviews examined per competitor, count mentioning each theme, sources, collection date (2026-08-01), and a one-line limitation.
- **Never** use these counts to claim one product attracts more complaints than another.
- Label App Store feedback as mobile-app feedback; do not generalize it to web.
- Vivideo's two Trustpilot profiles (`vivideo.ai`, `app.vivideo.ai`) stay reported separately.

### Benchmarks — the comparison must not imply a winner

Only one main run per product/workflow. State the single-run limit on the page itself, not buried in Methodology. Label workflow type beside every output — several products ran agent workflows where others ran manual, so a naive ranking would be wrong. Compare agent with agent, manual with manual, avatar with avatar.

---

## Phase 7 — Media pipeline ✅ DONE

### Built

- 30 JPEG posters (ffmpeg, 540w, 1.1 MB total — this ffmpeg build lacks a WebP encoder).
- `media-manifest.json`: every (product, prompt) → Drive output file ID + session-recording ID where one exists (25/30; Vivideo has none). IDs enumerated from the shared folder via `embeddedfolderview` — no API key needed.
- `BenchmarkCard`: local poster, click swaps in Drive `/preview` iframe, zero video bytes before click; session recordings link out beneath cards; Vivideo cards purple-bordered.
- Drive files verified **publicly accessible unauthenticated** (outputs + a recording).

### Duration ground-truthing

ffprobe over all 30 outputs vs the compare files: consistent under floor-of-player rounding, except **Runway AVATAR-01 = 17.0s vs recorded 16s** — corrected to 17s (video wins).

### Revid corrections settled by dated screenshots

- **Affiliate: 20% lifetime** (+20 credits once verified), code **auto-embedded into shared videos**. The earlier 50% note was wrong. (Screenshot 2026-07-30)
- **25-credit publish reward requires “revid.ai” in the caption** — attribution as a condition. (Screenshot 2026-07-31)

Updated on distribution / competitors / strategy / exec summary; print still 1 page.

### ⚠️ OPEN PRIVACY ISSUE — user action required

The Drive share was applied to the **root folder**, so **`receipts/` is publicly reachable** (heygen.pdf, invideo.pdf, polloai, revidai, runway.pdf — verified accessible without login). The spend report explicitly says checkout captures contain billing data and must not be published. **Fix: move `receipts` out of the shared `vivi` folder** (moving it out removes public access; competitor folders stay shared). Screen recordings being public is a deliberate evidence choice and is fine — they show account name/credit balance, already user-approved for sharing.

### Original Phase 7 plan


**Posters.** One script over the 30 outputs. Match on the `-{agent,ad,t2v,i2v,avatar}01.mp4` suffix, not a product prefix — the filenames use `vivideo-`, `pollo-`, `revidai-`, `heygen-`, `invideo-`, `runway-` inconsistently. Seek ~15% in, scale to 540px, WebP q75 → `site/public/posters/`. Capture true duration via `ffprobe`. ~30 KB each, ~1 MB total.

Cross-check `ffprobe` durations against the "Actual duration" column in the `*-compare.md` files. On mismatch the video file wins (handoff §16 source-of-truth order).

**Manifest** — `site/src/data/media-manifest.json`, relative paths per the base-path rule:

```json
{
  "vivideo-agent01": {
    "product": "vivideo", "prompt": "AGENT-01",
    "driveId": null, "poster": "posters/vivideo-agent01.webp",
    "durationSec": 34, "requestedDuration": "15-20",
    "workflow": "agent", "model": null, "autoSelected": true,
    "note": "Plan preview showed 18s; final video ran 34s."
  }
}
```

`driveId: null` renders as "evidence link pending" rather than a broken embed, so the site builds and deploys before uploads finish.

**Drive.** Two folders: public-link ("Anyone with the link → Viewer") for the 30 outputs; restricted for screen recordings, cancellation recordings, and receipts. Populate IDs via an Apps Script folder listing (the workspace already uses this pattern in `research/create-drive-folders.gs`) emitting `filename,fileId`; a node script merges into the manifest by filename.

**Player.** `<BenchmarkCard>` renders poster + metadata; click swaps in `<iframe src="https://drive.google.com/file/d/{driveId}/preview" allow="autoplay" loading="lazy">` plus a Close control. Zero video bytes until clicked.

Design around, don't fight: Google player chrome is visible, no autoplay, no muted loop, **no synchronized 6-up playback**. So the grid leads with the metadata row (requested vs. actual duration, workflow, model, first-run note) and treats video as on-demand proof.

---

## Phase 8 — Privacy pass

Run against built `dist/`, not just source.

- Crop `competitors/polloai/image.png` to the referral modal, dropping the account name. Same for any screenshot showing account name, email, or credit balance.
- `git ls-files | grep -c '\.mp4$'` must return `0`.
- No checkout or receipt screenshots ship — the spend report flags InVideo, Revid, and Runway captures as containing billing data.
- Grep `dist/` for the personal email and name.
- Verify the public Drive folder holds only the 30 generated outputs — no recordings, no receipts.

---

## Phase 9 — Deploy

`.github/workflows/deploy.yml` using `withastro/action` + `actions/deploy-pages`. `gh` is not installed, so the repo is created via the GitHub web UI (or `brew install gh` first) — you do that and hand me the remote. **Confirm the plan tier before choosing private**, per the visibility note above. Set `GITHUB_USER` and `REPO_NAME` in `astro.config.mjs`, then enable Pages → GitHub Actions. No secrets required.

---

## Verification

1. `cd site && npm run build && npm run preview` — all routes render, no broken internal links.
2. **Base path**: every poster, evidence image, and nav link resolves on the *deployed* URL, not just locally. This is the failure mode local preview hides.
3. Benchmark grid: cards show poster + metadata; a card with a `driveId` loads the player inline; one without shows "evidence link pending."
4. Cross-check 30 `ffprobe` durations against the `*-compare.md` column; resolve mismatches in favor of the video.
5. Freshness locally: run three times against unchanged pages — the hash must be identical all three times and produce zero commits. Point one product at a bad URL: confirm `fetch_failed`, prior snapshot preserved, not reported as a price change. Break one selector deliberately: confirm `parse_failed` still reports the hash-level change and saves the raw text to `debug/`.
6. `workflow_dispatch` the workflow; confirm it commits back.
7. Phase 8 privacy checks against `dist/`.
8. Mobile at 375px: benchmark grid, tables, Drive iframe, and the exec summary all hold up.
9. `/executive-summary/` prints to a single A4 page.
10. Deployed URL in a fresh browser profile, logged out of Google — confirms the Drive embeds are genuinely public.

## Out of scope unless asked

Recorded walkthrough video · changelog and feature-announcement monitoring beyond pricing · the optional 10th Revid/Vivideo review · a dedicated Drive test phase (if an embed fails it's a sharing-setting fix). The `data/*.csv` scaffolds stay untouched until site content is verified — the handoff is explicit that research files must not be deleted before migration is confirmed.
