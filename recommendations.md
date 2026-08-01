# Strategic recommendations for Vivideo

Status: final recommendation framework for the presentation  
Evidence base: first-hand benchmark runs, product walkthroughs, pricing and credit observations, cancellation tests, distribution research, and direct user-review themes.

## Executive thesis

> **Vivideo should become the trustworthy social-video agent—not another model marketplace.**

Vivideo should not try to win by claiming to have the single best video model. Model access is increasingly available through aggregators and competitors can switch providers quickly.

The stronger position is to become the most trustworthy and controllable layer between a user's idea and a publishable social video:

```text
User intent
→ approved plan and cost
→ transparent model selection
→ editable generated draft
→ publishable social output
→ measurable distribution loop
```

The research repeatedly exposed the same category-level weakness: users understand that AI output can vary, but they strongly resist losing credits, time, or control when it happens.

## Recommendation overview

| Priority | Recommendation | Strategic outcome | Evidence confidence |
| ---: | --- | --- | --- |
| 1 | Make approval a binding Generation Contract | Trust and predictable economics | High |
| 2 | Treat every generated video as an editable draft | Recoverability and higher export conversion | High |
| 3 | Make model routing intelligent but visible | Better quality-per-credit without confusing users | High |
| 4 | Package outcomes and preserve creator memory | Faster activation and differentiated repeat use | High |
| 5 | Turn sharing into a measurable distribution engine | Compounding acquisition and retention | Medium-high |

The first three recommendations strengthen the core product. The distribution recommendation should scale only after the creation and correction experience is trustworthy.

---

## 1. Make approval a binding Generation Contract

### Presentation headline

> **Make approval meaningful: the plan should be a contract, not a suggestion.**

### Problem observed

- Vivideo displayed an estimate of 9 credits and consumed 15.
- Another agent plan was approved at 12 credits and consumed 21.
- An 18-second Vivideo plan produced a 34-second video.
- HeyGen also showed that a pre-generation plan can diverge from the delivered duration.
- Credit confusion, failed-generation charges, and paying for unusable outputs appeared repeatedly in reviews across the category.

### Recommendation

Before credits are charged, show an editable Generation Contract containing:

- Original user prompt.
- Vivideo's interpreted brief.
- Script and scene plan.
- Target duration and acceptable tolerance.
- Selected model and why it was selected.
- Maximum credit charge.
- Resolution and watermark status.
- Captions, voice, music, aspect ratio, and other important settings.
- Failure and credit-restoration rules.

After approval:

- Never exceed the credit ceiling without requesting approval again.
- Keep the delivered duration within the agreed tolerance.
- Correct a material plan mismatch without another charge.
- Restore credits automatically after a clear technical failure.
- Preserve the prompt, approved plan, model, settings, and actual charge in project history.
- Display approved versus actual duration and cost after generation.

### What Vivideo should copy—and improve

Copy HeyGen's guided questions and pre-generation plan, but improve the mechanism by making the approved values binding.

### Why this can differentiate Vivideo

Competitors market model quality and feature breadth. Vivideo can own predictability and trust, which are recurring weaknesses across several competitors rather than a Vivideo-only issue.

### Success metrics

- Zero generations exceeding the approved credit ceiling.
- More than 95% of outputs within the approved duration tolerance.
- Credit-related support tickets.
- Automatic credit-restoration rate and reason.
- First-output acceptance rate.
- Paid regeneration rate.
- Accepted output per credit.

---

## 2. Treat every generated video as an editable draft

### Presentation headline

> **An imperfect result should be correctable—not a costly dead end.**

### Problem observed

Vivideo did not expose a clearly accessible post-generation editor. When a scene, duration, caption, or motion is wrong, the user risks regenerating the entire result and spending more credits.

Competitor evidence:

- HeyGen asks questions and generates an editable plan.
- InVideo constructs complete outputs from multiple generated clips.
- Revid provides post-generation editing.
- Runway provides deeper creative workflows.
- User reviews across products complain about paying repeatedly to correct flawed output.

### Recommendation

Build a focused social-video correction layer rather than a complex professional timeline editor.

Essential actions:

- Replace or regenerate one scene.
- Show the cost before a scene is regenerated.
- Trim, reorder, duplicate, or remove scenes.
- Edit the script.
- Correct captions and caption styling.
- Replace the voice or correct pronunciation.
- Adjust music volume.
- Replace a product or brand asset.
- Edit the CTA.
- Change aspect ratio for another social channel.
- Preserve earlier versions.

Recommended workflow:

```text
Guided brief
→ editable plan
→ generated draft
→ targeted corrections
→ export or publish
```

### Scope discipline

Vivideo does not need to reproduce Adobe Premiere. The objective is to fix the most common AI-generation failures quickly and without regenerating unaffected scenes.

### Strategic value

- Increases the chance that the first paid generation becomes usable.
- Reduces full regenerations and model cost.
- Gives users control without forcing them into a professional editor.
- Converts the agent from a one-shot generator into a draft-to-publish workflow.

### Success metrics

