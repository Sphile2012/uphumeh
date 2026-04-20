import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "./ContentCard";

export default function ContentRow({ title, items, onMoreInfo }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group/row mb-8 md:mb-10">
      <h2 className="text-white text-lg md:text-xl font-bold px-4 md:px-12 mb-2 md:mb-3 flex items-center gap-2">
        {title}
        <span className="text-[#E50914] text-xs font-medium opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 cursor-pointer flex items-center gap-1">
          Explore All <ChevronRight size={12} />
        </span>
      </h2>

      <div className="relative">
        {/* Left Arrow */}
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 w-10 md:w-14 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft className="text-white" size={28} />
          </button>
        )}

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 md:gap-3 overflow-x-auto px-4 md:px-12 pb-16 md:pb-20"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {items.map((item, idx) => (
            <ContentCard key={item.id || idx} item={item} index={idx} onMoreInfo={onMoreInfo} />
          ))}
        </div>

        {/* Right Arrow */}
        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-20 w-10 md:w-14 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight className="text-white" size={28} />
          </button>
        )}
      </div>
    </div>
  );
}