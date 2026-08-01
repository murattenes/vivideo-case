GPT: Your website-first plan is strong—probably **better than presentation-first** for this case. Their brief explicitly allows a web page or dashboard, asks for layered information, visual evidence, and a working mechanism that keeps the analysis fresh. A well-designed website can become both the main analysis and the living freshness mechanism. 

The key is to avoid spending too much time building software before collecting evidence. The website should organize and communicate the research—not become the main project itself.

# Recommended final approach

Use the website as the **single source of truth**:

```text
Hands-on research
        ↓
Structured JSON/Markdown files in GitHub
        ↓
Research website
        ↓
Executive-summary PDF + recorded briefing
```

Your final submission would contain:

1. Deployed competitor-analysis website
2. GitHub repository containing the website and freshness watcher
3. Google Drive evidence folder containing recordings and original outputs
4. One-page executive-summary PDF
5. Spend report
6. Optional 20–30 minute recorded walkthrough

You do **not necessarily need a PPTX**. The case says the analysis can be submitted in any format. A polished website, one-page PDF and recorded walkthrough would satisfy the communication requirement better than duplicating everything into a large presentation.

I would only create a short presentation later if you have spare time or want an offline backup.

---

# 1. Technical architecture

## Recommended stack

Because you want GitHub Pages, keep the final website static:

* React + TypeScript
* Vite or Next.js static export
* Tailwind CSS
* Markdown, MDX, JSON or YAML for research content
* Python + Playwright for the pricing watcher
* GitHub Actions for deployment and scheduled checks
* Google Drive for large recordings and video outputs

GitHub Pages publishes static HTML, CSS and JavaScript, and it supports custom GitHub Actions deployment workflows. Scheduled GitHub Actions workflows can run your watcher periodically using cron. ([GitHub Docs][1])

## Do not build an unnecessary backend

Although you can build full-stack applications, you probably do not need:

* Authentication
* A database
* API endpoints
* A content-management system
* User accounts
* Server-side storage

Use the GitHub repository as the database.

For example:

```text
data/
├── competitors/
│   ├── revid.json
│   ├── invideo.json
│   ├── fliki.json
│   ├── heygen.json
│   ├── runway.json
│   ├── opusclip.json
│   └── vivideo.json
├── benchmark-results.json
├── landscape.json
├── reviews.json
├── recommendations.json
├── pricing-history.json
└── spend-report.json
```

When you learn something new, update the relevant JSON or Markdown file and commit it. This gives you:

* Version history
* Traceability
* Easy deployment
* No database maintenance
* Evidence that the analysis can be updated

## Where the pricing watcher runs

Do not scrape competitor websites from the browser. Instead:

```text
GitHub Actions
      ↓
Python/Playwright watcher
      ↓
Save pricing snapshots
      ↓
Compare with previous snapshot
      ↓
Generate pricing-history.json
      ↓
Rebuild website
```

The site reads the resulting JSON and displays:

* Current observed pricing
* Previous pricing
* Date checked
* Detected changes
* Screenshot or snapshot
* Confidence or watcher status

GitHub notes that scheduled Actions can occasionally be delayed during periods of high load, which is acceptable for a weekly competitor watcher. ([GitHub Docs][2])

---

# 2. Recommended website structure

The website should not feel like a collection of notes. It should have a clear hierarchy.

## Page 1 — Executive overview

This is the homepage and the first thing the Vivideo team sees.

Include:

* 10 things Vivideo must know
* Top 5 recommendations
* Top 3 threats
* Competitors tested
* Number of generated outputs
* Number of recordings
* Number of reviews analyzed
* Date of latest update
* Links to the most important findings

Example top section:

```text
6 competitors tested
35 benchmark generations
14 paywalls encountered
102 reviews classified
27 first-hand findings
Last updated: August X, 2026
```

Then show your five highest-priority recommendations.

Each recommendation should link to the underlying evidence.

---

## Page 2 — Market landscape

Show all meaningful competitors, not only the six deep dives.

Possible visual categories:

* Short-form/social-video generators
* Avatar platforms
* Prompt-to-video models
* Clipping and repurposing tools
* General editors with AI features

Each competitor card could contain:

* Category
* Primary customer
* Main job-to-be-done
* Directness of competition
* Threat level
* Deep dive completed: Yes/No
* Reason included or excluded

Include a visual landscape map with Vivideo positioned among the categories.

---

## Page 3 — Benchmark comparison

This should be one of the strongest pages.

Allow filtering by benchmark:

* Educational short
* Product advertisement
* Image-to-video
* Avatar explainer
* Long-video clipping

For each benchmark, display outputs side by side:

```text
Vivideo | Revid | InVideo | Fliki | HeyGen | Runway | OpusClip
```

For every output include:

* Embedded video or Drive link
* Original prompt
* Generation time
* Credits consumed
* Manual editing time
* Watermark
* Export resolution
* Quality score
* Main failure
* Main strength

Use the same source materials and comparable effort for each competitor.

---

## Page 4 — Competitor deep dives

Each competitor should have its own route:

```text
/competitors/revid
/competitors/invideo
/competitors/fliki
```

Use the same structure for every company.

### Competitor-page structure

#### A. One-sentence verdict

Example format:

> Revid provides one of the fastest routes from an idea to a social-video preview, but limited output control makes the initial speed less valuable for users with specific brand requirements.

That is only an illustrative structure; the real claim must come from testing.

#### B. Three things Vivideo must know

The three most important findings, each connected to evidence.

#### C. First-five-minute timeline

Show what happened minute by minute:

```text
00:00 – Homepage CTA
00:45 – Account created
01:20 – Onboarding question
02:10 – First project started
04:30 – First preview
05:00 – Upgrade prompt encountered
```

Embed or link the screen recording.

#### D. Benchmark results

Include generated outputs and your structured scoring.

#### E. Pricing and paywall journey

Show:

* Free capability
* First upgrade prompt
* Hard paywall
* Plan purchased
* What the purchase unlocked
* Cancellation process
* Retention offer
* Credit behavior

#### F. Mechanisms worth stealing

Not generic strengths. Describe exact mechanisms.

#### G. Weaknesses worth attacking

