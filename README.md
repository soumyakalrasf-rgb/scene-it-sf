# 🎬 Scene It SF

**Every movie scene filmed in San Francisco — mapped.**

A mobile-first progressive web app that lets you explore film locations across San Francisco, walk themed movie routes, and discover how Steve McQueen broke the laws of physics in the most famous car chase in cinema history.

## Features

- **Explore** — Browse 40+ filming locations from 1947 to 2022. Search by movie, actor, or location. Filter by neighborhood.
- **Near Me** — Uses your GPS to find the closest film scene to wherever you are standing right now.
- **The Bullitt Audit** — An interactive timeline that maps the actual filming locations of the 1968 Bullitt car chase and reveals the impossible geographic teleportations. Spoiler: McQueen would have needed to drive 9,840 MPH to make one cut work.
- **Scene Walks** — Five curated walking routes: Dirty Harry's SF, Hitchcock's San Francisco, Rom-Com Crawl, Superhero Smash, and Golden Age Classics.
- **Trivia** — A 12-question quiz about SF film locations with scoring.

## Data

Built on the [Film Locations in San Francisco](https://data.sfgov.org/Culture-and-Recreation/Film-Locations-in-San-Francisco/yitu-d5am) dataset published by [DataSF](https://datasf.org), the City and County of San Francisco's open data program.

## Tech

- Single HTML file, no build step, no framework, no dependencies
- Progressive Web App (installable on mobile)
- Canvas-based map rendering for the Bullitt Audit
- Geolocation API for "Near Me" feature
- Offline-capable via service worker

## Deploy

This is designed for GitHub Pages:

1. Fork or clone this repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder
4. Your app is live at `https://yourusername.github.io/scene-it-sf/`

Optional: Point a custom domain (e.g., `sceneitsf.com`) to GitHub Pages for a cleaner URL.

## Local Development

Just open `index.html` in a browser. That's it. No `npm install`, no build, no server required.

For service worker testing, use a local server:
```bash
python -m http.server 8000
```

## License

MIT

## Credits

Film location data: [DataSF Open Data](https://data.sfgov.org)  
Bullitt chase research: Compiled from multiple film history sources  
Built with ☕ in San Francisco
