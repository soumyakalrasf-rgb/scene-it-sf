import { Film, MapPin, Calendar, Clapperboard } from "lucide-react";

interface StatsBarProps {
  filmCount: number;
  locationCount: number;
  neighborhoodCount: number;
  yearRange: string;
}

export default function StatsBar({ filmCount, locationCount, neighborhoodCount, yearRange }: StatsBarProps) {
  const stats = [
    { icon: Clapperboard, value: filmCount, label: "Films" },
    { icon: MapPin, value: locationCount, label: "Locations" },
    { icon: Film, value: neighborhoodCount, label: "Neighborhoods" },
    { icon: Calendar, value: yearRange, label: "Span" },
  ];

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[999]"
      data-testid="stats-bar"
    >
      <div className="bg-card/90 dark:bg-card/90 backdrop-blur-xl rounded-md border border-border/50 shadow-lg">
        <div className="flex items-center divide-x divide-border/50">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2.5">
              <stat.icon className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-bold text-foreground leading-none">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
