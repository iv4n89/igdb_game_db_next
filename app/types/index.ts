export interface Console {
  id: number;
  name: string;
  slug: string;
  generation: number;
  imageUrl: string;
  logoUrl?: string;
  releaseYear: number;
  manufacturer: string;
  color: string; // Color theme for ui
}

export interface Game {
  id: number;
  name: string;
  cover?: {
    id: number;
    url: string;
  };
  first_release_date?: number;
  rating?: number;
  summary?: string;
  platforms?: number[];
  screenshots?: {
    id: number;
    url: string;
  }[];
  genres?: {
    id: number;
    name: string;
  }[];
  involved_companies?: {
    company: {
      name: string;
    };
    developer: boolean;
    publisher: boolean;
  }[];
  storyline?: string;
  aggregated_rating?: number;
}

export interface IGDBAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface FilterState {
  genre?: number;
  letter?: string;
  yearRange?: {
    start?: number;
    end?: number;
  };
}
