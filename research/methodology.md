# Research methodology

Status: draft to freeze before testing  
Prompt set: v4  
Scoring rubric: v2  
Manual-edit cap: 10 minutes per benchmark where editing is available

## Objective

Build a first-hand, evidence-backed comparison that lets Vivideo understand each meaningful competitor's product quality, onboarding, pricing psychology, funnel mechanics, cancellation experience, user complaints, distribution, and strategic implications.

The final synthesis must answer:

- What should Vivideo steal?
- What should Vivideo avoid?
- What weakness can Vivideo attack?
- What are the two or three largest threats over the next 12 months?

## Tested-build scope

The research scope is based on the Vivideo build accessed on 2026-07-25, not on assumed or marketed capabilities.

Observed in the tested build:

- One-prompt Video Agent
- Manual text-to-video
- Manual image-to-video
- First/last-frame generation
- Multiple-image generation
- Model selection
- Avatar, voice, and brand options

Not available in the tested workflow:

- Uploading an existing video for general editing
- Long-video-to-short-form clipping
- A clearly accessible post-generation timeline editor

The absence of a feature is a capability-gap observation, not automatically a low output-quality score.

## Deep-dive products and order

1. Vivideo - baseline
2. Pollo AI - multi-model manual generation comparison
3. InVideo AI - mature end-to-end Video Agent comparison
4. Revid.ai - direct short-form and social-video comparison
5. HeyGen - avatar and AI-presenter specialist
6. Runway - advanced generation, model control, and creative-workflow comparison

## Standard session protocol

For each product:

1. Record the homepage, positioning, pricing, annual anchoring, free-plan claims, templates, and social proof before signup.
2. Start a screen recording before account creation.
3. Complete onboarding without skipping questions unless the same choice is unavailable.
4. After the session, add only the most important first-five-minute moments to `data/funnel-observations.csv`, using recording timestamps.
5. Run all five applicable benchmark tasks in the published order.
6. If a task is unsupported, set `supported=false` and explain why in `notes`; do not quietly substitute a different task.
7. Save the untouched first output before editing.
8. Record generation time, credit movement, failures, watermark, resolution, and export restrictions.
9. Apply no more than 10 minutes of manual editing where the product provides it. Log each edit.
10. Attempt export and deliberately document the first upgrade prompt and the hard paywall.
11. Purchase only the cheapest monthly or weekly plan needed to complete the test.
12. Test cancellation and save the confirmation.
13. Upload evidence, register only presentation-worthy artifacts and claims in `data/evidence.csv`, and finish the competitor profile before moving on.

## Comparability rules

- Use the same prompt version and source-asset version everywhere.
- Use the same target format (9:16) and language (English) where supported.
- Time from the final submit action until a playable result is available.
- Keep waiting time and hands-on editing time separate.
- A product-generated rewrite is part of the product result; do not manually improve the prompt for one competitor only.
- Allow one retry only for a clear technical failure. Keep the failed attempt in the dataset.
- If a product forces a different workflow, record the deviation in the benchmark row.
- Compare output quality only inside the appropriate comparison group: agent, manual generation, or avatar.
- Record post-generation editing separately in `data/capability-matrix.csv`; do not fold missing editing into every output-quality score.
- Score first outputs before seeing or editing the other products' outputs when practical.
- Never convert an unsupported task into a zero score.

## What counts as evidence

First-hand evidence:

- Screen recordings
- Screenshots
- Generated outputs
- Pricing and plan snapshots
- Credit balances before and after
- Cancellation confirmations

External evidence:

- Linked Reddit, G2, app-store, or other user reviews
- Official feature, pricing, template, affiliate, or changelog pages

External review claims must be marked as confirmed, partially confirmed, not encountered, contradicted, or not tested.

## Completion definition for one competitor

A deep dive is complete only when:

- Homepage and pricing were captured.
- The first five minutes were recorded.
- Every applicable benchmark is complete or explicitly marked unsupported.
- First and final outputs are saved where applicable.
- Editing, export, and paywall behavior were tested.
- The cheapest necessary paid plan was tested if required.
- Cancellation was tested or a reason is recorded.
- Review and distribution research is complete.
- All major claims have evidence IDs.
- The competitor profile has three clear implications for Vivideo.
