# Progress architecture

## Local state

Learner state lives in `localStorage` under namespaced, versioned keys. The contracts are in `types/progress.ts`; the only module permitted to touch `localStorage` is `lib/storage.ts`.

| Key | Store | Contents |
| --- | --- | --- |
| `orthly:settings:v1` | `SettingsState` | Theme, daily goal, sound, animations, exam target and date |
| `orthly:progress:v1` | `ProgressState` | Completed lessons, XP, streak, per-topic mastery |
| `orthly:attempts:v1` | `AttemptStore` | Quiz and simulation results with category breakdowns |
| `orthly:flashcards:v1` | `FlashcardStore` | Review schedule, ease, interval, next due date |
| `orthly:bookmarks:v1` | `BookmarkStore` | Saved lessons, questions, topics |
| `orthly:activity:v1` | `ActivityState` | Per-day lesson, question, and minute counters |

Only user-specific data is stored. Questions, answers, and explanations already exist in `public/data/` and are never duplicated into storage.

## Progress rules

- Completing a lesson records its stable lesson ID and awards XP once.
- A streak is updated from activity dates, not from page visits.
- Chapter completion is derived from completed lesson IDs and current content.
- `topicMastery` is an estimated indicator (0–100) computed from recent attempts — never presented as a validated language score.
- Review recommendations derive from incorrect attempts, due flashcards, and weak topics.

## Storage safety

`lib/storage.ts` handles the failure modes a browser app must tolerate:

- **Server rendering** — reads return an empty state when `window` is undefined.
- **Malformed JSON** — a parse failure falls back to a clean state instead of throwing.
- **Pre-versioned data** — the legacy `orthly-progress` key is migrated once, then removed.
- **Unavailable or full storage** — `saveProgress` returns `false` so callers can warn without crashing.
- **Unknown fields** — normalization drops anything that does not match the current schema.

## Versioning and migration

Each store carries its own `version`. When a shape changes, bump the version and add a migration path in the storage adapter rather than changing components. Because progress is keyed by stable content IDs, content can evolve without corrupting a learner's history.

## Export and import

A full export produces a `ProgressExport` object combining every store. Imports are validated before application: a malformed or foreign file must be rejected with a clear message and must never overwrite existing progress partially. This is the recommended safeguard before account synchronization is considered.

## User trust

The UI must state plainly that progress is local to this browser and is not synchronized across devices. Browser storage is not a durable backup and should not be presented as one.