Connect your observation with user reviews where possible.

#### H. Distribution strategy

Include:

* Template galleries
* SEO landing pages
* Affiliate programmes
* Free tools
* Social sharing
* Community examples
* Publishing integrations

#### I. Evidence index

List every screenshot, output, review and recording related to the competitor.

---

## Page 5 — Pricing and funnel comparison

This should have two sections.

### Current plan comparison

| Competitor | Free generation | Free export | Watermark | Entry plan | Credit model | Cancellation tested |
| ---------- | --------------- | ----------- | --------- | ---------: | ------------ | ------------------- |

### Funnel-psychology comparison

Show the monetization mechanisms rather than only prices:

* Pay before generation
* Pay after preview
* Pay at export
* Watermark removal
* Premium-asset gating
* Resolution gating
* Annual-plan anchoring
* Credit uncertainty
* Retention discount during cancellation

A visual journey is stronger than a traditional pricing table:

```text
Signup → Prompt → Generate → Edit → Export → Paywall
```

Highlight where each product asks for money.

---

## Page 6 — Reviews and user complaints

Create a quantified review-mining page.

Filters:

* Competitor
* Source
* Rating
* Date
* Complaint category
* Verified during your own testing

Possible chart:

```text
Pricing/credits         31%
Generation quality      24%
Rendering failures      18%
Cancellation/refunds    12%
Limited editing          9%
Other                    6%
```

Clicking a theme should show:

* Selected quotations
* Source links
* Date
* Whether your testing confirmed the complaint
* Relevant evidence

The most powerful findings combine three layers:

```text
User complaint
      +
Your first-hand observation
      +
Strategic recommendation
```

---

## Page 7 — Steal / Avoid / Attack

This is the main strategic page.

Use three tabs:

### Steal

Specific competitor mechanisms Vivideo should adopt.

### Avoid

Product, pricing or communication mistakes Vivideo should not repeat.

### Attack

Weaknesses Vivideo can exploit through positioning or product improvements.

Each item should include:

| Field           | Meaning                         |
| --------------- | ------------------------------- |
| Finding         | What you observed               |
| Competitor      | Where you observed it           |
| Evidence        | Recording, screenshot or output |
| Proposed action | What Vivideo should do          |
| Expected impact | Why it matters                  |
| Effort          | Low, medium or high             |
| Priority        | Now, next or later              |
| Confidence      | High, medium or low             |

Add filters by:

* Product
* Pricing
* Onboarding
* Output quality
* Editing
* Distribution
* Reliability

---

## Page 8 — Threats

Identify the two or three biggest threats for the next 12 months.

For each threat:

* Company or category
* What you personally observed
* Why it threatens Vivideo
* Expected development
* Indicators to monitor
* Recommended response
* Confidence level

Avoid simply identifying the largest companies. Focus on the competitors whose mechanisms, distribution or economics could threaten Vivideo.

---

## Page 9 — Price changes and freshness

Your proposed price-change tab fits here.

Include:

* Last successful check
* Current observed pricing
* Previous observed pricing
* Added or removed plans
* Credit changes
* Feature-limit changes
* Price difference
* Source page
* Watcher status
* Full text diff
* Historical timeline

Example:

```text
Competitor: Example AI
Checked: August 4, 2026

Previous:
Starter — $20/month — 100 credits

Current:
Starter — $24/month — 100 credits

Detected change:
Price increased by $4/month.
Credit allowance unchanged.
Effective unit price increased by 20%.
```

Also include a “Run manually” link pointing to the GitHub Actions workflow page, when practical.

---

## Page 10 — Methodology and spend

Include:

### Methodology

* Competitor-selection method
* Fixed benchmark prompts
* Editing-time limits
* Scoring definitions
* Test dates
* Known limitations
* What “not supported” means
* Which plans were tested

### Spend report

| Product | Plan | Amount | Reason | Purchase date | Cancelled |
| ------- | ---- | -----: | ------ | ------------- | --------- |

Do not expose:

* Card details
* Login details
* Private email addresses
* Receipts containing sensitive information
* API keys
* Session cookies

Receipts can remain in a private Drive folder and be linked only where appropriate.

---

# 3. Revised repository structure

```text
vivideo-competitor-analysis/
├── README.md
├── package.json
├── src/
│   ├── pages/
│   ├── components/
│   │   ├── CompetitorCard.tsx
│   │   ├── EvidenceCard.tsx
│   │   ├── BenchmarkComparison.tsx
│   │   ├── PricingTimeline.tsx
│   │   ├── RecommendationTable.tsx
│   │   └── ReviewThemeChart.tsx
│   └── utils/
├── public/
│   ├── thumbnails/
│   ├── screenshots/
│   └── data/
│       ├── competitors/
│       ├── landscape.json
│       ├── benchmark-results.json
│       ├── reviews.json
│       ├── recommendations.json
│       ├── pricing-history.json
│       └── spend-report.json
├── research/
│   ├── methodology.md
│   ├── prompts.md
│   ├── test-log.md
│   ├── review-coding-guide.md
│   └── evidence-index.csv
├── watcher/
│   ├── watcher.py
│   ├── extractor.py
│   ├── diff.py
│   ├── competitors.yaml
│   ├── requirements.txt
│   ├── snapshots/
│   └── tests/
├── exports/
│   ├── executive-summary.pdf
│   └── spend-report.xlsx
└── .github/
    └── workflows/
        ├── deploy-pages.yml
        └── competitor-watch.yml
```

Do not put large recordings directly in Git. GitHub recommends keeping repositories manageable, and GitHub Pages also has usage and bandwidth limits. Drive is the better location for large video evidence. ([GitHub Docs][3])

---

# 4. Evidence storage design

Use Google Drive for:

* Full screen recordings
* Original generated videos
* Receipts
* Large screenshots
* Source video used in clipping tests
* Benchmark assets

Recommended structure:

```text
Vivideo Case Study Evidence/
├── 00 Benchmark Assets/
├── 01 Vivideo/
├── 02 Revid/
├── 03 InVideo/
├── 04 Fliki/
├── 05 HeyGen/
├── 06 Runway/
├── 07 OpusClip/
└── 08 Receipts - Private/
```

