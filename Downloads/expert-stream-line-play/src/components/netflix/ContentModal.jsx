import React, { useState } from "react";
import { X, Play, Plus, ThumbsUp, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VideoPlayer from "./VideoPlayer";

export default function ContentModal({ item, isOpen, onClose }) {
  const [showVideo, setShowVideo] = useState(false);

  if (!isOpen || !item) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-6 md:pt-14 px-4 overflow-y-auto"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-3xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl mb-8 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Banner */}
            <div className="relative aspect-video">
              <img
                src={item.banner_url || item.thumbnail_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />

              <button
                onClick={onClose}
                className="absolute top-3 right-3 bg-[#181818] rounded-full p-1.5 hover:bg-gray-700 transition-colors z-10"
              >
                <X size={20} className="text-white" />
              </button>

              <div className="absolute bottom-5 left-5 right-5">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg">
                  {item.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowVideo(true)}
                    className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2 rounded hover:bg-white/80 transition-colors text-sm"
                  >
                    <Play size={16} fill="black" />
                    Play
                  </button>
                  <button className="border-2 border-gray-400 rounded-full p-2 hover:border-white transition-colors">
                    <Plus size={16} className="text-white" />
                  </button>
                  <button className="border-2 border-gray-400 rounded-full p-2 hover:border-white transition-colors">
                    <ThumbsUp size={16} className="text-white" />
                  </button>
                  <button className="border-2 border-gray-400 rounded-full p-2 hover:border-white transition-colors ml-auto">
                    <Volume2 size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 md:p-7">
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-sm">
                    <span className="text-green-400 font-bold">{item.match_percentage || 94}% Match</span>
                    <span className="text-gray-400">{item.year || 2025}</span>
                    <span className="border border-gray-600 text-gray-400 px-1.5 py-0.5 text-xs rounded">
                      {item.rating || "TV-MA"}
                    </span>
                    <span className="text-gray-400">{item.duration || "2h 15m"}</span>
                    <span className="border border-gray-600 text-gray-400 px-1.5 py-0.5 text-[10px] rounded">HD</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.description || "A gripping tale that will keep you on the edge of your seat."}
                  </p>
                </div>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-gray-500">Genre: </span>
                    <span className="text-gray-300 capitalize">{item.genre?.replace("_", " ") || "Drama"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type: </span>
                    <span className="text-gray-300 capitalize">{item.type || "Movie"}</span>
                  </div>
                  {(item.video_url || item.trailer_url) && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="mt-3 flex items-center gap-2 text-[#E50914] hover:text-red-400 transition-colors font-medium text-sm"
                    >
                      <Play size={14} fill="currentColor" /> Watch Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <VideoPlayer
        item={item}
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
      />
    </>
  );
}