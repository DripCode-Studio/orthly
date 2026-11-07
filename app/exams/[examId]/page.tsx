"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock, AlertTriangle, CheckCircle2, XCircle, Lightbulb, BarChart3 } from "lucide-react";
import { useExamBlueprint, useManifest, useQuestionBank } from "@/lib/queries";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { describeContentError } from "@/lib/content-service";
import { useLearnerStore } from "@/store/learner-store";
import { toast } from "sonner";
import { selectQuestionsForBlueprint } from "@/lib/questionSelector";
import type { Question } from "@/types/question";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExamPage() {
  const params = useParams<{ examId: string }>();
  const examId = params.examId;
  const { data: manifest } = useManifest();
  const examEntry = manifest?.ok ? manifest.data.exams.find((exam) => exam.id === examId) : undefined;
  const examQuery = useExamBlueprint(examEntry?.content);

  const exam = examQuery.data?.ok ? examQuery.data.data : undefined;

  const bankId = exam?.questionBankId ?? "tflm-core";
  // Load the question bank for this exam.
  const bankEntry = manifest?.ok
    ? manifest.data.questionBanks.find((b) => b.id === bankId)
    : undefined;
  const bankQuery = useQuestionBank(bankEntry?.content);

  const { hydrate, recordAttempt } = useLearnerStore();

  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => hydrate(), [hydrate]);

  const seed = useMemo(() => {
    let s = 0;
    for (let i = 0; i < examId.length; i++) s = (s * 31 + examId.charCodeAt(i)) >>> 0;
    return s;
  }, [examId]);

  const selection = useMemo(() => {
    if (!exam || !bankQuery.data?.ok) return null;
    const banks = [bankQuery.data.data];
    return selectQuestionsForBlueprint(exam, banks, { seed });
  }, [exam, bankQuery.data, seed]);

  const questions: Question[] = selection && selection.questions ? selection.questions : [];

  useEffect(() => {
    if (!started || !exam || exam.durationSeconds === 0) return;
    setSecondsLeft(exam.durationSeconds);
    const interval = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, exam]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (started && !submitted && secondsLeft === 0 && exam && exam.durationSeconds > 0 && questions.length > 0) {
      submitExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  function startExam() {
    if (!exam) return;
    if (!exam.verified && !exam.id.startsWith("tflm-simulation")) {
      toast.error("Profil non vérifié", {
        description: "Ce profil doit être validé contre le format officiel avant d'être utilisé."
      });
      return;
    }
    if (!selection || questions.length === 0) {
      toast.error("Aucune question disponible", {
        description: selection && "shortfalls" in selection
          ? selection.shortfalls.map((s) => `${s.categoryId}: ${s.available}/${s.requested}`).join(", ")
          : "Banque de questions introuvable."
      });
      return;
    }
    setStarted(true);
    setCurrentIndex(0);
    setAnswers({});
    setFinished(false);
    setSubmitted(false);
    toast.info("Simulation lancée", {
      description: exam.durationSeconds > 0 ? `Temps imparti : ${formatTime(exam.durationSeconds)}` : "Aucun chronomètre configuré."
    });
  }

  function toggleOption(qid: string, optionId: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: [optionId] }));
  }

  function submitExam() {
    setSubmitted(true);
    setFinished(true);
    const correctCount = questions.filter((q) => {
      const sel = answers[q.id] ?? [];
      const correctSet = new Set(q.answer.correctOptionIds);
      return sel.length === correctSet.size && sel.every((id) => correctSet.has(id));
    }).length;
    const incorrectIds = questions.filter((q) => {
      const sel = answers[q.id] ?? [];
      const correctSet = new Set(q.answer.correctOptionIds);
      return !(sel.length === correctSet.size && sel.every((id) => correctSet.has(id)));
    }).map((q) => q.id);
    recordAttempt({
      kind: "exam",
      examId,
      correctCount,
      questionCount: questions.length,
      categoryBreakdown: {},
      incorrectQuestionIds: incorrectIds
    });
    toast.success("Simulation terminée", {
      description: `${correctCount} / ${questions.length} bonnes réponses.`
    });
  }

  const currentQuestion: Question | undefined = questions[currentIndex];
  const progress = questions.length === 0 ? 0 : Math.round(((currentIndex + (submitted ? 1 : 0)) / questions.length) * 100);

  // Results
  const correctCount = submitted
    ? questions.filter((q) => {
        const sel = answers[q.id] ?? [];
        const correctSet = new Set(q.answer.correctOptionIds);
        return sel.length === correctSet.size && sel.every((id) => correctSet.has(id));
      }).length
    : 0;
  const accuracy = questions.length === 0 ? 0 : Math.round((correctCount / questions.length) * 100);

  // Category breakdown
  const categoryStats = useMemo(() => {
    if (!submitted) return [];
    const map = new Map<string, { total: number; correct: number }>();
    for (const q of questions) {
      const cat = (q.examCategories && q.examCategories[0]) || "autre";
      const sel = answers[q.id] ?? [];
      const correctSet = new Set(q.answer.correctOptionIds);
      const isCorrect = sel.length === correctSet.size && sel.every((id) => correctSet.has(id));
      const cur = map.get(cat) ?? { total: 0, correct: 0 };
      cur.total += 1;
      if (isCorrect) cur.correct += 1;
      map.set(cat, cur);
    }
    return Array.from(map.entries()).map(([cat, v]) => ({ cat, ...v, pct: Math.round((v.correct / v.total) * 100) }));
  }, [submitted, questions, answers]);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/exams">
              <ArrowLeft className="size-4" />
              Retour aux examens
            </Link>
          </Button>
        </div>

        <PageHeader
          eyebrow="Simulation"
          title={exam?.title ?? examId}
          description={exam?.description}
        />

        {examQuery.data?.ok === false && (
          <Alert>
            <AlertTitle>Profil d'examen non disponible</AlertTitle>
            <AlertDescription>{describeContentError(examQuery.data.error)}</AlertDescription>
          </Alert>
        )}

        {bankQuery.data?.ok === false && (
          <Alert>
            <AlertTitle>Banque de questions non disponible</AlertTitle>
            <AlertDescription>{describeContentError(bankQuery.data.error)}</AlertDescription>
          </Alert>
        )}

        {exam && !started && !submitted && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-extrabold">Durée</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="font-heading text-lg font-extrabold">
                    {exam.durationSeconds === 0 ? "Non définie" : formatTime(exam.durationSeconds)}
                  </span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-extrabold">Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="font-heading text-lg font-extrabold">
                    {questions.length === 0 ? exam.questionCount : questions.length}
                  </span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-extrabold">Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="font-heading text-lg font-extrabold">TFLM pratique</span>
                </CardContent>
              </Card>
            </div>

            {!exam.verified && (
              <Alert>
                <AlertTriangle className="size-4" />
                <AlertTitle>Simulation non officielle</AlertTitle>
                <AlertDescription>
                  Profil de pratique non vérifié contre le format officiel. Les résultats sont indicatifs.
                </AlertDescription>
              </Alert>
            )}

            {selection && "shortfalls" in selection && (
              <Alert>
                <AlertTitle>Manque de questions</AlertTitle>
                <AlertDescription>
                  {selection.shortfalls.map((s) => `${s.categoryId}: ${s.available}/${s.requested}`).join(" · ")}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center">
              <Button size="lg" onClick={startExam} disabled={questions.length === 0}>
                Lancer la simulation
              </Button>
            </div>
          </>
        )}

        {exam && started && !submitted && currentQuestion && (
          <>
            <Progress value={progress} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Question {currentIndex + 1} / {questions.length}</span>
              {exam.durationSeconds > 0 && <span className="font-mono">{formatTime(secondsLeft)}</span>}
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg font-extrabold">{currentQuestion.prompt}</CardTitle>
                {currentQuestion.stimulus?.text && (
                  <CardDescription className="text-base font-medium text-foreground">
                    {currentQuestion.stimulus.text}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {currentQuestion.options.map((option) => {
                  const isSelected = (answers[currentQuestion.id] ?? []).includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(currentQuestion.id, option.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg border p-4 text-left transition",
                        isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
                      )}
                    >
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold">
                        {option.id}
                      </span>
                      <span className="flex-1 text-sm">{option.text}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}>
                Précédent
              </Button>
              {currentIndex + 1 < questions.length ? (
                <Button onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}>
                  Suivant
                </Button>
              ) : (
                <Button onClick={submitExam} disabled={Object.keys(answers).length < questions.length}>
                  Soumettre
                </Button>
              )}
            </div>
          </>
        )}

        {submitted && (
          <>
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-orthly-learning/10">
                  <BarChart3 className="size-7 text-orthly-learning" />
                </div>
                <CardTitle className="mt-4 font-heading text-2xl font-extrabold">Résultats</CardTitle>
                <CardDescription>{correctCount} / {questions.length} bonnes réponses ({accuracy}%).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <p className="font-heading text-4xl font-black">{correctCount}</p>
                    <p className="text-xs text-muted-foreground">Bonnes réponses</p>
                  </div>
                  <div className="text-center">
                    <p className="font-heading text-4xl font-black">{questions.length}</p>
                    <p className="text-xs text-muted-foreground">Questions</p>
                  </div>
                  <div className="text-center">
                    <p className="font-heading text-4xl font-black">{accuracy}%</p>
                    <p className="text-xs text-muted-foreground">Précision</p>
                  </div>
                </div>

                {categoryStats.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Par catégorie</p>
                    {categoryStats.map((c) => (
                      <div key={c.cat} className="flex items-center justify-between text-sm">
                        <span>{c.cat.replace("_", " ")}</span>
                        <span className="font-mono">{c.correct}/{c.total} ({c.pct}%)</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const sel = answers[q.id] ?? [];
                const correctSet = new Set(q.answer.correctOptionIds);
                const isCorrect = sel.length === correctSet.size && sel.every((id) => correctSet.has(id));
                return (
                  <Card key={q.id} className={isCorrect ? "border-orthly-learning/40" : "border-orthly-error/40"}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-heading text-sm font-extrabold">Question {idx + 1}</CardTitle>
                        {isCorrect ? <CheckCircle2 className="size-5 text-orthly-learning" /> : <XCircle className="size-5 text-orthly-error" />}
                      </div>
                      <CardDescription className="text-foreground">{q.prompt}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1">
                        {q.options.map((opt) => {
                          const isSel = sel.includes(opt.id);
                          const isCorr = correctSet.has(opt.id);
                          return (
                            <div
                              key={opt.id}
                              className={cn(
                                "flex items-start gap-2 rounded-md border p-2 text-sm",
                                isCorr && "border-orthly-learning bg-orthly-learning/10",
                                isSel && !isCorr && "border-orthly-error bg-orthly-error/10"
                              )}
                            >
                              <span className="font-bold">{opt.id}.</span>
                              <span>{opt.text}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="rounded-lg border bg-muted/40 p-3">
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          <Lightbulb className="size-3" /> Explication
                        </p>
                        <p className="mt-1 text-sm">{q.answer.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center gap-2">
              <Button asChild>
                <Link href={`/exams/${examId}`}>Recommencer</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/exams">Autres examens</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}