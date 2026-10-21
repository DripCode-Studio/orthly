# Authoring guide

How to add content to Orthly. Every collection is JSON under `public/data/`, discovered through `manifest.json`. Adding content is a data change, never a code change — but each collection has rules, and `npm run validate:content` enforces the structural ones.

Before authoring anything, read [data-contracts.md](./data-contracts.md) for the field-by-field schemas and [content-pipeline.md](./content-pipeline.md) for the staged workflow. This guide is the practical "where do I put it and what do I edit" companion.

## The general recipe

Every addition follows the same four steps:

1. **Create the JSON file** in the right folder with the right `schemaVersion`.
2. **Register it in `manifest.json`** so the app can discover it.
3. **Run `npm run validate:content`** and fix any errors.
4. **Run `npm run build`** to confirm the app still compiles.

A file that exists but is not in the manifest is invisible to the app. A manifest entry that points at a missing file is a validator error.

---

## Adding notes (course content)

"Notes" are chapter lesson content. They arrive through the two-layer pipeline, so adding a chapter means producing both layers described in [content-pipeline.md](./content-pipeline.md).

### Layer 1 — extraction file

Produce `public/data/extraction/chapter-NN.json` conforming to `types/extraction.ts`. This is the faithful, auditable representation. Keep source page numbers, tables, exceptions, and exercises. Record anything unresolved in `sourceCoverage.itemsRequiringReview`.

The extraction file is **not** registered in the manifest; it is an intermediate artifact retained for review.

### Layer 2 — lesson file

Produce `public/data/chapters/chapter-NN.json` conforming to `types/lesson.ts`. This is what the learner reads.

Minimal shape:

```json
{
  "schemaVersion": "1.0.0",
  "id": "chapter-09",
  "number": 9,
  "slug": "nouveau-chapitre",
  "title": "Titre du chapitre",
  "description": "Introduction courte.",
  "estimatedMinutes": 20,
  "learningObjectives": [
    { "id": "chapter-09-objective-01", "text": "Objectif mesurable." }
  ],
  "sections": [
    {
      "id": "chapter-09-section-01",
      "title": "Titre de section",
      "order": 1,
      "introduction": "Pourquoi cette notion compte.",
      "concepts": [
        {
          "id": "chapter-09-concept-01",
          "title": "Titre du concept",
          "explanation": "Explication claire.",
          "definition": "Définition, ou null.",
          "rules": [],
          "steps": [],
          "examples": [],
          "exceptions": [],
          "commonMistakes": [],
          "takeaway": "Résumé court.",
          "sourceReferences": [{ "page": 1, "section": "1.1" }]
        }
      ],
      "summary": [],
      "sourceReferences": []
    }
  ],
  "reviewNotes": []
}
```

Rules that matter:

- Keep every array present, using `[]` rather than omitting fields.
- `definition` is `null` only when the schema allows it, not as a substitute for an empty string.
- Every example marks its origin: `"kind": "source"` for a faithful quotation, `"kind": "added"` for an authored teaching example. Never label an invented example `"source"`.
- IDs are permanent. See the table in [data-contracts.md](./data-contracts.md).

### Register the chapter

In `public/data/manifest.json`, add to `chapters`:

```json
{ "id": "chapter-09", "number": 9, "title": "Titre du chapitre", "content": "chapters/chapter-09.json", "status": "published" }
```

### Adding a section, concept, or exercise to an existing chapter

- **New section:** append to `sections[]` with the next `order` and a new `chapter-NN-section-NN` id.
- **New concept:** append to the containing section's `concepts[]` with a new `chapter-NN-concept-NN` id.
- **New exercise item:** exercises belong in the extraction layer (`ExtractedExercise`). Provide `answerKey` only when the source prints one.

Adding to an existing chapter does **not** require a manifest change; the chapter is already registered.

---

## Adding quizzes

A quiz is a question bank: a separate file from the lesson, reusable across practice, revision, and exams.

### Create the bank

`public/data/questions/chapter-NN.json`, conforming to `types/question.ts`.

```json
{
  "schemaVersion": "1.0.0",
  "chapterId": "chapter-01",
  "questionSetId": "chapter-01-core",
  "title": "Pratique — Chapitre 1",
  "questions": [
    {
      "id": "ch01-q0001",
      "type": "single_choice",
      "prompt": "Dans la phrase suivante, quelle est la classe du mot en évidence?",
      "stimulus": { "text": "J’aimerais fermer la porte.", "highlightedText": "fermer" },
      "options": [
        { "id": "A", "text": "Un nom" },
        { "id": "B", "text": "Un verbe à l’infinitif" },
        { "id": "C", "text": "Un adjectif" },
        { "id": "D", "text": "Un adverbe" }
      ],
      "answer": {
        "correctOptionIds": ["B"],
        "explanation": "« fermer » est un verbe à l’infinitif, employé après le verbe conjugué « aimerais »."
      },
      "difficulty": "beginner",
      "topicIds": ["word-classes", "verb"],
      "sectionIds": ["chapter-01-section-01"],
      "learningObjectiveIds": ["chapter-01-objective-01"],
      "examCategories": ["morphologie"],
      "origin": "source",
      "sourceReferences": [{ "page": 1, "section": "1.1" }],
      "reviewStatus": "needs_review"
    }
  ]
}
```

Rules the validator enforces:

