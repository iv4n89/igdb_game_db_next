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
          className="w-full cursor-pointer px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <span>🔍</span>
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-purple-500 text-xs rounded-full">
                Activos
              </span>
            )}
          </span>
          <span className="text-xl">{isExpanded ? "▼" : "▶"}</span>
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
        }}
        className="overflow-hidden lg:h-auto!"
      >
        <div className="space-y-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Filtrar juegos</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 cursor-pointer py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded-lg transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Género
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleGenreChange(undefined)}
                className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all ${
                  !selectedGenre
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Todos
              </button>
              {availableGenres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreChange(genre.id)}
                  className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all ${
                    selectedGenre === genre.id
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Década de lanzamiento
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
                  className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all ${
                    (!selectedYearRange && range.value === null) ||
                    (selectedYearRange?.start === range.start &&
                      selectedYearRange?.end === range.end)
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Letra inicial
            </label>
            <div className="grid grid-cols-9 md:grid-cols-14 lg:grid-cols-18 gap-1">
              <button
                onClick={() => handleLetterChange(undefined)}
                className={`aspect-square cursor-pointer flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                  !selectedLetter
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                ✕
              </button>
              {ALPHABET.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterChange(letter)}
                  className={`aspect-square cursor-pointer flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                    selectedLetter === letter
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              # = Juegos que empiezan con números
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
