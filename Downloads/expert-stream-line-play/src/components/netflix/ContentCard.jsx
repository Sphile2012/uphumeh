import React, { useState } from "react";
import { Play, Plus, ThumbsUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import VideoPlayer from "./VideoPlayer";

export default function ContentCard({ item, index, onMoreInfo, fluid = false }) {
  const [hovered, setHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <motion.div
        className={`relative cursor-pointer group ${fluid ? "w-full" : "flex-shrink-0 w-[120px] sm:w-[150px] md:w-[185px] lg:w-[210px]"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.5) }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Card Image */}
        <div className="relative rounded-md overflow-hidden aspect-[2/3] bg-gray-800">
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Title on image (always visible on mobile) */}
          <div className="absolute bottom-0 left-0 right-0 p-2 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-[11px] font-semibold leading-tight line-clamp-2">{item.title}</p>
          </div>

          {/* Play overlay */}
          <button
            onClick={() => setShowVideo(true)}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition-all duration-300"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors">
              <Play size={20} fill="white" className="text-white ml-0.5" />
            </div>
          </button>

          {/* TOP 10 Badge */}
          {item.match_percentage >= 95 && (
            <div className="absolute top-2 left-2 bg-[#E50914] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              TOP 10
            </div>
          )}
        </div>

        {/* Hover Info Panel — desktop only */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 right-0 -bottom-2 translate-y-full bg-[#1e1e1e] border border-white/10 rounded-b-md p-3 shadow-2xl z-30 hidden md:block"
          >
            {/* Action buttons */}
            <div className="flex items-center gap-1.5 mb-2">
              <button
                onClick={() => setShowVideo(true)}
                className="bg-white rounded-full p-1.5 hover:bg-gray-200 transition-colors"
              >
                <Play size={13} fill="black" className="text-black ml-px" />
              </button>
              <button className="border border-gray-500 rounded-full p-1.5 hover:border-white transition-colors">
                <Plus size={13} className="text-white" />
              </button>
              <button className="border border-gray-500 rounded-full p-1.5 hover:border-white transition-colors">
                <ThumbsUp size={13} className="text-white" />
              </button>
              <button
                onClick={() => onMoreInfo && onMoreInfo(item)}
                className="border border-gray-500 rounded-full p-1.5 hover:border-white transition-colors ml-auto"
              >
                <ChevronDown size={13} className="text-white" />
              </button>
            </div>
            {/* Meta */}
            <div className="flex items-center gap-1.5 text-[11px] mb-1 flex-wrap">
              <span className="text-green-400 font-bold">{item.match_percentage || 92}%</span>
              <span className="border border-gray-600 text-gray-400 px-1 py-px text-[9px] rounded">
                {item.rating || "TV-14"}
              </span>
              <span className="text-gray-400 truncate">{item.duration || "1h 45m"}</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-gray-500">
              <span className="capitalize">{item.genre?.replace("_", " ") || "Drama"}</span>
              <span>•</span>
              <span className="capitalize">{item.type || "Movie"}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      <VideoPlayer item={item} isOpen={showVideo} onClose={() => setShowVideo(false)} />
    </>
  );
}