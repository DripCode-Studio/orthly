import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { chapters } from "@/lib/content";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AVAILABLE = ["chapter-01", "chapter-02", "chapter-03", "chapter-04", "chapter-05", "chapter-06"];

export default function PracticePage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <PageHeader
          eyebrow="Pratiquer"
          title="Banques de questions"
          description="S'entraîner avec des questions rédigées à partir du cours, avec explication grammaticale après chaque réponse."
        />

        <div className="grid gap-3">
          {chapters.map((chapter) => {
            const isAvailable = AVAILABLE.includes(chapter.id);
            return (
              <Card key={chapter.id} className="flex-row items-center gap-4 py-4">
                <span
                  className="ml-4 grid size-10 shrink-0 place-items-center rounded-lg font-heading text-sm font-extrabold text-white"
                  style={{ backgroundColor: chapter.color }}
                  aria-hidden
                >
                  {String(chapter.number).padStart(2, "0")}
                </span>
                <CardContent className="min-w-0 flex-1 space-y-1 px-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      Chapitre {chapter.number}
                    </p>
                    {isAvailable && <Badge variant="secondary">Disponible</Badge>}
                  </div>
                  <h3 className="font-heading text-sm font-extrabold">{chapter.title}</h3>
                  <p className="truncate text-xs text-muted-foreground">Questions à choix multiples et multiples.</p>
                </CardContent>
                <div className="mr-4 flex w-28 justify-end">
                  {isAvailable ? (
                    <Button asChild size="sm">
                      <Link href={`/practice/${chapter.id}`}>
                        <ClipboardCheck className="size-4" />
                        S'entraîner
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
