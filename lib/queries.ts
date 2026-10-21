/**
 * TanStack Query hooks over the content service.
 *
 * Every page reads content through these hooks rather than calling `fetch`
 * directly. Content is static JSON shipped in `public/data/`, so results are
 * cached for the life of the tab (`staleTime: Infinity` in `providers.tsx`).
 *
 * A `ContentResult` failure is not a thrown exception: the query succeeds and
 * returns the result union, so a page can render a friendly empty state for a
 * missing chapter instead of crashing on an error boundary.
 */

"use client";

import { useQuery } from "@tanstack/react-query";

import {
  loadChapter,
  loadExamBlueprint,
  loadFlashcardDeck,
  loadManifest,
  loadQuestionBank
} from "@/lib/content-service";

export function useManifest() {
  return useQuery({
    queryKey: ["manifest"],
    queryFn: () => loadManifest()
  });
}

export function useChapter(path: string | undefined) {
  return useQuery({
    queryKey: ["chapter", path],
    queryFn: () => loadChapter(path as string),
    enabled: Boolean(path)
  });
}

export function useQuestionBank(path: string | undefined) {
  return useQuery({
    queryKey: ["question-bank", path],
    queryFn: () => loadQuestionBank(path as string),
    enabled: Boolean(path)
  });
}

export function useFlashcardDeck(path: string | undefined) {
  return useQuery({
    queryKey: ["flashcard-deck", path],
    queryFn: () => loadFlashcardDeck(path as string),
    enabled: Boolean(path)
  });
}

export function useExamBlueprint(path: string | undefined) {
  return useQuery({
    queryKey: ["exam", path],
    queryFn: () => loadExamBlueprint(path as string),
    enabled: Boolean(path)
  });
}
