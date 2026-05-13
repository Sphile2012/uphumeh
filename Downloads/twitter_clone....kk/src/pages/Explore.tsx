import React, { useState, useMemo } from 'react';
import { Search, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TweetCard } from '@/components/TweetCard';
import { TrendingSidebar } from '@/components/TrendingSidebar';
import { useTweets } from '@/hooks/useTweets';

const EXPLORE_TABS = [
  { id: 'for-you', label: 'For you' },
  { id: 'trending', label: 'Trending' },
  { id: 'news', label: 'News' },
  { id: 'sports', label: 'Sports' },
  { id: 'entertainment', label: 'Entertainment' },
];

export default function Explore() {
  const { tweets } = useTweets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('for-you');

  const filteredTweets = useMemo(() => {
    if (!searchQuery) return tweets.slice(0, 15);
    const query = searchQuery.toLowerCase();
    return tweets.filter(
      (tweet) =>
        tweet.content.toLowerCase().includes(query) ||
        tweet.user?.displayName.toLowerCase().includes(query) ||
        tweet.user?.username.toLowerCase().includes(query)
    );
  }, [tweets, searchQuery]);

  return (
    <div className="flex w-full min-h-screen">
      <div className="flex-1 max-w-[600px] border-x border-border min-h-screen bg-background">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md">
          <div className="px-4 pt-2 flex items-center gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search Twitter Clone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-secondary/50 border-none rounded-full h-11 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background"
              />
            </div>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <Tabs
            defaultValue="for-you"
            className="w-full mt-2"
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full h-12 bg-transparent border-b border-border rounded-none p-0 flex">
              {EXPLORE_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 h-full rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground font-semibold transition-all"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </header>

        <main className="pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + searchQuery}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'for-you' || activeTab === 'trending' ? (
                <div className="divide-y divide-border">
                  {filteredTweets.length > 0 ? (
                    filteredTweets.map((tweet) => (
                      <TweetCard key={tweet.id} tweet={tweet} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                      <h3 className="text-xl font-bold mb-2">No results for "{searchQuery}"</h3>
                      <p className="text-muted-foreground">
                        Try searching for something else, or check your spelling.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="max-w-xs mx-auto space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">Nothing to see here — yet</h2>
                    <p className="text-muted-foreground">
                      This category is currently being curated for the 2026 experience. Check back later!
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <aside className="hidden lg:block w-[350px] px-4 py-4 sticky top-0 h-screen overflow-y-auto">
        <TrendingSidebar />
        <footer className="mt-4 px-4 text-xs text-muted-foreground space-y-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Cookie Policy</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Ads info</a>
          </div>
          <p>© 2026 Twitter Clone Corp.</p>
        </footer>
      </aside>
    </div>
  );
}