Inside each competitor:

```text
Revid/
├── 01 Homepage and Pricing/
├── 02 Onboarding/
├── 03 Benchmark Outputs/
├── 04 Editing and Export/
├── 05 Paywalls/
├── 06 Cancellation/
└── 07 User Reviews/
```

## Evidence-ID format

Use predictable IDs:

```text
REVID-ONB-001
REVID-OUT-001
REVID-PAY-001
REVID-CAN-001
REVID-REV-001
```

Example website entry:

```json
{
  "id": "REVID-PAY-001",
  "type": "screen-recording",
  "title": "Export paywall encountered",
  "timestamp": "08:14",
  "driveUrl": "...",
  "observedAt": "2026-08-02",
  "notes": "Paywall appeared after generation and manual editing."
}
```

Generate thumbnails for recordings and place only those small thumbnail files in the repository.

---

# 5. Revised step-by-step work plan

## Phase 1 — Build the website skeleton

**Time limit: half a day**

Create:

* GitHub repository
* Static site
* Navigation
* Empty page templates
* JSON schemas
* Evidence-card component
* GitHub Pages deployment
* Google Drive folder structure

Do not polish animations, branding or advanced visualizations yet.

### Result

You should have a deployed but mostly empty website with pages for:

```text
Overview
Landscape
Benchmark
Competitors
Pricing
Reviews
Strategy
Threats
Freshness
Methodology
```

---

## Phase 2 — Freeze the research methodology

Before testing competitors, create:

* Five benchmark prompts
* Source images
* Avatar script
* Product-ad brief
* Source video for clipping
* Quality-scoring rubric
* Maximum manual-editing time
* Evidence naming rules
* Competitor-testing checklist

Publish the methodology page early.

### Result

Anyone reading the site should understand how the comparison will remain fair.

---

## Phase 3 — Map the landscape

Research approximately 15–25 products at a broad level.

For each:

* Category
* Target customer
* Main workflow
* Free plan
* Starting price
* Main differentiator
* Directness of competition
* Estimated strategic relevance
* Deep-dive decision

Then select your 5–7 deep dives.

### Result

Complete the landscape page and explain why each deep-dive competitor was selected.

---

## Phase 4 — Test Vivideo first

Run all applicable benchmark tests in Vivideo.

Capture:

* Homepage
* Signup
* First five minutes
* Generation
* Editing
* Export
* Paywalls
* Pricing
* Social publishing
* Cancellation, when applicable

This becomes the baseline against which all competitors are evaluated.

### Result

Publish the first full competitor-style page for Vivideo. This will also test whether your site structure works.

---

## Phase 5 — Test competitors one by one

Use the same process for every product:

1. Capture homepage and pricing.
2. Begin screen recording.
3. Create account.
4. Record the first five minutes.
5. Run applicable benchmark prompts.
6. Save the first output.
7. Make only permitted corrections.
8. Record generation time.
9. Record credits consumed.
10. Attempt export.
11. Encounter the paywall intentionally.
12. Purchase the cheapest necessary plan.
13. Test premium capability.
14. Attempt cancellation.
15. Record cancellation experience.
16. Upload evidence to Drive.
17. Enter observations into JSON or Markdown.
18. Publish the competitor page.
19. Write three immediate strategic findings.

Do not wait until all products are finished before entering the information. Complete one competitor page while the experience is still fresh.

### Suggested order

1. Revid
2. InVideo
3. Fliki
4. HeyGen
5. Runway
6. OpusClip
7. VEED only if time and budget permit

---

## Phase 6 — Complete benchmark comparisons

After testing all products:

* Normalize scores.
* Verify that effort was comparable.
* Show unsupported tests clearly.
* Create output thumbnails.
* Add side-by-side videos.
* Calculate cost per usable output where possible.
* Record corrections needed.
* Identify output-quality patterns.

### Result

Complete the benchmark page with both scores and original outputs.

Do not let the score replace the evidence. A score of 4.2 is less meaningful than a visible side-by-side output supported by a clear explanation.

---

## Phase 7 — Mine reviews and distribution

For every deep-dive competitor:

* Collect recent reviews.
* Classify complaint themes.
* Save source links.
* Select representative quotations.
* Compare complaints with your experience.
* Investigate template galleries.
* Investigate SEO landing pages.
* Investigate affiliates and referrals.
* Investigate free tools and distribution loops.

### Result

Complete the reviews and distribution sections.

Mark every theme as:

```text
Confirmed first-hand
Partially confirmed
Not encountered
Contradicted by testing
```

---

## Phase 8 — Write the strategic synthesis

Only after completing the evidence should you create:

* 10 things Vivideo must know
* Top 5 recommendations
* Steal list
* Avoid list
* Attack list
* Two or three 12-month threats

Every recommendation must link to at least one observation.

Prefer this structure:

```text
Observation
→ User consequence
→ Strategic implication
→ Recommended action
→ Evidence
```

Example:

```text
Observation:
The export limitation is disclosed only after the user finishes editing.

User consequence:
The user reaches the payment decision after investing significant time.

Strategic implication:
The funnel monetizes sunk cost but may also create distrust.

Vivideo action:
Test an export-stage upgrade prompt, but disclose resolution and
watermark limitations before generation.

Evidence:
COMP-PAY-002, timestamp 07:43.
```

---

## Phase 9 — Build the freshness watcher

Start the watcher after you understand how the pricing pages are structured.

The watcher should monitor:

* Pricing pages
* Credit allowances
* Free-plan limits
* Plan names
* Watermark rules
* Export resolution
* Changelog pages
* Important feature announcements

### Minimum acceptable version

```text
Input:
competitors.yaml

Process:
Fetch page
Extract relevant text
Normalize
Compare with previous snapshot
Save diff

Output:
pricing-history.json
Markdown report
GitHub Actions run
```

### Reliability fields

Show these on the website:

```text
Last attempted
Last successful
Status
Extraction method
Current snapshot
Previous snapshot
Manual verification required
```

Some pages may block automation or render inconsistently. Do not hide watcher failures. Display them and add a repeatable manual-check checklist.

---

## Phase 10 — Final communication layer

After the website is complete, create:

