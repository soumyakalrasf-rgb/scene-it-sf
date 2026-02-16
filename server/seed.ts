import { storage } from "./storage";

interface SeedFilm {
  title: string;
  year: number;
  tmdbId: number;
  genre: string;
  synopsis: string;
  locations: {
    address: string;
    lat: number;
    lng: number;
    neighborhood: string;
    sceneDescription: string;
  }[];
}

const SEED_DATA: SeedFilm[] = [
  {
    title: "Vertigo",
    year: 1958,
    tmdbId: 426,
    genre: "Thriller",
    synopsis: "A retired San Francisco detective suffering from acrophobia investigates the strange activities of an old friend's wife, all the while becoming dangerously obsessed with her.",
    locations: [
      { address: "Fort Point, Marine Dr", lat: 37.8107, lng: -122.4770, neighborhood: "Presidio", sceneDescription: "Madeleine jumps into the bay near Fort Point beneath the Golden Gate Bridge" },
      { address: "Mission Dolores, 3321 16th St", lat: 37.7646, lng: -122.4267, neighborhood: "Mission", sceneDescription: "Scottie follows Madeleine to the old Mission cemetery" },
      { address: "Palace of the Legion of Honor", lat: 37.7847, lng: -122.4998, neighborhood: "Presidio", sceneDescription: "Scottie discovers Madeleine staring at the portrait of Carlotta Valdes" },
    ],
  },
  {
    title: "Bullitt",
    year: 1968,
    tmdbId: 793,
    genre: "Action",
    synopsis: "An all-guts, no-glory San Francisco cop becomes determined to find the underworld kingpin that killed the witness in his protection.",
    locations: [
      { address: "Taylor & Filbert Streets", lat: 37.8013, lng: -122.4130, neighborhood: "Russian Hill", sceneDescription: "The iconic car chase roars through the steep hills of Russian Hill" },
      { address: "Marina Safeway, 15 Marina Blvd", lat: 37.8037, lng: -122.4375, neighborhood: "Marina", sceneDescription: "Bullitt's girlfriend shops at the Marina Safeway" },
    ],
  },
  {
    title: "Dirty Harry",
    year: 1971,
    tmdbId: 10728,
    genre: "Action",
    synopsis: "When a madman dubbed 'Scorpio' terrorizes San Francisco, hard-nosed cop Harry Callahan is assigned to track down the psychopath.",
    locations: [
      { address: "555 California St (Bank of America)", lat: 37.7921, lng: -122.4038, neighborhood: "Financial District", sceneDescription: "The Scorpio killer fires from the rooftop of the Bank of America building" },
      { address: "Kezar Stadium, Frederick St", lat: 37.7670, lng: -122.4575, neighborhood: "Haight-Ashbury", sceneDescription: "Harry's dramatic confrontation with Scorpio at the football stadium" },
      { address: "Washington Square Park", lat: 37.8005, lng: -122.4103, neighborhood: "North Beach", sceneDescription: "Harry stakes out the area waiting for the ransom drop" },
    ],
  },
  {
    title: "The Conversation",
    year: 1974,
    tmdbId: 592,
    genre: "Thriller",
    synopsis: "A paranoid and personally-secretive surveillance expert has a crisis of conscience when he suspects the couple he is spying on will be murdered.",
    locations: [
      { address: "Union Square", lat: 37.7879, lng: -122.4074, neighborhood: "Union Square", sceneDescription: "Harry Caul records the couple's conversation as they walk through the crowded square" },
      { address: "Financial Center, Embarcadero", lat: 37.7955, lng: -122.3937, neighborhood: "Financial District", sceneDescription: "The Director's corporate offices overlook the city" },
    ],
  },
  {
    title: "Invasion of the Body Snatchers",
    year: 1978,
    tmdbId: 11839,
    genre: "Sci-Fi",
    synopsis: "San Francisco residents gradually discover that people are being replaced by emotionless alien duplicates grown from plant-like pods.",
    locations: [
      { address: "City Hall, 1 Dr Carlton B Goodlett Pl", lat: 37.7793, lng: -122.4193, neighborhood: "Civic Center", sceneDescription: "The Health Department building where Matthew works" },
      { address: "Filbert Street Steps", lat: 37.8020, lng: -122.4042, neighborhood: "North Beach", sceneDescription: "Characters flee through the terraced gardens of Telegraph Hill" },
    ],
  },
  {
    title: "Star Trek IV: The Voyage Home",
    year: 1986,
    tmdbId: 8923,
    genre: "Sci-Fi",
    synopsis: "Kirk and his crew travel back in time to 1986 San Francisco to retrieve humpback whales to save Earth in the future.",
    locations: [
      { address: "Golden Gate Park", lat: 37.7694, lng: -122.4862, neighborhood: "Haight-Ashbury", sceneDescription: "The crew lands their cloaked Klingon Bird-of-Prey in the park" },
      { address: "Embarcadero & Market St", lat: 37.7932, lng: -122.3951, neighborhood: "Embarcadero", sceneDescription: "Kirk and Spock ride the Muni bus through downtown" },
    ],
  },
  {
    title: "Mrs. Doubtfire",
    year: 1993,
    tmdbId: 788,
    genre: "Comedy",
    synopsis: "After a bitter divorce, an actor disguises himself as a female housekeeper to spend time with his children held in custody by his former wife.",
    locations: [
      { address: "2640 Steiner St", lat: 37.7926, lng: -122.4370, neighborhood: "Pacific Heights", sceneDescription: "The iconic Hillard family home where Mrs. Doubtfire lives" },
      { address: "Bridges Restaurant, 44 Church St", lat: 37.7703, lng: -122.4296, neighborhood: "Castro", sceneDescription: "The restaurant scene where Daniel juggles two identities" },
    ],
  },
  {
    title: "The Rock",
    year: 1996,
    tmdbId: 9802,
    genre: "Action",
    synopsis: "A rogue general and his group of U.S. Marines take over Alcatraz and threaten San Francisco with a nerve gas attack.",
    locations: [
      { address: "Alcatraz Island", lat: 37.8267, lng: -122.4230, neighborhood: "Alcatraz", sceneDescription: "The entire climax unfolds on the infamous prison island" },
      { address: "Fairmont Hotel, 950 Mason St", lat: 37.7923, lng: -122.4102, neighborhood: "Nob Hill", sceneDescription: "FBI and military coordinate their assault from the luxury hotel" },
      { address: "Coit Tower, 1 Telegraph Hill Blvd", lat: 37.8024, lng: -122.4058, neighborhood: "North Beach", sceneDescription: "The fireball erupts from the tower during the chase sequence" },
    ],
  },
  {
    title: "The Pursuit of Happyness",
    year: 2006,
    tmdbId: 1402,
    genre: "Drama",
    synopsis: "A struggling salesman takes custody of his son as he's poised to begin a life-changing professional career in San Francisco.",
    locations: [
      { address: "Glide Memorial Church, 330 Ellis St", lat: 37.7851, lng: -122.4128, neighborhood: "Tenderloin", sceneDescription: "Chris and his son line up at the Glide homeless shelter" },
      { address: "Montgomery St BART Station", lat: 37.7894, lng: -122.4019, neighborhood: "Financial District", sceneDescription: "Chris runs through the financial district chasing opportunities" },
    ],
  },
  {
    title: "Zodiac",
    year: 2007,
    tmdbId: 1949,
    genre: "Thriller",
    synopsis: "In the late 1960s-70s, a cartoonist becomes an amateur detective obsessed with tracking down the Zodiac killer terrorizing Northern California.",
    locations: [
      { address: "San Francisco Chronicle, 901 Mission St", lat: 37.7823, lng: -122.4069, neighborhood: "SoMa", sceneDescription: "The newsroom where the Zodiac letters are received and analyzed" },
      { address: "Washington & Cherry Streets", lat: 37.7897, lng: -122.4581, neighborhood: "Presidio", sceneDescription: "The taxi cab murder scene in the Presidio Heights neighborhood" },
    ],
  },
  {
    title: "Milk",
    year: 2008,
    tmdbId: 10005,
    genre: "Drama",
    synopsis: "The story of Harvey Milk, the first openly gay elected official in the history of California, who became an activist in San Francisco.",
    locations: [
      { address: "575 Castro St (Castro Camera)", lat: 37.7601, lng: -122.4350, neighborhood: "Castro", sceneDescription: "Harvey Milk's camera shop, the base of his political movement" },
      { address: "City Hall, 1 Dr Carlton B Goodlett Pl", lat: 37.7793, lng: -122.4193, neighborhood: "Civic Center", sceneDescription: "Where Harvey Milk served as Supervisor and where he was assassinated" },
    ],
  },
  {
    title: "Blue Jasmine",
    year: 2013,
    tmdbId: 137109,
    genre: "Drama",
    synopsis: "A New York socialite, deeply troubled and struggling with addiction, moves into her sister's modest apartment in San Francisco.",
    locations: [
      { address: "South Park, SoMa", lat: 37.7826, lng: -122.3940, neighborhood: "SoMa", sceneDescription: "Jasmine wanders through the neighborhood trying to rebuild her life" },
      { address: "Mission District street markets", lat: 37.7599, lng: -122.4148, neighborhood: "Mission", sceneDescription: "Scenes of everyday life in the working-class neighborhood" },
    ],
  },
  {
    title: "Ant-Man and the Wasp",
    year: 2018,
    tmdbId: 363088,
    genre: "Action",
    synopsis: "In the aftermath of Captain America: Civil War, Scott Lang grapples with the consequences of his choices as he tries to balance his home life in San Francisco.",
    locations: [
      { address: "Lombard Street", lat: 37.8021, lng: -122.4187, neighborhood: "Russian Hill", sceneDescription: "The iconic car chase sequence down the crookedest street in the world" },
      { address: "Pier 39, Fisherman's Wharf", lat: 37.8087, lng: -122.4098, neighborhood: "Fisherman's Wharf", sceneDescription: "Action sequences at the famous waterfront destination" },
    ],
  },
  {
    title: "Venom",
    year: 2018,
    tmdbId: 335983,
    genre: "Action",
    synopsis: "Journalist Eddie Brock bonds with an alien symbiote to form Venom, gaining superpowers but also a dangerous alter ego in San Francisco.",
    locations: [
      { address: "Transamerica Pyramid, 600 Montgomery St", lat: 37.7952, lng: -122.4028, neighborhood: "Financial District", sceneDescription: "The Life Foundation's headquarters are located in the iconic pyramid building" },
      { address: "Chinatown, Grant Avenue", lat: 37.7942, lng: -122.4070, neighborhood: "Chinatown", sceneDescription: "Eddie Brock walks through Chinatown after losing his job" },
    ],
  },
  {
    title: "The Last Black Man in San Francisco",
    year: 2019,
    tmdbId: 513576,
    genre: "Drama",
    synopsis: "A young man searches for home in the rapidly changing city that seems to have left him behind, dreaming of reclaiming the Victorian house his grandfather built.",
    locations: [
      { address: "Western Addition Victorian homes", lat: 37.7804, lng: -122.4390, neighborhood: "Pacific Heights", sceneDescription: "The beautiful Victorian house that Jimmie's grandfather built" },
      { address: "Bayview-Hunters Point", lat: 37.7298, lng: -122.3812, neighborhood: "Bayview", sceneDescription: "The neighborhood where Jimmie and Mont grew up" },
    ],
  },
];

