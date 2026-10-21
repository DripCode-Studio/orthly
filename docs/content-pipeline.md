# Content pipeline

Turning a UQAR PDF into trustworthy app content is a staged process, not a single AI request. Asking one model to read a PDF and emit lessons, questions, flashcards, and exam items at once makes omissions, fabricated rules, and wrong answer keys impossible to detect.

## The five stages

```text
01 Extract  →  02 Lesson  →  03 Questions  →  04 Validate  →  05 Publish
   faithful      pedagogical    assessment      audit          manifest
```

Each stage has one job and one output. A later stage never silently repairs an earlier one; it records the issue for review instead.

### 01 — Extract

Produce an `ExtractedChapter` (see `types/extraction.ts`). The job is fidelity, not teaching.

- Capture the full inventory first: document title, every heading in source order, page ranges, definitions, rules, examples, tables, exceptions, exercises, and any printed answer keys.
- Preserve the original order. Do not reorganize into a new pedagogical sequence.
- Do not invent rules, examples, definitions, or answers. Do not solve exercises.
- Preserve accents, apostrophes, punctuation, and French typography exactly.
- Record anything unreadable, ambiguous, or missing in `sourceCoverage` rather than guessing.

Long documents are processed in consecutive page ranges with stable IDs, then merged. An output that stops early must stop at a section boundary and name the next page — never replace remaining content with a summary.

### 02 — Lesson

Transform the validated extraction into a `LessonChapter` (`types/lesson.ts`).

- Follow the source's conceptual order unless a small change clearly improves understanding without losing material.
- For each concept: title, why it matters, definition, rule or method, steps when procedural, source-backed examples, why each example illustrates the rule, exceptions, common mistakes, and a takeaway. Do not force every field onto every concept.
- Rewriting for clarity is allowed; changing grammatical meaning is not.
- Mark examples `"source"` or `"added"` honestly.
- Do not create quizzes, answer keys, or flashcards here.

### 03 — Questions

Generate a separate `QuestionBank`. The lesson is an input; the bank is its own file.

- Every correct answer must be independently solvable and defensible.
- Prefer applying a rule to a new sentence over recognizing a copied definition.
- Vary difficulty across `beginner`, `intermediate`, and `advanced`; avoid near-duplicates.
- Tag with chapter, topic, section, objective, difficulty, and exam category.
- Never store the answer in the prompt or option text.
- If the material cannot support a question, omit it and report the gap rather than padding the bank.

### 04 — Validate

Run two checks:

1. **Structural** — `npm run validate:content`. Unique IDs, resolvable references, well-formed keys, exam section sums, manifest targets.
2. **Human** — a person reads the lesson against the extraction and confirms every explanation is linguistically correct. This step cannot be automated away.

Promote `reviewStatus` from `needs_review` only after the human pass. The validator never approves anything.

### 05 — Publish

Add or update the entry in `public/data/manifest.json` and mark the chapter `status: "published"`. Because content is read-only at runtime, distributing new material means redeploying the app.

## Source fidelity rules

These apply at every stage:

- The supplied document is the authority. Supplementary material is labelled, never attributed to the notes.
- A questionable statement in the source is recorded for review, never silently corrected.
- Source page references point at the original PDF, not at an extracted fragment's position.
- Canadian French conventions are not silently replaced with another variety's.
- Genuine repetition is retained; the point is coverage, not concision.

## What never happens

- Generating all eight chapters in one pass before the schema is proven on one.
- Presenting a QCM bank as a complete TCF simulation.
- Padding a question bank with duplicates to reach a requested count.
- Marking AI output as reviewed without a human reading it.
- Inventing a page reference, a rule, or a passing threshold.

## Recommended first run

Build one chapter end to end before scaling:

1. Extract Chapter 1 completely.
2. Produce and validate its lesson.
3. Produce a separate question bank.
4. Render both in the app and confirm the data contract holds.
5. Repeat for Chapters 2–8 using the identical process.
