/**
 * Runtime session models. These are never persisted as content and are not
 * stored under their own localStorage key; only the summarized `AttemptRecord`
 * survives a session. They model the in-memory state of a practice run or a
 * timed exam so the engine and UI share one vocabulary.
 */

import type { ExamId } from "./ids";
import type { Question } from "./question";

export type SessionMode = "learning" | "assessment";

/** One answered (or flagged) question inside a running session. */
export type SessionItem = {
  question: Question;
  selectedOptionIds: string[];
  flagged: boolean;
  answeredAt?: string;
  /** Filled only in learning mode, or after an assessment is submitted. */
  isCorrect?: boolean;
};

export type PracticeSession = {
  id: string;
  mode: SessionMode;
  chapterId?: string;
  items: SessionItem[];
  currentIndex: number;
  startedAt: string;
};

export type ExamSession = {
  id: string;
  examId: ExamId;
  mode: "assessment";
  items: SessionItem[];
  currentIndex: number;
  startedAt: string;
  /** Absolute end time; recomputed from `durationSeconds` on resume. */
  expiresAt: string;
  /** Recorded so a generated exam can be reproduced during review. */
  seed?: number;
  submittedAt?: string;
};

export type SessionResult = {
  sessionId: string;
  correctCount: number;
  totalCount: number;
  accuracyPercent: number;
  passed: boolean | null;
  incorrectItems: SessionItem[];
  recommendations: Array<{ topicId: string; reason: string }>;
};
