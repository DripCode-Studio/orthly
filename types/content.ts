/**
 * DEPRECATED — compatibility shim.
 *
 * The contracts that used to live here have been split into focused modules:
 * - `ProgressState` moved to `types/progress.ts` (now versioned).
 * - The learning-path chapter node is `ChapterSummary` below.
 * - Full lesson content is `LessonChapter` in `types/lesson.ts`.
 *
 * New code should import from `@/types`. This file exists only so the current
 * dashboard and storage helpers keep compiling while they are migrated.
 */

import type { ProgressState } from "./progress";

export type { ProgressState };

/** A single tappable node on the learning path (not stored lesson content). */
export type PathNode = {
  id: string;
  title: string;
  type: "lesson" | "practice" | "checkpoint";
  durationMinutes: number;
  status?: "completed" | "current" | "available";
};

/** @deprecated Renamed to `PathNode`. */
export type Lesson = PathNode;

/** A lightweight chapter entry used to render the learning path. */
export type Chapter = {
  id: string;
  number: number;
  title: string;
  description: string;
  color: string;
  lessons: PathNode[];
};
