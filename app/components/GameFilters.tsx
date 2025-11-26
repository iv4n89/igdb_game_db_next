"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FilterState } from "../types";

interface Props {
  onFilterChange: (filters: FilterState) => void;
  availableGenres: { id: number; name: string }[];
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");
const YEAR_RANGES = [
  { label: "Todos", value: null },
  { label: "1970-1974", start: 1970, end: 1974 },
  { label: "1975-1979", start: 1975, end: 1979 },
  { label: "1980-1984", start: 1980, end: 1984 },
  { label: "1985-1989", start: 1985, end: 1989 },
  { label: "1990-1994", start: 1990, end: 1994 },
  { label: "1995-1999", start: 1995, end: 1999 },
  { label: "2000-2004", start: 2000, end: 2004 },
  { label: "2005-2009", start: 2005, end: 2009 },
  { label: "2010-2014", start: 2010, end: 2014 },
  { label: "2015+", start: 2015, end: 2030 },
];

export default function GameFilters({
  availableGenres,
  onFilterChange,
}: Props) {
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>();
  const [selectedLetter, setSelectedLetter] = useState<string | undefined>();
  const [selectedYearRange, setSelectedYearRange] = useState<
    { start?: number; end?: number } | undefined
  >();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGenreChange = (genreId: number | undefined) => {
    setSelectedGenre(genreId);
    onFilterChange({
      genre: genreId,
      letter: selectedLetter,
      yearRange: selectedYearRange,
    });
  };

  const handleLetterChange = (letter: string | undefined) => {
    setSelectedLetter(letter);
    onFilterChange({
      genre: selectedGenre,
      letter: letter,
      yearRange: selectedYearRange,
    });
  };

  const handleYearRangeChange = (
    range: { start?: number; end?: number } | undefined
  ) => {
    setSelectedYearRange(range);
    onFilterChange({
      genre: selectedGenre,
      letter: selectedLetter,
      yearRange: range,
    });
  };

  const clearFilters = () => {
    setSelectedGenre(undefined);
    setSelectedLetter(undefined);
    setSelectedYearRange(undefined);
    onFilterChange({});
  };

  const hasActiveFilters = selectedGenre || selectedLetter || selectedYearRange;

  return (
    <div className="mb-8">
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full cursor-pointer px-4 py-3 bg-black border border-neon-purple text-white transition-colors flex items-center justify-between hover:bg-neon-purple/20"
        >
          <span className="flex items-center gap-2 font-mono">
            <span>🔍</span>
            <span>SEARCH FILTERS</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-neon-pink text-black text-xs font-bold animate-pulse">
                ACTIVE
              </span>
            )}
          </span>
          <span className="text-xl text-neon-blue">{isExpanded ? "▼" : "▶"}</span>
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
        }}
        className="overflow-hidden lg:h-auto!"
      >
        <div className="space-y-8 bg-black/80 backdrop-blur-sm border-2 border-white/10 p-6 relative">
          {/* Decorative corner accents - positioned to overlap the border */}
          <div className="absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2 border-[#ff00ff] z-10" />
          <div className="absolute -top-[2px] -right-[2px] w-4 h-4 border-t-2 border-r-2 border-[#ff00ff] z-10" />
          <div className="absolute -bottom-[34px] -left-[2px] w-4 h-4 border-b-2 border-l-2 border-[#ff00ff] z-10" />
          <div className="absolute -bottom-[34px] -right-[2px] w-4 h-4 border-b-2 border-r-2 border-[#ff00ff] z-10" />

          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-[#00ffff] uppercase tracking-wider" style={{ textShadow: "2px 2px 0px rgba(0,255,255,0.3)" }}>
              FILTER DATABASE
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 cursor-pointer py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm font-mono transition-colors uppercase"
              >
                [ CLEAR SYSTEM ]
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#bc13fe] mb-3 uppercase tracking-wider font-mono">
              GENRE SELECTION
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleGenreChange(undefined)}
                className={`px-4 py-2 cursor-pointer text-sm font-mono transition-all border ${
                  !selectedGenre
                    ? "bg-[#bc13fe] text-black border-[#bc13fe] font-bold shadow-[0_0_10px_rgba(188,19,254,0.5)]"
                    : "bg-transparent text-gray-400 border-gray-700 hover:border-[#bc13fe] hover:text-[#bc13fe]"
                }`}
              >
                ALL
              </button>
              {availableGenres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreChange(genre.id)}
                  className={`px-4 py-2 cursor-pointer text-sm font-mono transition-all border ${
                    selectedGenre === genre.id
                      ? "bg-[#bc13fe] text-black border-[#bc13fe] font-bold shadow-[0_0_10px_rgba(188,19,254,0.5)]"
                      : "bg-transparent text-gray-400 border-gray-700 hover:border-[#bc13fe] hover:text-[#bc13fe]"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#00ffff] mb-3 uppercase tracking-wider font-mono">
              TIME PERIOD
            </label>
            <div className="flex flex-wrap gap-2">
              {YEAR_RANGES.map((range, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handleYearRangeChange(
                      range.value === null
                        ? undefined
                        : { start: range.start, end: range.end }
                    )
                  }
                  className={`px-4 py-2 cursor-pointer text-sm font-mono transition-all border ${
                    (!selectedYearRange && range.value === null) ||
                    (selectedYearRange?.start === range.start &&
                      selectedYearRange?.end === range.end)
                      ? "bg-[#00ffff] text-black border-[#00ffff] font-bold shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                      : "bg-transparent text-gray-400 border-gray-700 hover:border-[#00ffff] hover:text-[#00ffff]"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#ff00ff] mb-3 uppercase tracking-wider font-mono">
              ALPHABETICAL INDEX
            </label>
            <div className="grid grid-cols-9 md:grid-cols-14 lg:grid-cols-18 gap-1">
              <button
                onClick={() => handleLetterChange(undefined)}
                className={`aspect-square cursor-pointer flex items-center justify-center text-sm font-bold transition-all border ${
                  !selectedLetter
                    ? "bg-[#ff00ff] text-black border-[#ff00ff] shadow-[0_0_10px_rgba(255,0,255,0.5)]"
                    : "bg-transparent text-gray-400 border-gray-700 hover:border-[#ff00ff] hover:text-[#ff00ff]"
                }`}
              >
                *
              </button>
              {ALPHABET.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterChange(letter)}
                  className={`aspect-square cursor-pointer flex items-center justify-center text-sm font-bold transition-all border ${
                    selectedLetter === letter
                      ? "bg-[#ff00ff] text-black border-[#ff00ff] shadow-[0_0_10px_rgba(255,0,255,0.5)]"
                      : "bg-transparent text-gray-400 border-gray-700 hover:border-[#ff00ff] hover:text-[#ff00ff]"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 font-mono">
              [ # = NUMERIC TITLES ]
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
