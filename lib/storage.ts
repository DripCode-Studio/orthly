/**
 * localStorage adapter for learner-owned state.
 *
 * Every read is server-safe and defensive: the app renders on the server first,
 * stored bytes may predate the current schema, and `localStorage` can throw when
 * disabled or over quota. Components must never touch `localStorage` directly —
 * they go through this module so migration and error handling stay in one place.
 */

import type { ProgressState, StorageVersion } from "@/types/progress";

const STORAGE_VERSION: StorageVersion = 1;
const STORAGE_KEY = "orthly:progress:v1";

/** The pre-versioned key used before the storage contract was formalized. */
const LEGACY_STORAGE_KEY = "orthly-progress";

export const EMPTY_PROGRESS: ProgressState = {
  version: STORAGE_VERSION,
  completedLessons: [],
  xp: 0,
  streak: 0,
  topicMastery: {}
};

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
  if (typeof window === "undefined") return EMPTY_PROGRESS;

  try {
    const current = window.localStorage.getItem(STORAGE_KEY);
    if (current) return normalizeProgress(JSON.parse(current));

    // Migrate the pre-versioned record once, then remove the old key.
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const migrated = normalizeProgress(JSON.parse(legacy));
      saveProgress(migrated);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      return migrated;
    }
  } catch {
    // Malformed JSON or unavailable storage: fall back to a clean state.
  }

  return EMPTY_PROGRESS;
}

/**
 * Persist progress. Returns false when the write fails (for example when
 * storage is disabled or full) so callers can surface a non-fatal warning.
 */
export function saveProgress(progress: ProgressState): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...progress, version: STORAGE_VERSION }));
    return true;
  } catch {
    return false;
  }
}
