import type { ProgressState } from "@/types/content";

const STORAGE_KEY = "orthly-progress";
const EMPTY_PROGRESS: ProgressState = { completedLessons: [], xp: 0, streak: 0 };

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return EMPTY_PROGRESS;

  try {
    const value = JSON.parse(stored) as Partial<ProgressState>;
    return {
      completedLessons: Array.isArray(value.completedLessons) ? value.completedLessons : [],
      xp: typeof value.xp === "number" ? value.xp : 0,
      streak: typeof value.streak === "number" ? value.streak : 0,
      lastActivityDate: value.lastActivityDate
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(progress: ProgressState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
