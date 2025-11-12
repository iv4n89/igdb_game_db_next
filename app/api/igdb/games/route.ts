import { fetchGamesForPlatform } from "@/app/lib/igdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const platformId = searchParams.get("platformId");
  const limit = searchParams.get("limit") || "20";
  const offset = searchParams.get("offset") || "0";
  const genre = searchParams.get("genre");
  const letter = searchParams.get("letter");
  const yearStart = searchParams.get("yearStart");
  const yearEnd = searchParams.get("yearEnd");

  if (!platformId) {
    console.error("platformId is required");
    return NextResponse.json(
      { error: "platformId is required" },
      { status: 400 }
    );
  }

  try {
    const filters: Record<string, unknown> = {};
    if (genre) filters.genre = parseInt(genre);
    if (letter) filters.letter = letter;
    if (yearStart) filters.yearStart = parseInt(yearStart);
    if (yearEnd) filters.yearEnd = parseInt(yearEnd);

    const games = await fetchGamesForPlatform(
      parseInt(platformId),
      parseInt(limit),
      parseInt(offset),
      Object.keys(filters).length > 0 ? filters : undefined
    );

    return NextResponse.json(games);
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}
