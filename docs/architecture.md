# Product architecture

## Principle

Orthly separates stable educational content from ephemeral learner state. This keeps content reviewable in Git and lets the first release work without accounts, APIs, or a database.

```text
public/data (content JSON)
        ↓
lib/content + typed loaders
        ↓
components (learning, practice, exams)
        ↓
browser localStorage (learner state)
```

## Application layers

### Presentation

The Next.js App Router provides the page shell. Client components own interactions such as selecting answers, completing lessons, and reading or writing progress. Components should not embed long course explanations.

### Domain logic

`lib/` owns progress serialization, lesson selection, scoring, exam assembly, and recommendation rules. This logic must be deterministic and testable without a browser.

### Content

Content is static and versioned. A manifest identifies chapters and future question, flashcard, and exam collections. Each collection can be reviewed independently of the UI.

## Runtime boundaries

- Server-safe: metadata, static route shells, content types, and build-time content.
- Browser-only: `localStorage`, streak updates, quiz attempts, and interactive timers.
- Future backend boundary: user identity and synchronization can replace the storage adapter without changing content schemas or UI contracts.
