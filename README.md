# Orthly

Orthly est une application web statique pour apprendre le français et se préparer au TFLM. Elle repose sur un contenu structuré issu de la matière de cours et sur un mode d'apprentissage à base de leçons, questions à choix multiples, cartes éclair et suivi de progression local.

## Fonctionnalités

- **Apprendre** : Leçons pédagogiques par chapitre (syntaxe, classes de mots, groupe verbal, etc.)
- **Pratiquer** : Questions à choix multiples et multiples avec explications grammaticales
- **Cartes éclair** : Révision espacée (SRS) avec notation de la maîtrise
- **Examens** : Simulations selon des profils configurés
- **Progression** : Suivi local (XP, série, leçons complétées, historique des tentatives)
- **Paramètres** : Export/réinitialisation des données locales

## Stack technique

- [Next.js 15](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) pour l'état local
- [TanStack Query](https://tanstack.com/query) pour le chargement du contenu JSON
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [Lucide React](https://lucide.dev/) pour les icônes
- [Sonner](https://sonner.emilkowal.ski/) pour les toasts

## Démarrage

```bash
npm install
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run start
```

## Contenu

Le contenu est stocké dans `public/data/` :
- `chapters/` : Leçons pédagogiques au format `LessonChapter` (types/lesson.ts)
- `questions/` : Banques de questions (types/question.ts)  
- `flashcards/` : Jeux de cartes (types/flashcard.ts)
- `exams/` : Profils d'examens (types/exam.ts)
- `manifest.json` : Point d'entrée du contenu

**Règles importantes :**
- Tout le contenu est statique (pas de backend). Les données sont servies depuis `public/data/`.
- La progression est stockée uniquement dans `localStorage` du navigateur (`orthly:*:v1`).
- Aucun temps, nombre de questions ou seuil n'est inventé. Seuls les profils marqués « vérifié » activent une simulation complète.
- Le contenu fidèle au cours (UQAR) est préservé; les exemples et explications suivent les sources.

## Développement

```bash
npm run typecheck
npm run validate:content  # Validation des fichiers JSON sous public/data
```

## Remarques

Ce projet a été entièrement **vibecoded** (généré/itéré avec assistance IA) dans un contexte d'apprentissage et d'expérimentation.
