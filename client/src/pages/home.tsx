import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MapView from "@/components/MapView";
import FilmSidebar from "@/components/FilmSidebar";
import NeighborhoodFilter from "@/components/NeighborhoodFilter";
import LocationDetail from "@/components/LocationDetail";
import StatsBar from "@/components/StatsBar";
import { useTheme } from "@/hooks/use-theme";
import { NEIGHBORHOODS } from "@/lib/constants";
import type { Film, LocationWithFilm } from "@shared/schema";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFilmId, setSelectedFilmId] = useState<number | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState<LocationWithFilm | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const { data: films = [], isLoading: filmsLoading } = useQuery<Film[]>({
    queryKey: ["/api/films"],
  });

  const { data: locations = [], isLoading: locsLoading } = useQuery<LocationWithFilm[]>({
    queryKey: ["/api/locations"],
  });

  const filteredLocations = useMemo(() => {
    let filtered = locations;
    if (selectedNeighborhood !== "All") {
      filtered = filtered.filter((l) => l.neighborhood === selectedNeighborhood);
    }
    if (selectedFilmId) {
      filtered = filtered.filter((l) => l.filmId === selectedFilmId);
    }
    return filtered;
  }, [locations, selectedNeighborhood, selectedFilmId]);

  const locationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    locations.forEach((l) => {
      counts[l.neighborhood] = (counts[l.neighborhood] || 0) + 1;
    });
    return counts;
  }, [locations]);

  const availableNeighborhoods = useMemo(() => {
    const used = new Set(locations.map((l) => l.neighborhood));
    return NEIGHBORHOODS.filter((n) => n === "All" || used.has(n));
  }, [locations]);

  const yearRange = useMemo(() => {
    if (films.length === 0) return "—";
    const years = films.map((f) => f.year);
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? `${min}` : `${min}–${max}`;
  }, [films]);

  const uniqueNeighborhoods = useMemo(() => {
    return new Set(locations.map((l) => l.neighborhood)).size;
  }, [locations]);

  const handleFilmSelect = useCallback((film: Film) => {
    if (selectedFilmId === film.id) {
      setSelectedFilmId(null);
    } else {
      setSelectedFilmId(film.id);
    }
    setSelectedLocation(null);
    setFlyTo(null);
  }, [selectedFilmId]);

  const handleLocationSelect = useCallback((loc: LocationWithFilm) => {
    setSelectedLocation(loc);
    setFlyTo([loc.lat, loc.lng]);
    setSelectedFilmId(loc.filmId);
  }, []);

  const handleNeighborhoodSelect = useCallback((neighborhood: string) => {
    setSelectedNeighborhood(neighborhood);
    setSelectedFilmId(null);
    setSelectedLocation(null);
    setFlyTo(null);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-background">
      <MapView
        locations={filteredLocations}
        selectedLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
        flyTo={flyTo}
      />

      <NeighborhoodFilter
        neighborhoods={availableNeighborhoods}
        selectedNeighborhood={selectedNeighborhood}
        onSelect={handleNeighborhoodSelect}
        locationCounts={locationCounts}
      />

      {!sidebarOpen && (
        <div className="fixed top-4 left-4 z-[999] flex items-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setSidebarOpen(true)}
            className="bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg"
            data-testid="button-open-sidebar"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="fixed top-4 right-4 z-[999]">
        <Button
          size="icon"
          variant="secondary"
          onClick={toggleTheme}
          className="bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg"
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      <FilmSidebar
        films={films}
        locations={locations}
        selectedFilmId={selectedFilmId}
        onFilmSelect={handleFilmSelect}
        onLocationSelect={handleLocationSelect}
        isLoading={filmsLoading || locsLoading}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
      />

      <LocationDetail
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />

      <StatsBar
        filmCount={films.length}
        locationCount={locations.length}
        neighborhoodCount={uniqueNeighborhoods}
        yearRange={yearRange}
      />
    </div>
  );
}
