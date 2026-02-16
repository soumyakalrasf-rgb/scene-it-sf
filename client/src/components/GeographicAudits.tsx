import { useState } from "react";
import { X, ChevronDown, ChevronUp, Rocket, Zap, AlertTriangle, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImpossibleCut {
  from: string;
  to: string;
  distance: number;
  seconds: number;
  mph: number;
  roast: string;
}

interface AuditFilm {
  title: string;
  year: number;
  cuts: ImpossibleCut[];
}

const AUDIT_DATA: AuditFilm[] = [
  {
    title: "Bullitt",
    year: 1968,
    cuts: [
      { from: "Potrero Hill", to: "North Beach", distance: 3.8, seconds: 2, mph: 6840, roast: "McQueen teleports in a single cut." },
      { from: "Russian Hill", to: "Marina", distance: 0.7, seconds: 1, mph: 2520, roast: "Charger leaps 6 blocks across Van Ness." },
      { from: "Marina Blvd", to: "Visitacion Valley", distance: 8.2, seconds: 3, mph: 9840, roast: "Same Safeway appears twice, then 8 miles south." },
      { from: "Visitacion Valley", to: "Daly City", distance: 3.1, seconds: 2, mph: 5580, roast: "Finale outside city limits entirely." },
    ],
  },
  {
    title: "Ant-Man & the Wasp",
    year: 2018,
    cuts: [
      { from: "Lombard St", to: "Embarcadero", distance: 2.1, seconds: 3, mph: 2520, roast: "Turns on Lombard, instantly at Embarcadero." },
      { from: "Fisherman's Wharf", to: "Twin Peaks", distance: 4.5, seconds: 4, mph: 4050, roast: "Through completely unconnected neighborhoods." },
    ],
  },
  {
    title: "The Rock",
    year: 1996,
    cuts: [
      { from: "Nob Hill", to: "Marina Green", distance: 2.8, seconds: 5, mph: 2016, roast: "Hills flattened out of respect for the Humvee." },
      { from: "Embarcadero", to: "Wharf via downtown", distance: 1.5, seconds: 2, mph: 2700, roast: "Cable car requires 3+ transfers." },
    ],
  },
  {
    title: "Venom",
    year: 2018,
    cuts: [
      { from: "Edinburgh Castle bar", to: "Embarcadero", distance: 2.4, seconds: 4, mph: 2160, roast: "Tenderloin to waterfront in seconds." },
    ],
  },
];

const SPEED_BENCHMARKS = [
  { label: "Walking", mph: 3, color: "bg-emerald-500" },
  { label: "Driving", mph: 35, color: "bg-blue-500" },
  { label: "Bullet Train", mph: 200, color: "bg-violet-500" },
  { label: "Sound", mph: 767, color: "bg-orange-500" },
];

const totalTeleportations = AUDIT_DATA.reduce((sum, f) => sum + f.cuts.length, 0);
const peakMph = Math.max(...AUDIT_DATA.flatMap((f) => f.cuts.map((c) => c.mph)));

function getSpeedTier(mph: number): { label: string; className: string; tier: "rocket" | "wormhole" | "spacetime" } {
  if (mph > 6000) return { label: "BROKE THE SPACE-TIME CONTINUUM", className: "text-red-500", tier: "spacetime" };
  if (mph >= 3000) return { label: "Wormhole required", className: "text-violet-400", tier: "wormhole" };
  return { label: "Faster than a fighter jet", className: "text-orange-400", tier: "rocket" };
}

function SpeedIcon({ tier }: { tier: "rocket" | "wormhole" | "spacetime" }) {
  if (tier === "spacetime") {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center" data-testid="icon-spacetime">
        <div className="absolute inset-0 animate-glitch-pulse rounded-md bg-red-500/20" />
        <AlertTriangle className="w-6 h-6 text-red-500 animate-shake relative z-10" />
      </div>
    );
  }
  if (tier === "wormhole") {
    return (
      <div className="relative w-10 h-10 flex items-center justify-center" data-testid="icon-wormhole">
        <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-violet-500/40 border-t-violet-400" />
        <div className="absolute inset-1 animate-spin-reverse rounded-full border border-violet-400/30 border-b-violet-300" />
        <Zap className="w-5 h-5 text-violet-400 relative z-10" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 flex items-center justify-center" data-testid="icon-rocket">
      <Rocket className="w-6 h-6 text-orange-400 animate-bounce-subtle" />
    </div>
  );
}

function SpeedBar({ mph }: { mph: number }) {
  const maxMph = Math.max(mph * 1.1, 10000);
  return (
    <div className="mt-3 space-y-1" data-testid="speed-bar">
      <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
        {SPEED_BENCHMARKS.map((b) => (
          <div
            key={b.label}
            className={`absolute top-0 h-full w-0.5 ${b.color} opacity-60`}
            style={{ left: `${(b.mph / maxMph) * 100}%` }}
          />
        ))}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-primary via-red-500 to-red-600 transition-all duration-1000"
          style={{ width: `${Math.min((mph / maxMph) * 100, 100)}%` }}
        />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {SPEED_BENCHMARKS.map((b) => (
          <span key={b.label} className="text-[9px] text-muted-foreground flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${b.color}`} />
            {b.label} ({b.mph})
          </span>
        ))}
      </div>
    </div>
  );
}

function CutCard({ cut, index }: { cut: ImpossibleCut; index: number }) {
  const tier = getSpeedTier(cut.mph);
  return (
    <div
      className={`p-3 rounded-md border border-border/50 bg-muted/20 ${tier.tier === "spacetime" ? "animate-shake-subtle" : ""}`}
      data-testid={`card-cut-${index}`}
    >
      <div className="flex items-start gap-3">
        <SpeedIcon tier={tier.tier} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">{cut.from}</span>
            <span className="text-xs text-primary">→</span>
            <span className="text-xs text-muted-foreground">{cut.to}</span>
          </div>
          <p className="font-mono text-2xl font-black mt-1" data-testid={`text-mph-${index}`}>
            <span className={tier.className}>{cut.mph.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground font-normal ml-1">MPH</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {cut.distance} mi in {cut.seconds} sec
          </p>
          <p className={`text-xs font-semibold mt-1 ${tier.className}`}>
            {tier.label}
          </p>
          <p className="text-xs text-muted-foreground mt-1 italic">"{cut.roast}"</p>
          <SpeedBar mph={cut.mph} />
        </div>
      </div>
    </div>
  );
}

function FilmAuditCard({ film }: { film: AuditFilm }) {
  const [expanded, setExpanded] = useState(false);
  const worstCut = film.cuts.reduce((a, b) => (a.mph > b.mph ? a : b));
  const tier = getSpeedTier(worstCut.mph);

  return (
    <Card
      className="overflow-visible"
      data-testid={`card-audit-${film.title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => e.key === "Enter" && setExpanded(!expanded)}
        className="flex items-center gap-3 p-4 cursor-pointer hover-elevate rounded-md"
        data-testid={`button-expand-${film.title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <SpeedIcon tier={tier.tier} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif font-bold text-foreground" data-testid={`text-audit-title-${film.title.toLowerCase().replace(/\s+/g, "-")}`}>
              {film.title}
            </h3>
            <span className="text-xs text-muted-foreground">({film.year})</span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {film.cuts.length} impossible cut{film.cuts.length !== 1 ? "s" : ""}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Peak: <span className={`font-mono font-bold ${tier.className}`}>{worstCut.mph.toLocaleString()} MPH</span>
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )}
      </div>
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {film.cuts.map((cut, i) => (
            <CutCard key={i} cut={cut} index={i} />
          ))}
        </div>
      )}
    </Card>
  );
}

