# Product architecture

## Principle

Orthly separates stable educational content from ephemeral learner state. This keeps content reviewable in Git and lets the first release work without accounts, APIs, or a database.

```text
public/data (content JSON, read-only at runtime)
        ↓
lib/content-service + typed loaders
        ↓
components (learning, practice, exams)
        ↓
lib/storage → browser localStorage (learner state)
```

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript, `strict` |
| UI | React 19 client components + plain CSS (`app/globals.css`) |
| Content | Versioned JSON under `public/data/` |
| Learner state | `localStorage` via a single adapter |
| Validation | `scripts/validate-content.ts` |

> **Note on the original briefs.** Earlier drafts referenced React + Vite. The repository is Next.js, so Next.js App Router is the source of truth here; the Vite references are superseded. Server components handle metadata and static shells; interactive learning flows are `"use client"`.

## Application layers

### Presentation — `app/`, `components/`

The App Router provides the page shell. Client components own interactions: answering a question, completing a lesson, reading progress, and running timers. Components must not embed long course explanations — those live in JSON and are rendered, not hardcoded.

### Domain logic — `lib/`

Content access, progress serialization, scoring, exam assembly, and recommendation rules. This logic is deterministic and testable without a browser. `lib/storage.ts` is the only module permitted to touch `localStorage`.

### Content — `public/data/`

Static and versioned. `manifest.json` is the entry point; every other collection is discovered through it. Adding a chapter, bank, deck, or exam is a manifest edit plus a file — never a code change.

### Contracts — `types/`

Shared TypeScript models grouped by layer: `extraction`, `lesson`, `question`, `flashcard`, `exam`, `progress`, `session`, `manifest`. Import from `@/types`.

### Tooling — `scripts/`

Build-time validation. `npm run validate:content` gates a deploy on structural correctness.

## Runtime boundaries

- **Server-safe:** metadata, static route shells, content types, build-time validation.
- **Browser-only:** `localStorage`, streaks, quiz attempts, flashcards scheduling, countdown timers.
- **Future backend boundary:** user identity and synchronization can replace the storage adapter without changing content schemas or UI contracts.

## Error handling

Content loading is defensive. A missing file, invalid JSON, or unexpected shape produces a typed `ContentError` (`lib/content-service.ts`) that the UI renders as a friendly message rather than crashing the route. Progress reads tolerate malformed and pre-versioned data, migrating the legacy `orthly-progress` key transparently.

## Related documents

- [product-vision.md](./product-vision.md) — what the product is and is not.
- [data-contracts.md](./data-contracts.md) — collection schemas and ID conventions.
- [content-pipeline.md](./content-pipeline.md) — PDF → validated content.
- [progress-architecture.md](./progress-architecture.md) — localStorage contract.
- [exam-architecture.md](./exam-architecture.md) — timed simulation behavior.
- [design-system.md](./design-system.md) — visual language and accessibility.
- [testing.md](./testing.md) — verification strategy.
- [roadmap.md](./roadmap.md) — delivery order.
