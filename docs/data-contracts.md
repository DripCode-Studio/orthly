# Data contracts

Every collection Orthly reads is versioned JSON under `public/data/`, validated against the TypeScript contracts in `types/`. This document is the human-readable companion to those types; when the two disagree, `types/` wins and this file is corrected.

## Two content layers

Chapter content exists in two distinct forms. They are not interchangeable, and conflating them is the most common source of lost source material.

| Layer | File | Purpose | Reader |
| --- | --- | --- | --- |
| **Extraction** | `types/extraction.ts` | Faithful representation of the source PDF. Auditable. | Content reviewer |
| **Lesson** | `types/lesson.ts` | Pedagogical lesson with explanations and examples. | The learner |

The pipeline is one-directional:

```text
PDF  →  ExtractedChapter  →  LessonChapter  →  QuestionBank / FlashcardDeck
        (faithful)           (pedagogical)      (assessment)
```

The extraction layer is retained even after the lesson exists, so a reviewer can always check whether a rule, exception, or table survived the transformation.

## Extraction layer

Produced by the extraction step. Its blocks are deliberately low-level so nothing is lost to summarization.

```ts
type Block =
  | { type: "paragraph" | "definition" | "rule" | "example" | "counterexample"
          | "note" | "warning" | "diagramDescription"; content: string; sourcePage: number }
  | { type: "list"; content: { items: Array<string | ListContent>; ordered?: boolean }; sourcePage: number }
  | { type: "table"; content: { headers: string[]; rows: string[][] }; sourcePage: number }
  | { type: "procedure"; content: { steps: string[] }; sourcePage: number };
```

Rules for extraction:

- Preserve the source order; do not reorganize into a new teaching sequence.
- Keep exercises separate from examples; never confuse the two.
- `answerKey` is populated **only** when the PDF itself prints corrections. Exercises are never solved during extraction.
- `sourceCoverage.unreadableContent` and `itemsRequiringReview` are mandatory escape hatches. An incomplete import must be visible.

## Lesson layer

The learner-facing format. Explanations may be rewritten for clarity but never in a way that changes grammatical meaning.

```ts
type LessonConcept = {
  id: ConceptId;
  title: string;
  explanation: string;
  definition: string | null;
  rules: LessonRule[];
  steps: Array<{ id: string; text: string }>;
  examples: LessonExample[];
  exceptions: string[];
  commonMistakes: CommonMistake[];
  takeaway: string;
  sourceReferences: SourceReference[];
};
```

Every `LessonExample` carries `source.kind`:

- `"source"` — reproduced faithfully from the course material.
- `"added"` — authored for teaching and labelled as such.

An invented example must never be marked `"source"`. `highlight` offsets must fall inside `text` or be left empty; when ranges cannot be verified, leave `highlight: []`.

## Question banks

A question is a self-contained datum reused across every practice surface.

```ts
type Question = {
  id: QuestionId;
  type: QuestionType;
  prompt: string;
  stimulus: { text: string; highlightedText?: string; blankText?: string };
  options: QuestionOption[];
  answer: { correctOptionIds: string[]; explanation: string };
  difficulty: Difficulty;
  topicIds: string[];
  sectionIds: SectionId[];
  learningObjectiveIds: string[];
  examCategories: ExamCategoryId[];
  origin: ContentOrigin;
  sourceReferences: SourceReference[];
  reviewStatus: ReviewStatus;
};
```

Binding rules:

- `single_choice` has **exactly one** correct option; `multiple_choice` has **at least two**.
- `answer.explanation` explains the grammatical reasoning, not merely that the answer is correct.
- The correct answer must never appear as a hint in the prompt or an option.
- AI-assisted questions start at `reviewStatus: "needs_review"` and are promoted only after human verification.
- Only types in `SUPPORTED_QUESTION_TYPES` are renderable by the MVP engine. Others may be authored ahead of their renderer but are flagged by the validator.

Question types declared: `single_choice`, `multiple_choice`, `fill_blank`, `correction`, `identify`, `transformation`, `short_answer`. Only the first two are currently supported by the engine.

## Exam categories

The five TFLM scoring categories plus two used for UQAR work:

`orthographe_lexicale` · `orthographe_grammaticale` · `morphologie` · `syntaxe` · `vocabulaire` · `ponctuation` · `coherence_textuelle`

Assign a category by the skill a question actually tests, not mechanically by its chapter number.

## Flashcards

```ts
type Flashcard = {
  id: FlashcardId;
  chapterId: ChapterId;
  topicIds: string[];
  type: FlashcardType;
  front: string;
  back: string;
  example: string | null;
  tags: string[];
  difficulty: Difficulty;
  sourceRef: SourceReference | null;
};
```

The card is immutable content. Its review schedule (interval, ease, due date) lives only in `localStorage` — see [progress-architecture.md](./progress-architecture.md). This separation lets a deck be replaced without discarding review history.

## Exam blueprints

An exam declares how many questions to draw per category; it never stores copies of questions.

```ts
type ExamBlueprint = {
  id: string;
  family: "tflm" | "uqar" | "tcf";
  durationSeconds: number;
  questionCount: number;
  passingScorePercent: number | null;
  selectionMode: "blueprint" | "random" | "sequential";
  skills: ExamSkill[];
  sections: Array<{ categoryId: ExamCategoryId; questionCount: number }>;
  settings: ExamSettings;
  verified: boolean;
};
```

- `passingScorePercent: null` means no published threshold. Never invent one.
- The sum of `sections[].questionCount` must equal `questionCount`; the validator enforces this.
- `verified: false` means the profile has not been checked against an official format.
- When a category lacks enough **approved** questions, the engine reports the shortfall and offers a shorter practice run. It never repeats questions silently or reshapes the exam.

## Identifiers

IDs are permanent join keys between content and learner progress. Renaming a published ID is equivalent to deleting a learner's history for that item.

| Item | Convention | Example |
| --- | --- | --- |
| Chapter | `chapter-NN` | `chapter-01` |
| Section | `chapter-01-section-01` | — |
| Block | `chNN-sNN-bNN` | `ch01-s01-b01` |
| Concept | `chapter-01-concept-01` | — |
| Question | `chNN-qNNNN` | `ch01-q0001` |
| Flashcard | `fc-chNN-NNNN` | `fc-ch01-0001` |
| Exam | family slug | `tflm`, `tcf-canada` |

## Validation

`npm run validate:content` checks every collection under `public/data/` against these rules: unique IDs, resolvable references, well-formed answer keys, matching exam section sums, and manifest entries pointing at real files. It exits non-zero on errors so a deploy can be gated.

This is a structural check, not a grammar review. Verifying that an explanation is linguistically correct remains a human task — see [content-pipeline.md](./content-pipeline.md).
