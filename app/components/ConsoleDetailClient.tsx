"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Console, Game } from "../types";
import GameCard from "./GameCard";

interface Props {
  console: Console;
  initialGames: Game[];
}

export default function ConsoleDetailClient({
  console: consoleData,
  initialGames,
}: Props) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [games, setGames] = useState<Game[]>(initialGames);
  const [offset, setOffset] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const consoleImageScale = useTransform(scrollY, [0, 400], [1, 0.4]);
  const consoleImageY = useTransform(scrollY, [0, 400], [0, -200]);
  const consoleImageOpacity = useTransform(scrollY, [0, 300, 400], [1, 0.5, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadMoreGames = async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/igdb/games?platformId=${consoleData.id}&limit=20&offset=${offset}`
        );
        const newGames: Game[] = await response.json();

        if (newGames.length === 0) {
          setHasMore(false);
        } else {
          setGames((prevGames) => [...prevGames, ...newGames]);
          setOffset((prevOffset) => prevOffset + 20);
        }
      } catch (error) {
        console.error("Error loading more games:", error);
      } finally {
        setLoading(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreGames();
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, offset, consoleData.id]);

  return (
    <div className="min-h-screen bg-gray-900">
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-white hover:text-gray-300 transition-colors"
          >
            ← Volver
          </Link>

          <motion.div
            className="flex items-center gap-3"
            style={{ opacity: useTransform(scrollY, [300, 400], [0, 1]) }}
          >
            <span className="text-2xl">🎮</span>
            <span className="text-xl font-bold text-white">
              {consoleData.name}
            </span>
          </motion.div>
        </div>
      </motion.header>

      <motion.div
        ref={heroRef}
        style={{ height: useTransform(scrollY, [0, 400], ["100vh", "30vh"]) }}
        className="flex items-center justify-center overflow-hidden sticky top-0"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${consoleData.color} 0%, transparent 70%)`,
          }}
        />

        <motion.div
          className="relative z-10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            scale: consoleImageScale,
            y: consoleImageY,
            opacity: consoleImageOpacity,
          }}
        >
          <div className="text-9xl">🎮</div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{ opacity: useTransform(scrollY, [0, 100], [1, 0]) }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-sm">Scroll para explorar</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ↓
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-30 bg-linear-to-b from-gray-900 to-black min-h-screen"
      >
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-white mb-4">
              {consoleData.name}
            </h1>
            <div className="flex gap-6 text-gray-300 text-lg">
              <span>{consoleData.manufacturer}</span>
              <span>•</span>
              <span>{consoleData.releaseYear}</span>
              <span>•</span>
              <span>Generación {consoleData.generation}</span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              Juegos destacados
              <span className="text-lg text-gray-400 ml-3">
                ({games.length} juegos)
              </span>
            </h2>

            {games.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {games.map((game: Game, index: number) => (
                    <GameCard key={`${game.id}-${index}`} game={game} />
                  ))}
                </div>

                <div
                  ref={observerTarget}
                  className="h-20 flex items-center justify-center mt-8"
                >
                  {loading && (
                    <div className="flex items-center gap-3 text-gray-400">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full"
                      />
                      <span>Cargando más juegos...</span>
                    </div>
                  )}
                  {!hasMore && (
                    <p className="text-gray-500 text-sm">
                      ✓ Has visto todos los juegos disponibles
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p className="text-xl">
                  No se encontraron juegos para esta consola
                </p>
                <p className="text-sm mt-2">Intenta más tarde</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
