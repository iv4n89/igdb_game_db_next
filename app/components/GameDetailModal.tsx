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
  const [activeTab, setActiveTab] = useState<"details" | "media">("details");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const getOriginalScreenshotUrl = (url: string) => {
    const cleanUrl = url.startsWith("//") ? `https:${url}` : url;
    return cleanUrl.replace("t_thumb", "t_1080p");
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
                <div className="flex flex-col h-full">
                  {/* Header Content */}
                  <div className="p-8 pb-0">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      {gameDetail.name}
                    </h1>

                    {/* Tabs Navigation */}
                    <div className="flex gap-6 border-b border-gray-700 mb-6">
                      <button
                        onClick={() => setActiveTab("details")}
                        className={`pb-4 text-lg font-medium transition-colors relative cursor-pointer ${
                          activeTab === "details"
                            ? "text-purple-400"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Detalles
                        {activeTab === "details" && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"
                          />
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab("media")}
                        className={`pb-4 text-lg font-medium transition-colors relative cursor-pointer ${
                          activeTab === "media"
                            ? "text-purple-400"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Multimedia
                        {activeTab === "media" && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-8 pt-0">
                    {activeTab === "details" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
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
                            <div className="flex gap-6 mb-6">
                              {gameDetail.rating && (
                                <div className="flex items-center gap-2">
                                  <span className="text-yellow-400 text-2xl">
                                    ⭐
                                  </span>
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
                                  <span className="text-green-400 text-2xl">
                                    📊
                                  </span>
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
                                <span className="text-gray-400">
                                  Desarrollador:
                                </span>
                                <span className="text-white ml-2">
                                  {getDevelopers()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">
                                  Publicador:
                                </span>
                                <span className="text-white ml-2">
                                  {getPublishers()}
                                </span>
                              </div>
                              {gameDetail.genres &&
                                gameDetail.genres.length > 0 && (
                                  <div>
                                    <span className="text-gray-400">
                                      Géneros:
                                    </span>
                                    <span className="text-white ml-2">
                                      {gameDetail.genres
                                        .map((g) => g.name)
                                        .join(", ")}
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
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {gameDetail.screenshots &&
                        gameDetail.screenshots.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {gameDetail.screenshots.map((screenshot, index) => (
                              <div
                                key={screenshot.id}
                                className="relative aspect-video rounded-lg overflow-hidden shadow-lg group cursor-pointer"
                                onClick={() =>
                                  setSelectedImage(
                                    getOriginalScreenshotUrl(screenshot.url)
                                  )
                                }
                              >
                                <Image
                                  src={getScreenshotUrl(screenshot.url)}
                                  alt={`${gameDetail.name} screenshot ${
                                    index + 1
                                  }`}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  unoptimized
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm text-sm">
                                    Ver
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <span className="text-4xl mb-2">📷</span>
                            <p>No hay capturas de pantalla disponibles</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>

          {/* Lightbox Overlay */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                onClick={() => setSelectedImage(null)}
              >
                <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                  <Image
                    src={selectedImage}
                    alt="Screenshot full size"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                  className="absolute top-6 right-6 z-[70] w-12 h-12 flex items-center justify-center bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors border border-white/20"
                >
                  <span className="text-3xl leading-none pb-1">×</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
