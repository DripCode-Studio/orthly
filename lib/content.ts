/**
 * Static chapter navigation derived from the content manifest.
 *
 * This is the learning-path view model, not lesson content. It exists so the
 * sidebar, dashboard, and chapter grid can render before the async manifest
 * fetch resolves. The authoritative content lives in `public/data/`; keep this
 * list aligned with `manifest.json` (the validator warns on drift).
 */

import type { Chapter } from "@/types/content";

export const chapters: Chapter[] = [
  {
    id: "chapter-01",
    number: 1,
    title: "Les classes et les groupes de mots",
    description: "Identifier les mots et comprendre leur fonction dans la phrase.",
    color: "#58cc02",
    lessons: [
      { id: "ch01-intro", title: "Découvrir les classes de mots", type: "lesson", durationMinutes: 8 },
      { id: "ch01-variable", title: "Mots variables et invariables", type: "lesson", durationMinutes: 10 },
      { id: "ch01-practice", title: "Pratique guidée", type: "practice", durationMinutes: 7 },
      { id: "ch01-checkpoint", title: "Point de contrôle", type: "checkpoint", durationMinutes: 12 }
    ]
  },
  {
    id: "chapter-02",
    number: 2,
    title: "La syntaxe de la phrase",
    description: "Construire des phrases claires et reconnaître les erreurs.",
    color: "#1cb0f6",
    lessons: [
      { id: "ch02-intro", title: "La phrase de base", type: "lesson", durationMinutes: 9 },
      { id: "ch02-forms", title: "Types et formes de phrases", type: "lesson", durationMinutes: 10 },
      { id: "ch02-practice", title: "Pratique guidée", type: "practice", durationMinutes: 8 }
    ]
  },
  {
    id: "chapter-03",
    number: 3,
    title: "Le groupe verbal",
    description: "Choisir le bon temps, le bon mode et la bonne construction.",
    color: "#ce82ff",
    lessons: [
      { id: "ch03-intro", title: "Modes et temps", type: "lesson", durationMinutes: 10 },
      { id: "ch03-agreements", title: "Auxiliaires et participe passé", type: "lesson", durationMinutes: 12 },
      { id: "ch03-practice", title: "Pratique guidée", type: "practice", durationMinutes: 8 }
    ]
  },
  {
    id: "chapter-04",
    number: 4,
    title: "Les accords",
    description: "Maîtriser les accords prioritaires du TFLM.",
    color: "#ff9600",
    lessons: [
      { id: "ch04-subject", title: "L’accord sujet-verbe", type: "lesson", durationMinutes: 10 },
      { id: "ch04-past", title: "L’accord du participe passé", type: "lesson", durationMinutes: 12 },
      { id: "ch04-checkpoint", title: "Défi des accords", type: "checkpoint", durationMinutes: 15 }
    ]
  },
  {
    id: "chapter-05",
    number: 5,
    title: "La phrase complexe",
    description: "Relier les propositions avec précision.",
    color: "#58cc02",
    // Ids alignés sur les clés de complétion utilisées par la page de leçon
    // (`${chapterId}:${sectionId}`) : une section terminée compte dans la
    // progression du chapitre.
    lessons: [
      { id: "chapter-05:chapter-05-section-01", title: "La juxtaposition", type: "lesson", durationMinutes: 10 },
      { id: "chapter-05:chapter-05-section-02", title: "La coordination", type: "lesson", durationMinutes: 10 },
      { id: "chapter-05:chapter-05-section-03", title: "La subordination", type: "lesson", durationMinutes: 18 },
      { id: "chapter-05:chapter-05-section-04", title: "La confusion homophonique", type: "lesson", durationMinutes: 8 }
    ]
  },
  {
    id: "chapter-06",
    number: 6,
    title: "La ponctuation",
    description: "Donner à chaque signe son rôle grammatical.",
    color: "#1cb0f6",
    lessons: [{ id: "ch06-intro", title: "Les signes essentiels", type: "lesson", durationMinutes: 8 }]
  },
  {
    id: "chapter-07",
    number: 7,
    title: "Le lexique",
    description: "Choisir le mot juste et éviter les confusions.",
    color: "#ce82ff",
    lessons: [{ id: "ch07-intro", title: "Homophones et paronymes", type: "lesson", durationMinutes: 10 }]
  },
  {
    id: "chapter-08",
    number: 8,
    title: "La structure du paragraphe et du texte",
    description: "Construire un texte cohérent, clair et bien enchaîné.",
    color: "#ff9600",
    lessons: [{ id: "ch08-intro", title: "Idée principale et cohésion", type: "lesson", durationMinutes: 10 }]
  }
];

/** Look up a chapter's navigation entry by its route id. */
export function findChapter(chapterId: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === chapterId);
}
