/**
 * Learner state store.
 *
 * Every page reads and writes learner state through this Zustand store, so there
 * is one source of truth instead of per-component `useState` copies. The store
 * is a thin, typed layer over `lib/storage.ts`: it hydrates from localStorage on
 * the client and persists on every mutation.
 *
 * Server rendering is safe: the store starts from `EMPTY_PROGRESS` and only
 * hydrates inside `hydrate()`, which callers run in an effect.
 */

"use client";

import { create } from "zustand";
import {
  EMPTY_PROGRESS,
  loadProgress,
  saveProgress,
  loadFlashcards,
  saveFlashcards,
  loadAttempts,
  saveAttempts,
  loadSettings,
  saveSettings
} from "@/lib/storage";
import type {
  AttemptRecord,
  FlashcardReviewState,
  ProgressState,
  SettingsState
} from "@/types/progress";
import type { QuestionId } from "@/types/ids";

/** Flashcard ratings the learner can choose after revealing a card. */
export type ReviewRating = NonNullable<FlashcardReviewState["lastRating"]>;

type CompletionInput = {
  lessonId: string;
  xp?: number;
  topicIds?: string[];
};

type AttemptInput = {
  kind: AttemptRecord["kind"];
  examId?: string;
  correctCount: number;
  questionCount: number;
  categoryBreakdown: AttemptRecord["categoryBreakdown"];
  incorrectQuestionIds: QuestionId[];
};

type LearnerStore = {
  hydrated: boolean;
  progress: ProgressState;
  settings: SettingsState;
  flashcards: Record<string, FlashcardReviewState>;
  attempts: AttemptRecord[];

  hydrate: () => void;

  isLessonCompleted: (lessonId: string) => boolean;
  completeLesson: (input: CompletionInput) => void;

  recordAttempt: (input: AttemptInput) => AttemptRecord;
  reviewFlashcard: (cardId: string, rating: ReviewRating) => void;

  resetProgress: () => void;
  updateSettings: (patch: Partial<SettingsState>) => void;
};

/** Simple spaced-repetition intervals, in days, indexed by review count. */
const INTERVAL_LADDER = [0, 1, 3, 7, 16, 35];

function nextReviewState(
  previous: FlashcardReviewState | undefined,
  rating: ReviewRating,
  now: Date
): FlashcardReviewState {
  const repetitions = previous?.repetitions ?? 0;
  const ease = previous?.ease ?? 2.5;

  // "again" resets the ladder; the others advance or hold position.
  const nextRepetitions =
    rating === "again" ? 0 : rating === "hard" ? Math.max(repetitions, 1) : repetitions + 1;
  const nextEase = Math.max(1.3, rating === "hard" ? ease - 0.15 : rating === "easy" ? ease + 0.1 : ease);
  const intervalDays = INTERVAL_LADDER[Math.min(nextRepetitions, INTERVAL_LADDER.length - 1)];
  const nextReviewAt = new Date(now);
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  return {
    cardId: previous?.cardId ?? "",
    ease: nextEase,
    intervalDays,
    repetitions: nextRepetitions,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReviewAt.toISOString(),
    lastRating: rating
  };
}

/** Merge a lesson's topics into the mastery estimates. */
function applyMastery(
  mastery: ProgressState["topicMastery"],
  topicIds: string[],
  correctRatio: number
): ProgressState["topicMastery"] {
  const next = { ...mastery };
  for (const topicId of topicIds) {
    const previous = next[topicId];
    const attempts = (previous?.attempts ?? 0) + 1;
    const correct = (previous?.correct ?? 0) + (correctRatio >= 0.5 ? 1 : 0);
    next[topicId] = {
      topicId,
      attempts,
      correct,
      // Weight recent performance: a rolling estimate, not a lifetime average.
      score: Math.round(((previous?.score ?? 0) * (attempts - 1) + correctRatio * 100) / attempts),
      updatedAt: new Date().toISOString()
    };
  }
  return next;
}

export const useLearnerStore = create<LearnerStore>((set, get) => ({
  hydrated: false,
  progress: EMPTY_PROGRESS,
  settings: loadSettings(),
  flashcards: {},
  attempts: [],

  hydrate: () => {
    if (get().hydrated) return;
    const flashcards = loadFlashcards();
    set({
      hydrated: true,
      progress: loadProgress(),
      settings: loadSettings(),
      flashcards: flashcards.reviews,
      attempts: loadAttempts().attempts
    });
  },

  isLessonCompleted: (lessonId) => get().progress.completedLessons.includes(lessonId),

  completeLesson: ({ lessonId, xp = 20, topicIds = [] }) => {
    const current = get().progress;
    if (current.completedLessons.includes(lessonId)) return;

    const today = new Date().toISOString().slice(0, 10);
    const alreadyActiveToday = current.lastActivityDate === today;

    const next: ProgressState = {
      ...current,
      completedLessons: [...current.completedLessons, lessonId],
      xp: current.xp + xp,
      // A streak only advances once per day of genuine activity.
      streak: alreadyActiveToday ? current.streak : current.streak + 1,
      lastActivityDate: today,
      topicMastery: applyMastery(current.topicMastery, topicIds, 1)
    };

    saveProgress(next);
    set({ progress: next });
  },

  recordAttempt: (input) => {
    const attempt: AttemptRecord = {
      id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      startedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      ...input
    };

    const current = get().progress;
    const ratio = input.questionCount === 0 ? 0 : input.correctCount / input.questionCount;
    const nextProgress: ProgressState = {
      ...current,
      xp: current.xp + input.correctCount * 5,
      lastActivityDate: new Date().toISOString().slice(0, 10)
    };

    const attempts = [attempt, ...get().attempts];
    saveAttempts({ version: 1, attempts });
    saveProgress(nextProgress);
    set({ attempts, progress: nextProgress });

    return attempt;
  },

  reviewFlashcard: (cardId, rating) => {
    const existing = get().flashcards[cardId];
    const nextState = nextReviewState({ ...existing, cardId }, rating, new Date());
    const flashcards = { ...get().flashcards, [cardId]: nextState };

    saveFlashcards({ version: 1, reviews: flashcards });
    set({ flashcards });
  },

  resetProgress: () => {
    saveProgress(EMPTY_PROGRESS);
    saveAttempts({ version: 1, attempts: [] });
    saveFlashcards({ version: 1, reviews: {} });
    set({ progress: EMPTY_PROGRESS, attempts: [], flashcards: {} });
  },

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch };
    saveSettings(settings);
    set({ settings });
  }
}));

/**
 * Cards due for review today, in deck order. A card with no schedule is due
 * immediately; otherwise it is due once its `nextReviewAt` has passed.
 */
export function selectDueCardIds(
  flashcards: Record<string, FlashcardReviewState>,
  allCardIds: string[]
): string[] {
  const now = Date.now();
  return allCardIds.filter((id) => {
    const state = flashcards[id];
    if (!state?.nextReviewAt) return true;
    return new Date(state.nextReviewAt).getTime() <= now;
  });
}
