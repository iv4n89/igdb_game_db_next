import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Game } from "../types";

interface Props {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
}

export default function GameDetailModal({ game, isOpen, onClose }: Props) {
  const [gameDetail, setGameDetail] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);

  const loadGameDetail = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/igdb/games/${game.id}`);
      const data = await response.json();
      setGameDetail(data);
    } catch (error) {
      console.error("Failed to load game details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !gameDetail) {
      loadGameDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, game.id]);

  const getCoverUrl = (url?: string) => {
    if (!url) return null;
    const cleanUrl = url.startsWith("//") ? `https:${url}` : url;
    return cleanUrl.replace("t_thumb", "t_cover_big");
  };

  const getScreenshotUrl = (url: string) => {
    const cleanUrl = url.startsWith("//") ? `https:${url}` : url;
    return cleanUrl.replace("t_thumb", "t_screenshot_big");
  };

  const formatDate = (timeStamp?: number) => {
    if (!timeStamp) return "N/A";
    return new Date(timeStamp * 1000).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDevelopers = () => {
    return (
      gameDetail?.involved_companies
        ?.filter((ic) => ic.developer)
        .map((ic) => ic.company.name)
        .join(", ") || "N/A"
    );
  };

  const getPublishers = () => {
    return (
      gameDetail?.involved_companies
        ?.filter((ic) => ic.publisher)
        .map((ic) => ic.company.name)
        .join(", ") || "N/A"
    );
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 pt-20 md:pt-8 lg:pt-0 md:inset-16 lg:inset-24 z-50 overflow-hidden"
          >
            <div className="w-full h-full bg-gray-900 rounded-2xl shadow-2xl overflow-y-auto">
              <button
                onClick={onClose}
                className="sticky cursor-pointer top-4 right-4 float-right z-10 w-10 h-10 flex items-center justify-center bg-gray-800/90 hover:bg-gray-700 rounded-full transition-colors"
              >
                <span className="text-white text-2xl">×</span>
              </button>

              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : gameDetail ? (
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="shrink-0">
                      <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-2xl">
                        {gameDetail.cover?.url ? (
                          <Image
                            src={getCoverUrl(gameDetail.cover.url)!}
                            alt={gameDetail.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-6xl">
                            🎮
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grow">
                      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {gameDetail.name}
                      </h1>

                      <div className="flex gap-6 mb-6">
                        {gameDetail.rating && (
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-2xl">⭐</span>
                            <div>
                              <div className="text-2xl font-bold text-white">
                                {Math.round(gameDetail.rating)}
                              </div>
                              <div className="text-xs text-gray-400">
                                Rating IGDB
                              </div>
                            </div>
                          </div>
                        )}
                        {gameDetail.aggregated_rating && (
                          <div className="flex items-center gap-2">
                            <span className="text-green-400 text-2xl">📊</span>
                            <div>
                              <div className="text-2xl font-bold text-white">
                                {Math.round(gameDetail.aggregated_rating)}
                              </div>
                              <div className="text-xs text-gray-400">
                                Rating Crítica
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">
                            Fecha de lanzamiento:
                          </span>
                          <span className="text-white ml-2">
                            {formatDate(gameDetail.first_release_date)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Desarrollador:</span>
                          <span className="text-white ml-2">
                            {getDevelopers()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Publicador:</span>
                          <span className="text-white ml-2">
                            {getPublishers()}
                          </span>
                        </div>
                        {gameDetail.genres && gameDetail.genres.length > 0 && (
                          <div>
                            <span className="text-gray-400">Géneros:</span>
                            <span className="text-white ml-2">
                              {gameDetail.genres.map((g) => g.name).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {gameDetail.summary && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-white mb-4">
                        Descripción
                      </h2>
                      <p className="text-gray-300 leading-relaxed">
                        {gameDetail.summary}
                      </p>
                    </div>
                  )}

                  {gameDetail.storyline && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-white mb-4">
                        Historia
                      </h2>
                      <p className="text-gray-300 leading-relaxed">
                        {gameDetail.storyline}
                      </p>
                    </div>
                  )}

                  {gameDetail.screenshots &&
                    gameDetail.screenshots.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">
                          Capturas de pantalla
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {gameDetail.screenshots.map((screenshot, index) => (
                            <div
                              key={screenshot.id}
                              className="relative aspect-video rounded-lg overflow-hidden shadow-lg"
                            >
                              <Image
                                src={getScreenshotUrl(screenshot.url)}
                                alt={`${gameDetail.name} screenshot ${
                                  index + 1
                                }`}
                                fill
                                className="object-fill"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
