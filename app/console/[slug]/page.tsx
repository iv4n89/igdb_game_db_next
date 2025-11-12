import ConsoleDetailClient from "@/app/components/ConsoleDetailClient";
import { getConsoleBySlug } from "@/app/lib/consoles";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ConsolePage({ params }: Props) {
  const { slug } = await params;
  const console = getConsoleBySlug(slug);

  if (!console) {
    notFound();
  }

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
    }/api/igdb/games?platformId=${console.id}&limit=20`,
    { cache: "no-store" }
  );

  const initialGames = await response.json();

  return <ConsoleDetailClient console={console} initialGames={initialGames} />;
}

export async function generateStaticParams() {
  const { RETRO_CONSOLES } = await import("@/app/lib/consoles");

  return RETRO_CONSOLES.map((console) => ({
    slug: console.slug,
  }));
}
