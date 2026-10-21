/**
 * Barrel export for the shared content and learner-state contracts.
 *
 * Import from `@/types` in application code. Keep the layers straight:
 * - extraction.ts : faithful source representation (intermediate)
 * - lesson.ts     : pedagogical lesson the learner reads (derived)
 * - question.ts   : reusable question banks
 * - flashcard.ts  : reusable decks
 * - exam.ts       : exam blueprints
 * - progress.ts   : localStorage-owned learner state
 * - session.ts    : in-memory runtime session models
 * - manifest.ts   : content discovery
 */

export * from "./common";
export * from "./ids";
export * from "./extraction";
export * from "./lesson";
export * from "./question";
export * from "./flashcard";
export * from "./exam";
export * from "./progress";
export * from "./session";
export * from "./manifest";