### Required

* One-page executive-summary PDF
* Spend report
* README
* START_HERE page

### Strong optional addition

A 20–30 minute recorded analyst briefing:

1. Market structure
2. Three strongest findings
3. Benchmark results
4. Pricing psychology
5. Recommendations
6. Threats
7. Freshness mechanism

The recording can use the website itself as the visual presentation. There is no need to build an entirely separate deck.

---

# 6. Final deliverables

## Primary deliverable

**Deployed website**

Example URL structure:

```text
username.github.io/vivideo-competitor-analysis/
```

## Repository

Contains:

* Website source
* Research data
* Pricing watcher
* GitHub Actions workflows
* README
* Methodology
* Example watcher output

## Evidence repository

Google Drive folder with view-only links.

## Required documents

```text
Vivideo_Executive_Summary.pdf
Vivideo_Spend_Report.xlsx
```

## Recommended backup

```text
Vivideo_Competitor_Analysis_Offline.pdf
```

This does not have to reproduce every interactive element. It should capture the homepage, competitor conclusions and strategic pages in case website access fails.

## Optional briefing

```text
Vivideo_Analyst_Briefing.mp4
```

---

# 7. Important privacy decision

Before deploying, decide whether the website can be openly accessible.

A GitHub Pages website should not contain:

* Competitor account credentials
* Company-card information
* Session tokens
* Private receipts
* Personal email addresses
* Private correspondence
* Confidential notes from Vivideo
* Recordings containing sensitive browser tabs

A safe structure would be:

```text
Public/deployed website:
Analysis, sanitized screenshots, findings, summaries

View-only evidence folder:
Full recordings and output videos

Private folder:
Receipts, payment confirmations, sensitive information
```

Also check each screen recording before uploading. Close unrelated tabs, hide bookmarks when necessary, and ensure passwords or payment information are not visible.

---

# 8. How much time to spend on coding

Because coding is easy for you, set a hard limit:

| Work                                  | Approximate share |
| ------------------------------------- | ----------------: |
| Using products and gathering evidence |               40% |
| Analysis and strategic synthesis      |               25% |
| Reviews and distribution research     |               15% |
| Website development                   |               10% |
| Freshness watcher                     |                5% |
| Final QA and briefing                 |                5% |

The initial website skeleton should take no more than half a day. Advanced styling should happen only after the evidence is complete.

# Final recommendation

Proceed with the website. Make it the **final deliverable**, not merely a temporary note-taking tool.

The strongest package is:

```text
Living research website
+ GitHub repository
+ working pricing watcher
+ Drive evidence folder
+ one-page executive summary
+ spend report
+ recorded website walkthrough
```

Skip the full PowerPoint unless the website is completed early. This approach directly demonstrates the qualities they emphasize: first-hand evidence, clarity, actionability, technical ability and staying power.

[1]: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages?utm_source=chatgpt.com "What is GitHub Pages? - GitHub Docs"
[2]: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows?ref=airplane&utm_source=chatgpt.com "Events that trigger workflows - GitHub Docs"
[3]: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits?utm_source=chatgpt.com "GitHub Pages limits - GitHub Docs"








ME: For the website:
- page 1: no need to have those much information like 35 benchmark generations, 14 paywalls encountered, 102 reviews classified
- page 2: we can remove
- page 3: this is nice
- page 4, 5, 6, 7, 8, 9: nice
- page 10: no need methodology but we can have spend report

the only thing I need to understand: do I need to take my notes into json files? do I need to create each json file or should I ask AI for templates? what I want is actually: I have a clear steps, plans and templates. based on those I go to websites and sign up, create videos, use prompts, take recordings and based on those take my notes into relevant criteria section. this makes my job easier





GPT: You do **not** need to manually write large JSON files after every test. That would make the research slower and increase formatting errors.

The easiest system is:

* **Markdown/MDX** for detailed competitor notes.
* **CSV** for repeated, table-like information.
* **YAML front matter** for basic competitor metadata.
* **JSON only for automatically generated data**, such as the pricing watcher output.

You create the templates once—AI can generate the initial structure—then duplicate and fill them while testing each competitor.

One important point: removing the separate landscape page is fine, but the assignment still explicitly requires a landscape map. Put a compact market map on the homepage or in an expandable section rather than giving it its own page. 

# Revised website structure

## 1. Overview

Keep it focused:

* 10 things Vivideo must know
* Top 5 recommendations
* Top 2–3 threats
* Compact competitor landscape
* Links to key evidence
* Last updated date

No need for artificial statistics such as number of screenshots or reviews.

## 2. Benchmark comparison

* Same prompts across competitors
* Side-by-side outputs
* Generation time
* Cost or credits
* Editing time
* Output score
* Evidence links

## 3. Competitor deep dives

One page per competitor.

## 4. Pricing and funnel comparison

* Plans
* Credits
* Paywall locations
* Cancellation experience
* Pricing psychology

## 5. Review analysis

* Complaint themes
* Quotes and links
* Whether you confirmed the issue yourself

## 6. Steal / Avoid / Attack

Prioritized recommendations for Vivideo.

## 7. Threats

The two or three largest strategic threats over the next 12 months.

## 8. Price changes

* Current observed pricing
* Historical changes
* Watcher status
* Latest detected differences

## 9. Spend report

* Product
* Plan
* Amount
* Reason
* Cancellation status

Your methodology can live inside:

* The benchmark page
* The GitHub README
* A short expandable “How testing was conducted” section

It does not need a separate page.

# Recommended content system

Use this structure:

```text
vivideo-analysis/
├── content/
│   ├── competitors/
│   │   ├── vivideo.mdx
│   │   ├── revid.mdx
│   │   ├── invideo.mdx
│   │   ├── fliki.mdx
│   │   ├── heygen.mdx
│   │   ├── runway.mdx
│   │   └── opusclip.mdx
│   ├── overview.mdx
│   └── threats.mdx
├── data/
│   ├── competitors.csv
│   ├── benchmarks.csv
│   ├── evidence.csv
│   ├── pricing.csv
│   ├── reviews.csv
│   ├── recommendations.csv
│   ├── spend.csv
│   └── pricing-history.json
├── templates/
│   ├── competitor-template.mdx
│   ├── competitor-test-checklist.md
│   └── review-template.csv
├── watcher/
│   ├── watcher.py
│   ├── competitors.yaml
│   └── snapshots/
└── src/
```

