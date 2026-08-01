# Vivideo competitor analysis — project handoff

Last updated: 2026-08-01  
Workspace: `/Users/murat/Desktop/vivi`  
Current phase: research collection and strategic recommendations are complete; website implementation, freshness checker, spend report integration, and final presentation QA remain.

This is the primary context document for a new Codex/Claude conversation and for the developer who will build the final presentation website.

## 1. Assignment and intended deliverables

The source assignment is `case-3-competitor-analysis.pdf`. The project compares Vivideo with meaningful AI-video competitors using first-hand testing, generated outputs, user reviews, pricing/cancellation evidence, and distribution mechanisms.

Planned deliverables:

1. A deployed presentation-style competitor-analysis website.
2. A repository containing the website and a working freshness mechanism.
3. Private evidence storage for full screen recordings, original generated videos, and receipts.
4. A concise executive summary, either as a website page or one-page PDF.
5. A spend report explaining what was purchased and why.
6. Optionally, a recorded walkthrough using the website as the presentation.

The website is the presentation. A separate large PowerPoint deck is not required unless requested later.

## 2. Final competitor scope

### Deep dives

1. Vivideo — baseline.
2. Pollo AI — multi-model manual-generation platform.
3. InVideo AI — mature end-to-end video-agent comparison.
4. Revid.ai — direct short-form/social-video competitor.
5. HeyGen — avatar and AI-presenter specialist.
6. Runway — advanced generation, model control, and creative-workflow comparison.

### Landscape-only context

- VEED — editor-first AI-video platform.
- OpusClip — long-video clipping specialist.
- Zebracat — social-video automation alternative.
- Pika — creative effects and short generated clips.
- Synthesia — enterprise avatar/training video.
- Captions — social-native avatar and automatic editing.

## 3. Tested Vivideo capability boundary

The Vivideo build accessed on 2026-07-25 exposed:

- Video Agent and Manual entry points.
- Text-to-video.
- Image-to-video.
- First/last-frame generation.
- Multiple-image generation.
- Model selection.
- Avatar, voice, and brand options.
- Social sharing after generation.

The tested build did not expose:

- General upload-and-edit functionality for an existing video.
- Long-video-to-short-form clipping.
- A clearly accessible post-generation timeline editor.

These missing capabilities must be reported as capability gaps. They must not be converted into zero-quality scores for unsupported workflows.

## 4. Research method and caveats

Five benchmark tasks were run with fixed prompts and shared assets:

1. `AGENT-01` — one-prompt educational short.
2. `AD-01` — product advertisement using a supplied fictional packshot.
3. `T2V-01` — manual text-to-video.
4. `I2V-01` — image-to-video with controlled object motion and a mug-text change.
5. `AVATAR-01` — avatar explainer with an exact script.

Canonical prompts: `research/benchmark-prompts.md`  
Canonical assets: `research/assets/`  
Method: `research/methodology.md`

Important caveats:

- Only one main run was assessed for each product/workflow. Results are directional case-study evidence, not statistically reliable model rankings.
- The same visible prompt does not isolate model quality. Products may rewrite prompts, choose different models, assemble several clips, add stock assets, apply post-processing, or impose different defaults.
- Compare agent output with agent output, manual generation with manual generation, and avatar workflows with avatar workflows.
- Runway must be discussed both as a comparable generator and as a broader creative-workflow platform.
- App Store reviews describe mobile applications and must not be silently generalized to the web product.
- Review allegations are user claims, not verified facts.

## 5. Generated-output evidence and file naming

Each `competitors/<product>/` folder contains generated outputs. Approximately 25 competitor onboarding/run recordings are preserved; the five Vivideo benchmark sessions do not have linked run recordings in the current media manifest.

Current naming convention:

- Generated/downloaded result: `<competitor>-<prompt>.mp4`, such as `runway-i2v01.mp4`.
- Screen recording: `<PROMPT-ID> - <description>.mp4`, such as `I2V-01 - Image to video.mp4`.
- Onboarding recording: `<competitor>-onboarding.mp4` or the nearest equivalent.

Do not delete apparent duplicates without checking this distinction: one file is usually the output and the other is the recording of how it was produced.

Comparison notes:

- `agent01-compare.md`
- `ad01-compare.md`
- `t2v01-compare.md`
- `i2v01-compare.md`
- `avatar01-compare.md`

These files use comma-separated rows despite the `.md` extension. They contain the current concise first-run observations and durations.

### Output-level findings

#### AGENT-01

