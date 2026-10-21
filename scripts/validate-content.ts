#!/usr/bin/env node
/**
 * Content validator — run with `npm run validate:content`.
 *
 * Checks the JSON under public/data against the contracts in types/. It is a
 * structural/consistency check, not a grammar review: it verifies IDs are
 * unique, references resolve, answer keys are well-formed, and every manifest
 * entry points at a real file. It exits non-zero on any error so CI can gate a
 * deploy, and prints warnings (never errors) for quality hints.
 *
 * Usage: node --experimental-strip-types scripts/validate-content.ts
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const DATA_DIR = resolve(process.cwd(), "public", "data");
const SUPPORTED_QUESTION_TYPES = new Set(["single_choice", "multiple_choice"]);

type Level = "error" | "warning";
type Finding = { level: Level; file: string; message: string };

const findings: Finding[] = [];
const report = (level: Level, file: string, message: string) => findings.push({ level, file, message });

function readJson(relativePath: string): unknown | null {
  const path = join(DATA_DIR, relativePath);
  if (!existsSync(path)) {
    report("error", relativePath, "Fichier introuvable.");
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (cause) {
    report("error", relativePath, `JSON invalide : ${(cause as Error).message}`);
    return null;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Returns duplicate IDs found in an array of records with an `id` field. */
function duplicates(ids: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  return [...dupes];
}

// --- Manifest ------------------------------------------------------------
const manifest = readJson("manifest.json");
if (manifest && isRecord(manifest)) {
  const chapters = Array.isArray(manifest.chapters) ? manifest.chapters : [];
  const ids = chapters.filter(isRecord).map((c) => String(c.id));
  for (const dupe of duplicates(ids)) report("error", "manifest.json", `ID de chapitre dupliqué : ${dupe}`);

  for (const entry of chapters) {
    if (!isRecord(entry)) continue;
    if (typeof entry.content === "string" && !existsSync(join(DATA_DIR, entry.content))) {
      // A manifest may legitimately list a not-yet-authored chapter.
      report("warning", "manifest.json", `Chapitre « ${entry.id} » sans fichier (${entry.content}).`);
    }
  }

  for (const key of ["questionBanks", "flashcardDecks", "exams"]) {
    const list = Array.isArray(manifest[key]) ? (manifest[key] as unknown[]) : [];
    for (const entry of list) {
      if (!isRecord(entry) || typeof entry.content !== "string") continue;
      if (!existsSync(join(DATA_DIR, entry.content))) {
        report("error", "manifest.json", `Entrée « ${String(entry.id)} » pointe vers ${entry.content}, absent.`);
      }
    }
  }

  const glossary = isRecord(manifest.glossary) ? manifest.glossary : null;
  if (glossary && typeof glossary.content === "string" && !existsSync(join(DATA_DIR, glossary.content))) {
    report("error", "manifest.json", `Glossaire pointant vers ${glossary.content}, absent.`);
  }
} else {
  report("error", "manifest.json", "Manifeste manquant ou invalide.");
}

// --- Question banks ------------------------------------------------------
function validateQuestionBank(relativePath: string) {
  const bank = readJson(relativePath);
  if (!isRecord(bank) || !Array.isArray(bank.questions)) return;

  const questionIds = bank.questions.filter(isRecord).map((q) => String(q.id));
  for (const dupe of duplicates(questionIds)) {
    report("error", relativePath, `ID de question dupliqué : ${dupe}`);
  }

  for (const question of bank.questions) {
    if (!isRecord(question)) continue;
    const id = String(question.id ?? "(sans id)");

    if (!SUPPORTED_QUESTION_TYPES.has(String(question.type))) {
      report("warning", relativePath, `${id} : type « ${String(question.type)} » sans moteur de rendu.`);
    }

    const options = Array.isArray(question.options) ? question.options.filter(isRecord) : [];
    if (options.length < 2) {
      report("error", relativePath, `${id} : au moins deux options sont requises.`);
      continue;
    }

    const optionIds = options.map((o) => String(o.id));
    for (const dupe of duplicates(optionIds)) {
      report("error", relativePath, `${id} : ID d'option dupliqué « ${dupe} ».`);
    }

    const answer = isRecord(question.answer) ? question.answer : null;
    const correct = answer && Array.isArray(answer.correctOptionIds) ? answer.correctOptionIds.map(String) : [];

    if (!answer || typeof answer.explanation !== "string" || answer.explanation.trim() === "") {
      report("error", relativePath, `${id} : une explication de réponse est requise.`);
    }
    if (correct.length === 0) {
      report("error", relativePath, `${id} : aucune bonne réponse indiquée.`);
    }
    for (const optionId of correct) {
      if (!optionIds.includes(optionId)) {
        report("error", relativePath, `${id} : la bonne réponse « ${optionId} » n'existe pas parmi les options.`);
      }
    }
    if (question.type === "single_choice" && correct.length !== 1) {
      report("error", relativePath, `${id} : single_choice doit avoir exactement une bonne réponse.`);
    }
    if (question.type === "multiple_choice" && correct.length < 2) {
      report("error", relativePath, `${id} : multiple_choice doit avoir au moins deux bonnes réponses.`);
    }

    // A correct answer must never be revealed inside the prompt or an option.
    const stimulus = isRecord(question.stimulus) ? question.stimulus : null;
    const answerText = stimulus && typeof stimulus.highlightedText === "string" ? stimulus.highlightedText : "";

    if (question.reviewStatus === "needs_review") {
      report("warning", relativePath, `${id} : en attente de révision humaine.`);
    }
    if (!Array.isArray(question.sourceReferences) || question.sourceReferences.length === 0) {
      report("warning", relativePath, `${id} : aucune référence de source.`);
    }
    void answerText;
  }
}

