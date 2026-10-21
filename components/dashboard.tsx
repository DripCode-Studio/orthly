"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Flame, Sparkles, Target, Timer } from "lucide-react";

import { chapters } from "@/lib/content";
import { EMPTY_PROGRESS, loadProgress, saveProgress } from "@/lib/storage";
import type { ProgressState } from "@/types/progress";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);

  useEffect(() => setProgress(loadProgress()), []);

  const totalLessons = useMemo(
    () => chapters.reduce((total, chapter) => total + chapter.lessons.length, 0),
    []
  );
  const completed = progress.completedLessons.length;
  const completionPercent = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);
  const nextLesson = chapters
    .flatMap((chapter) => chapter.lessons)
    .find((lesson) => !progress.completedLessons.includes(lesson.id));

  function completeNextLesson() {
    if (!nextLesson) return;
    const next: ProgressState = {
      ...progress,
      completedLessons: [...progress.completedLessons, nextLesson.id],
      xp: progress.xp + 20,
      streak: Math.max(progress.streak, 1),
      lastActivityDate: new Date().toISOString().slice(0, 10)
    };
    setProgress(next);
    saveProgress(next);
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-expanded font-bold uppercase tracking-wide text-muted-foreground">
              Tableau de bord
            </p>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight">
              Bonjour, prêt à progresser?
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Flame className="size-3 text-orthly-streak" />
              {progress.streak} jour{progress.streak === 1 ? "" : "s"}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Sparkles className="size-3 text-orthly-milestone" />
              {progress.xp} XP
            </Badge>
          </div>
        </header>

        <Card className="overflow-hidden border-transparent bg-orthly-learning text-primary-foreground">
          <CardContent className="flex flex-wrap items-center justify-between gap-6 py-8">
            <div className="max-w-md space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-orthly-learning-pale">
                Ton prochain pas
              </p>
              <h2 className="font-heading text-xl font-extrabold">
                {nextLesson ? "Continue ton apprentissage" : "Parcours terminé!"}
              </h2>
              <p className="text-sm text-orthly-learning-pale">
                {nextLesson
                  ? `Reprends avec « ${nextLesson.title} » et garde ton élan.`
                  : "Bravo, tu as parcouru toutes les leçons disponibles."}
              </p>
              <Button
                className="mt-2 bg-orthly-learning-dark text-primary-foreground shadow-none hover:bg-orthly-learning-dark/90"
                onClick={completeNextLesson}
              >
                {nextLesson ? "Commencer la leçon" : "Revoir mes notions"}
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
            <div
              className="grid size-28 place-content-center rounded-full border-2 border-white/30 text-center"
              role="img"
              aria-label={`${completionPercent} % du parcours terminé`}
            >
              <span className="font-heading text-2xl font-black">{completionPercent}%</span>
              <span className="text-[10px] text-orthly-learning-pale">parcours</span>
            </div>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Ton parcours
              </p>
              <h2 className="font-heading text-lg font-extrabold">Apprendre le français</h2>
            </div>
            <Button variant="ghost" size="sm">
              Voir tout
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>

          <div className="grid gap-3">
            {chapters.map((chapter) => {
              const chapterCompleted = chapter.lessons.filter((lesson) =>
                progress.completedLessons.includes(lesson.id)
              ).length;
              const isCurrent = chapter.lessons.some((lesson) => lesson.id === nextLesson?.id);
              const chapterPercent =
                chapter.lessons.length === 0
                  ? 0
                  : Math.round((chapterCompleted / chapter.lessons.length) * 100);
              const isDone = chapterCompleted === chapter.lessons.length && chapter.lessons.length > 0;

              return (
                <Card key={chapter.id} className={cn("flex-row items-center gap-4 py-4", isCurrent && "ring-2 ring-primary/40")}>
                  <span
                    className="ml-4 grid size-10 shrink-0 place-items-center rounded-lg font-heading text-sm font-extrabold text-white"
                    style={{ backgroundColor: chapter.color }}
                    aria-hidden
                  >
                    {String(chapter.number).padStart(2, "0")}
                  </span>
                  <CardContent className="min-w-0 flex-1 space-y-2 px-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      Chapitre {chapter.number}
                    </p>
                    <h3 className="font-heading text-sm font-extrabold">{chapter.title}</h3>
                    <p className="truncate text-xs text-muted-foreground">{chapter.description}</p>
                    <Progress value={chapterPercent} className="max-w-56" aria-label={`Progression du chapitre ${chapter.number}`} />
                    <p className="text-[10px] text-muted-foreground">
                      {chapterCompleted} / {chapter.lessons.length} étapes
                    </p>
                  </CardContent>
                  <div className="mr-4 flex w-24 justify-end">
                    {isCurrent ? (
                      <Button size="sm" onClick={completeNextLesson}>
                        Continuer
                      </Button>
                    ) : isDone ? (
                      <Check className="size-5 text-primary" aria-label="Chapitre terminé" />
                    ) : (
                      <ArrowRight className="size-5 text-muted-foreground" aria-hidden />
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-sm font-extrabold">
                <Target className="size-4 text-orthly-info" />
                Objectif du jour
              </CardTitle>
              <CardDescription>Une petite session suffit pour avancer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-heading text-2xl font-black">{Math.min(completed, 3)}</span>
                <span className="text-sm text-muted-foreground">/ 3 leçons</span>
              </div>
              <Progress value={Math.min((completed / 3) * 100, 100)} />
              <Button variant="outline" size="sm" onClick={completeNextLesson}>
                Faire une session
                <ArrowRight data-icon="inline-end" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-sm font-extrabold">
                <Timer className="size-4 text-orthly-milestone" />
                À revoir aujourd’hui
              </CardTitle>
              <CardDescription>
                Les recommandations apparaîtront une fois des questions validées ajoutées.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Aucune carte éclair due pour l’instant. Ajoute du contenu pour activer les révisions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