You should not treat every piece of information the same way.

| Information                      | Best format |
| -------------------------------- | ----------- |
| Detailed competitor observations | MDX         |
| Benchmark measurements           | CSV         |
| Review quotations and themes     | CSV         |
| Pricing plans and paywalls       | CSV         |
| Evidence links                   | CSV         |
| Recommendations                  | CSV         |
| Spend report                     | CSV         |
| Price watcher output             | JSON        |
| Raw personal notes               | Markdown    |

# Your exact workflow

## Step 1 — Create the templates before visiting competitors

Create these files first:

```text
templates/
├── competitor-template.mdx
├── competitor-test-checklist.md
├── benchmark-prompts.md
└── scoring-rubric.md
```

Then create empty CSV files with their column headers.

You can ask AI to generate these templates. You only need to generate them once.

## Step 2 — Define your benchmark tests

Before creating accounts, finalize:

* Five fixed prompts
* Shared source images
* Shared source video
* Avatar script
* Maximum editing time
* Scoring criteria
* Evidence naming convention

Do not change the prompts halfway through unless a platform cannot support the original task.

## Step 3 — Create a Drive folder for each competitor

Example:

```text
Revid/
├── 01-homepage-pricing/
├── 02-onboarding/
├── 03-generations/
├── 04-editing-export/
├── 05-paywalls/
├── 06-cancellation/
└── 07-reviews/
```

## Step 4 — Duplicate the competitor template

Before testing Revid:

```text
competitor-template.mdx
→ revid.mdx
```

Before testing InVideo:

```text
competitor-template.mdx
→ invideo.mdx
```

Do this for every deep-dive competitor.

## Step 5 — Follow the testing checklist

While screen-recording:

1. Open the homepage.
2. Inspect pricing before signup.
3. Start the recording.
4. Create an account.
5. Record the first five minutes.
6. Run the fixed prompts.
7. Save the first outputs.
8. Record generation time.
9. Record credit consumption.
10. Attempt editing.
11. Attempt export.
12. Reach the paywall.
13. Purchase the cheapest required plan.
14. Test the unlocked feature.
15. Test cancellation.
16. Upload evidence to Drive.
17. Paste Drive links into the evidence sheet.
18. Complete your competitor notes.

## Step 6 — Fill the template immediately

Do not wait until the end of the week. After testing one product, complete its notes before moving to the next product.

## Step 7 — Enter structured results into CSV files

For example:

* Generation results → `benchmarks.csv`
* Paywall details → `pricing.csv`
* Recordings and screenshots → `evidence.csv`
* Reviews → `reviews.csv`
* Purchase → `spend.csv`

## Step 8 — Let the website render the files

Your React or Next.js components read the content files and produce:

* Competitor pages
* Comparison tables
* Review charts
* Evidence cards
* Pricing timelines
* Recommendations

This means you do not separately code each competitor page.

# Competitor note template

Create a file such as:

```md
---
id: revid
name: Revid
category: short-form-video
website: https://...
tested_date: 2026-08-01
plan_tested: Free + Starter
status: complete
overall_verdict: ""
---

# Executive verdict

Write a concise explanation of what this product does particularly well,
where it fails, and why it matters to Vivideo.

# Three things Vivideo must know

## Finding 1

Observation:

Why it matters:

Evidence ID:

## Finding 2

Observation:

Why it matters:

Evidence ID:

## Finding 3

Observation:

Why it matters:

Evidence ID:

# Homepage and positioning

Primary message:

Target customer:

Main CTA:

Social proof:

Pricing visibility:

Notable acquisition mechanism:

# Signup and first five minutes

Signup options:

Credit card required:

Onboarding questions:

First screen:

Time to first project:

Time to first generation:

Confusing moments:

Strong moments:

Recording evidence:

# Benchmark tests

## Educational short

Supported: Yes / No

Generation time:

Credits used:

Editing time:

First result quality:

Main strength:

Main failure:

Output evidence:

## Product advertisement

Supported:

Generation time:

Credits used:

Editing time:

Main strength:

Main failure:

Output evidence:

## Image-to-video

Supported:

Generation time:

Credits used:

Main strength:

Main failure:

Output evidence:

## Avatar video

Supported:

Generation time:

Credits used:

Main strength:

Main failure:

Output evidence:

## Long-video clipping

Supported:

Generation time:

Main strength:

Main failure:

Output evidence:

# Editing and control

What can be edited:

What cannot be edited:

Regeneration options:

Brand controls:

Caption controls:

Manual work required:

# Pricing and paywall

Free-plan capabilities:

Free generations:

Free exports:

Watermark:

First upgrade prompt:

Hard paywall location:

What consumes credits:

Do failed generations consume credits:

Monthly plan:

Annual-plan presentation:

What the paid plan unlocked:

Pricing psychology observed:

Evidence:

# Cancellation

Number of steps:

Retention offer:

Immediate or end-of-period cancellation:

Unused credits:

Difficulties:

Evidence:

# Strengths worth stealing

## Mechanism 1

Mechanism:

Why it works:

How Vivideo could use it:

Evidence:

## Mechanism 2

Mechanism:

Why it works:

How Vivideo could use it:

Evidence:

# Weaknesses worth attacking

## Weakness 1

Observed problem:

User consequence:

Related review evidence:

How Vivideo could attack it:

## Weakness 2

Observed problem:

User consequence:

Related review evidence:

How Vivideo could attack it:

# Things Vivideo should avoid

Decision or mechanism:

Why it is harmful:

Evidence:

# Distribution

Template gallery:

SEO landing pages:

Affiliate programme:

Referral mechanism:

Free tools:

Social publishing:

Community or public gallery:

Other distribution observations:

# Final recommendation

Threat level: Low / Medium / High

Best feature to copy:

Biggest weakness to attack:

Biggest lesson for Vivideo:
```

This is your main research document for every competitor.

# Competitor testing checklist

Keep this open while using each product:

