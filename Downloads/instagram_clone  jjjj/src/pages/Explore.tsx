import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Heart, 
  MessageCircle, 
  Play, 
  Copy, 
  TrendingUp, 
  Camera,
  Music2,
  Gamepad2,
  Utensils,
  Plane
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { mockPosts } from '@/data/index';
import { Post } from '@/lib/index';
import { cn } from '@/lib/utils';
import { springPresets } from '@/lib/motion';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: TrendingUp },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'music', label: 'Music', icon: Music2 },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'travel', label: 'Travel', icon: Plane },
];

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Enhance mock data to fill the grid for a more realistic explore experience
  const extendedPosts: Post[] = [...mockPosts, ...mockPosts, ...mockPosts, ...mockPosts].map((post, idx) => ({
    ...post,
    id: `${post.id}-explore-${idx}`,
    // Randomly assign some posts as "tall" for the masonry-like effect
    type: idx % 5 === 0 ? 'video' : post.type
  }));

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Search Bar - Mobile Focus */}
        <div className="mb-6 sticky top-0 z-10 bg-background/80 backdrop-blur-md py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search creators, hashtags, or places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat.id
                  ? "bg-foreground text-background shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Explore Grid */}
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {extendedPosts.map((post, index) => {
            // Custom logic for the Instagram-style explore grid
            // Every 10 items, we make a large feature (2x2)
            const isLarge = index % 10 === 0;
            const isVideo = post.type === 'video';

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...springPresets.gentle, delay: (index % 12) * 0.05 }}
                className={cn(
                  "relative group aspect-square overflow-hidden rounded-md md:rounded-xl cursor-pointer bg-muted",
                  isLarge && "col-span-2 row-span-2 aspect-auto"
                )}
              >
                {/* Post Content */}
                <img
                  src={post.mediaUrls[0]}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Type Indicators */}
                <div className="absolute top-2 right-2 z-10">
                  {post.type === 'carousel' && (
                    <Copy className="w-4 h-4 text-white drop-shadow-md" />
                  )}
                  {isVideo && (
                    <Play className="w-4 h-4 text-white fill-white drop-shadow-md" />
                  )}
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <Heart className="w-6 h-6 fill-white" />
                    <span>{post.likesCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <MessageCircle className="w-6 h-6 fill-white" />
                    <span>{post.commentsCount.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State / Loading Trigger */}
        <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
          <TrendingUp className="w-8 h-8 mb-2 opacity-20" />
          <p className="text-sm">Discovering more for you...</p>
        </div>
      </div>
    </Layout>
  );
}
