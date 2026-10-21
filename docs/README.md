# Orthly documentation

Orthly is a French-learning workspace for UQAR course material and TFLM preparation. The MVP is intentionally static: lessons and exercises are versioned JSON files, while personal progress is stored in the browser. There is no backend, database, or authentication.

The interface is built with Next.js App Router, Tailwind CSS v4, shadcn/ui components, and lucide icons.

## Start here

- [product-vision.md](./product-vision.md) — what Orthly is, its principles, and its boundaries.
- [architecture.md](./architecture.md) — stack, layers, runtime boundaries, error handling.
- [roadmap.md](./roadmap.md) — delivery order and immediate next steps.

## Content

- [content-architecture.md](./content-architecture.md) — collections, the two-layer split, and the manifest.
- [data-contracts.md](./data-contracts.md) — field-by-field schemas, ID conventions, validation rules.
- [content-pipeline.md](./content-pipeline.md) — the staged PDF → validated-content workflow.
- [authoring-guide.md](./authoring-guide.md) — how to add notes, quizzes, exams, and flashcards, and how to extend them.

## Learning behavior

- [progress-architecture.md](./progress-architecture.md) — localStorage contract, migration, export/import.
- [exam-architecture.md](./exam-architecture.md) — blueprints, selection, and timed simulation behavior.

## Engineering

- [design-system.md](./design-system.md) — tokens, components, layout, accessibility.
- [testing.md](./testing.md) — automated checks and manual review strategy.

## Repository map

| Path | Responsibility |
| --- | --- |
| `app/` | Next.js App Router routes and global styling |
| `components/ui/` | shadcn/ui primitives (generated — extend via the CLI) |
| `components/` | Product compositions such as the app shell and dashboard |
| `lib/` | Content access, storage, scoring, and recommendation logic |
| `types/` | Shared TypeScript contracts, one file per layer |
| `public/data/` | Versioned, read-only content JSON |
| `scripts/` | Build-time content validation |
