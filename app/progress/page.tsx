"use client";

import { useEffect } from "react";
import { TrendingUp, Flame, Sparkles, Target } from "lucide-react";
import { useLearnerStore } from "@/store/learner-store";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { chapters } from "@/lib/content";

export default function ProgressPage() {
  const { hydrate, progress, attempts } = useLearnerStore();

  useEffect(() => hydrate(), [hydrate]);

  const totalLessons = chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
  const completed = progress.completedLessons.length;
  const completionPercent = totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);
  const today = new Date().toISOString().slice(0, 10);
  const hasTodayActivity = progress.lastActivityDate === today;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <PageHeader
          eyebrow="Progression"
          title="Ta progression sur Orthly"
          description="Statistiques calculées à partir de ton activité locale. Rien n'est envoyé à un serveur."
        />

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-extrabold">
                <Sparkles className="size-4 text-orthly-milestone" />
                XP total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-heading text-3xl font-black">{progress.xp}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-extrabold">
                <Flame className="size-4 text-orthly-streak" />
                Série
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-heading text-3xl font-black">{progress.streak}</span>
              <p className="text-xs text-muted-foreground">{hasTodayActivity ? "Maintenue aujourd'hui" : "Reprends aujourd'hui"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-extrabold">
                <TrendingUp className="size-4 text-orthly-info" />
                Leçons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-heading text-3xl font-black">{completed}</span>
              <p className="text-xs text-muted-foreground">sur {totalLessons}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-extrabold">
                <Target className="size-4 text-orthly-learning" />
                Parcours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="font-heading text-3xl font-black">{completionPercent}%</span>
              <Progress value={completionPercent} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg font-extrabold">Historique des tentatives</CardTitle>
            <CardDescription>Pratiques, checkpoints et simulations enregistrés sur cet appareil.</CardDescription>
          </CardHeader>
          <CardContent>
            {attempts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune tentative enregistrée pour l'instant.</p>
            ) : (
              <div className="space-y-3">
                {attempts.slice(0, 10).map((attempt) => {
                  const date = new Date(attempt.startedAt).toLocaleString("fr-CA");
                  const correct = attempt.correctCount;
                  const total = attempt.questionCount;
                  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
                  return (
                    <div key={attempt.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{attempt.kind}</Badge>
                          {attempt.examId && <Badge variant="secondary">{attempt.examId}</Badge>}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{date}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-semibold">
                          {correct}/{total}
                        </span>
                        <Badge variant="outline">{pct}%</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