- Percentage of imperfect outputs fixed without a full regeneration.
- Scene-level versus full-video regeneration rate.
- Draft-to-export conversion.
- Average credits per accepted output.
- Median time from first draft to export.
- First-project completion rate.
- Most frequently used correction actions.

---

## 3. Make model routing intelligent but visible

### Presentation headline

> **Hide model complexity—not model cost or control.**

### Problem observed

- Pollo's model breadth is valuable but contributes to a crowded experience.
- Runway's Home agent tended to select Seedance; selecting another model required more explicit intervention or moving to Custom.
- InVideo's agent used strong models by default, which can accelerate credit consumption.
- When the same prompt is used across products, output differences reflect not only the underlying model but also prompt rewriting, model routing, defaults, clip assembly, and post-processing.

### Recommendation

Offer four understandable routing modes:

1. Fast & affordable.
2. Balanced.
3. Best quality.
4. Choose model manually.

For each choice, show:

- Model name.
- Estimated credit ceiling.
- Expected generation time.
- Supported duration and resolution.
- Why the model fits the requested workflow.
- Known limitations.

Example:

```text
Recommended: Seedance Fast

Best for:
Multi-scene social videos with people and camera movement

Maximum cost:
12 credits

Alternative:
Vivideo Balanced — 8 credits, lower motion consistency
```

### Control rules

- Lock the approved model for that generation.
- If a fallback is required, show the replacement model and new cost before continuing.
- Never silently move the user to a more expensive model.
- Learn model recommendations by task rather than always choosing the most capable model.

Example task routing:

- Avatar video → strongest lip-sync and speech model.
- Packshot advertisement → strongest source-fidelity model.
- Cinematic text-to-video → motion-focused model.
- Educational short → efficient multi-scene pipeline.

### Strategic value

Model access itself is not a durable moat. Transparent task-level orchestration can become one.

### Success metrics

- Accepted output per credit by routing mode.
- Model override rate.
- Fallback frequency and approval rate.
- Cost difference between recommended and manual selections.
- Quality and acceptance by model/use-case pair.
- Percentage of users choosing simple modes versus manual selection.

---

## 4. Package outcomes and preserve creator memory

### Presentation headline

> **Package outcomes—not hundreds of nearly identical tools.**

### Problem observed

- Pollo and Revid expose many dedicated tools and use cases, improving discoverability but also creating duplication and interface complexity.
- InVideo's Explore gallery reduces blank-page friction and provides copyable examples.
- Revid saves reusable generated characters, reducing repeated setup.
- An empty prompt box expects the user to already understand what the product can create.

### Recommendation: curated recipes

Launch approximately 10–15 high-value social-video recipes instead of a large catalog of novelty generators.

Recommended initial recipes:

- Product image to social advertisement.
- Product URL to video advertisement.
- UGC-style advertisement.
- Educational short.
- Faceless explainer.
- Avatar announcement.
- Podcast or article to short video.
- Viral-format recreation.
- Music-to-video.
- Multi-platform campaign variations.
- Brand-consistent weekly social series.

Each recipe should communicate:

- Outcome and target user.
- Example video.
- Required inputs.
- Expected duration.
- Estimated credit range.
- Recommended routing mode.
- Editable example prompt.
- Supported publishing channels.

Use the same structure for public use-case landing pages and the signed-in workflow. A visitor should move directly from a discoverable example into the matching creation flow.

### Recommendation: creator memory

Extend Revid's reusable-character mechanism into persistent creator context:

- Saved characters and avatars.
- Brand kit.
- Preferred voices.
- Default CTA.
- Target audiences.
- Preferred platforms.
- Caption style.
- Common aspect ratios.
- Reusable product assets.

The agent should reuse this context and ask only what changed for the new project.

### Strategic value

- Speeds up first use.
- Improves consistency across a content series.
- Reduces repetitive prompting.
- Creates switching costs based on accumulated creator context rather than model exclusivity.
- Connects public acquisition pages to product activation.

### Success metrics

- Recipe-page visit to signup conversion.
- Recipe start to generation conversion.
- First-output acceptance by recipe.
- Time to first generation.
- Repeat usage of saved brand, character, or voice assets.
- Percentage of sessions starting from a recipe versus an empty prompt.
- Organic traffic to public use-case pages.

---

## 5. Turn sharing into a measurable distribution engine

### Presentation headline

> **A share button distributes a video; a growth loop distributes the product.**

### Evidence observed

- Vivideo already supports sharing after generation.
- HeyGen supports sharing to X and LinkedIn.
- Pollo gives 50 credits to both parties after referral signup and 200 after upgrade.
- Pollo advertises an affiliate program paying up to 30% on attributed purchases, renewals, or upgrades.
- Revid offers credits for creation, publishing, and posting through its platform.
- Runway uses quests to teach and reward continued creation.

### Recommendation: referral loop

Reward meaningful activation rather than signup alone:

- Small two-sided reward after the referred user completes a first video.
- Larger reward after the referred user upgrades.
- Fraud, self-referral, and reward caps.
- Clear reward history.

