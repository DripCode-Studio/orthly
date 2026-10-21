/**
 * Flashcard deck content. Cards mirror rule/error/homophone knowledge so it can
 * be reviewed on its own schedule, separately from quizzes.
 *
 * The card itself is immutable content. Its review state (interval, ease, next
 * due date) lives only in localStorage — see types/progress.ts. Keeping the two
 * apart means a deck can be replaced without discarding a learner's history.
 */

import type { ContentOrigin, Difficulty, SourceReference } from "./common";
import type { ChapterId, FlashcardId } from "./ids";

export type FlashcardType =
  | "rule"
  | "definition"
  | "example"
  | "common_error"
  | "vocabulary"
  | "homophone"
  | "conjugation";

export type Flashcard = {
  id: FlashcardId;
  chapterId: ChapterId;
  topicIds: string[];
  type: FlashcardType;
  front: string;
  back: string;
  example: string | null;
  tags: string[];
  difficulty: Difficulty;
  origin: ContentOrigin;
  sourceRef: SourceReference | null;
};

export type FlashcardDeck = {
  schemaVersion: string;
  chapterId: ChapterId;
  deckId: string;
  title: string;
  cards: Flashcard[];
};
