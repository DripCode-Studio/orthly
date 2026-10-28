"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Check, Flame, Sparkles, Target, Timer } from "lucide-react";

import { chapters } from "@/lib/content";
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
import { useLearnerStore } from "@/store/learner-store";

export function Dashboard() {
  const { hydrate, progress } = useLearnerStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const totalLessons = useMemo(
    () => chapters.reduce((total, chapter) => total + chapter.lessons.length, 0),
    []
  );
  const completed = progress.completedLessons.length;
  const completionPercent = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);

  const hasChapterOneContent = true;
  const nextChapterId = hasChapterOneContent ? "chapter-01" : chapters[0]?.id;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Tableau de bord
            </p>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight">
              Bonjour, prêt à progresser ?
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
                {completed === 0 ? "Commence par le chapitre 1" : "Poursuis ton apprentissage"}
              </h2>
              <p className="text-sm text-orthly-learning-pale">
                {completed === 0
                  ? "Découvre les classes de mots, le contexte et les groupes de mots directement depuis le cours UQAR."
                  : "Reprends là où tu en étais et consolide tes acquis avec des exercices ciblés."}
              </p>
              <Button
                asChild
                className="mt-2 bg-orthly-learning-dark text-primary-foreground shadow-none hover:bg-orthly-learning-dark/90"
              >
                <Link href={`/learn/${nextChapterId}`}>
                  {completed === 0 ? "Commencer le chapitre 1" : "Continuer l'apprentissage"}
                  <ArrowRight data-icon="inline-end" />
                </Link>
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
            <Button asChild variant="ghost" size="sm">
              <Link href="/learn">
                Voir tout
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-3">
            {chapters.map((chapter) => {
              const chapterCompleted = chapter.lessons.filter((lesson) =>
                progress.completedLessons.includes(lesson.id)
              ).length;
              const chapterPercent =
                chapter.lessons.length === 0
                  ? 0
                  : Math.round((chapterCompleted / chapter.lessons.length) * 100);
              const isDone = chapterCompleted === chapter.lessons.length && chapter.lessons.length > 0;
              const isAvailable = chapter.id === "chapter-01" || chapter.id === "chapter-02" || chapter.id === "chapter-03" || chapter.id === "chapter-04" || chapter.id === "chapter-05" || chapter.id === "chapter-06" || chapter.id === "chapter-07";

              return (
                <Card
                  key={chapter.id}
                  className={cn(
                    "flex-row items-center gap-4 py-4 transition hover:shadow-sm",
                    isAvailable && "cursor-pointer"
                  )}
                >
                  <Link href={isAvailable ? `/learn/${chapter.id}` : "#"} className="flex flex-1 items-center gap-4">
                    <span
                      className="ml-4 grid size-10 shrink-0 place-items-center rounded-lg font-heading text-sm font-extrabold text-white"
                      style={{ backgroundColor: chapter.color }}
                      aria-hidden
                    >
                      {String(chapter.number).padStart(2, "0")}
                    </span>
                    <CardContent className="min-w-0 flex-1 space-y-2 px-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          Chapitre {chapter.number}
                        </p>
                        {isAvailable ? (
                          <Badge variant="secondary">Disponible</Badge>
                        ) : (
                          <Badge variant="outline">Bientôt</Badge>
                        )}
                      </div>
                      <h3 className="font-heading text-sm font-extrabold">{chapter.title}</h3>
                      <p className="truncate text-xs text-muted-foreground">{chapter.description}</p>
                      {isAvailable && (
                        <>
                          <Progress
                            value={chapterPercent}
                            className="max-w-56"
                            aria-label={`Progression du chapitre ${chapter.number}`}
                          />
                          <p className="text-[10px] text-muted-foreground">
                            {chapterCompleted} / {chapter.lessons.length} étapes
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Link>
                  <div className="mr-4 flex w-24 justify-end">
                    {isAvailable ? (
                      isDone ? (
                        <Check className="size-5 text-primary" aria-label="Chapitre terminé" />
                      ) : (
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/learn/${chapter.id}`}>
                            Ouvrir
                            <ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      )
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
              <CardDescription>Fais une petite session pour garder ton élan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-heading text-2xl font-black">{Math.min(completed, 3)}</span>
                <span className="text-sm text-muted-foreground">/ 3 leçons</span>
              </div>
              <Progress value={Math.min((completed / 3) * 100, 100)} />
              <Button asChild variant="outline" size="sm">
                <Link href="/practice/chapter-01">
                  Faire une session de pratique
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-sm font-extrabold">
                <Timer className="size-4 text-orthly-milestone" />
                À revoir aujourd’hui
              </CardTitle>
              <CardDescription>Réviser avec les cartes éclair pour ancrer les notions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Les cartes du chapitre 1 sont prêtes. Lance une révision espacée pour mieux retenir les règles et les homophones.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/flashcards">
                  Réviser les cartes éclair
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
