import axios from "axios";
import { Game, Genre, IGDBAuthResponse } from "../types";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get IGDB API token, caching it until expiry
 * @returns Promise<string>
 */
export async function getIGDBToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post<IGDBAuthResponse>(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
  );

  cachedToken = response.data.access_token;

  console.log(cachedToken);

  tokenExpiry = Date.now() + (response.data.expires_in - 3600) * 1000; // Refresh 1 hour before expiry

  return cachedToken;
}

export async function getGamesCount(platformId: number): Promise<number> {
  const token = await getIGDBToken();

  const response = await axios.post(
    `https://api.igdb.com/v4/games/count`,
    `
      where platforms = (${platformId}) & cover != null;
    `,
    {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID || "",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  return response.data.count;
}

/**
 * Fetch games for a specific platform
 * @param platformId
 * @param limit
 * @param offset
 * @returns Promise<Game[]>
 */
export async function fetchGamesForPlatform(
  platformId: number,
  limit: number = 20,
  offset: number = 0,
  filters?: {
    genre?: number;
    letter?: string;
    yearStart?: number;
    yearEnd?: number;
  }
): Promise<Game[]> {
  const token = await getIGDBToken();

  const whereConditions = [`platforms = (${platformId})`, "cover != null"];

  if (filters?.genre) {
    whereConditions.push(`genres = (${filters.genre})`);
  }

  if (filters?.yearStart && filters?.yearEnd) {
    const startTimestamp = new Date(filters.yearStart, 0, 1).getTime() / 1000;
    const endTimestamp = new Date(filters.yearEnd, 11, 31).getTime() / 1000;
    whereConditions.push(
      `first_release_date >= ${startTimestamp} & first_release_date <= ${endTimestamp}`
    );
  }

  let query = "";
  if (filters?.letter) {
    if (filters.letter === "#") {
      whereConditions.push(
        'name ~ "1"* | name ~ "2"* | name ~ "3"* | name ~ "4"* | name ~ "5"* | name ~ "6"* | name ~ "7"* | name ~ "8"* | name ~ "9"* | name ~ "0"*'
      );
    } else {
      whereConditions.push(`name ~ "${filters.letter.toLowerCase()}"*`);
    }
  }

  const whereClause = whereConditions.join(" & ");

  query = `
      fields name, cover.url, first_release_date, rating, summary, platforms, genres.name;
      where ${whereClause};
      sort first_release_date asc;
      limit ${limit};
      offset ${offset};
    `;

  const response = await axios.post("https://api.igdb.com/v4/games", query, {
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  return response.data;
}

export async function fetchGenresForPlatform(
  platformId: number
): Promise<Array<{ id: number; name: string }>> {
  const token = await getIGDBToken();

  const response = await axios.post(
    "https://api.igdb.com/v4/games",
    `
      fields genres.name;
      where platforms = (${platformId}) & cover != null & genres != null;
      limit 500;
    `,
    {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID!,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  const genresMap = new Map<number, string>();
  response.data.forEach((game: Game) => {
    if (game.genres) {
      game.genres.forEach((genre: Genre) => {
        genresMap.set(genre.id, genre.name);
      });
    }
  });

  return Array.from(genresMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchGameDetail(gameId: number): Promise<Game> {
  const token = await getIGDBToken();

  const response = await axios.post(
    `https://api.igdb.com/v4/games`,
    `
      fields name, cover.url, first_release_date, rating, summary, platforms, screenshots.url, genres.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, storyline, aggregated_rating;
      where id = ${gameId};
    `,
    {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID || "",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  return response.data[0];
}

/**
 * Search games by query string
 * @param query
 * @returns Promise<Game[]>
 */
export async function searchGames(query: string): Promise<Game[]> {
  const token = await getIGDBToken();

  const response = await axios.post(
    "https://api.igdb.com/v4/games",
    `
        search "${query}";
        fields name, cover.url, first_release_date, rating, summary, platforms;
        where cover != null;
        limit 10;
        `,
    {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID || "",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  return response.data;
}
