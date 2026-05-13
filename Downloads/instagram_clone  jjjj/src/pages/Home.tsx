import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Plus } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PostCard } from '@/components/PostCard';
import { StoryViewer } from '@/components/StoryViewer';
import { CreateStoryModal } from '@/components/CreateStoryModal';
import { mockStories } from '@/data/index';
import { usePosts } from '@/hooks/usePosts';
import { useStories } from '@/hooks/useStories';
import { useAuth } from '@/hooks/useAuth';
import { Story, Post } from '@/lib/index';
import { springPresets } from '@/lib/motion';

/**
 * Home Page component representing the main Instagram feed.
 * Features a horizontal stories carousel and a vertical feed of posts.
 */
export default function Home() {
  const { posts } = usePosts();
  const { stories, getUserStories } = useStories();
  const { user, profile } = useAuth();
  const [visiblePosts, setVisiblePosts] = useState<Post[]>(posts.slice(0, 3));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [selectedStoryUser, setSelectedStoryUser] = useState<{ avatar?: string; username?: string } | null>(null);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Get user's own stories
  const userStories = user ? getUserStories(user.id) : [];
  const hasUserStories = userStories.length > 0;

  // Simulate pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setVisiblePosts(posts.slice(0, 3));
    setIsRefreshing(false);
  };

  // Simulate infinite scroll using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visiblePosts.length < posts.length) {
          setTimeout(() => {
            setVisiblePosts((prev) => [
              ...prev,
              ...posts.slice(prev.length, prev.length + 2),
            ]);
          }, 800);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [visiblePosts.length, posts]);

  const handleStoryClick = (index: number, userInfo?: { avatar?: string; username?: string }) => {
    setSelectedStoryIndex(index);
    setSelectedStoryUser(userInfo || null);
  };

  const handleCreateStory = () => {
    setIsCreateStoryOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-[600px] mx-auto pb-20">
        {/* Pull to Refresh Indicator */}
        <AnimatePresence>
          {isRefreshing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 60, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center justify-center overflow-hidden"
            >
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stories Section */}
        <div className="py-4 bg-background border-b border-border mb-4 overflow-hidden">
          <div className="flex space-x-4 px-4 overflow-x-auto no-scrollbar">
            {/* Add Story Button */}
            <button
              onClick={handleCreateStory}
              className="flex flex-col items-center space-y-1 flex-shrink-0 focus:outline-none btn-touch focus-ring rounded-lg p-2"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-muted flex items-center justify-center p-0.5">
                  <img
                    src={profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'}
                    alt="Your story"
                    className={`w-full h-full rounded-full object-cover ${!hasUserStories ? 'grayscale' : ''}`}
                  />
                </div>
                <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full border-2 border-background p-0.5">
                  <Plus className="w-3 h-3" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground truncate w-16 text-center">
                {hasUserStories ? 'Your Story' : 'Add Story'}
              </span>
            </button>

            {/* User's Own Stories (if any) */}
            {hasUserStories && (
              <button
                onClick={() => handleStoryClick(0, {
                  avatar: profile?.avatar_url,
                  username: profile?.username || 'You'
                })}
                className="flex flex-col items-center space-y-1 flex-shrink-0 focus:outline-none btn-touch focus-ring rounded-lg p-2"
              >
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                  <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
                    <img
                      src={profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'}
                      alt="Your story"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-xs text-foreground truncate w-16 text-center">
                  Your Story
                </span>
              </button>
            )}

            {/* Mock Stories */}
            {mockStories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => handleStoryClick(index, {
                  avatar: story.user.avatar,
                  username: story.user.username
                })}
                className="flex flex-col items-center space-y-1 flex-shrink-0 focus:outline-none btn-touch focus-ring rounded-lg p-2"
              >
                <div className={`w-16 h-16 rounded-full p-[2px] ${
                  story.isSeen 
                    ? 'bg-muted' 
                    : 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]'
                }`}>
                  <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
                    <img
                      src={story.user.avatar}
                      alt={story.user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-xs text-foreground truncate w-16 text-center">
                  {story.user.username}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Feed */}
        <div className="space-y-4">
          {visiblePosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springPresets.gentle, delay: idx * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>

        {/* Loading Indicator for Infinite Scroll */}
        <div 
          ref={loaderRef} 
          className="py-10 flex justify-center"
        >
          {visiblePosts.length < posts.length && (
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          )}
          {visiblePosts.length >= posts.length && (
            <p className="text-sm text-muted-foreground">You've reached the end of the feed.</p>
          )}
        </div>
      </div>

      {/* Story Viewer Overlay */}
      <AnimatePresence>
        {selectedStoryIndex !== null && (
          <StoryViewer
            isOpen={true}
            onClose={() => {
              setSelectedStoryIndex(null);
              setSelectedStoryUser(null);
            }}
            stories={hasUserStories && selectedStoryIndex === 0 ? userStories : mockStories}
            initialStoryIndex={hasUserStories && selectedStoryIndex === 0 ? 0 : selectedStoryIndex}
            userAvatar={selectedStoryUser?.avatar}
            username={selectedStoryUser?.username}
          />
        )}
      </AnimatePresence>

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
      />

      {/* Pull to Refresh trigger area (hidden, just for simulation) */}
      <button
        onClick={handleRefresh}
        className="fixed bottom-24 right-6 w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shadow-lg text-foreground hover:bg-accent transition-colors z-40 md:hidden"
        aria-label="Refresh Feed"
      >
        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
      </button>
    </Layout>
  );
}
