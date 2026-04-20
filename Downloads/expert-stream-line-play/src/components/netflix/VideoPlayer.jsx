import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoPlayer({ item, isOpen, onClose }) {
  if (!isOpen || !item) return null;

  // Detect YouTube URL and convert to embed
  const getEmbedUrl = (url) => {
    if (!url) return null;
    // Already an embed URL
    if (url.includes("youtube.com/embed")) return url + "?autoplay=1&rel=0";
    // youtu.be short link
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&rel=0`;
    // youtube.com/watch?v=
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&rel=0`;
    // Direct mp4 or other — return as-is
    return url;
  };

  const videoUrl = getEmbedUrl(item.video_url || item.trailer_url);
  const isYouTube = videoUrl && videoUrl.includes("youtube.com/embed");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="fixed inset-0 bg-black/90" />

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden shadow-2xl z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Title bar */}
          <div className="bg-[#181818] px-5 py-3 flex items-center gap-3">
            <span className="text-[#E50914] font-black text-sm tracking-widest">N</span>
            <span className="text-white font-semibold text-sm">{item.title}</span>
            {item.rating && (
              <span className="border border-gray-600 text-gray-400 px-1.5 py-0.5 text-[10px] rounded ml-auto">
                {item.rating}
              </span>
            )}
          </div>

          {/* Video */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {videoUrl ? (
              isYouTube ? (
                <iframe
                  src={videoUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={item.title}
                  frameBorder="0"
                />
              ) : (
                <video
                  src={videoUrl}
                  className="absolute inset-0 w-full h-full"
                  controls
                  autoPlay
                  playsInline
                />
              )
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d0d0d] gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-gray-700 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3l14 9-14 9V3z" fill="#E50914" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm text-center px-8">
                  No video URL set for this title. Add a <span className="text-white">video_url</span> or{" "}
                  <span className="text-white">trailer_url</span> in the content record to enable playback.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}