# Testing and verification

Orthly has two things to verify: that the code works, and that the content is correct. They need different strategies — automated checks can prove the JSON is well-formed, but only a human can confirm a grammar explanation is right.

## Automated checks

Run these before every commit:

| Command | Verifies |
| --- | --- |
| `npm run typecheck` | TypeScript compiles under `strict` |
| `npm run validate:content` | JSON structure, IDs, references, answer keys, exam sums |
| `npm run build` | The Next.js production build succeeds |

`npm run validate:content` exits non-zero on any error, so it can gate a deploy. It is a structural validator, not a grammar checker.

### What the validator covers

- Unique IDs across questions, options, sections, blocks, and concepts.
- `correctOptionIds` entries that resolve to real options.
- `single_choice` with exactly one answer; `multiple_choice` with at least two.
- Non-empty answer explanations.
- Exam section counts summing to `questionCount`.
- Manifest entries pointing at files that exist.
- Example `source.kind` values restricted to `"source"` or `"added"`.
- Warnings (not errors) for unreviewed questions, unsupported question types, and unverified exam profiles.

## Manual content review

Structural validity does not imply correctness. A question can parse perfectly and still have the wrong answer. The human pass must confirm:

- Every explanation is linguistically accurate and supports the keyed answer.
- No second option is also defensibly correct.
- French accents, agreement, and punctuation are correct.
- A question is not a near-duplicate of another testing the same skill.
- Source references actually support the concept tested.
- `reviewStatus` stays `needs_review` until this pass is complete.

## Interaction checks

For each learning flow, verify by hand:

- Progress survives a page refresh and a browser restart.
- Clearing storage yields a clean state rather than an error.
- A malformed content file produces a friendly message, not a crash.
- In assessment mode, no correctness signal appears before submission.
- An exam with insufficient bank coverage reports the shortfall instead of starting.
- Flashcard review states persist across reloads.
- Keyboard navigation reaches every control, with visible focus.

## Responsive and accessible checks

- Layouts hold at mobile, tablet, and desktop widths without horizontal scrolling.
- Touch targets are comfortable on small screens.
- Color is never the only indicator of state — pair it with an icon or text.
- `prefers-reduced-motion` suppresses the playful animations.
- French content is rendered under `lang="fr-CA"`.

## Not yet automated

There is no component or end-to-end test runner configured. When one is added, it should target the deterministic domain logic first: scoring, exam assembly, storage migration, and recommendation rules — all of which are designed to run without a browser.