```md
# Competitor test checklist

## Before signup

- [ ] Record homepage
- [ ] Screenshot pricing page
- [ ] Record headline and main CTA
- [ ] Record whether annual pricing is emphasized
- [ ] Record free-plan claims
- [ ] Record templates, testimonials and social proof

## Signup and onboarding

- [ ] Start screen recording
- [ ] Record signup options
- [ ] Record whether payment details are required
- [ ] Record onboarding questions
- [ ] Record first screen
- [ ] Record time until first project
- [ ] Record time until first generation
- [ ] Note confusing moments
- [ ] Note useful onboarding mechanisms

## Generation

- [ ] Run educational-short prompt
- [ ] Run product-advertisement prompt
- [ ] Run image-to-video prompt
- [ ] Run avatar prompt
- [ ] Run clipping test
- [ ] Save first outputs
- [ ] Record generation times
- [ ] Record credits consumed
- [ ] Record failures
- [ ] Record manual editing time

## Editing and export

- [ ] Test captions
- [ ] Test scene replacement
- [ ] Test script editing
- [ ] Test voice editing
- [ ] Test branding
- [ ] Test export
- [ ] Record resolution
- [ ] Record watermark
- [ ] Record export formats
- [ ] Record social publishing options

## Paywall

- [ ] Identify first upgrade prompt
- [ ] Identify hard paywall
- [ ] Record whether paywall appears before or after generation
- [ ] Record what is locked
- [ ] Record plan recommendation
- [ ] Record annual-price anchoring
- [ ] Record credit explanation
- [ ] Purchase cheapest required plan
- [ ] Record what changed after payment

## Cancellation

- [ ] Locate subscription settings
- [ ] Record cancellation process
- [ ] Count cancellation steps
- [ ] Record retention offers
- [ ] Save cancellation confirmation
- [ ] Update spend report

## After testing

- [ ] Upload recordings to Drive
- [ ] Upload outputs to Drive
- [ ] Add evidence IDs
- [ ] Complete competitor template
- [ ] Write three main findings
- [ ] Write two steal ideas
- [ ] Write two attack ideas
- [ ] Write one avoid idea
```

# Benchmark CSV

You should not write the benchmark results in JSON manually. Use CSV:

```csv
competitor,test_id,supported,generation_time_seconds,credits_used,editing_time_minutes,output_score,prompt_adherence,visual_quality,caption_quality,watermark,resolution,first_output_url,final_output_url,notes
Vivideo,educational-short,true,85,10,4,4,4,4,5,false,1080x1920,DRIVE_URL,DRIVE_URL,
Revid,educational-short,true,62,5,7,3,4,3,4,true,720x1280,DRIVE_URL,DRIVE_URL,
```

Your website can filter this by:

* Competitor
* Prompt
* Score
* Supported capability

# Evidence CSV

```csv
evidence_id,competitor,type,title,drive_url,timestamp,observed_date,description
REVID-ONB-001,Revid,recording,Signup and onboarding,DRIVE_URL,00:00-05:00,2026-08-01,Complete first-five-minute journey
REVID-PAY-001,Revid,screenshot,Export paywall,DRIVE_URL,,2026-08-01,Paywall shown after editing
REVID-OUT-001,Revid,video,Educational short output,DRIVE_URL,,2026-08-01,First generated result
```

Every important claim in your site should reference one of these IDs.

# Pricing CSV

```csv
competitor,observed_date,plan_name,billing_period,price,currency,credits,free_generation,free_export,watermark,max_resolution,paywall_stage,cancellation_tested,notes
Revid,2026-08-01,Starter,monthly,29,USD,100,true,false,true,1080p,export,true,
```

The watcher can later generate `pricing-history.json` automatically.

# Review CSV

```csv
review_id,competitor,source,date,rating,theme,quote,source_url,confirmed_first_hand,evidence_id,notes
REV-001,Revid,Reddit,2026-07-15,,credit confusion,"Short verified quote",SOURCE_URL,true,REVID-PAY-001,
```

Use short quotations. Do not copy entire reviews.

# Recommendations CSV

```csv
recommendation_id,type,title,competitor,observation,user_consequence,recommended_action,impact,effort,priority,confidence,evidence_ids
REC-001,steal,Show immediate personalized starting point,Competitor name,Observed mechanism,User impact,Proposed Vivideo implementation,high,medium,now,high,"ID-001;ID-002"
REC-002,attack,Transparent failed-generation credits,Competitor name,Observed weakness,User impact,Proposed positioning or feature,high,low,now,high,"ID-003;REV-004"
```

The `type` value should be:

* `steal`
* `avoid`
* `attack`

# Spend CSV

```csv
date,competitor,plan,amount,currency,reason,purchase_type,cancelled,cancellation_date,receipt_private_url,notes
2026-08-01,Revid,Starter,29,USD,Needed to test watermark-free export,monthly,true,2026-08-01,PRIVATE_DRIVE_URL,
```

# Raw notes versus published notes

Maintain two levels.

## Raw testing notes

These can be messy:

```text
raw-notes/
├── revid-session-1.md
├── invideo-session-1.md
└── fliki-session-1.md
```

Write quickly during testing:

```md
10:04 — Started signup
10:06 — Asks whether I am a creator or business
10:08 — Prompt entered
10:10 — Preview ready
10:13 — Tried export; hard paywall
Interesting: did not mention export restriction earlier
Possible attack: transparent limits before generation
Evidence: recording around 09:20
```

## Published competitor content

After the session, transfer the useful information into:

```text
content/competitors/revid.mdx
```

The website should read the polished file, not your messy raw notes.

# How AI should help you

AI is useful for creating and maintaining the structure.

## Good uses of AI

* Generate the initial templates.
* Convert your raw timestamped notes into the MDX structure.
* Convert notes into CSV rows.
* Classify reviews.
* Identify repeated complaint themes.
* Improve recommendation wording.
* Check whether claims have evidence IDs.
* Generate page components from your schemas.
* Check for missing fields.

## Bad uses of AI

* Inventing what happened in a product.
* Filling unanswered fields using assumptions.
* Rating outputs it has not seen.
* Creating fake review conclusions.
* Turning a weak observation into an exaggerated strategic claim.

