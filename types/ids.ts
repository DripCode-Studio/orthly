/**
 * Identifier conventions for the whole content pipeline.
 *
 * IDs are stable, human-readable, and never reused. They are the join key
 * between lesson content, question banks, flashcards, exam blueprints, and
 * learner progress records. Because progress lives in localStorage and is not
 * migrated automatically, renaming an ID effectively deletes a learner's
 * recorded history for that item. Treat IDs as permanent once published.
 *
 * Conventions:
 * - chapter:        chapter-01 .. chapter-08
 * - section:        chapter-01-section-01
 * - block:          ch01-s01-b01
 * - objective:      chapter-01-objective-01
 * - concept:        chapter-01-concept-01
 * - question:       ch01-q0001
 * - flashcard:      fc-ch01-0001
 * - exam:           tflm, uqar, tcf-canada, tcf-quebec, tcf-tout-public, tcf-irn
 * - attempt:        runtime-generated, see types/session.ts
 */

export type ChapterId = `chapter-${string}`;
export type SectionId = `${string}-section-${string}`;
export type ConceptId = `${string}-concept-${string}`;
export type ObjectiveId = `${string}-objective-${string}`;
export type RuleId = `${string}-rule-${string}`;
export type ExampleId = `${string}-example-${string}`;
export type BlockId = string;
export type QuestionId = string;
export type FlashcardId = string;
export type TopicId = string;
export type ExamId = string;
