import { getGamesCount } from "@/app/lib/igdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const platformId = searchParams.get("platformId");

    if (!platformId) {
        return NextResponse.json({ error: "platformId is required" }, { status: 400 });
    }

    try {
        const count = await getGamesCount(parseInt(platformId));
        return NextResponse.json({ count });
    } catch (error) {
        console.error("Error fetching games count:", error);
        return NextResponse.json({ error: "Failed to fetch games count" }, { status: 500 });
    }
}
