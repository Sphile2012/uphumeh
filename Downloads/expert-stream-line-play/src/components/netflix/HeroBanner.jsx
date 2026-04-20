import React, { useState, useEffect } from "react";
import { Play, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VideoPlayer from "./VideoPlayer";

const FEATURED_ITEMS = [
  {
    title: "The Last Frontier",
    description: "A lone astronaut stranded on an alien world must navigate treacherous terrain and unravel an ancient mystery to find a way home before time runs out.",
    banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1280&h=720&fit=crop",
    match: 97, year: 2026, rating: "TV-MA", duration: "2h 18m",
    trailer_url: "https://www.youtube.com/embed/6ZfuNTqbHE8",
  },
  {
    title: "Neon Shadows",
    description: "In a rain-soaked city where nothing is as it seems, a rogue detective uncovers a conspiracy that threatens to tear apart the fabric of reality itself.",
    banner: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1280&h=720&fit=crop",
    match: 93, year: 2025, rating: "TV-14", duration: "Season 1",
    trailer_url: "https://www.youtube.com/embed/ySiIXwFp9Fg",
  },
  {
    title: "Reign of Fire",
    description: "When an ancient dragon awakens and threatens to destroy the last human kingdom, an unlikely hero must forge an alliance between sworn enemies.",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&h=720&fit=crop",
    match: 95, year: 2026, rating: "PG-13", duration: "2h 42m",
    trailer_url: "https://www.youtube.com/embed/A9cb_2TtxaA",
  },
];

export default function HeroBanner({ onInfoClick }) {
  const [current, setCurrent] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % FEATURED_ITEMS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const item = FEATURED_ITEMS[current];

  return (
    <>
      <div className="relative w-full overflow-hidden" style={{ height: "clamp(280px, 56vw, 85vh)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={item.banner}
              alt={item.title}
              className="w-full h-full object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-[#141414]/30 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-end pb-[12%] md:pb-[15%] px-4 sm:px-8 md:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="max-w-xl w-full"
            >
              <span className="text-[#E50914] text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase mb-2 block">
                N&nbsp;&nbsp;Original Series
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 md:mb-3 leading-tight drop-shadow-2xl">
                {item.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mb-2 md:mb-3">
                <span className="text-green-400 font-bold">{item.match}% Match</span>
                <span className="text-gray-300">{item.year}</span>
                <span className="border border-gray-500 text-gray-300 px-1.5 py-0.5 text-[10px] rounded">{item.rating}</span>
                <span className="text-gray-300">{item.duration}</span>
              </div>
              <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed mb-4 line-clamp-2 sm:line-clamp-3">
                {item.description}
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowVideo(true)}
                  className="flex items-center gap-1.5 sm:gap-2 bg-white text-black font-bold px-4 sm:px-7 py-2 sm:py-2.5 rounded hover:bg-white/80 transition-all duration-200 text-sm sm:text-base"
                >
                  <Play size={18} fill="black" />
                  Play
                </button>
                <button
                  onClick={() => onInfoClick && onInfoClick(item)}
                  className="flex items-center gap-1.5 sm:gap-2 bg-gray-500/60 text-white font-semibold px-4 sm:px-7 py-2 sm:py-2.5 rounded hover:bg-gray-500/40 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base"
                >
                  <Info size={18} />
                  <span className="hidden xs:inline">More Info</span>
                  <span className="xs:hidden">Info</span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-[4%] right-3 sm:right-10 flex items-center gap-1.5 z-10">
          {FEATURED_ITEMS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-0.5 rounded-full transition-all duration-500 ${
                idx === current ? "w-7 bg-white" : "w-3.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      <VideoPlayer item={item} isOpen={showVideo} onClose={() => setShowVideo(false)} />
    </>
  );
}