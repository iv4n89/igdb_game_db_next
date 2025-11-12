import axios from "axios";
import { Game, IGDBAuthResponse } from "../types";

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
  offset: number = 0
): Promise<Game[]> {
  const token = await getIGDBToken();

  const response = await axios.post(
    "https://api.igdb.com/v4/games",
    `
        fields name, cover.url, first_release_date, rating, summary, platforms;
        where platforms = (${platformId}) & cover != null;
        sort first_release_date asc;
        limit ${limit};
        offset ${offset};
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
