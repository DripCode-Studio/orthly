---
name: french-learning-platform
description: "Use when building, extending, reviewing, or importing content for Orthly, the static French-learning and TFLM preparation platform. Covers Next.js App Router, Tailwind v4 + shadcn/ui, lucide icons, the two-layer content pipeline, JSON data contracts, localStorage progress, flashcards, quizzes, and exam simulations."
argument-hint: "Describe the learning feature, content import, or exam workflow to implement"
user-invocable: true
---

# Orthly French-learning platform

## Product constraints

- Build a focused French-learning product for UQAR course notes and TFLM preparation.
- Keep the first version backend-free: static JSON in `public/data/` and progress in browser `localStorage`.
- Keep lesson content, question banks, flashcards, and exam blueprints separate.
- Treat source course material as authoritative. Never invent a rule, answer key, or citation.
- Never present fabricated statistics, placeholder content as official exam material, or an invented passing threshold.
- Preserve `fr-CA`, accents, French punctuation, and accessible labels.

## Stack

- Next.js 15 App Router, TypeScript `strict`, React 19.
- Tailwind CSS v4 (`@import "tailwindcss"` in `app/globals.css`; PostCSS via `postcss.config.mjs`).
- **shadcn/ui on `radix-ui`. Do not build components from scratch** — use `components/ui/`, and add missing pieces with `npx shadcn@latest add <name>`.
- Icons from `lucide-react` only. Never use emoji as interface icons.
- Toasts via `sonner`, charts via the shadcn `chart` component (recharts).

## Architecture

- `app/`: Next.js App Router routes and global styling.
- `components/ui/`: shadcn primitives (generated; extend via the CLI).
- `components/`: product compositions (`app-shell.tsx`, `dashboard.tsx`).
- `lib/`: content access, storage, scoring, and recommendation logic.
- `types/`: shared contracts, one file per layer, re-exported from `types/index.ts`.
- `public/data/extraction/`: faithful source representation (intermediate, not learner-facing).
- `public/data/chapters/`: pedagogical lesson content the learner reads.
- `public/data/questions/`: reusable tagged question banks.
- `public/data/flashcards/`: spaced-review decks.
- `public/data/exams/`: TFLM, UQAR, and optional TCF blueprints.
- `scripts/validate-content.ts`: build-time structural validation.
- `docs/`: the authoritative design and workflow documents.

## Two-layer content model

Chapter content exists twice, on purpose:

1. **Extraction** (`types/extraction.ts`) — faithful blocks with source pages and a review list. Never summarize away a table, exception, or exercise.
2. **Lesson** (`types/lesson.ts`) — pedagogical concepts, rules, examples, and mistakes. Examples carry `source.kind: "source" | "added"`; never mislabel an authored example as a quotation.

Pipeline: `PDF → extraction → lesson → questions`. Read `docs/content-pipeline.md` before importing content and `docs/authoring-guide.md` before adding files.

## Content workflow

1. Extract one source document faithfully into `public/data/extraction/`.
2. Convert it into a lesson in `public/data/chapters/`.
3. Add questions in a separate bank with one unambiguous answer and an explanation.
4. Tag every item with chapter, topic, difficulty, and source reference.
5. Set AI-assisted items to `reviewStatus: "needs_review"`; promote only after human review.
6. Register the collection in `public/data/manifest.json` and run `npm run validate:content`.
7. Use the same bank for practice, revision recommendations, and exam assembly.

## Data rules

- IDs are permanent join keys between content and progress. Renaming a published ID erases a learner's history for that item.
- An exam blueprint stores counts per category, never copies of questions. Its section counts must sum to `questionCount`.
- If a category lacks enough approved questions, report the shortfall and offer a shorter practice run. Never repeat questions silently or reshape the blueprint.
- Keep every schema array present, using `[]` where empty; use `null` only where the schema allows it.

## UI and interaction rules

- Compose from shadcn primitives: `button`, `card`, `badge`, `progress`, `tabs`, `radio-group`, `checkbox`, `separator`, `avatar`, `dropdown-menu`, `sheet`, `dialog`, `alert-dialog`, `alert`, `sidebar`, `breadcrumb`, `skeleton`, `toggle-group`, `tooltip`, `scroll-area`, `input`, `label`, `select`, `textarea`, `chart`, `sonner`.
- Use the Orthly tokens from `app/globals.css`: green learning actions, deep navy ink, blue information, purple milestones, orange streaks, red errors. Chart tokens reuse the same palette.
- Keep the learning path browseable; do not lock the whole course behind linear progression.
- Provide useful empty states and make every visible action functional.
- Explain corrections after practice; hide all correctness signals until submission in timed exams.
- Respect reduced motion (handled globally) and keyboard focus. Never signal state by colour alone.
- Pages render inside `components/app-shell.tsx`; do not rebuild navigation.

## Change checklist

1. Read the relevant document in `docs/` before changing the related surface.
2. Update `types/` before UI consumers.
3. Keep localStorage access inside `lib/storage.ts`; guard reads for server rendering and tolerate malformed data.
4. After adding content, run `npm run validate:content`.
5. Run `npm run build` after TypeScript, Tailwind, or route changes.
6. Update the related document in `docs/` when behavior or data flow changes.
