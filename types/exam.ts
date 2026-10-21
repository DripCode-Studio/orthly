/**
 * Exam blueprints. An exam never stores its own copy of a question; it declares
 * how many questions to draw per category and the engine selects from the shared
 * banks (see lib/questionSelector.ts).
 *
 * Blueprint numbers are configuration, not constants baked into the UI. If a
 * category cannot supply its requested count from *approved* questions, the
 * engine must report the shortfall and offer a shorter practice run rather than
 * silently repeating questions or reshaping the exam.
 */

import type { ExamCategoryId, ExamSettings } from "./common";

export type ExamSectionBlueprint = {
  categoryId: ExamCategoryId;
  questionCount: number;
  /** Optional weighting; defaults to an even split within the section. */
  difficultyMix?: Array<{ difficulty: "beginner" | "intermediate" | "advanced"; weight: number }>;
};

export type ExamSkill = "reading" | "listening" | "writing" | "speaking" | "language_structures";

export type ExamBlueprint = {
  id: string;
  title: string;
  /** Which assessment family this belongs to. */
  family: "tflm" | "uqar" | "tcf";
  /** Present for TCF variants (canada, quebec, tout-public, irn). */
  variant?: string;
  description: string;
  durationSeconds: number;
  questionCount: number;
  /** null means no published threshold; do not invent one. */
  passingScorePercent: number | null;
  selectionMode: "blueprint" | "random" | "sequential";
  /** Skills the profile covers. A grammar QCM alone is not a full TCF sim. */
  skills: ExamSkill[];
  sections: ExamSectionBlueprint[];
  settings: ExamSettings;
  /** True once the profile reflects a verified official format. */
  verified: boolean;
  notes?: string[];
};
