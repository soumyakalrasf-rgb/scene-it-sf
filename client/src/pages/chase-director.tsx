import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Clapperboard, MapPin, Shuffle, Check, Copy, Share2, Clock, ArrowLeft, Play,
  StopCircle, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getPosterSmallUrl } from "@/lib/constants";
import type { LocationWithFilm, ChaseWithDetails } from "@shared/schema";

type Phase = "pick" | "confirm" | "waiting" | "active" | "ended";

const CLUE_STAGES = [
  { minutes: 0, label: "Neighborhood only" },
  { minutes: 3, label: "Movie title + year" },
  { minutes: 6, label: "Fun fact + scene description" },
  { minutes: 10, label: "Exact address revealed" },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ChaseDirector() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>("pick");
  const [selectedLocation, setSelectedLocation] = useState<LocationWithFilm | null>(null);
  const [chase, setChase] = useState<ChaseWithDetails | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);

  const { data: randomLocs, isLoading, refetch } = useQuery<LocationWithFilm[]>({
    queryKey: ["/api/locations/random", "3"],
    queryFn: () => fetch("/api/locations/random?count=3").then((r) => r.json()),
  });

  const createChaseMut = useMutation({
    mutationFn: (locationId: number) =>
      apiRequest("POST", "/api/chases", { locationId }).then((r) => r.json()),
    onSuccess: (data: ChaseWithDetails) => {
      setChase(data);
      setPhase("confirm");
    },
  });

  const startChaseMut = useMutation({
    mutationFn: () =>
      apiRequest("PATCH", `/api/chases/${chase!.code}/start`).then((r) => r.json()),
    onSuccess: (data: ChaseWithDetails) => {
      setChase(data);
      setPhase("active");
    },
  });

  const endChaseMut = useMutation({
    mutationFn: () =>
      apiRequest("PATCH", `/api/chases/${chase!.code}/end`).then((r) => r.json()),
    onSuccess: (data: ChaseWithDetails) => {
      setChase(data);
      setPhase("ended");
    },
  });

  useEffect(() => {
    if (phase !== "active" || !chase?.startedAt) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - chase.startedAt!) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, chase?.startedAt]);

  const currentClueStage = CLUE_STAGES.reduce(
    (stage, s, i) => (elapsed >= s.minutes * 60 ? i : stage),
    0
  );

  const chaseUrl = chase
    ? `${window.location.origin}/chase/${chase.code}`
    : "";

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(chaseUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Link copied!", description: "Share it with your friends" });
    });
  }, [chaseUrl, toast]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: "Director's Chase - Scene It SF",
        text: `I'm hiding at a filming location! Find me! Use code: ${chase?.code}`,
        url: chaseUrl,
      });
    } else {
      handleCopyLink();
    }
  }, [chase?.code, chaseUrl, handleCopyLink]);

  const handlePickLocation = (loc: LocationWithFilm) => {
    setSelectedLocation(loc);
    createChaseMut.mutate(loc.id);
  };

  if (phase === "pick") {
    return (
      <div className="min-h-screen bg-background p-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/")}
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground" data-testid="text-chase-title">
              Director's Chase
            </h1>
            <p className="text-xs text-muted-foreground">Pick a filming location to hide at</p>
          </div>
        </div>

        <div className="space-y-3 mb-4" data-testid="location-cards">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-md" />
            ))
          ) : (
            randomLocs?.map((loc) => (
              <Card
                key={loc.id}
                className="overflow-visible cursor-pointer hover-elevate"
                onClick={() => handlePickLocation(loc)}
                data-testid={`card-location-pick-${loc.id}`}
              >
                <div className="flex items-center gap-3 p-3">
                  {loc.film?.posterPath ? (
                    <img
                      src={getPosterSmallUrl(loc.film.posterPath) || ""}
                      alt={loc.film.title}
                      className="w-12 h-[72px] rounded-md object-cover border border-border/50 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-[72px] rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <Clapperboard className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-foreground text-sm">{loc.film?.title}</p>
                    <p className="text-xs text-muted-foreground">{loc.film?.year}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-primary" />
                      <p className="text-xs text-muted-foreground truncate">{loc.address}</p>
                    </div>
                    <Badge variant="secondary" className="mt-1 text-[10px]">{loc.neighborhood}</Badge>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            queryClient.removeQueries({ queryKey: ["/api/locations/random", "3"] });
            refetch();
          }}
          className="w-full"
          data-testid="button-shuffle-locations"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Shuffle Locations
        </Button>
      </div>
    );
  }

  if (phase === "confirm" && chase && selectedLocation) {
    return (
      <div className="min-h-screen bg-background p-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button size="icon" variant="ghost" onClick={() => setPhase("pick")} data-testid="button-back-pick">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-serif text-xl font-bold text-foreground">Your Location</h1>
        </div>

        <Card className="overflow-visible mb-6">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              {selectedLocation.film?.posterPath && (
                <img
                  src={getPosterSmallUrl(selectedLocation.film.posterPath) || ""}
                  alt={selectedLocation.film.title}
                  className="w-16 h-24 rounded-md object-cover border border-border/50"
                />
              )}
              <div>
                <p className="font-serif font-bold text-lg text-foreground" data-testid="text-confirm-title">
                  {selectedLocation.film?.title}
                </p>
                <p className="text-sm text-muted-foreground">{selectedLocation.film?.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground" data-testid="text-confirm-address">{selectedLocation.address}</p>
            </div>
            <Badge variant="secondary">{selectedLocation.neighborhood}</Badge>
            {selectedLocation.sceneDescription && (
              <p className="text-xs text-muted-foreground mt-2 italic">"{selectedLocation.sceneDescription}"</p>
            )}
          </div>
        </Card>

        <div className="bg-muted/30 rounded-md border border-border p-4 mb-6 text-center">
          <p className="text-xs text-muted-foreground mb-2">Your game code</p>
          <p className="text-5xl font-mono font-black text-primary tracking-[0.3em]" data-testid="text-game-code">
            {chase.code}
          </p>
        </div>

        <p className="text-sm text-muted-foreground text-center mb-4">
          Go to this location. When you arrive, tap the button below to start the chase and share the link with friends.
        </p>

        <Button
          className="w-full"
          size="lg"
          onClick={() => startChaseMut.mutate()}
          disabled={startChaseMut.isPending}
          data-testid="button-start-chase"
        >
          <Play className="w-4 h-4 mr-2" />
          I'm Here — Start the Chase
        </Button>
      </div>
    );
  }

  if ((phase === "active" || phase === "waiting") && chase) {
    return (
      <div className="min-h-screen bg-background p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between gap-2 mb-6">
          <h1 className="font-serif text-xl font-bold text-foreground">The Chase Is On</h1>
          <Badge variant="default" className="text-sm">
            <Clock className="w-3 h-3 mr-1" />
            {formatTime(elapsed)}
          </Badge>
        </div>

        <div className="bg-muted/30 rounded-md border border-border p-4 mb-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Share this link</p>
          <p className="text-xs font-mono text-foreground break-all mb-3" data-testid="text-share-url">{chaseUrl}</p>
          <div className="flex items-center gap-2 justify-center">
            <Button size="sm" variant="secondary" onClick={handleCopyLink} data-testid="button-copy-link">
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button size="sm" onClick={handleShare} data-testid="button-share">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        <Card className="overflow-visible mb-4">
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">
              What chasers currently see
            </p>
            <div className="space-y-2">
              {CLUE_STAGES.map((stage, i) => {
                const isRevealed = i <= currentClueStage;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 p-2 rounded-md ${
                      isRevealed
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted/20 border border-border/30"
                    }`}
                    data-testid={`clue-stage-${i}`}
                  >
                    <Eye className={`w-4 h-4 flex-shrink-0 ${isRevealed ? "text-primary" : "text-muted-foreground/40"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${isRevealed ? "text-foreground font-medium" : "text-muted-foreground/60"}`}>
                        {stage.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {stage.minutes === 0 ? "Immediately" : `After ${stage.minutes} min`}
                      </p>
                    </div>
                    {isRevealed ? (
                      <Badge variant="default" className="text-[10px]">Revealed</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Locked</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card className="overflow-visible mb-6">
          <div className="p-4">
            <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">
              Your hiding spot
            </p>
            <p className="font-serif font-bold text-foreground">{chase.film.title} ({chase.film.year})</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-primary" />
              <p className="text-xs text-muted-foreground">{chase.location.address}</p>
            </div>
          </div>
        </Card>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => endChaseMut.mutate()}
          disabled={endChaseMut.isPending}
          data-testid="button-end-chase"
        >
          <StopCircle className="w-4 h-4 mr-2" />
          End the Chase
        </Button>
      </div>
    );
  }

  if (phase === "ended" && chase) {
    const duration = chase.endedAt && chase.startedAt
      ? Math.floor((chase.endedAt - chase.startedAt) / 1000)
      : elapsed;

    const AUDIT_SPEEDS: Record<string, { distance: number; seconds: number; mph: number; line: string }> = {
      "Bullitt": { distance: 3.8, seconds: 2, mph: 6840, line: "McQueen covered 3.8 miles in 2 seconds" },
      "Ant-Man & the Wasp": { distance: 2.1, seconds: 3, mph: 2520, line: "shrank through 2.1 miles in 3 seconds" },
      "The Rock": { distance: 2.8, seconds: 5, mph: 2016, line: "Humvee-d 2.8 miles in 5 seconds" },
      "Venom": { distance: 2.4, seconds: 4, mph: 2160, line: "symbioted 2.4 miles in 4 seconds" },
    };

    const audit = AUDIT_SPEEDS[chase.film.title];
    const speedRoast = audit
      ? `In ${chase.film.title}, they ${audit.line} (${audit.mph.toLocaleString()} MPH). Your friends needed ${formatTime(duration)}.`
      : `It took ${formatTime(duration)} to find the Director. Mrs. Doubtfire ran faster. In heels. In a latex mask.`;

    return (
      <div className="min-h-screen bg-background p-4 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <p className="font-serif text-2xl font-bold text-primary mb-1" data-testid="text-thats-a-wrap">
            THAT'S A WRAP
          </p>
          <p className="text-sm text-muted-foreground">The chase is over</p>
        </div>

        <Card className="overflow-visible mb-6">
          <div className="p-4 text-center">
            <p className="font-serif text-xl font-bold text-foreground">{chase.film.title}</p>
            <p className="text-sm text-muted-foreground">{chase.film.year}</p>
            <div className="flex items-center gap-1 justify-center mt-2">
              <MapPin className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">{chase.location.address}</p>
            </div>
            <div className="mt-4 bg-muted/30 rounded-md p-3">
              <p className="text-xs text-muted-foreground">Chase lasted</p>
              <p className="text-3xl font-mono font-black text-foreground" data-testid="text-chase-duration">
                {formatTime(duration)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic" data-testid="text-speed-roast">
              {speedRoast}
            </p>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate("/")}
            data-testid="button-back-explore"
          >
            Back to Explore
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setPhase("pick");
              setChase(null);
              setSelectedLocation(null);
              setElapsed(0);
            }}
            data-testid="button-play-again"
          >
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
