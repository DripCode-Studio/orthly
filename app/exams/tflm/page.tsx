"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { useManifest } from "@/lib/queries";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function TflmSimulationsPage() {
  const { data: manifest } = useManifest();
  const simulations = manifest?.ok
    ? manifest.data.exams.filter((e) => e.id.startsWith("tflm-simulation"))
    : [];

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/exams">
              <ArrowLeft className="size-4" /> Retour aux examens
            </Link>
          </Button>
        </div>
        <PageHeader
          eyebrow="TFLM"
          title="Simulations TFLM"
          description="5 simulations pratiques de 65 questions (QCM) portant sur les structures de la langue française. Profils non officiels."
        />

        {!manifest && (
          <div className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {manifest?.ok && (
          <div className="grid gap-3">
            {simulations.map((exam) => (
              <Card key={exam.id} className="flex-row items-center gap-4 py-4">
                <span className="ml-4 grid size-10 shrink-0 place-items-center rounded-lg bg-orthly-navy/10">
                  <GraduationCap className="size-5 text-orthly-navy" />
                </span>
                <CardContent className="min-w-0 flex-1 space-y-1 px-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-extrabold">{exam.title}</h3>
                    <Badge variant="outline">Non vérifié</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    65 questions · 90 minutes · TFLM pratique
                  </p>
                </CardContent>
                <div className="mr-4 flex w-32 justify-end">
                  <Button asChild size="sm">
                    <Link href={`/exams/${exam.id}`}>
                      Démarrer
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}