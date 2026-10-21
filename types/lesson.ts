/**
 * Pedagogical lesson layer — the format the learner actually reads.
 *
 * Derived from a validated `ExtractedChapter` (see types/extraction.ts). Unlike
 * the extraction layer, explanations may be rewritten for clarity, but never in
 * a way that changes grammatical meaning. Each example carries an
 * `origin.kind` so the UI can tell a faithful source example from an authored
 * one, and rewriting is not confused with quoting.
 */

import type { ContentOrigin, Difficulty, SourceReference } from "./common";
import type { ChapterId, ConceptId, ExampleId, ObjectiveId, RuleId, SectionId } from "./ids";

/** An example. `highlight` offsets must fall inside `text` or be left empty. */
export type LessonExample = {
  id: ExampleId;
  text: string;
  /** Character ranges within `text` to emphasize. Empty when unverifiable. */
  highlight: Array<{ start: number; end: number }>;
  explanation: string;
  source: SourceReference & { kind: ContentOrigin };
};

export type LessonRule = {
  id: RuleId;
  text: string;
  /** Source-provided exceptions to this rule, kept even when hard to explain. */
  exceptions: string[];
  source?: SourceReference;
};

export type CommonMistake = {
  id: string;
  incorrect: string;
  correct: string;
  explanation: string;
  source?: SourceReference;
};

export type LessonConcept = {
  id: ConceptId;
  title: string;
  /** Why this concept matters and where it is used. */
  explanation: string;
  definition: string | null;
  rules: LessonRule[];
  /** Ordered steps for procedural concepts; empty for purely declarative ones. */
  steps: Array<{ id: string; text: string }>;
  examples: LessonExample[];
  exceptions: string[];
  commonMistakes: CommonMistake[];
  takeaway: string;
  /** Cross-references to related concepts in other chapters. */
  prereqConceptIds?: ConceptId[];
  relatedConceptIds?: ConceptId[];
  difficulty?: Difficulty;
  topicIds?: string[];
  sourceReferences: SourceReference[];
};

export type LessonSection = {
  id: SectionId;
  title: string;
  order: number;
  introduction: string;
  concepts: LessonConcept[];
  summary: string[];
  sourceReferences: SourceReference[];
};

export type LessonObjective = {
  id: ObjectiveId;
  text: string;
  topicIds?: string[];
};

export type LessonChapter = {
  schemaVersion: string;
  id: ChapterId;
  number: number;
  slug: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  color?: string;
  learningObjectives: LessonObjective[];
  prerequisiteChapterIds?: ChapterId[];
  sections: LessonSection[];
  /** Genuine source ambiguities or inconsistencies needing human attention. */
  reviewNotes: Array<{
    id: string;
    description: string;
    conceptId?: ConceptId;
    sourcePage?: number;
  }>;
};
