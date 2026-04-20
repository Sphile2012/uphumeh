import React from "react";
import Navbar from "@/components/netflix/Navbar";
import Footer from "@/components/netflix/Footer";
import { Bookmark } from "lucide-react";

export default function MyList() {
  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />
      <div className="pt-24 px-4 md:px-12 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#2a2a2a] flex items-center justify-center mx-auto mb-6">
            <Bookmark size={36} className="text-gray-500" />
          </div>
          <h1 className="text-white text-3xl font-black mb-3">My List</h1>
          <p className="text-gray-400 text-sm max-w-md">
            Add movies and TV shows to your list so you can easily find them later. 
            Click the + button on any title to get started.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}