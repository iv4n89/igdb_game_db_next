"use client";

import Link from "next/link";
import { Console } from "../types";
import { motion } from "framer-motion";

interface Props {
  console: Console;
}

export default function ConsoleCard({ console: consoleData }: Props) {
  return (
    <Link href={`/console/${consoleData.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5}}
        whileHover={{ scale: 1.05, y: -10 }}
        className="relative group cursor-pointer"
      >
        <div
          className="rounded-2xl overflow-hidden shadow-2xl transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${consoleData.color}20 0%, ${consoleData.color}40 100%)`,
            border: `2px solid ${consoleData.color}40`,
          }}
        >
          <div className="aspect-square relative bg-linear-to-br from-gray-900 to-gray-800 p-8">
            <div className="relative w-full h-full">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl">🎮</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-900/50 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-2">
              {consoleData.name}
            </h3>
            <div className="flex justify-between items-center text-sm text-gray-300">
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
