/**
 * localStorage adapter for learner-owned state.
 *
 * Every read is server-safe and defensive: the app renders on the server first,
 * stored bytes may predate the current schema, and `localStorage` can throw when
 * disabled or over quota. Components must never touch `localStorage` directly —
 * they go through this module (usually via the Zustand store) so migration and
 * error handling stay in one place.
 */

import type {
  AttemptStore,
  FlashcardStore,
  ProgressState,
  SettingsState,
  StorageVersion
} from "@/types/progress";

const STORAGE_VERSION: StorageVersion = 1;

const KEYS = {
  progress: "orthly:progress:v1",
  settings: "orthly:settings:v1",
  flashcards: "orthly:flashcards:v1",
  attempts: "orthly:attempts:v1"
} as const;

/** The pre-versioned key used before the storage contract was formalized. */
const LEGACY_PROGRESS_KEY = "orthly-progress";

export const EMPTY_PROGRESS: ProgressState = {
  version: STORAGE_VERSION,
  completedLessons: [],
  xp: 0,
  streak: 0,
  topicMastery: {}
};

export const DEFAULT_SETTINGS: SettingsState = {
  version: STORAGE_VERSION,
  theme: "light",
  dailyGoalLessons: 3,
  soundEnabled: true,
  animationsEnabled: true
};

const EMPTY_FLASHCARDS: FlashcardStore = { version: STORAGE_VERSION, reviews: {} };
const EMPTY_ATTEMPTS: AttemptStore = { version: STORAGE_VERSION, attempts: [] };

/** Read and parse a key, returning null on any failure. */
function readKey(key: string): unknown | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Write a value, returning false when storage is unavailable or full. */
function writeKey(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Coerce an arbitrary parsed value into a valid `ProgressState`, dropping
 * unknown fields and repairing a missing version. Never throws.
 */
function normalizeProgress(value: unknown): ProgressState {
  if (!value || typeof value !== "object") return EMPTY_PROGRESS;
  const raw = value as Partial<ProgressState> & { completedLessons?: unknown };

  return {
    version: STORAGE_VERSION,
    completedLessons: Array.isArray(raw.completedLessons)
      ? raw.completedLessons.filter((id): id is string => typeof id === "string")
      : [],
    xp: typeof raw.xp === "number" && Number.isFinite(raw.xp) ? raw.xp : 0,
    streak: typeof raw.streak === "number" && Number.isFinite(raw.streak) ? raw.streak : 0,
    lastActivityDate: typeof raw.lastActivityDate === "string" ? raw.lastActivityDate : undefined,
    topicMastery:
      raw.topicMastery && typeof raw.topicMastery === "object" ? raw.topicMastery : {}
  };
}

export function loadProgress(): ProgressState {
  const current = readKey(KEYS.progress);
  if (current) return normalizeProgress(current);

  // Migrate the pre-versioned record once, then remove the old key.
  const legacy = readKey(LEGACY_PROGRESS_KEY);
  if (legacy) {
    const migrated = normalizeProgress(legacy);
    saveProgress(migrated);
    try {
      window.localStorage.removeItem(LEGACY_PROGRESS_KEY);
    } catch {
      // Removal is best-effort; a stale key is harmless.
    }
    return migrated;
  }

  return EMPTY_PROGRESS;
}

/**
 * Persist progress. Returns false when the write fails (for example when
 * storage is disabled or full) so callers can surface a non-fatal warning.
 */
export function saveProgress(progress: ProgressState): boolean {
  return writeKey(KEYS.progress, { ...progress, version: STORAGE_VERSION });
}

export function loadSettings(): SettingsState {
  const value = readKey(KEYS.settings);
  if (!value || typeof value !== "object") return DEFAULT_SETTINGS;
  const raw = value as Partial<SettingsState>;

  return {
    version: STORAGE_VERSION,
    theme: raw.theme === "system" ? "system" : "light",
    dailyGoalLessons:
      typeof raw.dailyGoalLessons === "number" && raw.dailyGoalLessons > 0 ? raw.dailyGoalLessons : 3,
    soundEnabled: typeof raw.soundEnabled === "boolean" ? raw.soundEnabled : true,
    animationsEnabled: typeof raw.animationsEnabled === "boolean" ? raw.animationsEnabled : true,
    examTarget: typeof raw.examTarget === "string" ? raw.examTarget : undefined,
    examTargetDate: typeof raw.examTargetDate === "string" ? raw.examTargetDate : undefined
  };
}

export function saveSettings(settings: SettingsState): boolean {
  return writeKey(KEYS.settings, { ...settings, version: STORAGE_VERSION });
}

export function loadFlashcards(): FlashcardStore {
  const value = readKey(KEYS.flashcards);
  if (!value || typeof value !== "object") return EMPTY_FLASHCARDS;
  const raw = value as Partial<FlashcardStore>;
  return {
    version: STORAGE_VERSION,
    reviews: raw.reviews && typeof raw.reviews === "object" ? raw.reviews : {}
  };
}

export function saveFlashcards(store: FlashcardStore): boolean {
  return writeKey(KEYS.flashcards, { ...store, version: STORAGE_VERSION });
}

export function loadAttempts(): AttemptStore {
  const value = readKey(KEYS.attempts);
  if (!value || typeof value !== "object") return EMPTY_ATTEMPTS;
  const raw = value as Partial<AttemptStore>;
  return {
    version: STORAGE_VERSION,
    attempts: Array.isArray(raw.attempts) ? raw.attempts : []
  };
}

export function saveAttempts(store: AttemptStore): boolean {
  return writeKey(KEYS.attempts, { ...store, version: STORAGE_VERSION });
}
