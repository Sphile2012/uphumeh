import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TweetCard } from '@/components/TweetCard';
import { TweetComposer } from '@/components/TweetComposer';
import { useTweets } from '@/hooks/useTweets';
import { Sparkles } from 'lucide-react';

/**
 * Home Page
 * Main timeline feed with responsive design, tweet composition, and interaction simulation.
 * © 2026 Twitter Clone Project. All rights reserved.
 */
export default function Home() {
  const { tweets } = useTweets();
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header physicality
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky Header with Glassmorphism 2.0 */}
      <header 
        className={`sticky top-0 z-30 transition-all duration-200 border-b border-border ${
          isScrolled ? 'backdrop-blur-xl bg-background/80 shadow-sm' : 'bg-background'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight font-sans">Home</h1>
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Sparkles className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* Feed Navigation Tabs */}
        <nav className="flex w-full">
          <button
            onClick={() => setActiveTab('for-you')}
            className="flex-1 relative py-4 text-sm font-semibold hover:bg-secondary/50 transition-colors group"
          >
            <span className={`relative z-10 ${activeTab === 'for-you' ? 'text-foreground' : 'text-muted-foreground'}`}>
              For You
            </span>
            {activeTab === 'for-you' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className="flex-1 relative py-4 text-sm font-semibold hover:bg-secondary/50 transition-colors group"
          >
            <span className={`relative z-10 ${activeTab === 'following' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Following
            </span>
            {activeTab === 'following' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[600px] mx-auto border-x border-border min-h-screen">
        {/* Desktop Composer - Hidden on mobile as mobile usually uses a FAB or separate view */}
        <div className="hidden md:block border-b border-border">
          <TweetComposer />
        </div>

        {/* Timeline Feed */}
        <div className="flex flex-col divide-y divide-border">
          <AnimatePresence mode="popLayout">
            {tweets.length > 0 ? (
              tweets.map((tweet, index) => (
                <motion.div
                  key={tweet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: Math.min(index * 0.05, 0.5), // Stagger first few items
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 25 
                  }}
                >
                  <TweetCard tweet={tweet} />
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Welcome to your timeline</h2>
                  <p className="text-muted-foreground max-w-xs mt-2">
                    Start following people to see what's happening in the world right now.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Loading Indicator for Simulated Infinite Scroll */}
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </main>

      {/* Mobile Floating Action Button for Tweeting */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-4 md:hidden w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-40"
      >
        <svg 
          viewBox="0 0 24 24" 
          aria-hidden="true" 
          className="w-6 h-6 fill-current"
        >
          <g><path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H14.5V11zM10 16H8.5v2H10V16z"></path></g>
        </svg>
      </motion.button>
    </div>
  );
}
