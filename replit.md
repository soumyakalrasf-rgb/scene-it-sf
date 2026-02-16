# Overview

This is **Scene It SF** — an interactive map-based web application that displays San Francisco film locations. Users can browse classic films shot in San Francisco, see their filming locations plotted on a Leaflet map, filter by neighborhood, and view details about each scene. The app has a cinematic warm/dark theme with a sidebar for browsing films and a bottom panel for location details.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Structure

The project follows a monorepo pattern with three main directories:

- **`client/`** — React single-page application (the frontend)
- **`server/`** — Express.js API server (the backend)
- **`shared/`** — Shared TypeScript types and database schema used by both client and server

### Frontend (`client/src/`)

- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Uses `wouter` (lightweight React router) — currently just `/` (Home) and a 404 fallback
- **State Management**: `@tanstack/react-query` for server state (fetching films and locations)
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives, styled with Tailwind CSS
- **Map**: Leaflet via `react-leaflet` for the interactive map, centered on San Francisco
- **Animations**: Framer Motion for panel transitions (location detail panel)
- **Theming**: Custom light/dark mode toggle stored in localStorage, CSS variables defined in `index.css`
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

Key components:
- `MapView` — Leaflet map with film location markers
- `FilmSidebar` — Left sidebar listing films with search
- `NeighborhoodFilter` — Top horizontal filter bar for neighborhoods
- `LocationDetail` — Bottom slide-up panel showing location/film details
- `StatsBar` — Bottom stats display (film count, location count, etc.)

### Backend (`server/`)

- **Framework**: Express.js running on Node with `tsx` for TypeScript execution
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Key Endpoints**:
  - `GET /api/films` — List all films ordered by year
  - `GET /api/films/:id` — Get a single film
  - `GET /api/locations` — Get all locations with joined film data
  - `GET /api/films/:id/locations` — Get locations for a specific film
- **Dev Server**: Vite dev server middleware is attached in development mode (`server/vite.ts`)
- **Production**: Static files served from `dist/public` via `server/static.ts`
- **Seeding**: `server/seed.ts` contains seed data for classic SF films (Vertigo, Bullitt, Dirty Harry, etc.) with their filming locations

### Database

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Connection**: `node-postgres` (pg) pool, connected via `DATABASE_URL` environment variable
- **Schema** (`shared/schema.ts`):
  - `films` table: id, title, year, tmdbId, genre, synopsis, posterPath, backdropPath, rating
  - `locations` table: id, filmId (FK → films), address, lat, lng, neighborhood, sceneDescription
- **Validation**: `drizzle-zod` generates Zod schemas for insert operations
- **Migrations**: Drizzle Kit configured with `drizzle-kit push` command (`db:push` script)
- **Storage layer**: `server/storage.ts` defines an `IStorage` interface with a `DatabaseStorage` implementation

### Build Process

- **Dev**: `tsx server/index.ts` runs the server with Vite middleware for HMR
- **Build**: Custom `script/build.ts` that runs Vite build for client and esbuild for server, outputting to `dist/`
- **Production**: `node dist/index.cjs` serves the built app

## External Dependencies

### Required Services
- **PostgreSQL**: Required. Connected via `DATABASE_URL` environment variable. The database must be provisioned before the app starts.

### Third-Party APIs (Image CDN)
- **TMDB (The Movie Database)**: Film poster and backdrop images are loaded from `https://image.tmdb.org/t/p/` — this is just an image CDN, no API key is needed for displaying images. The `tmdbId` field in the films table links to TMDB entries.

### Key NPM Packages
- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui (Radix primitives), Leaflet/react-leaflet, Framer Motion, TanStack React Query, wouter
- **Backend**: Express, Drizzle ORM, node-postgres (pg), Zod
- **Build tools**: esbuild (server bundling), Vite (client bundling), tsx (dev runtime)

### Map Tiles
- Leaflet map tiles are loaded from a tile server (configured in MapView component) — no API key configuration visible in the codebase, likely using OpenStreetMap default tiles.