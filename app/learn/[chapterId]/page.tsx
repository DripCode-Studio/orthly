"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, FileText } from "lucide-react";
import { useChapter, useManifest } from "@/lib/queries";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { describeContentError } from "@/lib/content-service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLearnerStore } from "@/store/learner-store";
import { useEffect } from "react";

export default function ChapterPage() {
  const params = useParams<{ chapterId: string }>();
  const chapterId = params.chapterId;
  const { data: manifest } = useManifest();
  const entry = manifest?.ok ? manifest.data.chapters.find((chapter) => chapter.id === chapterId) : undefined;
  const chapterQuery = useChapter(entry?.content);
  const { hydrate, isLessonCompleted } = useLearnerStore();

  useEffect(() => hydrate(), [hydrate]);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/learn">
              <ArrowLeft className="size-4" />
              Retour aux chapitres
            </Link>
          </Button>
        </div>

        <PageHeader
          eyebrow="Chapitre"
          title={entry?.title ?? chapterId}
          description="Leçon, objectifs d'apprentissage et synthèse tirés directement du contenu validé."
        />

        {!chapterQuery.data && <ChapterSkeleton />}

        {chapterQuery.data?.ok === false && (
          <Alert>
            <AlertTitle>Contenu non disponible</AlertTitle>
            <AlertDescription>{describeContentError(chapterQuery.data.error)}</AlertDescription>
          </Alert>
        )}

        {chapterQuery.data?.ok && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-lg font-extrabold">
                  <BookOpen className="size-5 text-orthly-learning" />
                  {chapterQuery.data.data.title}
                </CardTitle>
                <CardDescription>{chapterQuery.data.data.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Objectifs d'apprentissage
                  </p>
                  <ul className="mt-2 space-y-2">
                    {chapterQuery.data.data.learningObjectives.map((objective) => (
                      <li key={objective.id} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 size-1.5 rounded-full bg-primary" aria-hidden />
                        <span>{objective.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">~{chapterQuery.data.data.estimatedMinutes} min</Badge>
                  <Badge variant="outline">{chapterQuery.data.data.sections.length} sections</Badge>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Leçons</p>
                  <h2 className="font-heading text-lg font-extrabold">Sections du chapitre</h2>
                </div>
              </div>

              <div className="grid gap-3">
                {chapterQuery.data.data.sections.map((section) => {
                  const lessonId = `${chapterId}:${section.id}`;
                  const completed = isLessonCompleted(lessonId);
                  return (
                    <Card key={section.id} className="flex-row items-center gap-4 py-4">
                      <span className="ml-4 grid size-10 shrink-0 place-items-center rounded-lg bg-orthly-navy/10 font-heading text-sm font-extrabold text-orthly-navy">
                        {section.order}
                      </span>
                      <CardContent className="min-w-0 flex-1 space-y-1 px-0">
                        <h3 className="font-heading text-sm font-extrabold">{section.title}</h3>
                        <p className="truncate text-xs text-muted-foreground">{section.introduction}</p>
                        <p className="text-[10px] text-muted-foreground">{section.concepts.length} notions</p>
                      </CardContent>
                      <div className="mr-4 flex items-center gap-2">
                        {completed && <Badge variant="secondary">Terminé</Badge>}
                        <Button asChild size="sm">
                          <Link href={`/lesson/${chapterId}/${section.id}`}>
                            <FileText className="size-4" />
                            Lire la leçon
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-sm font-extrabold">Synthèse</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {chapterQuery.data.data.sections
                    .flatMap((section) => section.summary)
                    .slice(0, 6)
                    .map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="mt-1 size-1.5 rounded-full bg-muted-foreground" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}

function ChapterSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
