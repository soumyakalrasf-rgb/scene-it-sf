import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MapPin } from "lucide-react";

interface NeighborhoodFilterProps {
  neighborhoods: string[];
  selectedNeighborhood: string;
  onSelect: (neighborhood: string) => void;
  locationCounts: Record<string, number>;
}

export default function NeighborhoodFilter({
  neighborhoods,
  selectedNeighborhood,
  onSelect,
  locationCounts,
}: NeighborhoodFilterProps) {
  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-[999] max-w-[calc(100%-2rem)]"
      data-testid="neighborhood-filter"
    >
      <div className="bg-card/90 dark:bg-card/90 backdrop-blur-xl rounded-md border border-border/50 px-1.5 py-1 shadow-lg">
        <ScrollArea className="w-full">
          <div className="flex items-center gap-1 px-0.5">
            {neighborhoods.map((n) => {
              const isActive = n === selectedNeighborhood;
              const count = n === "All"
                ? Object.values(locationCounts).reduce((a, b) => a + b, 0)
                : locationCounts[n] || 0;

              return (
                <Button
                  key={n}
                  size="sm"
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onSelect(n)}
                  className="whitespace-nowrap text-xs"
                  data-testid={`button-filter-${n.toLowerCase().replace(/['\s]/g, "-")}`}
                >
                  {n === "All" && <MapPin className="w-3 h-3 mr-1" />}
                  {n}
                  {count > 0 && (
                    <span className={`text-[10px] ml-1 ${isActive ? "opacity-80" : "opacity-50"}`}>
                      {count}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
