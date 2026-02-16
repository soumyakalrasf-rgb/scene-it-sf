import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Clapperboard, MapPin, Clock, Film, Star, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChaseWithDetails } from "@shared/schema";

const CLUE_THRESHOLDS = [0, 3 * 60, 6 * 60, 10 * 60];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ChasePlayer() {
  const [, params] = useRoute("/chase/:code");
  const [, navigate] = useLocation();
  const code = params?.code?.toUpperCase() || "";

  const { data: chase, isLoading, error } = useQuery<ChaseWithDetails>({
    queryKey: ["/api/chases", code],
    queryFn: () => fetch(`/api/chases/${code}`).then((r) => {
      if (!r.ok) throw new Error("Chase not found");
      return r.json();
    }),
    refetchInterval: 5000,
    enabled: !!code,
  });

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!chase?.startedAt || chase.status === "ended") return;
    const update = () => setElapsed(Math.floor((Date.now() - chase.startedAt!) / 1000));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [chase?.startedAt, chase?.status]);

  useEffect(() => {
    if (chase?.status === "ended" && chase.startedAt && chase.endedAt) {
      setElapsed(Math.floor((chase.endedAt - chase.startedAt) / 1000));
    }
  }, [chase?.status, chase?.startedAt, chase?.endedAt]);

  const clueLevel = CLUE_THRESHOLDS.reduce(
    (level, threshold, i) => (elapsed >= threshold ? i : level),
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 max-w-lg mx-auto flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error || !chase) {
    return (
      <div className="min-h-screen bg-background p-4 max-w-lg mx-auto flex items-center justify-center">
        <div className="text-center">
          <Clapperboard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-serif text-xl font-bold text-foreground mb-2">Chase Not Found</p>
          <p className="text-sm text-muted-foreground mb-4">
            Code "{code}" doesn't match any active chase.
          </p>
          <Button onClick={() => navigate("/")} data-testid="button-go-home">
            Go to Scene It SF
          </Button>
        </div>
      </div>
    );
  }

  if (chase.status === "waiting") {
    return (
      <div className="min-h-screen bg-background p-4 max-w-lg mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-primary/40 border-t-primary animate-spin-slow" />
          <p className="font-serif text-xl font-bold text-foreground mb-2" data-testid="text-waiting">
            Waiting for the Director...
          </p>
          <p className="text-sm text-muted-foreground">
            The Director hasn't started the chase yet. Hang tight.
          </p>
          <p className="text-xs text-muted-foreground mt-4">Game code: <span className="font-mono font-bold text-primary">{code}</span></p>
        </div>
      </div>
    );
  }

  if (chase.status === "ended") {
    return (
      <div className="min-h-screen bg-background p-4 max-w-lg mx-auto">
        <div className="text-center mb-6 pt-8">
          <p className="font-serif text-2xl font-bold text-primary mb-1" data-testid="text-chase-over">
            THAT'S A WRAP
          </p>
          <p className="text-sm text-muted-foreground">The chase has ended</p>
        </div>

        <Card className="overflow-visible mb-6">
          <div className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">The Director was hiding at</p>
            <p className="font-serif text-xl font-bold text-foreground">{chase.film.title}</p>
            <p className="text-sm text-muted-foreground">{chase.film.year}</p>
            <div className="flex items-center gap-1 justify-center mt-2">
              <MapPin className="w-4 h-4 text-primary" />
              <p className="text-sm text-foreground">{chase.location.address}</p>
            </div>
            <Badge variant="secondary" className="mt-2">{chase.location.neighborhood}</Badge>
            {chase.location.sceneDescription && (
              <p className="text-xs text-muted-foreground mt-3 italic">"{chase.location.sceneDescription}"</p>
            )}
            <div className="mt-4 bg-muted/30 rounded-md p-3">
              <p className="text-xs text-muted-foreground">Chase lasted</p>
              <p className="text-3xl font-mono font-black text-foreground">{formatTime(elapsed)}</p>
            </div>
          </div>
        </Card>

        <Button className="w-full" onClick={() => navigate("/")} data-testid="button-explore">
          Explore Scene It SF
        </Button>
      </div>
    );
  }

  const nextClueAt = clueLevel < 3 ? CLUE_THRESHOLDS[clueLevel + 1] : null;
  const timeToNext = nextClueAt ? nextClueAt - elapsed : null;

  return (
    <div className="min-h-screen bg-background p-4 max-w-lg mx-auto">
      <div className="text-center mb-4 pt-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Clapperboard className="w-5 h-5 text-primary" />
          <p className="font-serif text-lg font-bold text-foreground">Director's Chase</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <p className="text-2xl font-mono font-black text-foreground" data-testid="text-timer">
            {formatTime(elapsed)}
          </p>
        </div>
        {timeToNext !== null && timeToNext > 0 && (
          <p className="text-xs text-muted-foreground mt-1" data-testid="text-next-clue">
            Next clue in {formatTime(timeToNext)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Card className="overflow-visible animate-fade-in" data-testid="clue-neighborhood">
          <div className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">
              The Director is somewhere in...
            </p>
            <p className="font-serif text-2xl font-bold text-primary" data-testid="text-clue-neighborhood">
              {chase.location.neighborhood}
            </p>
          </div>
        </Card>

        {clueLevel >= 1 && (
          <Card className="overflow-visible" data-testid="clue-movie">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Film className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Clue Unlocked — The Movie
                </p>
              </div>
              <p className="font-serif text-xl font-bold text-foreground" data-testid="text-clue-movie">
                {chase.film.title}
              </p>
              <p className="text-sm text-muted-foreground">{chase.film.year}</p>
              {chase.film.genre && (
                <Badge variant="secondary" className="mt-2">{chase.film.genre}</Badge>
              )}
            </div>
          </Card>
        )}

        {clueLevel >= 2 && (
          <Card className="overflow-visible" data-testid="clue-details">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Clue Unlocked — Scene Details
                </p>
              </div>
              {chase.location.sceneDescription && (
                <p className="text-sm text-foreground italic" data-testid="text-clue-scene">
                  "{chase.location.sceneDescription}"
                </p>
              )}
              {chase.film.synopsis && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{chase.film.synopsis}</p>
              )}
            </div>
          </Card>
        )}

        {clueLevel >= 3 && (
          <Card className="overflow-visible border-primary/30" data-testid="clue-address">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <p className="text-xs text-primary font-semibold uppercase tracking-wider">
                  Final Clue — Exact Location
                </p>
              </div>
              <p className="font-serif text-lg font-bold text-foreground" data-testid="text-clue-address">
                {chase.location.address}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{chase.location.neighborhood}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${chase.location.lat},${chase.location.lng}`,
                    "_blank"
                  )
                }
                data-testid="button-get-directions"
              >
                <MapPin className="w-4 h-4 mr-1" />
                Get Directions
              </Button>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          When you find the Director, yell <span className="font-bold text-primary">CUT!</span>
        </p>
      </div>
    </div>
  );
}
