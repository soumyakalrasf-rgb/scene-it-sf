import { useState } from "react";
import { Film, MapPin, Star, Calendar, ChevronRight, Search, X, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { getPosterUrl } from "@/lib/constants";
import type { Film as FilmType, LocationWithFilm } from "@shared/schema";

interface FilmSidebarProps {
  films: FilmType[];
  locations: LocationWithFilm[];
  selectedFilmId: number | null;
  onFilmSelect: (film: FilmType) => void;
  onLocationSelect: (loc: LocationWithFilm) => void;
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FilmSidebar({
  films,
  locations,
  selectedFilmId,
  onFilmSelect,
  onLocationSelect,
  isLoading,
  isOpen,
  onToggle,
}: FilmSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFilms = films.filter((f) =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedFilm = films.find((f) => f.id === selectedFilmId);
  const filmLocations = selectedFilmId
    ? locations.filter((l) => l.filmId === selectedFilmId)
    : [];

  return (
    <div
      className={`fixed top-0 left-0 h-full z-[1000] transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ width: "380px" }}
      data-testid="film-sidebar"
    >
      <div className="h-full bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-primary" />
              <h1 className="font-serif text-lg font-bold text-sidebar-foreground tracking-wide" data-testid="text-app-title">
                Scene It SF
              </h1>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={onToggle}
              className="text-sidebar-foreground"
              data-testid="button-close-sidebar"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search films..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-sidebar-accent/50 border border-sidebar-border rounded-md text-sm text-sidebar-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              data-testid="input-search-films"
            />
          </div>
        </div>

        {selectedFilm ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="relative">
              {selectedFilm.backdropPath && (
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w780${selectedFilm.backdropPath}`}
                    alt={selectedFilm.title}
                    className="w-full h-full object-cover"
                    data-testid="img-film-backdrop"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sidebar via-sidebar/60 to-transparent" />
                </div>
              )}
              <div className={`px-4 ${selectedFilm.backdropPath ? "-mt-16 relative z-10" : "pt-4"}`}>
                <div className="flex gap-3">
                  {selectedFilm.posterPath && (
                    <img
                      src={getPosterUrl(selectedFilm.posterPath) || ""}
                      alt={selectedFilm.title}
                      className="w-20 h-[120px] object-cover rounded-md border border-sidebar-border shadow-lg flex-shrink-0"
                      data-testid={`img-poster-${selectedFilm.id}`}
                    />
                  )}
                  <div className="flex-1 min-w-0 pt-2">
                    <h2 className="font-serif font-bold text-sidebar-foreground text-lg leading-tight" data-testid="text-film-title">
                      {selectedFilm.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground flex items-center gap-1" data-testid="text-film-year">
                        <Calendar className="w-3 h-3" />
                        {selectedFilm.year}
                      </span>
                      {selectedFilm.rating && (
                        <span className="text-xs text-primary flex items-center gap-1" data-testid="text-film-rating">
                          <Star className="w-3 h-3 fill-primary" />
                          {selectedFilm.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    {selectedFilm.genre && (
                      <Badge variant="secondary" className="mt-2 text-xs" data-testid="badge-film-genre">
                        {selectedFilm.genre}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedFilm.synopsis && (
              <p className="px-4 mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3" data-testid="text-film-synopsis">
                {selectedFilm.synopsis}
              </p>
            )}

            <div className="px-4 mt-4 mb-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Filming Locations
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilmSelect(selectedFilm)}
                  className="text-xs text-muted-foreground"
                  data-testid="button-back-to-films"
                >
                  Back to all
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 px-4 pb-4">
              <div className="space-y-2">
                {filmLocations.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => onLocationSelect(loc)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && onLocationSelect(loc)}
                    className="w-full text-left p-3 rounded-md bg-sidebar-accent/30 hover-elevate border border-sidebar-border/50 cursor-pointer"
                    data-testid={`button-location-${loc.id}`}
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sidebar-foreground leading-tight" data-testid={`text-location-address-${loc.id}`}>
                          {loc.address}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5" data-testid={`text-location-neighborhood-${loc.id}`}>{loc.neighborhood}</p>
                        {loc.sceneDescription && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">
                            "{loc.sceneDescription}"
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-2" data-testid={`skeleton-film-${i}`}>
                    <Skeleton className="w-12 h-[72px] rounded-md bg-sidebar-accent/30" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-sidebar-accent/30" />
                      <Skeleton className="h-3 w-1/2 bg-sidebar-accent/30" />
                      <Skeleton className="h-3 w-1/3 bg-sidebar-accent/30" />
                    </div>
                  </div>
                ))
              ) : filteredFilms.length === 0 ? (
                <div className="text-center py-12" data-testid="text-no-films">
                  <Film className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No films found</p>
                </div>
              ) : (
                filteredFilms.map((film) => {
                  const locCount = locations.filter((l) => l.filmId === film.id).length;
                  return (
                    <div
                      key={film.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onFilmSelect(film)}
                      onKeyDown={(e) => e.key === "Enter" && onFilmSelect(film)}
                      className="w-full text-left flex gap-3 p-2 rounded-md hover-elevate cursor-pointer"
                      data-testid={`button-film-${film.id}`}
                    >
                      {film.posterPath ? (
                        <img
                          src={getPosterUrl(film.posterPath) || ""}
                          alt={film.title}
                          className="w-12 h-[72px] object-cover rounded-md border border-sidebar-border/50 flex-shrink-0"
                          data-testid={`img-film-poster-${film.id}`}
                        />
                      ) : (
                        <div className="w-12 h-[72px] rounded-md bg-sidebar-accent/50 flex items-center justify-center flex-shrink-0">
                          <Film className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-sidebar-foreground leading-tight" data-testid={`text-film-title-${film.id}`}>
                          {film.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground" data-testid={`text-film-year-${film.id}`}>{film.year}</span>
                          {film.rating && (
                            <span className="text-xs text-primary flex items-center gap-0.5" data-testid={`text-film-rating-${film.id}`}>
                              <Star className="w-3 h-3 fill-primary" />
                              {film.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground" data-testid={`text-film-locations-${film.id}`}>
                            {locCount} location{locCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground self-center flex-shrink-0" />
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