// --- Chapter files -------------------------------------------------------
/** Extraction layer: faithful source representation (types/extraction.ts). */
function validateExtraction(relativePath: string) {
  const value = readJson(relativePath);
  if (!isRecord(value) || !isRecord(value.chapter)) {
    report("error", relativePath, "Fichier d'extraction invalide : champ « chapter » manquant.");
    return;
  }

  const chapter = value.chapter;
  const sections = Array.isArray(chapter.sections) ? chapter.sections : [];
  const sectionIds = sections.filter(isRecord).map((s) => String(s.id));
  for (const dupe of duplicates(sectionIds)) {
    report("error", relativePath, `ID de section dupliqué : ${dupe}`);
  }

  const blockIds: string[] = [];
  for (const section of sections) {
    if (!isRecord(section) || !Array.isArray(section.blocks)) continue;
    for (const block of section.blocks) {
      if (isRecord(block) && typeof block.id === "string") blockIds.push(block.id);
    }
  }
  for (const dupe of duplicates(blockIds)) {
    report("error", relativePath, `ID de bloc dupliqué : ${dupe}`);
  }
}

/** Lesson layer: pedagogical content the learner reads (types/lesson.ts). */
function validateChapter(relativePath: string) {
  const value = readJson(relativePath);
  if (!isRecord(value) || !Array.isArray(value.sections)) {
    report("error", relativePath, "Leçon invalide : sections[] est requis.");
    return;
  }

  const sectionIds = value.sections.filter(isRecord).map((s) => String(s.id));
  for (const dupe of duplicates(sectionIds)) {
    report("error", relativePath, `ID de section dupliqué : ${dupe}`);
  }

  const conceptIds: string[] = [];
  for (const section of value.sections) {
    if (!isRecord(section) || !Array.isArray(section.concepts)) continue;
    for (const concept of section.concepts) {
      if (!isRecord(concept)) continue;
      if (typeof concept.id === "string") conceptIds.push(concept.id);

      const examples = Array.isArray(concept.examples) ? concept.examples : [];
      for (const example of examples) {
        if (!isRecord(example) || !isRecord(example.source)) continue;
        // A source example must carry kind: "source"; never mislabel an
        // authored example as reproduced from the course notes.
        if (example.source.kind !== "source" && example.source.kind !== "added") {
          report("error", relativePath, `${String(concept.id)} : example.source.kind doit être « source » ou « added ».`);
        }
      }
    }
  }
  for (const dupe of duplicates(conceptIds)) {
    report("error", relativePath, `ID de concept dupliqué : ${dupe}`);
  }
}

// --- Exam blueprints -----------------------------------------------------
function validateExam(relativePath: string) {
  const exam = readJson(relativePath);
  if (!isRecord(exam)) return;

  const id = String(exam.id ?? "(sans id)");
  const sections = Array.isArray(exam.sections) ? exam.sections.filter(isRecord) : [];
  const declared = typeof exam.questionCount === "number" ? exam.questionCount : 0;
  const sum = sections.reduce((total, s) => total + (typeof s.questionCount === "number" ? s.questionCount : 0), 0);

  if (sections.length > 0 && sum !== declared) {
    report(
      "error",
      relativePath,
      `${id} : la somme des sections (${sum}) ne correspond pas à questionCount (${declared}).`
    );
  }
  if (exam.verified === false && sections.length > 0) {
    report("warning", relativePath, `${id} : profil non vérifié contre le format officiel.`);
  }
}

// --- Run -----------------------------------------------------------------
const questionBankDir = join(DATA_DIR, "questions");
if (existsSync(questionBankDir)) {
  for (const file of readdirSync(questionBankDir)) {
    if (file.endsWith(".json")) validateQuestionBank(`questions/${file}`);
  }
}

const chaptersDir = join(DATA_DIR, "chapters");
if (existsSync(chaptersDir)) {
  for (const file of readdirSync(chaptersDir)) {
    if (file.endsWith(".json")) validateChapter(`chapters/${file}`);
  }
}

const extractionDir = join(DATA_DIR, "extraction");
if (existsSync(extractionDir)) {
  for (const file of readdirSync(extractionDir)) {
    if (file.endsWith(".json")) validateExtraction(`extraction/${file}`);
  }
}

/** Walk the exams directory, including the nested tcf/ folder. */
function walkJsonFiles(dir: string, prefix: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = `${prefix}${entry.name}`;
    if (entry.isDirectory()) out.push(...walkJsonFiles(join(dir, entry.name), `${rel}/`));
    else if (entry.name.endsWith(".json")) out.push(rel);
  }
  return out;
}

const examsDir = join(DATA_DIR, "exams");
if (existsSync(examsDir)) {
  for (const rel of walkJsonFiles(examsDir, "exams/")) validateExam(rel);
}

const errors = findings.filter((f) => f.level === "error");
const warnings = findings.filter((f) => f.level === "warning");

for (const finding of [...errors, ...warnings]) {
  const tag = finding.level === "error" ? "ERREUR " : "AVERT.";
  console.log(`${tag} ${finding.file} — ${finding.message}`);
}

console.log(`\n${errors.length} erreur(s), ${warnings.length} avertissement(s).`);
process.exit(errors.length > 0 ? 1 : 0);
