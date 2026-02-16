import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, serial, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const films = pgTable("films", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  tmdbId: integer("tmdb_id"),
  genre: text("genre"),
  synopsis: text("synopsis"),
  posterPath: text("poster_path"),
  backdropPath: text("backdrop_path"),
  rating: real("rating"),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  filmId: integer("film_id").notNull().references(() => films.id),
  address: text("address").notNull(),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  neighborhood: text("neighborhood").notNull(),
  sceneDescription: text("scene_description"),
});

export const chases = pgTable("chases", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 4 }).notNull().unique(),
  locationId: integer("location_id").notNull().references(() => locations.id),
  status: text("status").notNull().default("waiting"),
  startedAt: bigint("started_at", { mode: "number" }),
  endedAt: bigint("ended_at", { mode: "number" }),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const insertFilmSchema = createInsertSchema(films).omit({ id: true });
export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });
export const insertChaseSchema = createInsertSchema(chases).omit({ id: true });

export type InsertFilm = z.infer<typeof insertFilmSchema>;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type InsertChase = z.infer<typeof insertChaseSchema>;
export type Film = typeof films.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type Chase = typeof chases.$inferSelect;

export type LocationWithFilm = Location & { film: Film };

export type ChaseWithDetails = Chase & {
  location: Location;
  film: Film;
};
