# Roadmap

## Vertical slices

1. **Foundation** — Next.js shell, Tailwind v4 + shadcn/ui design system, shared type contracts, content service, storage adapter, and `manifest.json`. *Largely complete.*
2. **MVP shell** — dashboard and learning path rendered from shadcn primitives with local lesson completion. *In progress: dashboard rebuilt; learning path still uses hardcoded navigation data.*
3. **Lesson reader** — render lesson JSON (paragraph, rule, example, table, source references) instead of the hardcoded `lib/content.ts` chapter list.
4. **Practice engine** — consume an independent tagged question bank, one-question flow, explanations, and attempt history.
5. **Flashcards** — due queue, confidence rating, and local review scheduling.
6. **Exam simulations** — TFLM blueprint, timer, submission report, and category breakdown.
7. **Data portability** — progress export/import and explicit local-storage recovery guidance.
8. **Analytics** — chart chapter completion, topic mastery, and recurring mistakes once real data exists.

## Immediate next steps

- Convert `public/data/extraction/chapter-01.json` into a lesson file at `public/data/chapters/chapter-01.json`, then register and validate it.
- Replace the hardcoded `lib/content.ts` chapter array with data loaded through `lib/content-service.ts`.
- Author the first real question bank for Chapter 1 and review every answer key by hand.

## Content sequencing

Extract and validate **one** chapter end to end before producing all eight. Once the schema and pipeline are proven, repeat the identical process for Chapters 2–8. Content quality is validated before adding more gamification or exam modes.

## Deferred

- Account synchronization and a backend (replace the storage adapter, keep the content schemas unchanged).
- Component and end-to-end test runner.
- Audio, writing, and speaking interfaces for TCF variants.
