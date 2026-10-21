/**
 * Reusable, tagged question banks.
 *
 * A question is a self-contained datum. The same object is served to chapter
 * practice, targeted revision, "practice my mistakes", and exam simulation
 * assembly. Nothing about a question is coupled to one screen, so no answer key
 * or explanation is ever duplicated into a lesson.
 *
 * Answer keys are data, not derivable from prompt text. `reviewStatus` starts at
 * "needs_review" for anything AI-assisted and is promoted only after a human
 * verifies the key and the explanation.
 */

import type { ContentOrigin, Difficulty, ExamCategoryId, ReviewStatus, SourceReference } from "./common";
import type { ChapterId, QuestionId, SectionId } from "./ids";

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "fill_blank"
  | "correction"
  | "identify"
  | "transformation"
  | "short_answer";

/**
 * Only these are renderable by the MVP engine. Others are declared so content
 * can be authored ahead of their renderer, but the loader must reject any type
 * outside `SUPPORTED_QUESTION_TYPES` until a renderer exists.
 */
export const SUPPORTED_QUESTION_TYPES = ["single_choice", "multiple_choice"] as const satisfies readonly QuestionType[];

export type SupportedQuestionType = (typeof SUPPORTED_QUESTION_TYPES)[number];

export type QuestionOption = {
  id: string;
  text: string;
  /** Why this distractor is wrong. Optional but strongly recommended. */
  explanation?: string;
};

/**
 * The text the question is about. For a highlighted-word question, both fields
 * are present; for a plain prompt only `text` is used.
 */
export type QuestionStimulus = {
  text: string;
  highlightedText?: string;
  /** Text a fill-blank must complete, with the gap marked by "___". */
  blankText?: string;
};

export type QuestionAnswer = {
  correctOptionIds: string[];
  /** Explains the grammatical reasoning, not merely that the answer is right. */
  explanation: string;
};

export type Question = {
  id: QuestionId;
  type: QuestionType;
  prompt: string;
  stimulus: QuestionStimulus;
  options: QuestionOption[];
  answer: QuestionAnswer;
  difficulty: Difficulty;
  topicIds: string[];
  sectionIds: SectionId[];
  learningObjectiveIds: string[];
  examCategories: ExamCategoryId[];
  hints?: string[];
  estimatedSeconds?: number;
  origin: ContentOrigin;
  sourceReferences: SourceReference[];
  reviewStatus: ReviewStatus;
};

export type QuestionBank = {
  schemaVersion: string;
  chapterId: ChapterId;
  questionSetId: string;
  title: string;
  questions: Question[];
};
