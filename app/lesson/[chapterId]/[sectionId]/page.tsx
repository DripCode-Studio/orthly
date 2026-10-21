"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpenText } from "lucide-react";
import { useChapter, useManifest } from "@/lib/queries";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { describeContentError } from "@/lib/content-service";
import { useLearnerStore } from "@/store/learner-store";
import { toast } from "sonner";

export default function LessonPage() {
  const params = useParams<{ chapterId: string; sectionId: string }>();
  const { chapterId, sectionId } = params;
  const { data: manifest } = useManifest();
  const entry = manifest?.ok ? manifest.data.chapters.find((chapter) => chapter.id === chapterId) : undefined;
  const chapterQuery = useChapter(entry?.content);
  const { hydrate, completeLesson, isLessonCompleted } = useLearnerStore();

  useEffect(() => hydrate(), [hydrate]);

  const chapter = chapterQuery.data?.ok ? chapterQuery.data.data : undefined;
  const section = chapter?.sections.find((s) => s.id === sectionId);
  const lessonId = `${chapterId}:${sectionId}`;
  const completed = isLessonCompleted(lessonId);

  const sectionIndex = chapter ? chapter.sections.findIndex((s) => s.id === sectionId) : -1;
  const nextSection = chapter && sectionIndex >= 0 ? chapter.sections[sectionIndex + 1] : undefined;
  const topicIds = Array.from(
    new Set((section?.concepts.flatMap((concept) => concept.topicIds ?? []) ?? []).filter(Boolean))
  );

  function handleComplete() {
    completeLesson({ lessonId, xp: 25, topicIds });
    toast.success("Leçon terminée", {
      description: "Ta progression et ton XP ont été mis à jour."
    });
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href={`/learn/${chapterId}`}>
              <ArrowLeft className="size-4" />
              Retour au chapitre
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            {completed && <Badge variant="secondary">Déjà terminé</Badge>}
            <Button size="sm" onClick={handleComplete} disabled={completed}>
              <CheckCircle2 className="size-4" />
              {completed ? "Leçon terminée" : "Marquer comme terminée"}
            </Button>
          </div>
        </div>

        <PageHeader
          eyebrow={entry?.title ?? chapterId}
          title={section?.title ?? "Leçon"}
          description={section?.introduction}
        />

        {!chapterQuery.data && <LessonSkeleton />}

        {chapterQuery.data?.ok === false && (
          <Alert>
            <AlertTitle>Contenu non disponible</AlertTitle>
            <AlertDescription>{describeContentError(chapterQuery.data.error)}</AlertDescription>
          </Alert>
        )}

        {chapter && section && (
          <>
            <Card className="border-orthly-learning/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-sm font-extrabold">
                  <BookOpenText className="size-4 text-orthly-learning" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{section.introduction}</p>
              </CardContent>
            </Card>

            {section.concepts.map((concept, index) => (
              <Card key={concept.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg font-extrabold">{concept.title}</CardTitle>
                    <Badge variant="outline">Notion {index + 1}</Badge>
                  </div>
                  <CardDescription>{concept.explanation}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {concept.definition && (
                    <div className="rounded-lg border bg-muted/40 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Définition</p>
                      <p className="mt-1 text-sm font-medium">{concept.definition}</p>
                    </div>
                  )}

                  {concept.rules.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Règles à retenir</p>
                      <ul className="space-y-2">
                        {concept.rules.map((rule) => (
                          <li key={rule.id} className="flex items-start gap-2 text-sm">
                            <span className="mt-1 size-1.5 rounded-full bg-orthly-info" aria-hidden />
                            <span>{rule.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {concept.steps.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Démarche</p>
                      <ol className="space-y-2">
                        {concept.steps.map((step, stepIndex) => (
                          <li key={step.id} className="flex items-start gap-3 text-sm">
                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {stepIndex + 1}
                            </span>
                            <span>{step.text}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {concept.examples.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Exemples tirés du cours</p>
                      <div className="grid gap-2">
                        {concept.examples.map((example) => (
                          <div key={example.id} className="rounded-lg border p-4">
                            <p className="font-medium leading-relaxed">{example.text}</p>
                            <p className="mt-2 text-xs text-muted-foreground">{example.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {concept.commonMistakes.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Erreurs fréquentes</p>
                      <div className="grid gap-2">
                        {concept.commonMistakes.map((mistake) => (
                          <div key={mistake.id} className="rounded-lg border border-orthly-error/40 bg-orthly-error/5 p-4">
                            <p className="text-sm">
                              <span className="font-semibold text-orthly-error">À éviter :</span> {mistake.incorrect}
                            </p>
                            <p className="mt-1 text-sm">
                              <span className="font-semibold text-orthly-learning">Correct :</span> {mistake.correct}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">{mistake.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg bg-muted/40 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">À retenir</p>
                    <p className="mt-1 text-sm font-medium">{concept.takeaway}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg font-extrabold">Synthèse de la section</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.summary.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 size-1.5 rounded-full bg-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button asChild variant="outline">
                <Link href={`/learn/${chapterId}`}>
                  <ArrowLeft className="size-4" />
                  Retour au chapitre
                </Link>
              </Button>
              {nextSection ? (
                <Button asChild>
                  <Link href={`/lesson/${chapterId}/${nextSection.id}`}>
                    Section suivante : {nextSection.title}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={`/practice/${chapterId}`}>
                    Passer à la pratique
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

function LessonSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
