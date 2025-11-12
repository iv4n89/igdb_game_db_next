import { NextRequest, NextResponse } from 'next/server';
import { fetchGenresForPlatform } from '@/app/lib/igdb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const platformId = searchParams.get('platformId');

  if (!platformId) {
    return NextResponse.json(
      { error: 'platformId is required' },
      { status: 400 }
    );
  }

  try {
    const genres = await fetchGenresForPlatform(parseInt(platformId));
    return NextResponse.json(genres);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
  }
}
