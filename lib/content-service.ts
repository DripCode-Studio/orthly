/**
 * Content access layer.
 *
 * The app reads every lesson, bank, deck, and blueprint through this module so
 * page components never fetch `/data/...` paths directly and never embed course
 * prose. Loading is defensive: a malformed file yields a typed `ContentError`
 * the UI can render as a friendly message instead of crashing the route.
 *
 * `public/data` is read-only at runtime. Changing content means editing the JSON
 * and redeploying; learner progress is stored separately (see lib/storage.ts).
 */

import type { ContentManifest } from "@/types/manifest";
import type { LessonChapter } from "@/types/lesson";
import type { QuestionBank } from "@/types/question";
import type { FlashcardDeck } from "@/types/flashcard";
import type { ExamBlueprint } from "@/types/exam";

/** Machine-readable failure so callers can decide how to present it. */
export type ContentError =
  | { kind: "missing_file"; path: string }
  | { kind: "invalid_json"; path: string; message: string }
  | { kind: "invalid_shape"; path: string; message: string }
  | { kind: "network"; path: string; message: string };

export type ContentResult<T> = { ok: true; data: T } | { ok: false; error: ContentError };

const DATA_ROOT = "/data";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function fetchJson(path: string): Promise<ContentResult<unknown>> {
  const url = `${DATA_ROOT}/${path}`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (cause) {
    return { ok: false, error: { kind: "network", path, message: String(cause) } };
  }

  if (response.status === 404) {
    return { ok: false, error: { kind: "missing_file", path } };
  }
  if (!response.ok) {
    return { ok: false, error: { kind: "network", path, message: `HTTP ${response.status}` } };
  }

  try {
    return { ok: true, data: await response.json() };
  } catch (cause) {
    return { ok: false, error: { kind: "invalid_json", path, message: String(cause) } };
  }
}

/** Load and shape-check the manifest that indexes every content collection. */
export async function loadManifest(): Promise<ContentResult<ContentManifest>> {
  const result = await fetchJson("manifest.json");
  if (!result.ok) return result;

  const value = result.data;
  if (!isRecord(value) || !Array.isArray(value.chapters)) {
    return { ok: false, error: { kind: "invalid_shape", path: "manifest.json", message: "chapters[] est requis." } };
  }

  return { ok: true, data: value as unknown as ContentManifest };
}

export async function loadChapter(path: string): Promise<ContentResult<LessonChapter>> {
  const result = await fetchJson(path);
  if (!result.ok) return result;

  const value = result.data;
  if (!isRecord(value) || !isRecord(value.chapter)) {
    // Stored chapters are still in the extraction shape; report it clearly
    // rather than pretending the lesson layer exists.
    const nested = isRecord(value) && isRecord((value as { chapter?: unknown }).chapter);
    return {
      ok: false,
      error: {
        kind: "invalid_shape",
        path,
        message: nested
          ? "Le fichier est au format d'extraction. Il doit être converti au format de leçon (types/lesson.ts)."
          : "Champ « chapter » manquant."
      }
    };
  }

  return { ok: true, data: value as unknown as LessonChapter };
}

export async function loadQuestionBank(path: string): Promise<ContentResult<QuestionBank>> {
  const result = await fetchJson(path);
  if (!result.ok) return result;

  const value = result.data;
  if (!isRecord(value) || !Array.isArray(value.questions)) {
    return { ok: false, error: { kind: "invalid_shape", path, message: "questions[] est requis." } };
  }

  return { ok: true, data: value as unknown as QuestionBank };
}

export async function loadFlashcardDeck(path: string): Promise<ContentResult<FlashcardDeck>> {
  const result = await fetchJson(path);
  if (!result.ok) return result;

  const value = result.data;
  if (!isRecord(value) || !Array.isArray(value.cards)) {
    return { ok: false, error: { kind: "invalid_shape", path, message: "cards[] est requis." } };
  }

  return { ok: true, data: value as unknown as FlashcardDeck };
}

export async function loadExamBlueprint(path: string): Promise<ContentResult<ExamBlueprint>> {
  const result = await fetchJson(path);
  if (!result.ok) return result;

  const value = result.data;
  if (!isRecord(value) || !Array.isArray(value.sections) || typeof value.durationSeconds !== "number") {
    return {
      ok: false,
      error: { kind: "invalid_shape", path, message: "sections[] et durationSeconds sont requis." }
    };
  }

  return { ok: true, data: value as unknown as ExamBlueprint };
}

/** Human-readable message for a `ContentError`, safe to render in the UI. */
export function describeContentError(error: ContentError): string {
  switch (error.kind) {
    case "missing_file":
      return `Le fichier de contenu « ${error.path} » est introuvable.`;
    case "invalid_json":
      return `Le fichier « ${error.path} » contient un JSON invalide.`;
    case "invalid_shape":
      return `Le fichier « ${error.path} » ne respecte pas le schéma : ${error.message}`;
    case "network":
      return `Impossible de charger « ${error.path} » (${error.message}).`;
  }
}
