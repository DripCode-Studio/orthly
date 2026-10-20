---
name: french-learning-platform
description: "Use when building, extending, reviewing, or importing content for Orthly, the static French-learning and TFLM preparation platform. Covers Next.js UI, French course content, JSON schemas, localStorage progress, flashcards, quizzes, and exam simulations."
argument-hint: "Describe the learning feature, content import, or exam workflow to implement"
user-invocable: true
---

# Orthly French-learning platform

## Product constraints

- Build a focused French-learning product for UQAR course notes and TFLM preparation.
- Keep the first version backend-free: static JSON in `public/data/` and progress in browser `localStorage`.
- Keep lesson content, question banks, flashcards, and exam blueprints separate.
- Treat source course material as authoritative. Never invent a rule, answer key, or citation.
- Preserve `fr-CA`, accents, French punctuation, and accessible labels.

## Architecture

- `app/`: Next.js App Router routes and global styling.
- `components/`: interactive presentation and client-side learning flows.
- `lib/`: content access, scoring, progress, and recommendation logic.
- `types/`: shared TypeScript contracts.
- `public/data/chapters/`: extracted lesson material.
- `public/data/questions/`: reusable tagged question banks.
- `public/data/flashcards/`: spaced-review cards.
- `public/data/exams/`: TFLM, UQAR, and optional TCF blueprints.
- `docs/`: product, architecture, content, progress, exam, and design decisions.

## Content workflow

1. Extract one source document faithfully, retaining source pages and review issues.
2. Validate the chapter JSON before adding questions.
3. Add questions in a separate bank with one unambiguous answer and an explanation.
4. Tag every item with chapter, topic, difficulty, and source reference.
5. Use the same bank for practice, revision recommendations, and exam assembly.

## UI and interaction rules

- Use the Orthly visual language: rounded cards, deep navy text, green learning actions, blue information, purple milestones, orange streaks.
- Keep the learning path browseable; do not lock the entire course behind linear progression.
- Provide useful empty states and make every visible action functional.
- Explain quiz corrections after practice; hide answer feedback until submission in timed exams.
- Respect reduced motion and keyboard focus. Use icons consistently instead of emoji-only controls.

## Change checklist

1. Read the relevant document in `docs/` before changing the related surface.
2. Update types and data contracts before UI consumers.
3. Keep localStorage reads guarded for server rendering and handle malformed stored data safely.
4. Run `npm run build` after TypeScript or route changes.
5. Update the directly related architecture document when behavior or data flow changes.
