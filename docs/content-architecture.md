# Content architecture

## Source of truth

The original UQAR notes are the authority. Extraction is faithful and keeps page references plus an explicit review list. A source issue must never be silently corrected during import.

## Collections

```text
public/data/
├── manifest.json
├── chapters/chapter-01.json ... chapter-08.json
├── questions/chapter-01.json ...
├── flashcards/chapter-01.json ...
└── exams/tflm.json, uqar.json, tcf/*.json
```

Lessons contain explanations, rules, examples, exceptions, and summaries. Question banks are separate so the same question can appear in practice, revision, and a simulation without duplicating lesson content.

## Required metadata

Every question and flashcard should include `id`, `chapterId`, `topicIds`, `difficulty`, `sourceRef`, and an explanation. Exam blueprints select by topic and difficulty rather than storing copied questions.

## Import pipeline

1. Extract the complete source document.
2. Normalize it into the chapter schema.
3. Validate JSON, source coverage, and unresolved review items.
4. Create questions from validated material.
5. Check answer keys, ambiguity, duplicates, and coverage.
6. Publish the collection through the manifest.
