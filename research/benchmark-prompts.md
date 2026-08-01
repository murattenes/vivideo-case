# Fixed benchmark prompts

Status: draft - review once, then freeze before testing  
Prompt version: v4  
Asset versions: AD-01 v1; I2V-01 v3  
Target: vertical 9:16, English

## Global instructions

- Paste the prompt as written when the product supports free-form prompting.
- When a product uses a form or wizard, map the same requirements to the available controls and record the deviation.
- Do not add competitor-specific creative direction.
- Preserve the first result before any regeneration or editing.
- Use the same source files listed in `research/assets/README.md`.
- Set `supported=false` and explain the reason in the benchmark notes if the product does not support it.



## AGENT-01 - One-prompt educational short

Goal: test an agent or guided idea-to-complete social-video workflow.

```text
Create a 15-20 second vertical video for TikTok, Reels, or Shorts explaining why leaves change color in autumn.

Audience: curious adults with no science background.
Structure:
1. Open with a clear hook in the first two seconds.
2. Explain chlorophyll fading as daylight decreases.
3. Explain that yellow and orange pigments were already present.
4. Mention that some trees create red pigments.
5. End with a concise takeaway, not a follow request.

Use natural visual pacing, readable burned-in captions, a warm neutral English voice, and background music that does not overpower speech. Do not invent statistics.
```

Primary measures: hook/script quality, factual adherence, scene relevance, voice, captions, time to first output, editing required.

## AD-01 - Product advertisement

Goal: test product-image handling and conversion-focused creative.

Input: `research/assets/shared-product-packshot-v1.png`

```text
Create a 20-second vertical social advertisement for the fictional product Drift Cold Brew using the supplied packshot.

Communicate all three product facts without changing their meaning:
1. Unsweetened oat-milk cold brew.
2. 120 mg caffeine.
3. Recyclable 250 ml can.

Audience: busy creative professionals.
Tone: calm, modern, premium, not aggressive.
Required sequence:
1. Hook: "Smooth focus, no sugar rush."
2. Show the supplied product accurately.
3. Communicate the three product facts.
4. End with: "Find your flow with Drift."

Use concise, readable captions. Treat the supplied packshot as the canonical product reference. Do not redesign the can, alter or replace its logo or packaging text, distort its shape.
```

Primary measures: packshot fidelity, text accuracy, ad structure, visual consistency, CTA clarity.

## T2V-01 - Manual text to video

Goal: compare Vivideo Manual mode with multi-model generation platforms such as Pollo AI.

Target settings:

- Duration: 6 seconds
- Aspect ratio: 9:16
- Resolution: 720p where selectable
- Model: use the same exact model across products when available; otherwise record the closest available model and mark the deviation

```text
A single continuous vertical shot of a tiny paper boat floating through a rain-filled city gutter at blue hour. The camera tracks beside the boat at water level. Warm shop lights reflect in the moving water, raindrops create realistic ripples, and the paper remains structurally consistent. Cinematic realism, natural motion, shallow depth of field. No cuts, people, text, captions, logos, or music.
```

Primary measures: prompt adherence, motion naturalness, temporal consistency, model transparency, generation speed, settings, and credit use.

## I2V-01 - Image to video

Goal: isolate motion quality and source-image fidelity.

Input: `research/assets/shared-image-v3.png`

```text
Create one continuous 10-15 seconds vertical shot from the supplied image.

Use a very slow camera push-in. Make the red paper pinwheel rotate smoothly clockwise for approximately one full turn. Let the curtain sway gently once and the mug's steam rise naturally, drifting slightly toward the window.

While the camera pushes in, change only the word printed on the mug from "PAUSE" to "PLAY". The shot must begin with "PAUSE" clearly readable and end with "PLAY" clearly readable. Keep the mug's shape, material, position, and all other mug details unchanged during the text transformation.

Keep the pinwheel's shape, center axle, and stick stable. Preserve the table, window, lighting, and colors. Do not add new objects, people, cuts, captions, voice, music, or logos. No warping, morphing outside the requested word change, sudden movement, or camera shake.
```

Primary measures: source fidelity, motion naturalness, temporal consistency, unwanted morphing, and requested text-change accuracy.

## AVATAR-01 - Avatar explainer

Goal: test stock-avatar workflow, speech quality, lip sync, gestures, and exact-script control.

Use a stock avatar and the closest available neutral English voice. Do not use a custom avatar.

Exact script:

```text
Most AI videos fail before generation begins. The goal, audience, and format are usually unclear. Start with one outcome, one viewer, and one publishing channel. Then make the first version, review what is missing, and improve only the parts that matter.
```

Direction:

```text
Create vertical presenter video. Use a clean neutral background, medium framing, restrained natural gestures, accurate burned-in captions, and no background music. Read the script exactly without adding or removing words.
```

Primary measures: exact-script adherence, lip sync, voice naturalness, gesture quality, caption accuracy, setup friction.

## Version-change log


| Version | Date       | Change                                                                                                                                 | Reason                                                                                            |
| ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| v1      | 2026-07-25 | Initial benchmark set                                                                                                                  | Created before testing.                                                                           |
| v2      | 2026-07-25 | Replaced clipping with manual text-to-video                                                                                            | Aligned tests with capabilities in the accessed Vivideo build.                                    |
| v3      | 2026-07-26 | Clarified AD-01 product facts and packshot invariants; made I2V-01 motion and preservation requirements observable and non-conflicting | Final asset-to-prompt review before testing.                                                      |
| v4      | 2026-07-26 | Selected the pinwheel image as I2V-01 v3 and added an exact in-shot mug-text change from "PAUSE" to "PLAY"                             | Tests controlled object motion and localized text transformation without an overly complex scene. |


