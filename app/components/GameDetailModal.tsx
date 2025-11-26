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
  const [activeTab, setActiveTab] = useState<"details" | "media" | "related">("details");

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
            <div className="w-full h-full bg-black border-2 border-neon-purple shadow-[0_0_50px_rgba(188,19,254,0.3)] overflow-y-auto relative">
              {/* Scanline overlay for modal */}
              <div className="absolute inset-0 pointer-events-none z-0 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
              
              <button
                onClick={onClose}
                className="sticky cursor-pointer top-4 right-4 float-right z-50 w-10 h-10 flex items-center justify-center bg-black border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black transition-colors"
              >
                <span className="text-xl font-bold">X</span>
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
                  <div className="p-8 pb-0 relative z-10">
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 uppercase tracking-wider" style={{ textShadow: "2px 2px 0px #bc13fe" }}>
                      {gameDetail.name}
                    </h1>

                    {/* Tabs Navigation */}
                    <div className="flex gap-6 border-b-2 border-white/10 mb-6">
                      <button
                        onClick={() => setActiveTab("details")}
                        className={`pb-4 text-lg font-mono tracking-wider transition-colors relative cursor-pointer ${
                          activeTab === "details"
                            ? "text-neon-blue"
                            : "text-gray-500 hover:text-white"
                        }`}
                      >
                        DETAILS
                        {activeTab === "details" && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue shadow-[0_0_10px_#00ffff]"
                          />
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab("media")}
                        className={`pb-4 text-lg font-mono tracking-wider transition-colors relative cursor-pointer ${
                          activeTab === "media"
                            ? "text-neon-blue"
                            : "text-gray-500 hover:text-white"
                        }`}
                      >
                        MEDIA
                        {activeTab === "media" && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue shadow-[0_0_10px_#00ffff]"
                          />
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab("related")}
                        className={`pb-4 text-lg font-mono tracking-wider transition-colors relative cursor-pointer ${
                          activeTab === "related"
                            ? "text-neon-blue"
                            : "text-gray-500 hover:text-white"
                        }`}
                      >
                        RELATED
                        {activeTab === "related" && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue shadow-[0_0_10px_#00ffff]"
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
                            <div className="relative w-64 h-80 rounded-none overflow-hidden shadow-2xl border-2 border-white/20">
                              {gameDetail.cover?.url ? (
                                <Image
                                  src={getCoverUrl(gameDetail.cover.url)!}
                                  alt={gameDetail.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-6xl opacity-50">
                                  👾
                                </div>
                              )}
                              {/* Scanline overlay for cover */}
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-50" />
                            </div>
                          </div>

                          <div className="grow font-mono">
                            <div className="flex gap-6 mb-6">
                              {gameDetail.rating && (
                                <div className="flex items-center gap-2">
                                  <span className="text-neon-pink text-2xl">
                                    ★
                                  </span>
                                  <div>
                                    <div className="text-2xl font-bold text-white">
                                      {Math.round(gameDetail.rating)}
                                    </div>
                                    <div className="text-xs text-gray-400 tracking-wider">
                                      IGDB RATING
                                    </div>
                                  </div>
                                </div>
                              )}
                              {gameDetail.aggregated_rating && (
                                <div className="flex items-center gap-2">
                                  <span className="text-neon-blue text-2xl">
                                    ●
                                  </span>
                                  <div>
                                    <div className="text-2xl font-bold text-white">
                                      {Math.round(gameDetail.aggregated_rating)}
                                    </div>
                                    <div className="text-xs text-gray-400 tracking-wider">
                                      CRITIC RATING
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-white/10 pt-4">
                              <div>
                                <span className="text-gray-500 uppercase tracking-wider block text-xs mb-1">
                                  RELEASE DATE
                                </span>
                                <span className="text-white">
                                  {formatDate(gameDetail.first_release_date)}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 uppercase tracking-wider block text-xs mb-1">
                                  DEVELOPER
                                </span>
                                <span className="text-white">
                                  {getDevelopers()}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500 uppercase tracking-wider block text-xs mb-1">
                                  PUBLISHER
                                </span>
                                <span className="text-white">
                                  {getPublishers()}
                                </span>
                              </div>
                              {gameDetail.genres &&
                                gameDetail.genres.length > 0 && (
                                  <div>
                                    <span className="text-gray-500 uppercase tracking-wider block text-xs mb-1">
                                      GENRES
                                    </span>
                                    <span className="text-white">
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
                          <div className="mb-8 font-mono">
                            <h2 className="text-xl font-bold text-neon-pink mb-4 uppercase tracking-wider border-b border-white/10 pb-2 inline-block">
                              SUMMARY
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-lg">
                              {gameDetail.summary}
                            </p>
                          </div>
                        )}

                        {gameDetail.storyline && (
                          <div className="mb-8 font-mono">
                            <h2 className="text-xl font-bold text-neon-blue mb-4 uppercase tracking-wider border-b border-white/10 pb-2 inline-block">
                              STORYLINE
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-lg">
                              {gameDetail.storyline}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ) : activeTab === "media" ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Videos Section */}
                        {gameDetail.videos && gameDetail.videos.length > 0 && (
                          <div className="mb-12">
                            <h3 className="text-xl font-bold text-neon-pink mb-6 uppercase tracking-wider font-mono border-b border-white/10 pb-2 inline-block">
                              VIDEOS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {gameDetail.videos.map((video) => (
                                <div
                                  key={video.id}
                                  className="aspect-video border-2 border-white/20 shadow-lg bg-black"
                                >
                                  <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${video.video_id}`}
                                    title={video.name}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Screenshots Section */}
                        <h3 className="text-xl font-bold text-neon-blue mb-6 uppercase tracking-wider font-mono border-b border-white/10 pb-2 inline-block">
                          SCREENSHOTS
                        </h3>
                        {gameDetail.screenshots &&
                        gameDetail.screenshots.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {gameDetail.screenshots.map((screenshot, index) => (
                              <div
                                key={screenshot.id}
                                className="relative aspect-video rounded-none overflow-hidden shadow-lg group cursor-pointer border border-white/20 hover:border-neon-pink transition-colors"
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
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <span className="text-neon-pink font-bold font-mono tracking-widest border-2 border-neon-pink px-3 py-1 bg-black/50">
                                    VIEW
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10 text-gray-500 font-mono">
                            <span className="text-4xl mb-2 opacity-50">📷</span>
                            <p>NO SCREENSHOTS AVAILABLE</p>
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
                        {gameDetail.similar_games &&
                        gameDetail.similar_games.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {gameDetail.similar_games.map((game) => (
                              <div
                                key={game.id}
                                className="group relative aspect-[3/4] bg-gray-900 border border-white/10 hover:border-neon-purple transition-colors"
                              >
                                {game.cover?.url ? (
                                  <Image
                                    src={getCoverUrl(game.cover.url)!}
                                    alt={game.name}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                                    👾
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                                  <h4 className="text-white font-bold font-mono text-sm leading-tight group-hover:text-neon-purple transition-colors">
                                    {game.name}
                                  </h4>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-20 text-gray-500 font-mono">
                            <span className="text-4xl mb-2 opacity-50">🎮</span>
                            <p>NO RELATED GAMES FOUND</p>
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