### Recommendation: publishing and remix loop

- Publish eligible work to a Vivideo gallery.
- Allow creators to share reusable templates.
- Let another user remix a public result into their own project.
- Reward content that generates qualified visits, activated creators, or useful remixes.
- Do not reward every low-quality upload equally.

### Recommendation: progression loop

Use Runway-style quests to teach high-value behavior:

- Complete a brand kit.
- Correct one scene rather than regenerating the entire video.
- Publish in two aspect ratios.
- Create from a saved recipe.
- Reuse a character.
- Invite a collaborator.

Avoid meaningless gamification such as rewarding users for clicking arbitrary interface elements.

### Recommendation: partner loop

Add an affiliate program after the core product has healthy first-output acceptance and retention. Acquiring more users before improving trust would amplify complaints and refunds.

### Success metrics

- Share actions per export.
- Share-to-visit conversion.
- Visit-to-signup conversion.
- Referred-user first-video completion.
- Referral acquisition cost.
- Public template remix rate.
- Quest completion correlated with retention.
- Affiliate customer activation, retention, and refund rate.

---

## Non-negotiable lifecycle trust improvements

These are not separate strategic bets; they are baseline product hygiene required to support all five recommendations.

- Show a playable watermarked preview before requiring an upgrade.
- Disclose watermark, resolution, credit, editing, and export restrictions before generation.
- Keep the original prompt and generation configuration visible.
- Show estimated versus actual credit use.
- Restore credits for clear technical failures.
- Provide a direct self-service cancellation action.
- Keep cancellation feedback optional.
- Confirm the subscription end date immediately.

Vivideo's support-assisted cancellation ending is particularly damaging because it reinforces the trust problems already visible in credit and preview complaints.

## Final Steal / Avoid / Attack framework

### Steal

- HeyGen's guided brief and plan—but make approved values binding.
- Revid's reusable characters—but expand them into persistent creator and brand memory.
- Runway's prompt guidance, workflows, quests, and upscale action—but connect them to successful publishing outcomes.
- Pollo's referral and affiliate mechanics—but reward activated and retained users.
- InVideo's Explore gallery and copyable prompts—but connect each example to a structured recipe.
- Revid's publishing rewards—but measure downstream value.
- Focused post-generation correction from mature agent workflows—but avoid building an unnecessarily complex editor.

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
- Rewards for low-quality or spam activity.
- Long mandatory cancellation surveys.
- Support-assisted cancellation as the only option.

### Attack

- Be the AI-video agent where approval has contractual meaning.
- Make imperfect results recoverable without full paid regeneration.
- Provide the clearest relationship between model, cost, speed, and expected quality.
- Offer the most trustworthy first-video experience: guided input, visible plan, capped cost, usable preview, and focused editing.
- Connect creation, creator memory, publishing, and performance in one social-video workflow.
- Compete on accepted output per credit rather than model count.

## Recommended roadmap

| Phase | Actions | Reason for sequence |
| --- | --- | --- |
| Now: trust foundation | Generation Contract, prompt history, credit ceiling, automatic restoration, early restriction disclosure, watermarked preview, self-service cancellation | Fixes the highest-confidence trust problems before acquiring more users. |
| Next: controllable creation | Guided plan, focused scene correction, transparent routing modes, model/fallback consent | Improves usable-output conversion and reduces costly full regenerations. |
| Expand: activation and retention | Curated recipes, public use-case pages, creator memory, reusable assets | Reduces blank-page friction and creates repeat-use value. |
| Scale: distribution | Referrals, meaningful quests, publishing rewards, remixable templates, affiliate program | Compounds growth after the core experience is reliable. |

## Recommended presentation sequence

### Section 1 — Category insight

> Model quality changes quickly and model access is rentable. Trust, control, recoverability, and distribution are more defensible.

Support with:

- One Vivideo credit/duration mismatch.
- One cross-product review theme about credits or unusable generations.
- A note that the same prompt did not isolate model quality because product orchestration differed.

### Section 2 — Strategic position

> Vivideo should become the trustworthy social-video agent.

Show the five recommendations in one overview graphic or table.

### Section 3 — Top three product priorities

1. Generation Contract.
2. Editable draft workflow.
3. Transparent model routing.

These should receive the most presentation time because they directly address first-hand benchmark failures and repeated review complaints.

### Section 4 — Activation and growth

4. Curated recipes and creator memory.
5. Measurable distribution loops.

Use Pollo referral evidence, InVideo Explore, Revid publishing rewards, and Runway quests as supporting mechanisms.

### Section 5 — Roadmap and measurement

End with the phased roadmap and a small KPI set:

- Approved-plan adherence.
- First-output acceptance.
- Accepted output per credit.
- Draft-to-export conversion.
- Referred-user activation.
- Support and refund rate.

## Final recommendation statement

> Vivideo should compete on accepted output per credit—not on the number of models or tools. A visible, binding plan; recoverable draft; transparent routing; persistent creator context; and measurable publishing loops would turn Vivideo from another generator into a trusted social-video operating system.
