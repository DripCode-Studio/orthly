"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, RotateCcw, Layers, ThumbsDown, ThumbsUp } from "lucide-react";
import { useManifest, useFlashcardDeck } from "@/lib/queries";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { describeContentError } from "@/lib/content-service";
import { useLearnerStore } from "@/store/learner-store";
import { cn } from "@/lib/utils";

export default function FlashcardsPage() {
  const { data: manifest } = useManifest();
  const deckEntry = manifest?.ok ? manifest.data.flashcardDecks[0] : undefined;
  const deckQuery = useFlashcardDeck(deckEntry?.content);
  const { hydrate, flashcards, reviewFlashcard } = useLearnerStore();

  const [flipped, setFlipped] = useState(false);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => hydrate(), [hydrate]);

  const deck = deckQuery.data?.ok ? deckQuery.data.data : undefined;
  const cards = deck?.cards ?? [];
  const card = cards[index];

  const dueCount = useMemo(() => {
    const now = Date.now();
    return cards.filter((c) => {
      const state = flashcards[c.id];
      if (!state?.nextReviewAt) return true;
      return new Date(state.nextReviewAt).getTime() <= now;
    }).length;
  }, [cards, flashcards]);

  function rate(rating: "again" | "hard" | "good" | "easy") {
    if (!card) return;
    reviewFlashcard(card.id, rating);
    setFlipped(false);
    if (index + 1 < cards.length) {
      setIndex((i) => i + 1);
    } else {
      setIndex(0);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
              Retour au tableau de bord
            </Link>
          </Button>
        </div>

        <PageHeader
          eyebrow="Cartes éclair"
          title={deck?.title ?? "Révision espacée"}
          description="Retourne la carte, puis note ta difficulté. Le planning se met à jour automatiquement sur cet appareil."
        />

        {!deckQuery.data && <FlashcardSkeleton />}

        {deckQuery.data?.ok === false && (
          <Alert>
            <AlertTitle>Jeu de cartes non disponible</AlertTitle>
            <AlertDescription>{describeContentError(deckQuery.data.error)}</AlertDescription>
          </Alert>
        )}

        {deckQuery.data?.ok && cards.length === 0 && (
          <Alert>
            <AlertTitle>Aucune carte</AlertTitle>
            <AlertDescription>Ce jeu est vide pour l'instant.</AlertDescription>
          </Alert>
        )}

        {deckQuery.data?.ok && cards.length > 0 && !started && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-orthly-navy/10">
                <Layers className="size-7 text-orthly-navy" />
              </div>
              <CardTitle className="mt-4 font-heading text-2xl font-extrabold">{deck?.title}</CardTitle>
              <CardDescription>
                {cards.length} cartes • {dueCount} à réviser maintenant
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" onClick={() => setStarted(true)}>
                <RotateCcw className="size-4" />
                Commencer la révision
              </Button>
            </CardContent>
          </Card>
        )}

        {started && card && (
          <>
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                Carte {index + 1} / {cards.length}
              </Badge>
              <Badge variant="secondary">{card.type.replace("_", " ")}</Badge>
            </div>

            <button
              onClick={() => setFlipped(!flipped)}
              className="w-full text-left"
              aria-label={flipped ? "Retourner sur le recto" : "Voir la réponse"}
            >
              <Card
                className={cn(
                  "min-h-[280px] transition-shadow",
                  flipped ? "border-orthly-learning/60" : "hover:shadow-md"
                )}
              >
                <CardHeader>
                  <CardTitle className="font-heading text-xl font-extrabold">
                    {flipped ? "Réponse" : "Question"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex min-h-[180px] items-center justify-center p-8 text-center">
                  <p className="text-lg leading-relaxed">{flipped ? card.back : card.front}</p>
                </CardContent>
                {flipped && card.example && (
                  <CardContent className="border-t pt-4">
                    <p className="text-center text-sm text-muted-foreground">
                      <span className="font-semibold">Exemple :</span> {card.example}
                    </p>
                  </CardContent>
                )}
              </Card>
            </button>

            <p className="text-center text-xs text-muted-foreground">
              {flipped ? "Évalue ta maîtrise pour ajuster le prochain rappel." : "Clique sur la carte pour voir la réponse."}
            </p>

            {flipped && (
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" onClick={() => rate("again")} className="flex-col gap-1 py-6">
                  <ThumbsDown className="size-4" />
                  <span className="text-xs">À revoir</span>
                </Button>
                <Button variant="outline" onClick={() => rate("hard")} className="flex-col gap-1 py-6">
                  <span className="text-xs">Difficile</span>
                </Button>
                <Button variant="outline" onClick={() => rate("good")} className="flex-col gap-1 py-6">
                  <ThumbsUp className="size-4" />
                  <span className="text-xs">Bien</span>
                </Button>
                <Button onClick={() => rate("easy")} className="flex-col gap-1 py-6">
                  <span className="text-xs">Facile</span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function FlashcardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-[280px] w-full" />
    </div>
  );
}