- `single_choice` must have **exactly one** correct option; `multiple_choice` at least two.
- Every `correctOptionIds` entry must match an option `id` in the same question.
- `answer.explanation` is required and must be non-empty.
- IDs are unique within the bank.
- The correct answer must not be revealed in the prompt or option text.
- Only `single_choice` and `multiple_choice` are renderable today. Other declared types (`fill_blank`, `correction`, `identify`, `transformation`, `short_answer`) are accepted by the schema but flagged as a warning until a renderer exists.

Every AI-assisted question starts at `reviewStatus: "needs_review"`. Promote it only after a human verifies the answer and explanation.

### Register the bank

Add to `questionBanks` in `manifest.json`:

```json
{ "id": "chapter-01-core", "chapterId": "chapter-01", "title": "Pratique — Chapitre 1", "content": "questions/chapter-01.json" }
```

### Adding more question sets to one chapter

A chapter can hold several banks — for example a core set and an advanced set. Give each a distinct `questionSetId`, a distinct filename (`questions/chapter-01-advanced.json`), and its own manifest entry. The engine reads them as peers.

---

## Adding an exam

An exam is a blueprint. It stores no questions; it declares how many to draw per category, and the engine selects from the shared banks.

### Create the blueprint

`public/data/exams/<id>.json`, conforming to `types/exam.ts`. The TFLM reference:

```json
{
  "id": "tflm",
  "title": "Simulation TFLM",
  "family": "tflm",
  "description": "65 questions en 90 minutes.",
  "durationSeconds": 5400,
  "questionCount": 65,
  "passingScorePercent": 60,
  "selectionMode": "blueprint",
  "skills": ["reading", "language_structures"],
  "sections": [
    { "categoryId": "orthographe_lexicale", "questionCount": 4 },
    { "categoryId": "orthographe_grammaticale", "questionCount": 24 },
    { "categoryId": "morphologie", "questionCount": 5 },
    { "categoryId": "syntaxe", "questionCount": 13 },
    { "categoryId": "vocabulaire", "questionCount": 19 }
  ],
  "settings": {
    "allowReview": true,
    "showFeedbackDuringExam": false,
    "showAnswersBeforeSubmission": false,
    "allowPause": false
  },
  "verified": false,
  "notes": ["À valider contre le format officiel."]
}
```

Rules the validator enforces:

- The sum of `sections[].questionCount` **must equal** `questionCount`.
- `passingScorePercent` is `null` when no threshold is published. Never invent one.
- `verified: false` means the profile has not been checked against an official format; the validator warns.

Operational rule: a full simulation only becomes available once each category has enough **approved** questions to fill its `questionCount`. Until then the engine must report the shortfall and offer a shorter practice run — it must never silently repeat questions or reshape the exam.

### Register the exam

Add to `exams` in `manifest.json`:

```json
{ "id": "tflm", "title": "Simulation TFLM", "content": "exams/tflm.json", "verified": false }
```

### Adding a new exam (for example TCF Canada)

1. Create `public/data/exams/tcf/tcf-canada.json` with `family: "tcf"` and `variant: "canada"`.
2. Configure its own `skills` and `sections`. Do not reuse the TFLM blueprint — the formats differ.
3. Register it in the manifest.
4. Keep `verified: false` until the format is confirmed against the official source.

Nested exam files are allowed; the validator walks `exams/` recursively.

---

## Adding flashcards

`public/data/flashcards/chapter-NN.json`, conforming to `types/flashcard.ts`.

```json
{
  "schemaVersion": "1.0.0",
  "chapterId": "chapter-04",
  "deckId": "chapter-04-core",
  "title": "Cartes éclair — Chapitre 4",
  "cards": [
    {
      "id": "fc-ch04-0001",
      "chapterId": "chapter-04",
      "topicIds": ["accord-verbe-sujet"],
      "type": "rule",
      "front": "Avec quoi le verbe s’accorde-t-il?",
      "back": "Avec son sujet, en personne et en nombre.",
      "example": "La classe travaille. Les classes travaillent.",
      "tags": ["accord", "grammaire"],
      "difficulty": "beginner",
      "origin": "source",
      "sourceRef": { "page": 12 }
    }
  ]
}
```

The card is immutable content. Review scheduling (interval, ease, due date) is stored in `localStorage`, so replacing a deck never discards a learner's history. Register the deck in `flashcardDecks`.

---

## Adding topics and exam categories

- **Topics** (`topicIds`) are free-form slugs such as `accord-verbe-sujet`. They connect questions, flashcards, sections, and progress mastery records. Introduce a topic by using it consistently across those collections; a typo silently creates a second topic.
- **Exam categories** (`examCategories`) are a fixed, validated set: `orthographe_lexicale`, `orthographe_grammaticale`, `morphologie`, `syntaxe`, `vocabulaire`, `ponctuation`, `coherence_textuelle`. To add one, extend the `ExamCategoryId` union in `types/common.ts` and reference it in at least one exam blueprint.

---

## Checklists

**Adding notes:** extraction file → lesson file → manifest chapter entry → validate → build.

**Adding a quiz:** bank file → manifest `questionBanks` entry → validate → review each answer key → build.

**Adding an exam:** blueprint file → confirm section sum equals `questionCount` → manifest `exams` entry → validate → build. Confirm the bank coverage before enabling a full run.

**Adding flashcards:** deck file → manifest `flashcardDecks` entry → validate → build.

The validator catches structural mistakes. It does not check whether French explanations are linguistically correct — that remains a human review step, every time.