A useful prompt after every test would be:

```text
I tested Revid and pasted my raw timestamped notes below.

Convert them into the competitor MDX template I provide.

Rules:
1. Do not invent or infer observations that are not in my notes.
2. Keep uncertain fields marked as "Not tested" or "Unknown."
3. Preserve evidence IDs and recording timestamps.
4. Separate direct observations from external review claims.
5. Extract possible steal, avoid and attack findings, but mark them
as draft recommendations.
6. Also produce proposed rows for benchmarks.csv, pricing.csv,
evidence.csv and spend.csv.
```

Then manually review the result before committing it.

# The simplest possible work routine

For every competitor, repeat this exact sequence:

```text
1. Copy competitor template
2. Open testing checklist
3. Start screen recording
4. Sign up
5. Complete five-minute onboarding test
6. Run benchmark prompts
7. Save outputs
8. Hit the paywall
9. Test paid plan if necessary
10. Test cancellation
11. Upload recordings to Drive
12. Write raw timestamped notes
13. Ask AI to structure the notes
14. Verify AI output
15. Add CSV rows
16. Commit to GitHub
17. Check deployed competitor page
```

This gives you the clear system you are looking for: you do not decide what to investigate while testing. You follow the checklist, fill the same template, and the website automatically puts the information in the correct sections.


ME: okay, now I want you to search the web go the websites of the competitors. give me 6 competitor that I should choose for my case study

GPT: After reviewing the competitors’ current websites and comparing them with Vivideo’s positioning, I recommend these **six deep-dive competitors**:

1. **Revid.ai**
2. **InVideo AI**
3. **Fliki**
4. **HeyGen**
5. **VEED**
6. **OpusClip**

This gives you strong coverage of the four categories required in the case: short-form/social-video creation, avatar platforms, prompt-to-video products, and clipping tools. It also focuses on products whose complete workflows can realistically be compared with Vivideo—not only their underlying video-generation models. 

## 1. Revid.ai — closest direct competitor

**Category:** Short-form and social AI video

Revid should definitely be included because its core promise is extremely close to Vivideo’s: enter an idea or script, automatically generate visuals, voiceover, captions and music, and produce content for TikTok, Instagram Reels and YouTube Shorts. It also offers social publishing and scheduling capabilities through its product/API infrastructure. ([revid.ai][1])

### What you should investigate

* How quickly it creates a complete short-form video.
* Whether its hooks and scripts feel genuinely social-native.
* How much control users have over individual scenes.
* Credit consumption during generation and regeneration.
* Whether failed generations consume credits.
* When the export paywall appears.
* Social scheduling and publishing.
* Template and SEO-gallery strategy.

### Why it matters to Vivideo

This is likely your **most directly comparable competitor**. It should receive one of your deepest analyses.

---

## 2. InVideo AI — broadest end-to-end competitor

**Category:** Prompt-to-finished-video platform

InVideo now positions itself as a comprehensive AI creation platform rather than only a template editor. It can generate scripts, visuals, subtitles, music, voiceovers and transitions from prompts. Its current platform also provides access to many external image, video, audio and music models, alongside workflows for advertisements, explainers, product videos and short-form content. ([Invideo][2])

### What you should investigate

* Idea-to-complete-video workflow.
* Agent or conversational editing.
* Stock footage versus generated footage.
* Product-ad and UGC workflows.
* Credit predictability across different models.
* How it presents access to many AI models.
* Upgrade prompts and credit top-ups.
* Whether the large number of choices helps or overwhelms users.
* Output editing after the initial generation.

### Why it matters to Vivideo

InVideo competes with Vivideo on the idea of providing **one place for the complete video-production process**, including multiple models and complete workflows. Vivideo itself emphasizes one studio containing numerous models, avatars, voices and publishing tools, so this comparison should be strategically valuable. ([Vivideo][3])

---

## 3. Fliki — faceless and repeatable social content

**Category:** Faceless short-form, text-to-video and voice generation

Fliki explicitly markets the ability to create faceless TikToks and Reels from ideas, scripts and blog posts. It generates scripts, visuals, AI voices, music and captions, and its website advertises direct publishing to TikTok, Instagram and YouTube. It also has a particularly strong voice and multilingual positioning, with more than 2,000 voices across over 80 languages. ([Fliki][4])

### What you should investigate

* Faceless short-form generation.
* Script and blog-to-video conversion.
* Voice quality and voice selection.
* How quickly a user can create recurring content.
* Stock-footage repetition.
* Caption and scene quality.
* Direct social publishing.
* Watermark and export restrictions.
* How its minute- or credit-based usage feels to users.

### Why it matters to Vivideo

Fliki competes for users who do not necessarily want cinematic clips. These users want to publish frequent, narrated social videos with minimal work. That is an important segment for Vivideo’s automation and recurring social-content positioning. ([Vivideo][5])

---

## 4. HeyGen — avatar and AI-presenter benchmark

**Category:** AI avatars, UGC and presenter videos

HeyGen is the strongest choice for the avatar category. Its platform focuses on stock and custom digital avatars, voice cloning, multilingual generation, gestures, expressions and marketing or social-media applications. Its free plan currently allows limited short videos, which should make initial onboarding and paywall testing practical before purchasing a plan. ([HeyGen][6])

### What you should investigate

* Avatar realism.
* Lip synchronization.
* Gestures and facial movement.
* Stock avatar versus custom avatar experience.
* UGC advertisement creation.
* Voice cloning.
* Video Agent workflow.
* Free-plan limitations.
* Watermark and resolution gating.
* Pricing difference between ordinary and premium generation.
* Cancellation and credit behavior.

### Why it matters to Vivideo

Vivideo includes avatars and voices as part of a broader studio. HeyGen can show you what a specialized avatar product does better—and where specialization creates additional complexity or cost. ([Vivideo][3])

### Why not Synthesia instead?

Synthesia is important, but its official positioning is primarily business training, internal communication and enterprise video. HeyGen is more directly relevant to creator, marketing, UGC and social-media workflows. ([Synthesia][7])

Keep Synthesia in your broad landscape map, but do not make it one of the six main deep dives unless Vivideo tells you that enterprise training is strategically important.

