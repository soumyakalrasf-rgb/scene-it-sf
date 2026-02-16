import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, serial } from "drizzle-orm/pg-core";
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

export const insertFilmSchema = createInsertSchema(films).omit({ id: true });
export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });

export type InsertFilm = z.infer<typeof insertFilmSchema>;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Film = typeof films.$inferSelect;
export type Location = typeof locations.$inferSelect;

export type LocationWithFilm = Location & { film: Film };
