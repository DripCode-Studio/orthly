/**
 * The content manifest. `public/data/manifest.json` is the single entry point
 * the content service reads first; every other collection is discovered through
 * it. Adding a chapter, bank, deck, or exam is a manifest edit plus a JSON file,
 * never a code change.
 */

import type { ChapterId, ExamId } from "./ids";

export type ManifestChapterEntry = {
  id: ChapterId;
  number: number;
  title: string;
  /** Path relative to public/data, e.g. "chapters/chapter-01.json". */
  content: string;
  /** Optional: chapter may be published before its exercises are authored. */
  status?: "draft" | "published";
};

export type ManifestCollectionEntry = {
  id: string;
  chapterId?: ChapterId;
  title: string;
  content: string;
};

export type ManifestExamEntry = {
  id: ExamId;
  title: string;
  content: string;
  verified: boolean;
};

export type ContentManifest = {
  schemaVersion: string;
  document: {
    id: string;
    title: string;
    language: "fr-CA";
  };
  chapters: ManifestChapterEntry[];
  questionBanks: ManifestCollectionEntry[];
  flashcardDecks: ManifestCollectionEntry[];
  exams: ManifestExamEntry[];
  glossary?: { content: string };
};