async function fetchTmdbData(tmdbId: number): Promise<{ posterPath: string | null; backdropPath: string | null; rating: number | null }> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return { posterPath: null, backdropPath: null, rating: null };

  try {
    const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return { posterPath: null, backdropPath: null, rating: null };
    const data = await res.json();
    return {
      posterPath: data.poster_path || null,
      backdropPath: data.backdrop_path || null,
      rating: data.vote_average || null,
    };
  } catch {
    return { posterPath: null, backdropPath: null, rating: null };
  }
}

export async function seedDatabase() {
  const count = await storage.getFilmCount();
  if (count > 0) {
    console.log(`Database already seeded with ${count} films. Skipping.`);
    return;
  }

  console.log("Seeding database with SF filming locations...");

  for (const filmData of SEED_DATA) {
    const tmdb = await fetchTmdbData(filmData.tmdbId);

    const film = await storage.insertFilm({
      title: filmData.title,
      year: filmData.year,
      tmdbId: filmData.tmdbId,
      genre: filmData.genre,
      synopsis: filmData.synopsis,
      posterPath: tmdb.posterPath,
      backdropPath: tmdb.backdropPath,
      rating: tmdb.rating,
    });

    for (const loc of filmData.locations) {
      await storage.insertLocation({
        filmId: film.id,
        address: loc.address,
        lat: loc.lat,
        lng: loc.lng,
        neighborhood: loc.neighborhood,
        sceneDescription: loc.sceneDescription,
      });
    }

    console.log(`  Seeded: ${filmData.title} (${filmData.year}) with ${filmData.locations.length} locations`);
  }

  console.log("Database seeding complete!");
}
