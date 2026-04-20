import React, { useState } from "react";
import { getContent } from "@/api/phumeh";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/netflix/Navbar";
import HeroBanner from "@/components/netflix/HeroBanner";
import ContentRow from "@/components/netflix/ContentRow";
import ContentModal from "@/components/netflix/ContentModal";
import Footer from "@/components/netflix/Footer";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(null);

  const { data: allContent = [] } = useQuery({
    queryKey: ["content"],
    queryFn: getContent,
  });

  const rows = [
    { title: "Trending Now", items: allContent.filter((c) => c.category === "trending") },
    { title: "Netflix Originals", items: allContent.filter((c) => c.category === "originals") },
    { title: "Top Rated", items: allContent.filter((c) => c.category === "top_rated") },
    { title: "New Releases", items: allContent.filter((c) => c.category === "new_releases") },
    { title: "Popular on Netflix", items: allContent.filter((c) => c.category === "popular") },
  ];

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />
      <HeroBanner onInfoClick={(item) => setSelectedItem(item)} />
      <div className="relative z-10 -mt-8 sm:-mt-16 md:-mt-24">
        {rows.map((row) => (
          <ContentRow key={row.title} title={row.title} items={row.items} onMoreInfo={setSelectedItem} />
        ))}
      </div>
      <Footer />
      <ContentModal item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
