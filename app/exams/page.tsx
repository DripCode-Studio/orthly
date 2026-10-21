"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, AlertCircle } from "lucide-react";
import { useManifest } from "@/lib/queries";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExamsPage() {
  const { data: manifest } = useManifest();
  const exams = manifest?.ok ? manifest.data.exams : [];

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <PageHeader
          eyebrow="Examens"
          title="Simulations et préparation"
          description="Les profils sont configurés à partir des données officielles fournies. Les simulations TFLM/UQAR/TCF ne sont activées qu'après validation."
        />

        {!manifest && (
          <div className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {manifest?.ok && (
          <div className="grid gap-3">
            {exams.map((exam) => (
              <Card key={exam.id} className="flex-row items-center gap-4 py-4">
                <span className="ml-4 grid size-10 shrink-0 place-items-center rounded-lg bg-orthly-navy/10">
                  <GraduationCap className="size-5 text-orthly-navy" />
                </span>
                <CardContent className="min-w-0 flex-1 space-y-1 px-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-extrabold">{exam.title}</h3>
                    {exam.verified ? (
                      <Badge variant="secondary">Vérifié</Badge>
                    ) : (
                      <Badge variant="outline">Non vérifié</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {exam.id === "tflm"
                      ? "Simulation selon répartition de référence (à valider contre format officiel)."
                      : exam.id === "uqar"
                      ? "Format officiel non confirmé — durée/questionnaire à renseigner."
                      : "TCF complet nécessite des profils par déclinaison."}
                  </p>
                </CardContent>
                <div className="mr-4 flex w-32 justify-end">
                  {exam.verified && exam.id !== "uqar" && exam.id !== "tcf" ? (
                    <Button asChild size="sm">
                      <Link href={`/exams/${exam.id}`}>
                        Démarrer
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      <AlertCircle className="size-4" />
                      En attente
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-sm font-extrabold">Règle importante</CardTitle>
            <CardDescription>
              Aucun temps, nombre de questions ou seuil n'est inventé. Seuls les profils marqués « vérifié » activent la
              simulation complète.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </AppShell>
  );
}
