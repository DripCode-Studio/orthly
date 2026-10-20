# Progress architecture

## Local state

The MVP stores a small versioned-compatible object under `orthly-progress`:

```ts
{
  completedLessons: string[],
  xp: number,
  streak: number,
  lastActivityDate?: string
}
```

All reads are guarded for server rendering and malformed JSON. The storage adapter is isolated in `lib/storage.ts` so export/import or a remote adapter can be added later.

## Progress rules

- Completing a lesson records its stable lesson ID and awards XP once.
- A streak is updated from activity dates, not from page visits.
- Chapter completion is derived from completed lesson IDs and current content.
- Review recommendations should be derived from incorrect attempts, due flashcards, and weak topics.

## User trust

The UI must explain that progress is local to this browser. A future release should add JSON export/import before adding account synchronization.
