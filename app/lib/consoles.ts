import { Console } from "../types";

export const RETRO_CONSOLES: Console[] = [
  {
    id: 7, // PlayStation
    name: 'PlayStation',
    slug: 'playstation',
    generation: 5,
    imageUrl: '/consoles/ps1.png',
    logoUrl: '/consoles/ps1-logo.png',
    releaseYear: 1994,
    manufacturer: 'Sony',
    color: '#003791' // Blue PlayStation
  },
  {
    id: 8, // PlayStation 2
    name: 'PlayStation 2',
    slug: 'ps2',
    generation: 6,
    imageUrl: '/consoles/ps2.png',
    logoUrl: '/consoles/ps2-logo.png',
    releaseYear: 2000,
    manufacturer: 'Sony',
    color: '#000000'
  },
  {
    id: 4, // Nintendo 64
    name: 'Nintendo 64',
    slug: 'n64',
    generation: 5,
    imageUrl: '/consoles/n64.png',
    logoUrl: '/consoles/n64-logo.png',
    releaseYear: 1996,
    manufacturer: 'Nintendo',
    color: '#E60012'
  },
  {
    id: 21, // GameCube
    name: 'GameCube',
    slug: 'gamecube',
    generation: 6,
    imageUrl: '/consoles/gamecube.png',
    logoUrl: '/consoles/gamecube-logo.png',
    releaseYear: 2001,
    manufacturer: 'Nintendo',
    color: '#6A5ACD'
  },
  {
    id: 23, // Dreamcast
    name: 'Dreamcast',
    slug: 'dreamcast',
    generation: 6,
    imageUrl: '/consoles/dreamcast.png',
    logoUrl: '/consoles/dreamcast-logo.png',
    releaseYear: 1998,
    manufacturer: 'SEGA',
    color: '#FF6600'
  },
  {
    id: 11, // Xbox
    name: 'Xbox',
    slug: 'xbox',
    generation: 6,
    imageUrl: '/consoles/xbox.png',
    logoUrl: '/consoles/xbox-logo.png',
    releaseYear: 2001,
    manufacturer: 'Microsoft',
    color: '#107C10'
  },
  {
    id: 32, // SEGA Saturn
    name: 'SEGA Saturn',
    slug: 'saturn',
    generation: 5,
    imageUrl: '/consoles/saturn.png',
    logoUrl: '/consoles/saturn-logo.png',
    releaseYear: 1994,
    manufacturer: 'SEGA',
    color: '#0047AB'
  }
];

export function getConsoleById(id: number): Console | undefined {
  return RETRO_CONSOLES.find(console => console.id === id);
}

export function getConsoleBySlug(slug: string): Console | undefined {
  return RETRO_CONSOLES.find(console => console.slug === slug);
}
