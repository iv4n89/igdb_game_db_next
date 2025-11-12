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
}

export interface IGDBAuthResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}
