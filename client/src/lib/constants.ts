export const SF_CENTER: [number, number] = [37.7749, -122.4194];
export const DEFAULT_ZOOM = 13;
export const MIN_ZOOM = 11;
export const MAX_ZOOM = 18;
export const FLY_TO_ZOOM = 16;

export const NEIGHBORHOODS = [
  "All",
  "Alcatraz",
  "Bayview",
  "Castro",
  "Chinatown",
  "Civic Center",
  "Embarcadero",
  "Financial District",
  "Fisherman's Wharf",
  "Haight-Ashbury",
  "Marina",
  "Mission",
  "Nob Hill",
  "Noe Valley",
  "North Beach",
  "Pacific Heights",
  "Presidio",
  "Russian Hill",
  "SoMa",
  "Tenderloin",
  "Union Square",
] as const;

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";
export const POSTER_SIZE = "w342";
export const BACKDROP_SIZE = "w780";
export const POSTER_SMALL = "w154";

export function getPosterUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${POSTER_SIZE}${path}`;
}

export function getBackdropUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${BACKDROP_SIZE}${path}`;
}

export function getPosterSmallUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${POSTER_SMALL}${path}`;
}
