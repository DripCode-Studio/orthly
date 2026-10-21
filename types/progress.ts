/**
 * Learner-owned state. Everything here is user-specific and lives in the
 * browser under namespaced, versioned keys. None of it is content: questions,
 * answers, and explanations stay in `public/data/`.
 *
 * Persisting rules:
 * - Every record is keyed by a stable content ID so content can change without
 *   corrupting progress.
 * - Each top-level store carries its own `version` for lightweight migration.
 * - Reads must tolerate missing, malformed, and quota-exceeded storage.
 */

import type { Difficulty, ExamCategoryId } from "./common";
import type { QuestionId } from "./ids";

export type StorageVersion = 1;

/** Settings store — `orthly:settings:v1`. */
export type SettingsState = {
  version: StorageVersion;
  theme: "light" | "system";
  dailyGoalLessons: number;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  examTarget?: string;
  examTargetDate?: string;
};

/** Aggregated progress — `orthly:progress:v1`. */
export type ProgressState = {
  version: StorageVersion;
  completedLessons: string[];
  xp: number;
  streak: number;
  lastActivityDate?: string;
  /** Estimated mastery per topic, 0..100. An indicator, not a grade. */
  topicMastery: Record<string, MasteryRecord>;
};

export type MasteryRecord = {
  topicId: string;
  score: number;
  attempts: number;
  correct: number;
  updatedAt: string;
};

/** Quiz/exam attempt history — `orthly:attempts:v1`. */
export type AttemptRecord = {
  id: string;
  kind: "practice" | "exam" | "checkpoint";
  examId?: string;
  startedAt: string;
  submittedAt?: string;
  correctCount: number;
  questionCount: number;
  categoryBreakdown: Partial<Record<ExamCategoryId, { correct: number; total: number }>>;
  /** Question IDs answered incorrectly, for "practice my mistakes". */
  incorrectQuestionIds: QuestionId[];
};

export type AttemptStore = {
  version: StorageVersion;
  attempts: AttemptRecord[];
};

/** Flashcard scheduling — `orthly:flashcards:v1`. */
export type FlashcardReviewState = {
  cardId: string;
  /** SM-2-style scheduling fields kept local to the device. */
  ease: number;
  intervalDays: number;
  repetitions: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
  lastRating?: "again" | "hard" | "good" | "easy";
  difficulty?: Difficulty;
};

export type FlashcardStore = {
  version: StorageVersion;
  reviews: Record<string, FlashcardReviewState>;
};

/** Bookmarks — `orthly:bookmarks:v1`. */
export type BookmarkStore = {
  version: StorageVersion;
  lessonIds: string[];
  questionIds: QuestionId[];
  topicIds: string[];
};

/** Daily activity log — `orthly:activity:v1`. */
export type ActivityState = {
  version: StorageVersion;
  /** ISO date -> aggregate counters. */
  days: Record<string, { lessonsCompleted: number; questionsAnswered: number; minutes: number }>;
};

/** Shape of a full export produced by the settings export action. */
export type ProgressExport = {
  app: "orthly";
  exportedAt: string;
  settings: SettingsState;
  progress: ProgressState;
  attempts: AttemptStore;
  flashcards: FlashcardStore;
  bookmarks: BookmarkStore;
  activity: ActivityState;
};