interface GeographicAuditsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GeographicAudits({ isOpen, onClose }: GeographicAuditsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4" data-testid="audits-panel">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-card border border-border rounded-md shadow-xl flex flex-col">
        <div className="flex items-center justify-between gap-2 p-4 border-b border-border">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground" data-testid="text-audits-heading">
              Geographic Audits
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              How Hollywood breaks the laws of physics in San Francisco
            </p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            data-testid="button-close-audits"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 px-4 py-3 border-b border-border bg-muted/30 flex-wrap">
          <div className="flex items-center gap-2" data-testid="stat-teleportations">
            <Gauge className="w-4 h-4 text-primary" />
            <div>
              <p className="text-lg font-black font-mono text-foreground leading-none">{totalTeleportations}</p>
              <p className="text-[10px] text-muted-foreground">Total Teleportations</p>
            </div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-2" data-testid="stat-peak-mph">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-lg font-black font-mono text-red-500 leading-none">{peakMph.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Peak MPH (Bullitt)</p>
            </div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-2" data-testid="stat-movies">
            <Rocket className="w-4 h-4 text-orange-400" />
            <div>
              <p className="text-lg font-black font-mono text-foreground leading-none">{AUDIT_DATA.length}</p>
              <p className="text-[10px] text-muted-foreground">Movies Audited</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {AUDIT_DATA.map((film) => (
              <FilmAuditCard key={film.title} film={film} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
