"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, BarChart3 } from "lucide-react";
import { useManifest, useQuestionBank } from "@/lib/queries";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { describeContentError } from "@/lib/content-service";
import { useLearnerStore } from "@/store/learner-store";
import { toast } from "sonner";
import type { Question } from "@/types/question";
import { cn } from "@/lib/utils";

export default function PracticeQuizPage() {
  const params = useParams<{ chapterId: string }>();
  const chapterId = params.chapterId;
  const { data: manifest } = useManifest();
  const bankEntry = manifest?.ok
    ? manifest.data.questionBanks.find((bank) => bank.chapterId === chapterId)
    : undefined;
  const bankQuery = useQuestionBank(bankEntry?.content);
  const { hydrate, recordAttempt } = useLearnerStore();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Array<{ questionId: string; correct: boolean; selected: string[] }>>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => hydrate(), [hydrate]);

  const bank = bankQuery.data?.ok ? bankQuery.data.data : undefined;
  const questions = bank?.questions ?? [];
  const question: Question | undefined = questions[index];
  const progress = questions.length === 0 ? 0 : Math.round(((revealed ? index + 1 : index) / questions.length) * 100);

  function toggleOption(optionId: string) {
    if (!question || revealed) return;
    if (question.type === "single_choice") {
      setSelected([optionId]);
      return;
    }
    setSelected((current) =>
      current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId]
    );
  }

  function checkAnswer() {
    if (!question || selected.length === 0) return;
    const correctSet = new Set(question.answer.correctOptionIds);
    const isCorrect =
      selected.length === correctSet.size && selected.every((id) => correctSet.has(id));
    setAnswers((current) => [...current, { questionId: question.id, correct: isCorrect, selected }]);
    setRevealed(true);
  }

  function nextQuestion() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelected([]);
      setRevealed(false);
      return;
    }
    const correctCount = answers.filter((a) => a.correct).length + 0;
    const finalCorrect = answers.filter((a) => a.correct).length;
    setFinished(true);
    const incorrectIds = answers.filter((a) => !a.correct).map((a) => a.questionId);
    recordAttempt({
      kind: "practice",
      correctCount: finalCorrect,
      questionCount: answers.length,
      categoryBreakdown: {},
      incorrectQuestionIds: incorrectIds
    });
    toast.success("Pratique terminée", {
      description: `${finalCorrect} / ${answers.length} bonnes réponses.`
    });
  }

  // Fix: when revealing last question, we need to count current answer
  function revealAndPrepareNext() {
    if (!question || selected.length === 0 || revealed) return;
    const correctSet = new Set(question.answer.correctOptionIds);
    const isCorrect = selected.length === correctSet.size && selected.every((id) => correctSet.has(id));
    const updatedAnswers = [...answers, { questionId: question.id, correct: isCorrect, selected }];
    setAnswers(updatedAnswers);
    setRevealed(true);
    if (index + 1 >= questions.length) {
      setFinished(true);
      const incorrectIds = updatedAnswers.filter((a) => !a.correct).map((a) => a.questionId);
      recordAttempt({
        kind: "practice",
        correctCount: updatedAnswers.filter((a) => a.correct).length,
        questionCount: updatedAnswers.length,
        categoryBreakdown: {},
        incorrectQuestionIds: incorrectIds
      });
      toast.success("Pratique terminée", {
        description: `${updatedAnswers.filter((a) => a.correct).length} / ${updatedAnswers.length} bonnes réponses.`
      });
    }
  }

  function goNextAfterReveal() {
    if (!finished && index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelected([]);
      setRevealed(false);
    }
  }

  const correctSet = question ? new Set(question.answer.correctOptionIds) : new Set<string>();
  const correctCount = answers.filter((a) => a.correct).length;
  const accuracy = answers.length === 0 ? 0 : Math.round((correctCount / answers.length) * 100);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/practice">
              <ArrowLeft className="size-4" />
              Retour à la pratique
            </Link>
          </Button>
          {questions.length > 0 && !finished && (
            <Badge variant="outline">
              Question {index + 1} / {questions.length}
            </Badge>
          )}
        </div>

        <PageHeader
          eyebrow="Pratique guidée"
          title={bank?.title ?? "Banque de questions"}
          description="Lis attentivement, choisis ta réponse et prends le temps de lire l'explication grammaticale."
        />

        {!bankQuery.data && <QuizSkeleton />}

        {bankQuery.data?.ok === false && (
          <Alert>
            <AlertTitle>Banque de questions non disponible</AlertTitle>
            <AlertDescription>{describeContentError(bankQuery.data.error)}</AlertDescription>
          </Alert>
        )}

        {bankQuery.data?.ok && questions.length === 0 && (
          <Alert>
            <AlertTitle>Aucune question</AlertTitle>
            <AlertDescription>Cette banque est vide pour l'instant. Ajoute des questions dans public/data/questions/.</AlertDescription>
          </Alert>
        )}

        {bankQuery.data?.ok && questions.length > 0 && !finished && question && (
          <>
            <Progress value={progress} />
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-lg font-extrabold">{question.prompt}</CardTitle>
                  <Badge variant="outline">{question.difficulty}</Badge>
                </div>
                {question.stimulus?.text && (
                  <CardDescription className="text-base font-medium text-foreground">
                    {question.stimulus?.highlightedText ? (
                      <span>
                        {question.stimulus.text.split(question.stimulus.highlightedText).map((part, i, arr) => (
                          <span key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <mark className="rounded bg-orthly-milestone/30 px-1">{question.stimulus.highlightedText}</mark>
                            )}
                          </span>
                        ))}
                      </span>
                    ) : (
                      question.stimulus.text
                    )}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {question.options.map((option) => {
                  const isSelected = selected.includes(option.id);
                  const isCorrect = correctSet.has(option.id);
                  const showCorrect = revealed && isCorrect;
                  const showIncorrect = revealed && isSelected && !isCorrect;

                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      disabled={revealed}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition",
                        !revealed && isSelected && "border-primary bg-primary/5",
                        !revealed && !isSelected && "hover:border-primary/50",
                        revealed && showCorrect && "border-orthly-learning bg-orthly-learning/10",
                        revealed && showIncorrect && "border-orthly-error bg-orthly-error/10",
                        revealed && !showCorrect && !showIncorrect && "opacity-60"
                      )}
                    >
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold">
                        {option.id}
                      </span>
                      <span className="flex-1 text-sm">{option.text}</span>
                      {showCorrect && <CheckCircle2 className="size-5 text-orthly-learning" />}
                      {showIncorrect && <XCircle className="size-5 text-orthly-error" />}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {!revealed ? (
              <div className="flex justify-end">
                <Button onClick={revealAndPrepareNext} disabled={selected.length === 0}>
                  Vérifier la réponse
                </Button>
              </div>
            ) : (
              <>
                <Card className="border-orthly-info/40 bg-orthly-info/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-heading text-sm font-extrabold">
                      <Lightbulb className="size-4 text-orthly-info" />
                      Explication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{question.answer.explanation}</p>
                  </CardContent>
                </Card>
                <div className="flex justify-end">
                  <Button onClick={goNextAfterReveal}>
                    {index + 1 < questions.length ? "Question suivante" : "Voir les résultats"}
                    <ArrowLeft className="size-4 rotate-180" />
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {finished && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-orthly-learning/10">
                <BarChart3 className="size-7 text-orthly-learning" />
              </div>
              <CardTitle className="mt-4 font-heading text-2xl font-extrabold">Résultats de la pratique</CardTitle>
              <CardDescription>Bon travail. Prends le temps de relire les explications pour consolider tes acquis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="font-heading text-4xl font-black">{correctCount}</p>
                  <p className="text-xs text-muted-foreground">Bonnes réponses</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-4xl font-black">{answers.length}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-4xl font-black">{accuracy}%</p>
                  <p className="text-xs text-muted-foreground">Précision</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Button asChild>
                  <Link href={`/practice/${chapterId}`}>Recommencer</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/practice">Autres chapitres</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/learn/${chapterId}`}>Revoir le chapitre</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

function QuizSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}
