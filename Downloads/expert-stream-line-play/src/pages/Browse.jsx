import React, { useState } from "react";
import { getContent } from "@/api/phumeh";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/netflix/Navbar";
import ContentCard from "@/components/netflix/ContentCard";
import ContentModal from "@/components/netflix/ContentModal";
import Footer from "@/components/netflix/Footer";
import { motion } from "framer-motion";

const GENRES = ["all", "action", "comedy", "drama", "horror", "sci_fi", "thriller", "romance", "documentary", "animation", "fantasy"];

export default function Browse() {
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const typeFilter = urlParams.get("type");
  const categoryFilter = urlParams.get("category");

  const { data: allContent = [] } = useQuery({
    queryKey: ["content"],
    queryFn: getContent,
  });

  let filtered = allContent;
  if (typeFilter) filtered = filtered.filter((c) => c.type === typeFilter);
  if (categoryFilter) filtered = filtered.filter((c) => c.category === categoryFilter);
  if (selectedGenre !== "all") filtered = filtered.filter((c) => c.genre === selectedGenre);

  const pageTitle =
    typeFilter === "series" ? "TV Shows" :
    typeFilter === "movie" ? "Movies" :
    categoryFilter === "new_releases" ? "New & Popular" : "Browse";

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />
      <div className="pt-24 px-4 md:px-12">
        <h1 className="text-white text-3xl md:text-4xl font-black mb-6">{pageTitle}</h1>
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedGenre === genre ? "bg-white text-black" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
              }`}
            >
              {genre === "all" ? "All" : genre.replace("_", "-").charAt(0).toUpperCase() + genre.replace("_", "-").slice(1)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3 pb-16">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.4) }}
              className="w-full"
            >
              <ContentCard item={item} index={idx} onMoreInfo={setSelectedItem} fluid />
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">No content found for this filter.</p>
          </div>
        )}
      </div>
      <Footer />
      <ContentModal item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