---

## 5. VEED — all-in-one creation and editing threat

**Category:** AI generation, editing and repurposing

VEED is a particularly important inclusion because it combines several competitor categories in one product. Users can generate videos from prompts or images, use external models such as Veo, Kling and Sora, create avatar or talking-head content, edit scenes, add captions and branding, and repurpose content into social clips. ([VEED][8])

### What you should investigate

* AI generation followed by manual editing.
* How smoothly users move from generation into the full editor.
* Model-selection experience.
* Image-to-video.
* Product-video generation.
* Caption and brand-kit features.
* Long-video repurposing.
* Free-plan export restrictions.
* AI-credit add-ons.
* Whether the editor provides meaningful control or adds complexity.

### Why it matters to Vivideo

VEED represents the threat of an established editing platform adding enough AI automation that users no longer need a separate AI-video application. It lets you compare:

> **AI-first automatic creation** versus **editor-first creation enhanced by AI**.

That is an important strategic comparison for Vivideo.

---

## 6. OpusClip — clipping and repurposing benchmark

**Category:** Long-video-to-short-form clipping

OpusClip should be included because clipping tools are explicitly required in the case. Its core workflow converts long videos into multiple vertical clips, automatically detects highlights, adds captions, reframes speakers and supports publishing to social platforms. Its current plans also include social-account connections, creating an overlap with Vivideo’s publishing and automation ambitions. ([Opus][9])

### What you should investigate

* Moment and highlight selection.
* Quality of the first chosen clips.
* “Virality” or performance scores.
* Speaker detection and reframing.
* Caption accuracy.
* Hook selection.
* Number of useful clips from one source video.
* Manual corrections required.
* Credits or minutes consumed.
* Direct publishing workflow.
* Brand-template limitations.
* Export and cancellation paywalls.

### Why it matters to Vivideo

Vivideo also positions itself as capable of turning podcasts, episodes, streams and long-form content into social clips. OpusClip is therefore the clearest specialist benchmark for this part of Vivideo’s product. ([Vivideo][10])

# Final selection matrix

| Competitor | Main role in your case                            | Comparison priority |
| ---------- | ------------------------------------------------- | ------------------: |
| Revid.ai   | Closest direct short-form competitor              |           Very high |
| InVideo AI | Complete prompt-to-video and multi-model workflow |           Very high |
| Fliki      | Faceless, narrated social-content production      |                High |
| HeyGen     | Avatar and UGC-video specialist                   |                High |
| VEED       | AI generation combined with a mature editor       |                High |
| OpusClip   | Long-form-to-short-form specialist                |                High |

This is a balanced group because you are not comparing six nearly identical prompt generators.

# Competitors to map but not deeply test

## Runway

Runway is strategically important as a model and creative-generation company. It offers proprietary video models, image-to-video, video editing and advanced generative controls. However, it is less directly focused on automatically producing and publishing complete social videos than your chosen six. ([Runway][11])

Include Runway in:

* Your compact landscape.
* Your model-level analysis.
* Your 12-month threat discussion.
* Possibly one benchmark-generation test.

Do not spend the same amount of time testing its onboarding, publishing and clipping workflow because the comparison will become less symmetrical.

## Pika

Pika is valuable for creative effects, image-to-video and short generative clips, but it is closer to a specialized generation playground than a complete social-video production and distribution workflow. ([Pika][12])

Keep it in the landscape and possibly compare one image-to-video result.

## Synthesia

Keep it as the enterprise-avatar reference, but HeyGen is more suitable for your main creator/social benchmark. ([Synthesia][7])

## Captions

Captions is your strongest **reserve competitor**. It combines AI-generated footage, AI actors, digital twins, automated editing and credit-based plans. Replace Fliki or VEED with Captions if one of those products becomes inaccessible, too expensive to test, or substantially less relevant after signup. ([Captions][13])

# Recommended testing order

Test them in this order:

1. **Vivideo baseline**
2. **Revid**
3. **InVideo**
4. **Fliki**
5. **HeyGen**
6. **VEED**
7. **OpusClip**

This order starts with the closest competitors, which will help you refine your note-taking template before reaching the more specialized avatar, editor and clipping products.

The final six I would state in your case-study methodology are:

> **Revid.ai, InVideo AI and Fliki as direct AI social-video competitors; HeyGen as the avatar specialist; VEED as the all-in-one AI creation and editing platform; and OpusClip as the long-form repurposing specialist.**

[1]: https://www.revid.ai/category/pricing?utm_source=chatgpt.com "Create Pricing Videos with AI"
[2]: https://invideo.io/make/ai-video-generator/?utm_source=chatgpt.com "Free AI Video Generator"
[3]: https://vivideo.ai/features?utm_source=chatgpt.com "AI Video Features — Avatars, Voices, Brand Kit & More"
[4]: https://fliki.ai/?utm_source=chatgpt.com "Fliki - AI Video Generator | Text to Video with AI Voices"
[5]: https://vivideo.ai/features/ai-video-automation?utm_source=chatgpt.com "AI Video Automation — Generate & Publish on Autopilot"
[6]: https://www.heygen.com/?utm_source=chatgpt.com "Free AI Video Generator: Create Stunning Videos with AI"
[7]: https://www.synthesia.io/?utm_source=chatgpt.com "Synthesia: #1 AI Video Platform for Business"
[8]: https://www.veed.io/tools/ai-video?utm_source=chatgpt.com "AI Video Generator - Create & Edit AI ..."
[9]: https://www.opus.pro/?utm_source=chatgpt.com "OpusClip: #1 AI video clipping and editing tool"
[10]: https://vivideo.ai/solutions/ai-podcast-clips?utm_source=chatgpt.com "AI Podcast Clip Maker — Turn Episodes into Shorts"
[11]: https://runwayml.com/research/introducing-runway-gen-4?utm_source=chatgpt.com "Runway Gen-4: AI Video Generation with World Consistency"
[12]: https://pika.art/pricing?utm_source=chatgpt.com "Subscription Pricing - Pika"
[13]: https://captions.ai/pricing?utm_source=chatgpt.com "Captions AI Pricing and Subscription Plans"