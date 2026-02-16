import { X, MapPin, Calendar, Star, ExternalLink, Navigation, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPosterUrl, getBackdropUrl } from "@/lib/constants";
import type { LocationWithFilm } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface LocationDetailProps {
  location: LocationWithFilm | null;
  onClose: () => void;
}

export default function LocationDetail({ location, onClose }: LocationDetailProps) {
  if (!location) return null;

  const film = location.film;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${location.lat},${location.lng}`;

  return (
    <AnimatePresence>
      {location && (
        <motion.div
          key="location-detail"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[1001] max-h-[70vh]"
          data-testid="location-detail-panel"
        >
          <div className="bg-card/95 dark:bg-card/95 backdrop-blur-xl border-t border-border/50 rounded-t-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            <div className="relative">
              {film?.backdropPath && (
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={getBackdropUrl(film.backdropPath) || ""}
                    alt={film.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
              )}

              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                className="absolute top-3 right-3 bg-background/50 backdrop-blur-sm text-foreground"
                data-testid="button-close-detail"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className={`px-5 pb-5 ${film?.backdropPath ? "-mt-14 relative z-10" : "pt-2"}`}>
              <div className="flex gap-4">
                {film?.posterPath && (
                  <img
                    src={getPosterUrl(film.posterPath) || ""}
                    alt={film.title}
                    className="w-24 h-36 object-cover rounded-md border border-border shadow-lg flex-shrink-0"
                    data-testid="img-detail-poster"
                  />
                )}
                <div className="flex-1 min-w-0 pt-1">
                  <h2 className="font-serif font-bold text-xl text-foreground leading-tight" data-testid="text-detail-title">
                    {film?.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {film?.year && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {film.year}
                      </span>
                    )}
                    {film?.rating && (
                      <span className="text-sm text-primary flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-primary" />
                        {film.rating.toFixed(1)}
                      </span>
                    )}
                    {film?.genre && (
                      <Badge variant="secondary">{film.genre}</Badge>
                    )}
                  </div>

                  <div className="mt-3 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{location.address}</p>
                      <p className="text-xs text-muted-foreground">{location.neighborhood}</p>
                    </div>
                  </div>
                </div>
              </div>

              {location.sceneDescription && (
                <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 font-semibold">Scene</p>
                  <p className="text-sm text-foreground italic leading-relaxed">
                    "{location.sceneDescription}"
                  </p>
                </div>
              )}

              {film?.synopsis && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {film.synopsis}
                </p>
              )}

              <div className="mt-4 flex gap-2 flex-wrap">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="sm" data-testid="button-directions">
                    <Navigation className="w-3.5 h-3.5 mr-1.5" />
                    Directions
                  </Button>
                </a>
                <a href={streetViewUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm" data-testid="button-street-view">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Street View
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
