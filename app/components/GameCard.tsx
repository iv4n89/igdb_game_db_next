"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Game } from "../types";
import GameDetailModal from "./GameDetailModal";

interface Props {
  game: Game;
}

export default function GameCard({ game }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCoverUrl = (url?: string) => {
    if (!url) return null;
    const cleanUrl = url.startsWith("//") ? `https:${url}` : url;
    return cleanUrl.replace("t_thumb", "t_cover_big");
  };

  const coverUrl = getCoverUrl(game.cover?.url);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="group cursor-pointer relative z-10"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="rounded-none overflow-hidden shadow-lg bg-black border border-white/20 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(188,19,254,0.5)] group-hover:border-neon-purple">
            <div className="aspect-3/4 relative bg-gray-900 border-b border-white/10">
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
                <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">
                  👾
                </div>
              )}
              
              {/* Scanline overlay for cover */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-50" />
            </div>

            <div className="p-3 bg-black relative">
              <h3 className="text-xs font-bold text-white line-clamp-2 mb-2 min-h-[2.5em] font-mono tracking-wide group-hover:text-neon-pink transition-colors">
                {game.name}
              </h3>
              {game.rating && (
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1 text-neon-blue">
                    <span>★</span>
                    <span>{Math.round(game.rating)}</span>
                  </div>
                  <span className="text-gray-600 text-[10px]">RATING</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
      <GameDetailModal
        game={game}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
