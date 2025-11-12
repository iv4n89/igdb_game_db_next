"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Game } from "../types";

interface Props {
  game: Game;
}

export default function GameCard({ game }: Props) {
  const getCoverUrl = (url?: string) => {
    if (!url) return null;
    const cleanUrl = url.startsWith("//") ? `https:${url}` : url;
    return cleanUrl.replace("t_thumb", "t_cover_big");
  };

  const coverUrl = getCoverUrl(game.cover?.url);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className="group cursor-pointer relative z-10"
      >
        <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/20">
          <div className="aspect-3/4 relative bg-gray-900">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={game.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🎮
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-800">
            <h3 className="text-sm font-semibold text-white line-clamp-2 mb-1 min-h-10">
              {game.name}
            </h3>
            {game.rating && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span>⭐</span>
                <span>{Math.round(game.rating)}/100</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
