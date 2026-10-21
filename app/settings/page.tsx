"use client";

import { useEffect } from "react";
import { Settings, Download, Trash2, Target } from "lucide-react";
import { useLearnerStore } from "@/store/learner-store";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SettingsPage() {
  const { hydrate, settings, updateSettings, resetProgress, progress, attempts } = useLearnerStore();

  useEffect(() => hydrate(), [hydrate]);

  function exportData() {
    const data = {
      app: "orthly",
      exportedAt: new Date().toISOString(),
      settings,
      progress,
      attempts
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orthly-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export terminé", { description: "Fichier JSON téléchargé." });
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Réinitialiser toute la progression locale ? Cette action ne peut pas être annulée."
    );
    if (!confirmed) return;
    resetProgress();
    toast.success("Progression réinitialisée", { description: "Toutes les données locales ont été supprimées." });
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <PageHeader
          eyebrow="Paramètres"
          title="Paramètres"
          description="Gérer les préférences et les données stockées uniquement sur cet appareil."
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg font-extrabold">
              <Target className="size-5 text-orthly-info" />
              Objectif d'examen
            </CardTitle>
            <CardDescription>Définis ton objectif pour garder le cap.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="examTarget">Cible</Label>
              <Input
                id="examTarget"
                value={settings.examTarget ?? ""}
                placeholder="TFLM, TCF Canada, etc."
                onChange={(e) => updateSettings({ examTarget: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="examDate">Date visée</Label>
              <Input
                id="examDate"
                type="date"
                value={settings.examTargetDate ?? ""}
                onChange={(e) => updateSettings({ examTargetDate: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg font-extrabold">
              <Settings className="size-5" />
              Données locales
            </CardTitle>
            <CardDescription>Aucun compte, aucune synchronisation. Toutes tes données restent dans ton navigateur.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={exportData}>
              <Download className="size-4" />
              Exporter mes données (JSON)
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              <Trash2 className="size-4" />
              Réinitialiser la progression
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-sm font-extrabold">À propos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Orthly — Apprentissage du français et préparation au TFLM.</p>
            <p className="mt-1">Basé sur du contenu pédagogique fidèle aux sources UQAR.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