- Vivideo produced the most complete first-run educational short, but the plan preview showed 18 seconds while the final video was 34 seconds.
- HeyGen produced a coherent result but exceeded the requested range and took approximately 11 minutes.
- InVideo matched the target range with no major recorded failure.
- Pollo used basic visuals, omitted burned-in subtitles, and had unclear narration.
- Revid combined four shots, but the voice and visual style changed between them.
- Runway selected a 10-second Seedance workflow; the separately added voice felt weakly integrated.

#### AD-01

- HeyGen assembled a coherent multi-scene advertisement but produced 15 rather than 20 seconds.
- InVideo produced coherent motion and music but omitted voiceover.
- Pollo mostly placed text over the product image instead of constructing a multi-scene ad.
- Revid produced a complete ad without a major first-run failure.
- Runway produced a complete clip but with weak ad structure and limited product treatment.
- Vivideo had only enough remaining credits for a six-second result, limiting prompt coverage.

#### T2V-01

- HeyGen, InVideo, Pollo, and Runway produced complete first-run clips without a major recorded generation failure.
- Revid kept the paper boat stationary instead of moving it through the gutter.
- Vivideo behaved like a shaking still image and added spoken narration even though the prompt prohibited audio.

#### I2V-01

- Every product rotated the red pinwheel more than the requested approximately one full clockwise turn.
- InVideo preserved the source scene best despite missing the one-turn constraint.
- HeyGen also displaced the pinwheel and departed from the requested stable push-in.
- Runway also used limited motion and showed temporal inconsistency.
- Vivideo also failed the PAUSE-to-PLAY mug-text change.
- Pollo and Revid produced otherwise complete results, but still missed the one-turn constraint.

#### AVATAR-01

- All six products produced a complete presenter-style result.
- Revid's final comparison uses the corrected run without the extra B-roll from its earlier exploratory version.
- Vivideo initially proposed 30 seconds; after the plan was edited, it produced a 16-second result.

## 6. Product notes and noteworthy mechanisms

### Vivideo

- Displayed credit estimates did not always match actual charges. One auto-generation estimate showed 9 credits but consumed 15; another agent plan was approved at 12 but consumed 21.
- Planned and generated durations could differ substantially.
- The user could not easily see the submitted prompt after generation.
- A generated item displayed an incorrect relative timestamp.
- First-run quality varied substantially across workflows.
- Social sharing exists after generation.
- Product opportunities: clearer credit estimates, visible prompt history, better preview behavior, self-service cancellation, use-case discovery, agent skills, and editing.

### HeyGen

- The agent asked pre-generation questions and showed a plan before generation.
- The plan and generated duration could diverge.
- Free videos carried a watermark; download, editing, and 1080p could trigger upgrade prompts.
- Direct sharing to X and LinkedIn was observed.
- Avatar/presenter workflows were comparatively mature.
- Cancellation used a conversational agent and offered a one-month freeze.
- Credit allowance felt generous: about 11 videos were produced with credits remaining.

### Pollo AI

- Offers many underlying models and a broad set of specialized tools/use cases.
- The interface felt crowded during testing.
- Free export retained a Pollo watermark.
- Credits were restrictive; approximately five videos were produced using lower-cost Pollo models.
- Product-promotion workflow was comparatively successful and easy to select as a dedicated use case.
- Referral program: 50 credits to each side on signup and 200 credits to each side after upgrade.
- Referral sharing options shown: copied invitation link, Facebook, X, WhatsApp, LinkedIn, and Telegram.
- Affiliate program: up to 30% commission on an attributed first purchase, renewal, or upgrade.
- Use-case categories shown include marketing, e-commerce, social media, and music.
- Cancellation was the shortest and most direct flow.

### InVideo AI

- Initial free allowance was too small to complete meaningful generation after setting up the agent.
- The agent worked well but tended to select strong, relatively expensive models by default.
- The agent assembled short generated clips into complete videos effectively.
- Explore/examples provide inspiration by category and allow prompt inspection/copying.
- Categories shown include UGC Ads, Entertainment, Food, Montage, Product Ads, Travel & Landscapes, Explainer, Animated, Anime, Realistic, Cinematic, and Music.
- Cancellation used a multi-step survey and rejected meaningless free-text responses.

### Revid.ai

- Strong social-native features: Repurpose, Viral Search, Channel Watchers, and social-specific media types.
- In-product creation/publishing quests award credits.
- Publishing on Revid offered 25 credits, creating a user-generated-content loop.
- Post-generation editing is available.
- Reusable generated characters are saved to the user profile.
- The product exposes a very large tool/use-case catalog; many entries are narrow variations of the same generation capability.
- A 50% affiliate share was observed in notes but still needs a dated official page before it is used as a precise public claim.
- Generation could be slow even for short videos.
- Growth plan cost $39/month and was the most expensive tested plan, but its credits felt generous.
- Cancellation offered 20% off for one month.

