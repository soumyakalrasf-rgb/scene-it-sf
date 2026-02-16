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

  app.post("/api/chases", async (req, res) => {
    try {
      const { locationId } = req.body;
      if (!locationId) return res.status(400).json({ error: "locationId required" });

      let code: string;
      let attempts = 0;
      do {
        code = Array.from({ length: 4 }, () =>
          "ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.floor(Math.random() * 24)]
        ).join("");
        const existing = await storage.getChaseByCode(code);
        if (!existing) break;
        attempts++;
      } while (attempts < 20);

      const chase = await storage.createChase({
        code,
        locationId: parseInt(locationId, 10),
        status: "waiting",
        startedAt: null,
        endedAt: null,
        createdAt: Date.now(),
      });
      const full = await storage.getChaseByCode(chase.code);
      res.json(full);
    } catch (err) {
      console.error("Error creating chase:", err);
      res.status(500).json({ error: "Failed to create chase" });
    }
  });

  app.get("/api/chases/:code", async (req, res) => {
    try {
      const code = req.params.code.toUpperCase();
      const chase = await storage.getChaseByCode(code);
      if (!chase) return res.status(404).json({ error: "Chase not found" });
      res.json(chase);
    } catch (err) {
      console.error("Error fetching chase:", err);
      res.status(500).json({ error: "Failed to fetch chase" });
    }
  });

  app.patch("/api/chases/:code/start", async (req, res) => {
    try {
      const code = req.params.code.toUpperCase();
      const chase = await storage.updateChaseStatus(code, "active", Date.now());
      if (!chase) return res.status(404).json({ error: "Chase not found" });
      const full = await storage.getChaseByCode(code);
      res.json(full);
    } catch (err) {
      console.error("Error starting chase:", err);
      res.status(500).json({ error: "Failed to start chase" });
    }
  });

  app.patch("/api/chases/:code/end", async (req, res) => {
    try {
      const code = req.params.code.toUpperCase();
      const chase = await storage.updateChaseStatus(code, "ended", undefined, Date.now());
      if (!chase) return res.status(404).json({ error: "Chase not found" });
      const full = await storage.getChaseByCode(code);
      res.json(full);
    } catch (err) {
      console.error("Error ending chase:", err);
      res.status(500).json({ error: "Failed to end chase" });
    }
  });

  app.get("/api/locations/random", async (req, res) => {
    try {
      const locs = await storage.getLocationsWithFilms();
      const count = parseInt(req.query.count as string) || 3;
      const shuffled = locs.sort(() => Math.random() - 0.5).slice(0, count);
      res.json(shuffled);
    } catch (err) {
      console.error("Error fetching random locations:", err);
      res.status(500).json({ error: "Failed to fetch random locations" });
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
