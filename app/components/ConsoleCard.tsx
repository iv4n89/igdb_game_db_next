"use client";

import Link from "next/link";
import { Console } from "../types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface Props {
  console: Console;
}

export default function ConsoleCard({ console: consoleData }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Link
      href={`/console/${consoleData.slug}`}
      onClick={() => setIsLoading(true)}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05, y: -10 }}
        className="relative group cursor-pointer h-full"
      >
        <div
          className="rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 h-full flex flex-col relative"
          style={{
            background: `linear-gradient(135deg, ${consoleData.color}20 0%, ${consoleData.color}40 100%)`,
            border: `2px solid ${consoleData.color}40`,
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
              />
            </div>
          )}

          <div className="aspect-square relative bg-linear-to-br from-gray-900 to-gray-800 p-8">
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              layoutId={`console-image-${consoleData.id}`}
            >
              <Image
                src={consoleData.imageUrl}
                alt={consoleData.name}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </motion.div>
          </div>

          <div className="p-6 bg-gray-900/50 backdrop-blur-sm grow flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2 min-h-16 flex items-center">
              {consoleData.name}
            </h3>
            <div className="flex justify-between items-center text-sm text-gray-300 mt-auto">
              <span>{consoleData.manufacturer}</span>
              <span>{consoleData.releaseYear}</span>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              Generation {consoleData.generation}
            </div>
          </div>

          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${consoleData.color}30 0%, transparent 70%)`,
            }}
          ></div>
        </div>
      </motion.div>
    </Link>
  );
}