### Runway

- Free allocation allowed image generation but did not provide the expected video generation access in the tested account.
- The Home agent tended to select Seedance; choosing Runway's own models required the Custom area or more explicit control.
- Quests encourage additional creation and can provide credits.
- Prompt tips teach techniques such as specifying camera lens types.
- A post-generation 4K upscale action was visible.
- Workflow templates support both simple and complex creative pipelines.
- Cancellation offered one free month with another credit refresh.

## 7. User-review research

Location: `reviews/`

Each competitor has:

- `reviews.md` containing selected direct-review evidence and concise paraphrases.
- `a.md` containing source-page URLs.
- Saved screenshots.

Current coverage:

| Product | Direct examples | Status |
| --- | ---: | --- |
| HeyGen | 10 | Complete. |
| InVideo | 10 | Complete. |
| Pollo AI | 10 | Complete. |
| Runway | 11 | Complete. |
| Revid.ai | 9 | One more recent review is optional if equal sample sizes are desired. |
| Vivideo | 9 | One more recent positive/neutral review is optional if equal sample sizes are desired. |

Vivideo has two valid Trustpilot profiles, one for `vivideo.ai` and one for `app.vivideo.ai`. Their aggregate scores must remain separate.

Cross-product review themes:

- Credit opacity and fast credit depletion.
- Paying for failed or unusable generations.
- Prompt-adherence and source-fidelity failures.
- Pricing-value concerns and plan-limit changes.
- Billing, cancellation, refund, and support frustration.
- Positive feedback around ease of use, speed to first result, and all-in-one workflows.

Do not include every review screenshot in the main presentation. Use a theme-frequency or theme-by-product view with two or three representative direct-review cards.

## 8. Distribution and growth research

Detailed source: `distribution.md`

Distinguish among:

- Public acquisition/discovery.
- Referral and affiliate acquisition.
- Shareable-output/product loops.
- Activation and retention.
- Monetization, which is not distribution by itself.

Current findings:

- Vivideo supports social sharing after video generation.
- HeyGen supports sharing to X and LinkedIn, and free outputs can carry its watermark.
- Pollo combines referral rewards, social sharing, an affiliate program, a broad use-case library, and watermarked free export.
- InVideo's Explore gallery and copyable prompts reduce activation friction; this is only SEO/public discovery if accessible without login.
- Revid combines social trend discovery, affiliate acquisition, quests, publishing incentives, and many use-case pages.
- Runway's quests, prompt education, and workflows are strong activation/retention mechanisms; an official public gallery/community/workflow page is needed only for an external-acquisition claim.

New distribution screenshots supplied on 2026-08-01:

1. `Screenshot 2026-08-01 at 3.11.44 PM.png` — Pollo referral rewards: 50 credits each after signup and 200 credits each after upgrade; multiple share destinations.
2. `Screenshot 2026-08-01 at 3.12.06 PM.png` — Pollo use-case library grouped by marketing, e-commerce, social media, and music.
3. `Screenshot 2026-08-01 at 3.12.37 PM.png` — InVideo Explore gallery with category filters.
4. `Screenshot 2026-08-01 at 3.41.13 PM.png` — Pollo affiliate page advertising up to 30% commission.

These screenshots were supplied from temporary attachment paths and were not found inside the workspace. Move the originals into stable private evidence storage before starting a new conversation.

Presentation selection:

- Show the Pollo referral screenshot as the primary distribution visual.
- Show either Pollo's affiliate page or Revid's publishing-credit mechanism as a secondary visual.
- Use InVideo Explore only as a small supporting example for activation.
- Keep the remaining screenshots as evidence rather than giving each one presentation space.

## 9. Cancellation research

Detailed comparison: `cancellation.md`  
Recordings: `cancellation/*.mp4`

Key conclusion:

- Pollo was the most direct cancellation flow.
- Revid and Runway used clear monetary retention offers.
- HeyGen used a longer conversational flow and a freeze option.
- InVideo created the most survey friction.
- Vivideo created the highest outcome friction because the final step required contacting support instead of completing cancellation in product.

The user confirmed that the Vivideo support follow-up and subscription checks were completed.

Privacy: the recordings can display personal billing information, including a name, email, renewal details, invoices, and card last four digits. They must remain private. Publish only cropped/redacted frames.

