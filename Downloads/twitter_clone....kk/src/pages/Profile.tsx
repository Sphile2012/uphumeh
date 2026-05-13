import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { User, Tweet, ROUTE_PATHS } from '@/lib/index';
import { UserProfile } from '@/components/UserProfile';
import { TweetCard } from '@/components/TweetCard';
import { useAuth } from '@/hooks/useAuth';
import { mockUsers, mockTweets } from '@/data/index';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('tweets');

  const user = useMemo(() => {
    const found = mockUsers.find((u) => u.username === username);
    return found || null;
  }, [username]);

  const userTweets = useMemo(() => {
    if (!user) return [];
    return mockTweets.filter((t) => t.userId === user.id);
  }, [user]);

  const isCurrentUser = currentUser?.id === user?.id;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">This account doesn't exist</h2>
        <p className="text-muted-foreground mb-6">Try searching for another.</p>
        <Button onClick={() => navigate(ROUTE_PATHS.HOME)} variant="default">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl mx-auto border-x border-border min-h-screen bg-background"
    >
      {/* Sticky Profile Header */}
      <header className="sticky top-0 z-20 flex items-center gap-6 px-4 py-2 bg-background/80 backdrop-blur-md border-b border-border">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-muted"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold leading-tight">{user.displayName}</h2>
          <span className="text-xs text-muted-foreground">
            {userTweets.length} posts
          </span>
        </div>
      </header>

      {/* Profile Detail Section */}
      <UserProfile user={user} isCurrentUser={isCurrentUser} />

      {/* Content Tabs */}
      <Tabs 
        defaultValue="tweets" 
        className="w-full mt-2" 
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full flex border-b border-border bg-transparent h-auto p-0 rounded-none">
          <TabsTrigger 
            value="tweets" 
            className="flex-1 py-4 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground hover:bg-muted/50 transition-all"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger 
            value="replies" 
            className="flex-1 py-4 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground hover:bg-muted/50 transition-all"
          >
            Replies
          </TabsTrigger>
          <TabsTrigger 
            value="media" 
            className="flex-1 py-4 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground hover:bg-muted/50 transition-all"
          >
            Media
          </TabsTrigger>
          <TabsTrigger 
            value="likes" 
            className="flex-1 py-4 text-sm font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground hover:bg-muted/50 transition-all"
          >
            Likes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tweets" className="mt-0">
          {userTweets.length > 0 ? (
            <div className="divide-y divide-border">
              {userTweets.map((tweet) => (
                <TweetCard key={tweet.id} tweet={tweet} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center px-10">
              <h3 className="text-2xl font-bold mb-2">@{user.username} hasn't posted yet</h3>
              <p className="text-muted-foreground">When they do, their posts will show up here.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="replies" className="mt-0">
          <div className="py-20 text-center px-10">
            <p className="text-muted-foreground">Replies are currently hidden for this demonstration.</p>
          </div>
        </TabsContent>

        <TabsContent value="media" className="mt-0">
          <div className="grid grid-cols-3 gap-1 p-1">
            {userTweets.filter(t => t.mediaUrls && t.mediaUrls.length > 0).map((tweet) => (
              <div 
                key={tweet.id} 
                className="aspect-square bg-muted overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img 
                  src={tweet.mediaUrls?.[0]} 
                  alt="User media" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {userTweets.filter(t => t.mediaUrls && t.mediaUrls.length > 0).length === 0 && (
              <div className="col-span-3 py-20 text-center">
                <h3 className="text-2xl font-bold mb-2">Lights, camera… attachments!</h3>
                <p className="text-muted-foreground">When @{user.username} posts photos or videos, they will show up here.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="likes" className="mt-0">
          <div className="py-20 text-center px-10">
            <h3 className="text-2xl font-bold mb-2">No likes yet</h3>
            <p className="text-muted-foreground">When @{user.username} likes a post, it'll show up here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
