import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SF_CENTER, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM, FLY_TO_ZOOM, getPosterSmallUrl } from "@/lib/constants";
import type { LocationWithFilm } from "@shared/schema";

function createFilmMarkerIcon(isSelected: boolean) {
  const size = isSelected ? 18 : 12;
  const color = isSelected ? "#e5a842" : "#c49a3c";
  const glow = isSelected ? "0 0 12px rgba(229, 168, 66, 0.6)" : "none";

  return L.divIcon({
    className: "custom-film-marker",
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: 2px solid rgba(255,255,255,0.9);
      border-radius: 50%;
      box-shadow: ${glow};
      transition: all 0.3s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapController({ selectedLocation, flyTo }: {
  selectedLocation: LocationWithFilm | null;
  flyTo: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo, FLY_TO_ZOOM, { duration: 1.2 });
    }
  }, [flyTo, map]);

  return null;
}

interface MapViewProps {
  locations: LocationWithFilm[];
  selectedLocation: LocationWithFilm | null;
  onLocationSelect: (loc: LocationWithFilm) => void;
  flyTo: [number, number] | null;
}

export default function MapView({ locations, selectedLocation, onLocationSelect, flyTo }: MapViewProps) {
  const markers = useMemo(() => {
    return locations.map((loc) => ({
      ...loc,
      isSelected: selectedLocation?.id === loc.id,
    }));
  }, [locations, selectedLocation]);

  return (
    <div className="absolute inset-0" data-testid="map-container">
      <MapContainer
        center={SF_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        zoomControl={false}
        style={{ height: "100%", width: "100%", background: "hsl(225, 20%, 7%)" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <ZoomControl position="bottomright" />
        <MapController selectedLocation={selectedLocation} flyTo={flyTo} />

        {markers.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={createFilmMarkerIcon(loc.isSelected)}
            eventHandlers={{
              click: () => onLocationSelect(loc),
            }}
          >
            <Popup className="film-popup">
              <div className="flex items-center gap-2 min-w-[180px]">
                {loc.film?.posterPath && (
                  <img
                    src={getPosterSmallUrl(loc.film.posterPath) || ""}
                    alt={loc.film.title}
                    className="w-10 h-14 object-cover rounded-sm"
                  />
                )}
                <div>
                  <p className="font-semibold text-sm leading-tight">{loc.film?.title}</p>
                  <p className="text-xs text-gray-400">{loc.film?.year}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{loc.address}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
