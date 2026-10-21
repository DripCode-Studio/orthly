# Content architecture

## Source of truth

The original UQAR notes are the authority. Extraction is faithful and keeps page references plus an explicit review list. A source issue must never be silently corrected during import. See [content-pipeline.md](./content-pipeline.md) for the staged process and [authoring-guide.md](./authoring-guide.md) for practical steps.

## Two layers

Chapter content exists as two separate files, because fidelity and pedagogy are different jobs:

| Layer | Folder | Contract | Audience |
| --- | --- | --- | --- |
| Extraction | `public/data/extraction/` | `types/extraction.ts` | Reviewer |
| Lesson | `public/data/chapters/` | `types/lesson.ts` | Learner |

The extraction file is retained even after the lesson exists, so any rule, exception, or table can be traced back to its source page.

## Collections

```text
public/data/
├── manifest.json            ← discovery entry point
├── glossary.json
├── extraction/chapter-01.json …      faithful source (intermediate)
├── chapters/chapter-01.json …        pedagogical lessons (learner-facing)
├── questions/chapter-01.json …       reusable, tagged question banks
├── flashcards/chapter-01.json …      spaced-review decks
└── exams/
    ├── tflm.json
    ├── uqar.json
    └── tcf/tcf-common.json …
```

Lessons contain explanations, rules, examples, exceptions, and summaries. Question banks are separate so the same question can appear in practice, revision, and a simulation without duplicating lesson content.

## Required metadata

Every question and flashcard includes `id`, `chapterId`/`topicIds`, `difficulty`, `sourceRef`/`sourceReferences`, an explanation, and an `origin`. Exam blueprints select by category and difficulty rather than storing copied questions.

## Manifest

`manifest.json` is the single index the content service reads first. A collection that is not registered is invisible; an entry pointing at a missing file is a validator error. Adding content is a manifest edit plus a file — never a code change.

## Import pipeline

1. Extract the complete source document into `extraction/`.
2. Normalize it into the lesson schema in `chapters/`.
3. Validate JSON, source coverage, and unresolved review items.
4. Create questions from validated material in `questions/`.
5. Check answer keys, ambiguity, duplicates, and coverage.
6. Publish the collection through the manifest.

Run `npm run validate:content` between steps 3 and 6 to catch structural problems before they reach the app.
