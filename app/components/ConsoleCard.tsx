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
          className="rounded-none overflow-hidden transition-all duration-300 h-full flex flex-col relative border-2"
          style={{
            borderColor: consoleData.color,
            boxShadow: `0 0 10px ${consoleData.color}, inset 0 0 20px ${consoleData.color}40`,
            background: "rgba(0, 0, 0, 0.8)",
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-12 h-12 border-4 border-t-transparent rounded-full"
                style={{ borderColor: consoleData.color, borderTopColor: "transparent" }}
              />
            </div>
          )}

          <div className="aspect-square relative p-8 border-b-2" style={{ borderColor: consoleData.color }}>
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `repeating-linear-gradient(
                  45deg,
                  ${consoleData.color}20,
                  ${consoleData.color}20 10px,
                  transparent 10px,
                  transparent 20px
                )`
              }}
            />
            <motion.div
              className="relative w-full h-full flex items-center justify-center z-10"
              layoutId={`console-image-${consoleData.id}`}
            >
              <Image
                src={consoleData.imageUrl}
                alt={consoleData.name}
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </motion.div>
          </div>

          <div className="p-6 grow flex flex-col relative">
            <h3 
              className="text-xl font-bold text-white mb-4 min-h-16 flex items-center leading-tight tracking-wider"
              style={{ textShadow: `2px 2px 0px ${consoleData.color}` }}
            >
              {consoleData.name}
            </h3>
            
            <div className="mt-auto space-y-2 font-mono text-sm">
              <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <span className="text-gray-400">MAKER</span>
                <span className="text-white uppercase">{consoleData.manufacturer}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                <span className="text-gray-400">YEAR</span>
                <span className="text-white">{consoleData.releaseYear}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">GEN</span>
                <span className="text-white">0{consoleData.generation}</span>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 30px ${consoleData.color}`,
            }}
          ></div>
        </div>
      </motion.div>
    </Link>
  );
}
