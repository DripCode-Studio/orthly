import type { ExamBlueprint, ExamSectionBlueprint } from "@/types/exam";
import type { Question, QuestionBank } from "@/types/question";

export type SelectionShortfall = {
  categoryId: string;
  requested: number;
  available: number;
};

export type SelectionResult =
  | { ok: true; questions: Question[] }
  | { ok: false; questions: Question[]; shortfalls: SelectionShortfall[] };

function eligible(q: Question): boolean {
  return q.reviewStatus !== "retired";
}

/** Simple seeded PRNG (mulberry32) for reproducible shuffles. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], seed?: number): T[] {
  const out = [...arr];
  const r = seed !== undefined ? rng(seed) : Math.random;
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Select questions for an exam blueprint from the provided banks.
 * Never repeats a question within the exam. Reports shortfalls instead of
 * silently reshaping the blueprint.
 */
export function selectQuestionsForBlueprint(
  blueprint: ExamBlueprint,
  banks: QuestionBank[],
  options?: { seed?: number }
): SelectionResult {
  const allQuestions = banks.flatMap((b) => b.questions);
  const shortfalls: SelectionShortfall[] = [];
  const selected: Question[] = [];
  const usedIds = new Set<string>();

  for (const section of blueprint.sections) {
    const pool = allQuestions.filter(
      (q) => q.examCategories.includes(section.categoryId as any) && eligible(q) && !usedIds.has(q.id)
    );
    // Note: Question.examCategories is string[]; blueprint categoryId is ExamCategoryId.
    // We compare against q.examCategories (which stores category ids).
    const available = pool.length;
    const requested = section.questionCount;
    if (available < requested) {
      shortfalls.push({ categoryId: section.categoryId, requested, available });
    }
    const shuffled = shuffle(pool, options?.seed);
    const take = Math.min(requested, shuffled.length);
    for (let i = 0; i < take; i++) {
      selected.push(shuffled[i]);
      usedIds.add(shuffled[i].id);
    }
  }

  if (shortfalls.length > 0) {
    return { ok: false, questions: selected, shortfalls };
  }
  return { ok: true, questions: selected };
}