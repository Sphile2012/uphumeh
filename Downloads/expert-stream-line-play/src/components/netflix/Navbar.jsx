import React, { useState, useEffect } from "react";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home", path: "/Home" },
  { label: "TV Shows", path: "/Browse?type=series" },
  { label: "Movies", path: "/Browse?type=movie" },
  { label: "New & Popular", path: "/Browse?category=new_releases" },
  { label: "My List", path: "/MyList" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-3 sm:px-6 md:px-12 py-3">
        {/* Left */}
        <div className="flex items-center gap-6">
          <Link to="/Home" className="text-[#E50914] font-black text-2xl md:text-3xl tracking-wider">
            NETFLIX
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-3 md:gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs md:text-sm whitespace-nowrap transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center transition-all duration-300 ${searchOpen ? "bg-[#141414] border border-white/30" : ""} rounded`}>
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-white p-1">
              <Search size={20} />
            </button>
            {searchOpen && (
              <input
                autoFocus
                placeholder="Titles, people, genres"
                className="bg-transparent text-white text-sm w-40 md:w-56 px-2 py-1 outline-none placeholder-gray-400"
                onBlur={() => setSearchOpen(false)}
              />
            )}
          </div>
          <button className="text-white hidden sm:block">
            <Bell size={20} />
          </button>
          <div className="flex items-center gap-1 cursor-pointer group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#E50914] to-[#B20710] flex items-center justify-center text-white text-xs font-bold">
              U
            </div>
            <ChevronDown size={16} className="text-white group-hover:rotate-180 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#141414]/95 backdrop-blur-md border-t border-white/10">
          <div className="flex flex-col py-4 px-6 gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm py-2 transition-colors ${
                  location.pathname === link.path
                    ? "text-white font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}