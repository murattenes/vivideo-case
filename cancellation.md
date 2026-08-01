# Cancellation comparison

Observed on 2026-08-01. The full screen recordings are stored in `cancellation/`. Timestamps below are approximate navigation aids, not frame-accurate citations.

## Summary

| Product | Path and questions | Retention mechanism | Access after cancellation | Outcome | Relative friction |
| --- | --- | --- | --- | --- | --- |
| HeyGen | Plan and Billing → manage billing. Cancellation opened a chat that asked why the user was leaving, mentioned the freeze option, and asked what product capability was missing. | One-month plan freeze was available. | Paid access and remaining credits continue through the current billing period. | Clear cancellation confirmation shown. | High: conversational flow and several exchanges before confirmation. |
| Pollo AI | Billing page → Cancel Subscription. One reason-selection form was followed by confirmation. | No retention offer was observed. | Remaining credits continue through the current billing period. | Cancellation completed directly. | Low: shortest and most direct tested flow. |
| Runway | Plans & Billing → Cancel plan. The flow asked for a reason and additional feedback, then continued to a separate billing page. | One free month, including another credit refresh, was offered. | Paid access and remaining credits continue through the current billing period. | Cancellation completed after the external billing step. | Medium-high: multiple screens and a strong retention offer. |
| InVideo AI | Subscriptions → Cancel. The flow asked why the user was leaving, what should improve, and which tool would be used next. | No monetary retention offer was observed. | Paid access and remaining credits continue through the current billing period. | User reported completion after submitting the survey. | Highest survey friction: several required questions and validation rejected meaningless text. |
| Revid.ai | Account settings → manage subscription → Stripe billing portal. The flow asked for one cancellation reason. | 20% off for one month was offered. | Growth plan and remaining credits continue through the current billing period. | Stripe showed the scheduled end date after cancellation. | Medium: external billing portal plus one retention screen. |
| Vivideo | Account cancellation showed the benefits that would be lost, asked for a reason, and continued through several dialogs. | 50 bonus credits were offered to keep the subscription. | Not established in the recorded flow. | The self-service flow ended by instructing the user to contact support by email; no self-service confirmation was shown. | Highest outcome friction: cancellation could not be completed entirely in product. |

## Recording index

### HeyGen

Recording: `cancellation/heygen.mp4`

- Around `00:05–00:10`: Plan and Billing page; Creator monthly plan and renewal date visible.
- Around `00:15–01:00`: cancellation handled through an in-product chat.
- Around `01:00`: chat confirms that access and credits remain until the end of the billing period.
- Around `01:10`: explicit cancellation confirmation.
- Additional observation: a one-month freeze option was available. The tested plan had enough credits for approximately 11 generated videos with credits remaining.

### Pollo AI

Recording: `cancellation/polloai.mp4`

- Around `00:05`: Cancel Subscription link at the bottom of the billing page.
- Around `00:10`: single cancellation-reason form.
- Around `00:15`: confirmation dialog.
- Around `00:20–00:25`: billing page after cancellation.
- Additional observation: the tested credit allowance supported roughly five videos when using Pollo's lower-cost models and felt restrictive relative to the other plans.

### Runway

Recording: `cancellation/runway.mp4`

- Around `00:05–00:15`: Plans & Billing and cancellation-reason selection.
- Around `00:20`: additional feedback question.
- Around `00:25–00:35`: one-free-month retention offer.
- Around `00:35–00:45`: separate billing page and final cancellation.
- Additional observation: credits remained after five benchmark videos, helped by credits earned through quests.

### InVideo AI

Recording: `cancellation/invideo.mp4`

- Around `00:05`: Subscriptions page states that the plan remains active through the billing period.
- Around `00:10–00:50`: multi-step survey covering the main reason, desired improvement, and the next tool the user expects to use.
- Around `00:30`: validation rejects meaningless free-text input.
- Around `00:55`: feedback submission.
- Around `01:00–01:05`: return to the subscriptions page.

### Revid.ai

Recording: `cancellation/revidai.mp4`

- Around `00:05–00:15`: account settings and Manage Subscription.
- Around `00:20`: Stripe billing portal shows Growth at $39/month.
- Around `00:25`: one cancellation-reason selector.
- Around `00:30`: 20% discount for one month offered as retention.
- Around `00:45`: Stripe shows the service scheduled to end at the close of the billing period.
- Additional observation: this was the most expensive tested subscription, but its credit allowance felt generous.

### Vivideo

Recording: `cancellation/vivideo.mp4`

- Around `00:05–00:15`: loss-framing and cancellation-reason dialogs.
- Around `00:15–00:20`: additional help/feedback step.
- Around `00:20–00:25`: offer of 50 bonus credits.
- Around `00:25–00:40`: instruction to contact the team by email instead of a final self-service cancellation action.

## Presentation guidance

Use one comparison table for all six products. Show at most two cancellation screenshots:

1. Runway's one-free-month retention offer as the clearest retention mechanism.
2. Vivideo's support-contact ending as the clearest cancellation-friction finding.

The full recordings are evidence, not presentation content. Extract only cropped, redacted frames for the website.

## Privacy warning

Some recordings expose private billing information, including a name, email address, card last four digits, invoice details, or renewal dates. Do not upload the raw cancellation videos to the public website or repository. Keep them in private evidence storage and publish only cropped or redacted screenshots.

## Completion status

The user reported that the Vivideo support follow-up, renewal-status checks, and spend-report updates were completed. The private confirmations should remain outside the public website and repository.
