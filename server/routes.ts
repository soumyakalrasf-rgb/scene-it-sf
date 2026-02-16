import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/films", async (_req, res) => {
    try {
      const films = await storage.getFilms();
      res.json(films);
    } catch (err) {
      console.error("Error fetching films:", err);
      res.status(500).json({ error: "Failed to fetch films" });
    }
  });

  app.get("/api/films/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid film ID" });
      const film = await storage.getFilm(id);
      if (!film) return res.status(404).json({ error: "Film not found" });
      res.json(film);
    } catch (err) {
      console.error("Error fetching film:", err);
      res.status(500).json({ error: "Failed to fetch film" });
    }
  });

  app.get("/api/locations", async (_req, res) => {
    try {
      const locs = await storage.getLocationsWithFilms();
      res.json(locs);
    } catch (err) {
      console.error("Error fetching locations:", err);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.get("/api/films/:id/locations", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: "Invalid film ID" });
      const locs = await storage.getLocationsByFilm(id);
      res.json(locs);
    } catch (err) {
      console.error("Error fetching locations:", err);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.get("/api/tmdb/movie/:tmdbId", async (req, res) => {
    try {
      const apiKey = process.env.TMDB_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "TMDB API key not configured" });

      const tmdbId = req.params.tmdbId;
      const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&append_to_response=images`;
      const response = await fetch(url);
      if (!response.ok) return res.status(response.status).json({ error: "TMDB API error" });
      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error("TMDB proxy error:", err);
      res.status(500).json({ error: "Failed to fetch TMDB data" });
    }
  });

  return httpServer;
}
