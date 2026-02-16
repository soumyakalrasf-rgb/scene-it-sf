import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  films,
  locations,
  type Film,
  type InsertFilm,
  type Location,
  type InsertLocation,
  type LocationWithFilm,
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
}

export const storage = new DatabaseStorage();
