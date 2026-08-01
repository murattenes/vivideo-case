# Vivideo competitor research kit

This workspace is currently for research collection and analysis only. Website implementation comes later.

For the complete current status, findings, website brief, remaining work, and file-cleanup guidance, start with `PROJECT-HANDOFF.md`.

For the finalized, presentation-ready strategy, use `recommendations.md`.

## Deep-dive set

Test in this order:

1. Vivideo (baseline)
2. Pollo AI
3. InVideo AI
4. Revid.ai
5. HeyGen
6. Runway

VEED, OpusClip, Zebracat, Pika, Synthesia, and Captions remain in the broad landscape but are not primary deep dives.

This selection follows the capabilities visible in the tested Vivideo build: a one-prompt Video Agent, manual text-to-video and image-to-video generation, first/last-frame and multi-image modes, model selection, avatars, voices, and branding. Long-video upload and clipping were not available in the tested workflow.

## Start here

1. Read `research/methodology.md`.
2. Review and freeze `research/benchmark-prompts.md` and `research/scoring-rubric.md` before the first account is created.
3. Create the shared benchmark assets listed in `research/assets/README.md`.
4. Open `research/templates/competitor-test-checklist.md` during every test.
5. Screen-record the full session and copy `research/templates/raw-session-template.md` for a small timestamp index.
6. After each session, copy `research/templates/competitor-profile-template.md` and complete it while the experience is fresh.
7. Add structured rows to the relevant file in `data/`.
8. Update `data/research-status.csv`.

## Where information belongs

| Information | File |
| --- | --- |
| Deep narrative and conclusions | `research/notes/competitors/<competitor>.md` |
| Messy timestamped session notes | `research/notes/raw/<competitor>-session-01.md` |
| Fixed test inputs | `research/benchmark-prompts.md` |
| Comparable generation results | `data/benchmarks.csv` |
| Capability availability and gaps | `data/capability-matrix.csv` |
| Onboarding, upgrade, and cancellation events | `data/funnel-observations.csv` |
| Plans, credits, and paywalls | `data/pricing.csv` |
| Recordings, screenshots, and outputs | `data/evidence.csv` |
| External reviews and complaint coding | `data/reviews.csv` |
| SEO, affiliate, gallery, and publishing loops | `data/distribution.csv` |
| Steal, avoid, and attack proposals | `data/recommendations.csv` |
| Purchases and cancellations | `data/spend.csv` |

## Non-negotiable rules

- Record an observation only if it was directly seen or has a linked external source.
- Treat screen recordings as the detailed source of truth; use CSVs only for concise facts you will compare or cite.
- Keep direct observations separate from review claims and interpretation.
- Every important claim must reference at least one evidence ID.
- Use `unknown`, `not_tested`, or `not_applicable`; never guess.
- Preserve the first output before making edits.
- Score first-output quality separately from post-generation editing capability.
- Do not penalize Vivideo's output-quality score merely because a separate editor is unavailable; record that gap in the capability matrix.
- Log failed generations and whether they consumed credits.
- Keep credentials, payment details, receipts, and sensitive recordings out of the public repository.
- Do not change prompts, source assets, scoring anchors, or the edit-time cap after testing begins. If a change is unavoidable, increment the version and explain it.
