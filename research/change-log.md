# Research-plan change log

## 2026-08-01 - Finalize Runway as the fifth external deep dive

- Added Runway as the fifth external competitor because all five benchmark workflows and supporting evidence were completed.
- Final deep dives are Pollo AI, InVideo AI, Revid.ai, HeyGen, and Runway, with Vivideo as the baseline.

## 2026-07-26 - Simplify for screen-recording-first research

- Removed the unused specialist language test and `data/specialist-tests.csv`.
- Made full screen recordings and timestamped raw notes the detailed source of truth.
- Reduced every supporting CSV to the fields needed for comparison, evidence lookup, and presentation tables.
- Kept only high-value funnel moments instead of logging every UI step.
- Preserved the two Vivideo screenshots as `VIVI-GEN-001` and `VIVI-GEN-002`.

## 2026-07-26 - Validate shared assets and clarify benchmark prompts

### Changes made

- Created and verified the canonical AD-01 and I2V-01 source images at 936 × 1664 px (9:16).
- Recorded dimensions and SHA-256 hashes in `research/assets/README.md`.
- Clarified AD-01's three product facts and made the supplied packshot the canonical packaging reference.
- Clarified the permitted I2V-01 motion and the source details that must remain invariant during the push-in.
- Advanced the prompt set from v2 to v3 before testing.
- Selected the simpler pinwheel-and-mug image as I2V-01 asset v3.
- Advanced the prompt set to v4 and added a controlled mug-text transformation from "PAUSE" to "PLAY".
- Removed the rejected I2V-01 v1 and v2 image alternatives after confirming v3.

### Methodological principle

The shared inputs should expose meaningful product failures while remaining
simple enough that differences reflect platform behavior rather than ambiguous
instructions.

## 2026-07-25 - Align scope with tested Vivideo build

### First-hand observation

Screenshots from the accessed Vivideo MAX-plan build show:

- Video Agent and Manual entry points
- Text-to-video
- Image-to-video
- First/last-frame generation
- Multiple-image generation
- Model selection
- Aspect ratio, duration, quality, and advanced settings
- Avatar, voice, and brand options in Video Agent

The tested workflow did not provide an existing-video upload/editor or long-video clipping flow.

Evidence:

- `VIVI-GEN-001`
- `VIVI-GEN-002`

### Changes made

- Reduced the deep-dive set to five competitors plus the Vivideo baseline.
- Added Pollo AI as the multi-model manual-generation comparison.
- Kept InVideo AI, Revid.ai, and HeyGen; the final fifth external deep dive is Runway.
- Moved VEED and OpusClip to landscape-only status.
- Added Zebracat as a landscape-only automation alternative.
- Replaced the long-video clipping benchmark with a manual text-to-video benchmark.
- Added a capability matrix so editing gaps are reported separately from output-quality scores.

### Revised deep-dive set

1. Vivideo baseline
2. Pollo AI
3. InVideo AI
4. Revid.ai
5. HeyGen
6. Runway

### Methodological principle

Compare like with like:

- Agent output against agent output
- Manual generation against manual generation
- Avatar workflow against avatar workflow

Do not score a product as if it failed a workflow it does not claim or expose in the tested build. Record unsupported and missing capabilities explicitly.
