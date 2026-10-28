"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { chapters } from "@/lib/content";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useLearnerStore } from "@/store/learner-store";
import { useEffect } from "react";

export default function LearnPage() {
  const { hydrate, progress } = useLearnerStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const totalLessons = chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <PageHeader
          eyebrow="Apprendre"
          title="Parcours de français"
          description="Chaque chapitre est structuré autour de notions tirées du cours UQAR. Commence ici pour construire des bases solides."
        />

        <Card className="border-orthly-learning/40 bg-orthly-learning/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg font-extrabold">
              <BookOpen className="size-5 text-orthly-learning" />
              Structure du parcours
            </CardTitle>
            <CardDescription>
              {chapters.length} chapitres • {totalLessons} étapes au total.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Les chapitres s'appuient sur les fiches pédagogiques : la classe des mots, la syntaxe, les accords, la
            phrase complexe, la ponctuation, le lexique et la cohésion du texte.
          </CardContent>
        </Card>

        <div className="grid gap-3">
          {chapters.map((chapter) => {
            const isAvailable = chapter.id === "chapter-01" || chapter.id === "chapter-02" || chapter.id === "chapter-03" || chapter.id === "chapter-04" || chapter.id === "chapter-05" || chapter.id === "chapter-06" || chapter.id === "chapter-07";
            const chapterCompleted = chapter.lessons.filter((lesson) =>
              progress.completedLessons.includes(lesson.id)
            ).length;
            const chapterPercent =
              chapter.lessons.length === 0 ? 0 : Math.round((chapterCompleted / chapter.lessons.length) * 100);

            return (
              <Card key={chapter.id} className={cn("flex-row items-center gap-4 py-4")}>
                {isAvailable ? (
                  <Link href={`/learn/${chapter.id}`} className="flex flex-1 items-center gap-4">
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
                        <Badge variant="secondary">Disponible</Badge>
                      </div>
                      <h3 className="font-heading text-sm font-extrabold">{chapter.title}</h3>
                      <p className="truncate text-xs text-muted-foreground">{chapter.description}</p>
                      <Progress value={chapterPercent} className="max-w-56" aria-label={`Progression du chapitre ${chapter.number}`} />
                      <p className="text-[10px] text-muted-foreground">
                        {chapterCompleted} / {chapter.lessons.length} étapes
                      </p>
                    </CardContent>
                  </Link>
                ) : (
                  <div className="flex flex-1 items-center gap-4">
                    <span
                      className="ml-4 grid size-10 shrink-0 place-items-center rounded-lg font-heading text-sm font-extrabold text-white opacity-50"
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
                        <Badge variant="outline">Bientôt</Badge>
                      </div>
                      <h3 className="font-heading text-sm font-extrabold opacity-60">{chapter.title}</h3>
                      <p className="truncate text-xs text-muted-foreground opacity-60">{chapter.description}</p>
                    </CardContent>
                  </div>
                )}
                <div className="mr-4 flex w-28 justify-end">
                  {isAvailable ? (
                    <Button asChild size="sm">
                      <Link href={`/learn/${chapter.id}`}>
                        Ouvrir le chapitre
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      Bientôt
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
