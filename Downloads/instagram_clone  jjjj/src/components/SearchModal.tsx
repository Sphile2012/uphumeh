import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, History, TrendingUp, MapPin, Music, Hash, User as UserIcon, ChevronRight } from 'lucide-react';
import { User, ContentCategory } from '@/lib/index';
import { mockUsers } from '@/data/index';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { springPresets } from '@/lib/motion';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RecentSearch {
  id: string;
  type: ContentCategory;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

const INITIAL_RECENT_SEARCHES: RecentSearch[] = [
  {
    id: 'r1',
    type: 'users',
    title: 'sarah_lens',
    subtitle: 'Sarah Jenkins',
    imageUrl: 'https://images.unsplash.com/photo-1661265117335-4f2bb4cd966e?w=150',
  },
  {
    id: 'r2',
    type: 'hashtags',
    title: '#tokyo2026',
    subtitle: '1.2M posts',
  },
  {
    id: 'r3',
    type: 'audio',
    title: 'Neon Nights',
    subtitle: 'Synthwave Artist',
  },
];

const TRENDING_HASHTAGS = [
  { tag: '#visualarts', posts: '2.5M' },
  { tag: '#futureoftech', posts: '850K' },
  { tag: '#minimalistdesign', posts: '1.1M' },
  { tag: '#streetstyle2026', posts: '420K' },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(INITIAL_RECENT_SEARCHES);
  const [activeTab, setActiveTab] = useState<ContentCategory>('all');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveTab('all');
    }
  }, [isOpen]);

  const removeRecent = (id: string) => {
    setRecentSearches(prev => prev.filter(item => item.id !== id));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
  };

  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(query.toLowerCase()) || 
    user.fullName.toLowerCase().includes(query.toLowerCase())
  );

  const renderResultItem = (item: RecentSearch | User | any, type: ContentCategory) => {
    const title = 'username' in item ? item.username : item.title || item.tag || item.name;
    const subtitle = 'fullName' in item ? item.fullName : item.subtitle || item.posts || item.location;
    const image = 'avatar' in item ? item.avatar : item.imageUrl;

    return (
      <div 
        key={item.id || title} 
        className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            {type === 'users' ? (
              <Avatar className="h-12 w-12 border-2 border-background">
                <AvatarImage src={image} alt={title} />
                <AvatarFallback>{title[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                {type === 'hashtags' && <Hash className="h-6 w-6 text-muted-foreground" />}
                {type === 'places' && <MapPin className="h-6 w-6 text-muted-foreground" />}
                {type === 'audio' && <Music className="h-6 w-6 text-muted-foreground" />}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</span>
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          </div>
        </div>
        {query ? (
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              removeRecent(item.id);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex justify-center md:items-start md:pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={springPresets.gentle}
            className="bg-card w-full max-w-2xl h-full md:h-auto md:max-h-[80vh] md:rounded-3xl shadow-2xl border overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header & Search Input */}
            <div className="p-4 border-b space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Search</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search creators, tags, or places..."
                  className="pl-10 pr-4 h-12 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Tabs & Content */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                {!query ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <History className="h-4 w-4" />
                            Recent
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:text-primary/80 font-medium text-xs"
                            onClick={clearAllRecent}
                          >
                            Clear All
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {recentSearches.map(item => renderResultItem(item, item.type))}
                        </div>
                      </div>
                    )}

                    {/* Trending Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 px-2 text-sm font-semibold">
                        <TrendingUp className="h-4 w-4" />
                        Trending Now
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {TRENDING_HASHTAGS.map((tag) => (
                          <div 
                            key={tag.tag} 
                            className="p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer border border-transparent hover:border-border"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Hash className="h-4 w-4 text-primary" />
                              <span className="font-bold text-sm">{tag.tag.replace('#', '')}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{tag.posts} posts this week</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as ContentCategory)} className="w-full">
                    <TabsList className="w-full justify-start h-10 bg-transparent gap-2 mb-6">
                      {['all', 'users', 'hashtags', 'places', 'audio'].map((cat) => (
                        <TabsTrigger 
                          key={cat} 
                          value={cat} 
                          className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground capitalize px-4"
                        >
                          {cat}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="all" className="space-y-1 mt-0">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => renderResultItem(user, 'users'))
                      ) : (
                        <div className="text-center py-12">
                          <Search className="h-12 w-12 text-muted/30 mx-auto mb-4" />
                          <p className="text-muted-foreground">No results found for "{query}"</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="users" className="space-y-1 mt-0">
                      {filteredUsers.map(user => renderResultItem(user, 'users'))}
                    </TabsContent>

                    <TabsContent value="hashtags" className="space-y-1 mt-0">
                      {/* Mocked Tags */}
                      {['#minimalism', '#creative', '#coding'].filter(t => t.includes(query)).map(tag => 
                        renderResultItem({ id: tag, tag, posts: '15.4K posts' }, 'hashtags')
                      )}
                    </TabsContent>

                    <TabsContent value="places" className="space-y-1 mt-0">
                       {/* Empty state example for other tabs */}
                       <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                         <MapPin className="h-8 w-8 mb-2 opacity-20" />
                         <p className="text-sm">Searching locations...</p>
                       </div>
                    </TabsContent>

                    <TabsContent value="audio" className="space-y-1 mt-0">
                       <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                         <Music className="h-8 w-8 mb-2 opacity-20" />
                         <p className="text-sm">Searching audio tracks...</p>
                       </div>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </ScrollArea>

            {/* Footer / Shortcut Hint */}
            <div className="p-4 bg-muted/10 border-t hidden md:flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border bg-card">ESC</kbd> to close</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded border bg-card">↑↓</kbd> to navigate</span>
              </div>
              <span>© 2026 INSTAGRAM CLONE</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
