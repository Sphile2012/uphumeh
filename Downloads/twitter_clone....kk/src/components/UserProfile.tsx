import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Link as LinkIcon, Mail, MoreHorizontal, BadgeCheck } from 'lucide-react';
import { User, ROUTE_PATHS } from '@/lib/index';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { springPresets } from '@/lib/motion';

interface UserProfileProps {
  user: User;
  isCurrentUser?: boolean;
}

/**
 * Responsive User Profile component showing user details, stats, and content tabs.
 * © 2026 Twitter Clone Project.
 */
export function UserProfile({ user, isCurrentUser = false }: UserProfileProps) {
  const { updateProfile } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={springPresets.smooth}
      className="w-full bg-background border-b border-border"
    >
      {/* Banner Section */}
      <div className="relative h-32 sm:h-48 md:h-64 bg-muted overflow-hidden">
        {user.bannerUrl ? (
          <img
            src={user.bannerUrl}
            alt={`${user.displayName}'s banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20" />
        )}
      </div>

      {/* Profile Header Section */}
      <div className="px-4 pb-4">
        <div className="relative flex justify-between items-start">
          {/* Avatar - overlapping banner */}
          <div className="-mt-12 sm:-mt-16 md:-mt-20">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 border-4 border-background ring-2 ring-transparent">
              <AvatarImage src={user.avatarUrl} alt={user.displayName} className="object-cover" />
              <AvatarFallback className="text-2xl">{user.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full hidden sm:flex">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
            {isCurrentUser ? (
              <Button 
                variant="outline" 
                className="rounded-full font-bold px-6 border-border hover:bg-accent"
              >
                Edit Profile
              </Button>
            ) : (
              <Button className="rounded-full font-bold px-6 bg-foreground text-background hover:bg-foreground/90">
                Follow
              </Button>
            )}
          </div>
        </div>

        {/* User Identity */}
        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {user.displayName}
            </h1>
            {user.isVerified && (
              <BadgeCheck className="w-5 h-5 text-primary fill-current" />
            )}
          </div>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        {/* Bio */}
        <div className="mt-4 text-[15px] leading-relaxed whitespace-pre-wrap">
          {user.bio}
        </div>

        {/* Metadata Grid */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground text-sm">
          {user.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{user.location}</span>
            </div>
          )}
          {user.website && (
            <div className="flex items-center gap-1">
              <LinkIcon className="w-4 h-4" />
              <a 
                href={user.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-5 text-sm">
          <button className="flex items-center gap-1 hover:underline">
            <span className="font-bold text-foreground">
              {new Intl.NumberFormat().format(user.followingCount)}
            </span>
            <span className="text-muted-foreground">Following</span>
          </button>
          <button className="flex items-center gap-1 hover:underline">
            <span className="font-bold text-foreground">
              {new Intl.NumberFormat().format(user.followersCount)}
            </span>
            <span className="text-muted-foreground">Followers</span>
          </button>
        </div>
      </div>

      {/* Mobile-Optimized Content Tabs */}
      <Tabs defaultValue="tweets" className="w-full">
        <TabsList className="w-full h-12 bg-transparent border-b border-border rounded-none p-0 flex">
          <TabsTrigger 
            value="tweets" 
            className="flex-1 rounded-none h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all font-semibold"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger 
            value="replies" 
            className="flex-1 rounded-none h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all font-semibold"
          >
            Replies
          </TabsTrigger>
          <TabsTrigger 
            value="highlights" 
            className="flex-1 rounded-none h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all font-semibold hidden sm:flex"
          >
            Highlights
          </TabsTrigger>
          <TabsTrigger 
            value="media" 
            className="flex-1 rounded-none h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all font-semibold"
          >
            Media
          </TabsTrigger>
          <TabsTrigger 
            value="likes" 
            className="flex-1 rounded-none h-full border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all font-semibold"
          >
            Likes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tweets" className="m-0">
          {/* Content will be injected by the parent page based on the selected tab */}
        </TabsContent>
        <TabsContent value="replies" className="m-0" />
        <TabsContent value="media" className="m-0" />
        <TabsContent value="likes" className="m-0" />
      </Tabs>
    </motion.div>
  );
}
