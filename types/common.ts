/** Shared primitives used across every content collection. */

/**
 * Origin of a piece of content. "source" means the item reproduces the UQAR
 * course material faithfully; "added" means it was authored to support the
 * course and must never be presented as a quotation from the notes.
 */
export type ContentOrigin = "source" | "added" | "external";

/** Review lifecycle for any authored item. AI-assisted items start unreviewed. */
export type ReviewStatus = "needs_review" | "reviewed" | "approved" | "retired";

export type Difficulty = "beginner" | "intermediate" | "advanced";

/**
 * Reference back to the original PDF. `page` always refers to the page of the
 * source document, never to a position inside an extracted fragment.
 */
export type SourceReference = {
  page?: number;
  section?: string;
  document?: string;
  /** Which of the seven TFLM-style categories this material supports. */
  examCategories?: ExamCategoryId[];
};

/** The five TFLM scoring categories plus the two extras used for UQAR work. */
export type ExamCategoryId =
  | "orthographe_lexicale"
  | "orthographe_grammaticale"
  | "morphologie"
  | "syntaxe"
  | "vocabulaire"
  | "ponctuation"
  | "coherence_textuelle";

/** A single toggle/settings flag pair used by exam blueprints. */
export type ExamSettings = {
  allowReview: boolean;
  showFeedbackDuringExam: boolean;
  showAnswersBeforeSubmission: boolean;
  allowPause: boolean;
};
