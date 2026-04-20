import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-4">
      <h1 className="text-[#E50914] font-black text-4xl mb-4">Lost your way?</h1>
      <p className="text-gray-400 text-center max-w-md mb-8">
        Sorry, we can't find that page. You'll find lots to explore on the home page.
      </p>
      <Link
        to="/Home"
        className="bg-white text-black font-bold px-8 py-3 rounded hover:bg-white/80 transition-colors"
      >
        Netflix Home
      </Link>
    </div>
  );
}