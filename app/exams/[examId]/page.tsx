"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, AlertTriangle } from "lucide-react";
import { useExamBlueprint, useManifest } from "@/lib/queries";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { describeContentError } from "@/lib/content-service";
import { useLearnerStore } from "@/store/learner-store";
import { toast } from "sonner";

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
  const { hydrate, recordAttempt } = useLearnerStore();

  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => hydrate(), [hydrate]);

  const exam = examQuery.data?.ok ? examQuery.data.data : undefined;

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

  function startExam() {
    if (!exam) return;
    if (!exam.verified) {
      toast.error("Profil non vérifié", {
        description: "Ce profil doit être validé contre le format officiel avant d'être utilisé."
      });
      return;
    }
    setStarted(true);
    toast.info("Simulation lancée", {
      description: exam.durationSeconds > 0 ? `Temps imparti : ${formatTime(exam.durationSeconds)}` : "Aucun chronomètre configuré."
    });
  }

  function finishExam() {
    recordAttempt({
      kind: "exam",
      examId,
      correctCount: 0,
      questionCount: exam?.questionCount ?? 0,
      categoryBreakdown: {},
      incorrectQuestionIds: []
    });
    toast.success("Simulation terminée", {
      description: "Résultat enregistré dans ton historique."
    });
    setStarted(false);
  }

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

        {exam && !started && (
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
                    {exam.questionCount === 0 ? "Non défini" : exam.questionCount}
                  </span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-extrabold">Seuil de réussite</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="font-heading text-lg font-extrabold">
                    {exam.passingScorePercent === null ? "Non défini" : `${exam.passingScorePercent}%`}
                  </span>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-sm font-extrabold">Répartition par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                {exam.sections.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune section configurée. Ce profil ne peut pas être simulé pour l'instant.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {exam.sections.map((section) => (
                      <Badge key={section.categoryId} variant="outline">
                        {section.categoryId.replace("_", " ")} • {section.questionCount}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {!exam.verified && (
              <Alert>
                <AlertTriangle className="size-4" />
                <AlertTitle>Profil non vérifié</AlertTitle>
                <AlertDescription>
                  La répartition ou les consignes doivent être validées contre le format officiel. La simulation reste
                  désactivée jusqu'à ce que le profil soit marqué « vérifié ».
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-sm font-extrabold">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(exam.notes ?? []).map((note, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 size-1.5 rounded-full bg-muted-foreground" aria-hidden />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button size="lg" onClick={startExam} disabled={!exam.verified || exam.sections.length === 0}>
                Lancer la simulation
              </Button>
            </div>
          </>
        )}

        {exam && started && (
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-2xl font-extrabold">Simulation en cours</CardTitle>
              <CardDescription>
                {exam.durationSeconds > 0
                  ? `Temps restant : ${formatTime(secondsLeft)}`
                  : "Pas de limite de temps configurée pour ce profil."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Le moteur de sélection de questions n'est pas encore branché. Cette vue montre la structure de la
                simulation ; les vraies questions seront tirées des banques partagées quand le moteur sera activé.
              </p>
              <div className="flex justify-center gap-2">
                <Button onClick={finishExam}>Terminer et enregistrer</Button>
                <Button variant="outline" onClick={() => setStarted(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
