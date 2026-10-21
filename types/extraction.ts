/**
 * Extraction layer — the faithful representation of a source PDF.
 *
 * This is NOT the format the learner reads. It is the auditable intermediate
 * produced by the extraction step (Prompt A) and reviewed by a human before the
 * pedagogical lesson layer is derived from it. Its purpose is fidelity: if a
 * table row, exception, or exercise item is lost here, a reviewer can see it.
 *
 * Relationship:  PDF  ->  ExtractedChapter  ->  LessonChapter  ->  QuestionBank
 */

import type { ContentOrigin, ReviewStatus, SourceReference } from "./common";
import type { BlockId, ChapterId, SectionId } from "./ids";

/** The block vocabulary the extraction step is allowed to emit. */
export type BlockType =
  | "paragraph"
  | "definition"
  | "rule"
  | "example"
  | "counterexample"
  | "list"
  | "table"
  | "note"
  | "warning"
  | "procedure"
  | "diagramDescription";

export type TableContent = {
  headers: string[];
  rows: string[][];
};

export type ListContent = {
  /** Ordered items. Nesting is expressed by nesting `items`. */
  items: Array<string | ListContent>;
  ordered?: boolean;
};

export type ProcedureContent = {
  steps: string[];
};

/** A block's payload depends on its `type`; narrow with `block.type`. */
export type Block =
  | { id: BlockId; type: "paragraph"; content: string; sourcePage: number; origin?: ContentOrigin }
  | { id: BlockId; type: "definition"; content: string; sourcePage: number; origin?: ContentOrigin }
  | { id: BlockId; type: "rule"; content: string; sourcePage: number; origin?: ContentOrigin }
  | { id: BlockId; type: "example"; content: string; sourcePage: number; origin?: ContentOrigin }
  | { id: BlockId; type: "counterexample"; content: string; sourcePage: number; origin?: ContentOrigin }
  | { id: BlockId; type: "note"; content: string; sourcePage: number; origin?: ContentOrigin }
  | { id: BlockId; type: "warning"; content: string; sourcePage: number; origin?: ContentOrigin }
  | { id: BlockId; type: "diagramDescription"; content: string; sourcePage: number; origin?: ContentOrigin }
  | { id: BlockId; type: "list"; content: ListContent; sourcePage: number; origin?: ContentOrigin }
  | { id: BlockId; type: "table"; content: TableContent; sourcePage: number; origin?: ContentOrigin }
  | { id: BlockId; type: "procedure"; content: ProcedureContent; sourcePage: number; origin?: ContentOrigin };

export type ExtractedSection = {
  id: SectionId;
  /** Source section number, e.g. "1.1". Kept verbatim when available. */
  number?: string;
  title: string;
  sourcePages: { start: number; end: number };
  blocks: Block[];
};

export type ExtractedExerciseItem = {
  id: string;
  prompt: string;
  sourcePage: number;
};

export type ExtractedExercise = {
  id: string;
  title?: string;
  instructions: string;
  items: ExtractedExerciseItem[];
  /** Only populated when the PDF itself prints corrections. Never solved by AI. */
  answerKey: string[] | null;
  sourcePages: { start: number; end: number };
};

/**
 * Machine-readable audit trail of the extraction. `unreadableContent` and
 * `itemsRequiringReview` are deliberate escape hatches so an incomplete import
 * is visible rather than silently summarized away.
 */
export type SourceCoverage = {
  extractedSections: string[];
  extractedPageRanges: string[];
  unreadableContent: string[];
  itemsRequiringReview: Array<{
    id: string;
    description: string;
    sourcePage?: number;
    status: ReviewStatus;
  }>;
};

export type ExtractedDocument = {
  id: string;
  title: string;
  language: "fr-CA";
  sourceFile: string;
  totalPages?: number;
};

export type ExtractedChapter = {
  schemaVersion: string;
  document: ExtractedDocument;
  chapter: {
    id: ChapterId;
    number: number;
    title: string;
    summary: string | null;
    learningObjectives: string[];
    sections: ExtractedSection[];
    exercises: ExtractedExercise[];
    sourceCoverage: SourceCoverage;
  };
};

/** Convenience alias for a reference produced by the extraction review. */
export type ExtractionReference = SourceReference;
