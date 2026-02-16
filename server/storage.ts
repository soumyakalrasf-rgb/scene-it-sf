import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  films,
  locations,
  chases,
  type Film,
  type InsertFilm,
  type Location,
  type InsertLocation,
  type LocationWithFilm,
  type Chase,
  type InsertChase,
  type ChaseWithDetails,
} from "@shared/schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export interface IStorage {
  getFilms(): Promise<Film[]>;
  getFilm(id: number): Promise<Film | undefined>;
  insertFilm(film: InsertFilm): Promise<Film>;
  getLocations(): Promise<Location[]>;
  getLocationsWithFilms(): Promise<LocationWithFilm[]>;
  getLocationsByFilm(filmId: number): Promise<Location[]>;
  insertLocation(location: InsertLocation): Promise<Location>;
  getFilmCount(): Promise<number>;
  createChase(chase: InsertChase): Promise<Chase>;
  getChaseByCode(code: string): Promise<ChaseWithDetails | undefined>;
  updateChaseStatus(code: string, status: string, startedAt?: number, endedAt?: number): Promise<Chase | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getFilms(): Promise<Film[]> {
    return db.select().from(films).orderBy(films.year);
  }

  async getFilm(id: number): Promise<Film | undefined> {
    const result = await db.select().from(films).where(eq(films.id, id));
    return result[0];
  }

  async insertFilm(film: InsertFilm): Promise<Film> {
    const result = await db.insert(films).values(film).returning();
    return result[0];
  }

  async getLocations(): Promise<Location[]> {
    return db.select().from(locations);
  }

  async getLocationsWithFilms(): Promise<LocationWithFilm[]> {
    const allLocations = await db.select().from(locations);
    const allFilms = await db.select().from(films);
    const filmMap = new Map(allFilms.map((f) => [f.id, f]));

    return allLocations.map((loc) => ({
      ...loc,
      film: filmMap.get(loc.filmId)!,
    }));
  }

  async getLocationsByFilm(filmId: number): Promise<Location[]> {
    return db.select().from(locations).where(eq(locations.filmId, filmId));
  }

  async insertLocation(location: InsertLocation): Promise<Location> {
    const result = await db.insert(locations).values(location).returning();
    return result[0];
  }

  async getFilmCount(): Promise<number> {
    const result = await db.select().from(films);
    return result.length;
  }

  async createChase(chase: InsertChase): Promise<Chase> {
    const result = await db.insert(chases).values(chase).returning();
    return result[0];
  }

  async getChaseByCode(code: string): Promise<ChaseWithDetails | undefined> {
    const result = await db.select().from(chases).where(eq(chases.code, code));
    if (result.length === 0) return undefined;
    const chase = result[0];
    const loc = await db.select().from(locations).where(eq(locations.id, chase.locationId));
    if (loc.length === 0) return undefined;
    const film = await db.select().from(films).where(eq(films.id, loc[0].filmId));
    if (film.length === 0) return undefined;
    return { ...chase, location: loc[0], film: film[0] };
  }

  async updateChaseStatus(code: string, status: string, startedAt?: number, endedAt?: number): Promise<Chase | undefined> {
    const updates: Partial<Chase> = { status };
    if (startedAt !== undefined) (updates as any).startedAt = startedAt;
    if (endedAt !== undefined) (updates as any).endedAt = endedAt;
    const result = await db.update(chases).set(updates).where(eq(chases.code, code)).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