## 10. Final strategic recommendations

Presentation-ready source: `recommendations.md`

### Strategic thesis

> Vivideo should become the trustworthy social-video agent—not another model marketplace.

Model access is increasingly commoditized. Vivideo's more defensible position is to become the most trustworthy and controllable layer between user intent and a publishable social video.

### Final priorities

| Priority | Recommendation | Strategic outcome |
| ---: | --- | --- |
| 1 | Make approval a binding Generation Contract | Trust and predictable economics |
| 2 | Treat every generated video as an editable draft | Recoverability and higher export conversion |
| 3 | Make model routing intelligent but visible | Better quality-per-credit without confusing users |
| 4 | Package outcomes and preserve creator memory | Faster activation and differentiated repeat use |
| 5 | Turn sharing into a measurable distribution engine | Compounding acquisition and retention |

### Steal

- HeyGen's guided brief and plan—but make approved values binding.
- Revid's reusable characters—but expand them into persistent creator and brand memory.
- Runway's guidance, workflows, quests, and upscale action—but connect them to successful publishing outcomes.
- Pollo's referral and affiliate mechanics—but reward activated and retained users.
- InVideo's Explore gallery and copyable prompts—but connect each example to a structured recipe.
- Revid's publishing rewards—but measure downstream value.
- Focused post-generation correction—but avoid building an unnecessarily complex editor.

### Avoid

- Credit estimates that differ from actual charges.
- Material duration differences after approval.
- Full regeneration as the only correction mechanism.
- Hidden prompts, models, or settings.
- Expensive automatic model selection without consent.
- Charging for obvious technical failures.
- Waiting until export to disclose restrictions.
- Pay-before-preview funnels.
- Hundreds of nearly identical novelty tools.
- Low-quality incentive spam.
- Mandatory cancellation surveys or support-assisted cancellation as the only option.

### Attack

- Be the AI-video agent where approval has contractual meaning.
- Make imperfect results recoverable without full paid regeneration.
- Provide the clearest relationship between model, cost, speed, and expected quality.
- Offer the most trustworthy first-video experience: guided input, visible plan, capped cost, usable preview, and focused editing.
- Connect creation, creator memory, publishing, and performance in one workflow.
- Compete on accepted output per credit rather than model count.

### Roadmap

| Phase | Focus |
| --- | --- |
| Now | Generation Contract, prompt history, credit restoration, early restriction disclosure, watermarked preview, self-service cancellation |
| Next | Guided planning, focused scene correction, transparent model routing and fallback consent |
| Expand | Curated recipes, public use-case pages, creator memory, reusable assets |
| Scale | Referrals, meaningful quests, publishing rewards, remixable templates, affiliate distribution |

### Likely threats over the next 12 months

1. End-to-end agents such as InVideo, HeyGen, and Revid compress scripting, generation, editing, and publishing into one workflow.
2. Multi-model platforms such as Pollo reduce model differentiation by giving users one interface for whichever model currently performs best.
3. Competitors with referral, affiliate, publishing, quest, community, and template loops can compound acquisition and retention even when output quality is similar.

## 11. Website build brief

The website should communicate the analysis, not merely display a directory of research files.

### Recommended information architecture

1. **Overview** — executive summary, three largest findings, three recommendations, and two or three threats.
2. **Benchmarks** — tabs for the five prompts; side-by-side generated videos, durations, models/workflows, and concise observations.
3. **Competitors** — six deep-dive profiles with positioning, product experience, pricing, strongest mechanism, weakness, and implication for Vivideo.
4. **Pricing & cancellation** — plan comparison, credit psychology, paywalls, cancellation-friction table, and retention offers.
5. **Reviews** — coded themes, representative direct reviews, source links, and mobile-versus-web caveat.
6. **Distribution** — discovery, referral/affiliate, shareable-output, and activation/retention mechanisms.
7. **Strategy** — Steal / Avoid / Attack recommendations and 12-month threats.
8. **Freshness** — current and prior price snapshots, detected changes, last successful check, source links, watcher status, and history.
9. **Methodology** — tested build, prompt set, assets, single-run limitation, and evidence/privacy rules.

### Benchmark interaction

- Default to one benchmark at a time rather than autoplaying 30 videos.
- Provide a six-product comparison grid or carousel.
- Display requested versus actual duration, workflow type, model, and concise first-run note beside each output.
- Allow videos to be opened full screen.
- Do not claim a single winning model across all prompts.
- Clearly label workflow differences and unsupported capabilities.

### Evidence behavior

- Every important claim should link to a public-safe screenshot, generated output, external source, or private-evidence reference.
- Raw cancellation and onboarding recordings should not be publicly embedded.
- External review links should open the source page.
- Use cropped screenshots for specific UI mechanisms rather than full desktop captures.
- Keep a small “Observed on” date near time-sensitive claims.

### Visual priorities

- Lead with conclusions and evidence, not methodology.
- Use tables for exact mappings and compact comparisons.
- Use screenshots only when the UI mechanism is visually important.
- Avoid screenshot walls.
- Give generated videos more visual weight than decorative graphics.
- Clearly distinguish first-hand observation, user-review claim, and strategic interpretation.

## 12. Freshness checker specification

The first implementation can focus on pricing, but “price” should include the plan economics rather than only the currency amount.

Monitor all six deep-dive products for:

- Plan name.
- Monthly/annual billing period.
- Displayed price and currency.
- Included credits or generation allowance.
- Free-plan limits.
- Watermark rules.
- Maximum export resolution.
- Source pricing URL.
- Last successful check.
- Fetch/extraction status.

Store:

- Current normalized snapshot.
- Previous snapshot.
- Field-level differences.
- Raw relevant text or hash for debugging.
- Historical timeline.

The website should show “no change” and failure states honestly. A manual Check Now action is acceptable for the first working version; scheduled GitHub Actions can be added afterward. Changelog and feature-announcement monitoring are optional extensions.

## 13. Spend report

Minimum fields:

| Product | Plan | Amount | Currency | Reason purchased | Purchase date | Cancelled | Cancellation date |
| --- | --- | ---: | --- | --- | --- | --- | --- |

Fill exact plan names and prices from the saved pricing/purchase screenshots. Do not guess from memory.

Keep receipts private. Do not expose card data, login details, personal email addresses, billing names, invoice IDs, or API keys.

## 14. What remains, in order

The cancellation follow-up, renewal checks, distribution-evidence storage, spend report, and optional review collection were reported complete by the user.

1. Add impact, effort, owner, and target timing if the presentation requires an implementation-planning view.
2. Define monitorable indicators for the three selected 12-month threats.
3. Build the website using the information architecture above and `recommendations.md` as the strategy-page source.
4. Implement the pricing freshness checker.
5. Run privacy, source-link, mobile-layout, and factual-consistency QA.

No additional generation benchmark runs are required unless a saved output is corrupt or a first run cannot be explained from the recording.

## 15. File-retention and cleanup guidance

Do not delete research files before the website content has been migrated and verified.

### Essential to keep

- `case-3-competitor-analysis.pdf`
- `PROJECT-HANDOFF.md`
- `README.md`
- The five `*-compare.md` files.
- `distribution.md`
- `cancellation.md`
- `recommendations.md`
- `competitors/` generated outputs and recordings.
- `cancellation/` recordings, stored privately.
- `reviews/` evidence files and screenshots.
- `research/benchmark-prompts.md`
- `research/assets/`
- `research/methodology.md`
- `research/competitor-selection.md`

### CSV status

Most CSV files are unused templates rather than completed analysis:

- `data/benchmarks.csv` contains placeholder run rows; actual observations are in the comparison Markdown files.
- `data/distribution.csv`, `data/funnel-observations.csv`, `data/pricing.csv`, `data/recommendations.csv`, `data/reviews.csv`, and `data/spend.csv` contain headers only.
- `data/research-status.csv` is a partially updated tracker.
- `data/capability-matrix.csv`, `data/competitors.csv`, and `data/evidence.csv` contain some useful structured information.

Recommended approach: keep `data/` until the website developer decides whether to consume CSV, Markdown, JSON, or TypeScript. After migration, archive or delete the empty scaffolds. If all CSVs are removed, update `README.md`, `research/methodology.md`, and templates so they no longer point to them.

### Optional scaffolding after website migration

- `research/templates/`
- `research/create-drive-folders.gs`
- `research/review-coding-guide.md`
- `research/notes/` if empty
- `data/README.md`
- `chat.md`, which can be archived as historical conversation context

Never delete the original generated outputs or evidence recordings merely because a cropped screenshot has been created.

## 16. Source-of-truth hierarchy

When documents disagree, use this priority:

1. Original generated video or screen recording.
2. Dated screenshot or official source page.
3. Concise comparison/review/distribution/cancellation Markdown.
4. This handoff document.
5. Empty or partially completed CSV scaffolding.
6. Historical `chat.md` conversation.

Any new claim added to the website should be traceable to one of the first three levels.
