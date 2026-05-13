import React from 'react';
import { Search, Settings, MoreHorizontal, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ROUTE_PATHS, type Trend, type User } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { IMAGES } from '@/assets/images';

interface TrendingSidebarProps {
  className?: string;
}

// Mock data locally since it's specific to the sidebar display
const MOCK_TRENDS: Trend[] = [
  {
    id: '1',
    name: '#TechTrends2026',
    category: 'Technology · Trending',
    tweetCount: 125400,
  },
  {
    id: '2',
    name: 'Artificial Intelligence',
    category: 'Science · Trending',
    tweetCount: 85200,
  },
  {
    id: '3',
    name: 'Mars Colony Update',
    category: 'Space',
    tweetCount: 45600,
  },
  {
    id: '4',
    name: '#WebDevLife',
    category: 'Programming',
    tweetCount: 12300,
  },
  {
    id: '5',
    name: 'Electric VTOLs',
    category: 'Transportation',
    tweetCount: 34200,
  },
];

const SUGGESTED_USERS: Partial<User>[] = [
  {
    id: 's1',
    username: 'future_tech',
    displayName: 'Future Tech',
    avatarUrl: IMAGES.USER_AVATAR_5,
    isVerified: true,
  },
  {
    id: 's2',
    username: 'design_daily',
    displayName: 'Design Daily',
    avatarUrl: IMAGES.USER_AVATAR_6,
    isVerified: false,
  },
  {
    id: 's3',
    username: 'code_master',
    displayName: 'Code Master',
    avatarUrl: IMAGES.USER_AVATAR_7,
    isVerified: true,
  },
];

export function TrendingSidebar({ className }: TrendingSidebarProps) {
  return (
    <aside className={cn("flex flex-col gap-4 w-full h-fit pb-10", className)}>
      {/* Search Bar - Sticky on top of sidebar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Twitter"
            className="pl-10 bg-muted/50 border-none rounded-full focus-visible:ring-primary focus-visible:bg-background transition-all"
          />
        </div>
      </div>

      {/* Trends Section */}
      <Card className="bg-muted/30 border-none shadow-none rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">What's happening</CardTitle>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-accent">
            <Settings className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {MOCK_TRENDS.map((trend) => (
              <motion.button
                key={trend.id}
                whileHover={{ backgroundColor: "rgba(var(--foreground), 0.03)" }}
                className="flex flex-col gap-0.5 px-4 py-3 text-left transition-colors w-full"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-muted-foreground">{trend.category}</span>
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="font-bold text-sm">{trend.name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(trend.tweetCount)} posts
                </span>
              </motion.button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Button 
            variant="ghost" 
            className="w-full justify-start rounded-none h-12 text-primary hover:bg-accent hover:text-primary px-4"
          >
            Show more
          </Button>
        </CardFooter>
      </Card>

      {/* Who to Follow Section */}
      <Card className="bg-muted/30 border-none shadow-none rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Who to follow</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {SUGGESTED_USERS.map((user) => (
              <motion.div
                key={user.id}
                whileHover={{ backgroundColor: "rgba(var(--foreground), 0.03)" }}
                className="flex items-center justify-between px-4 py-3 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border/50">
                    <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                    <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm hover:underline decoration-1">
                        {user.displayName}
                      </span>
                      {user.isVerified && (
                        <Badge className="bg-primary text-primary-foreground p-0.5 rounded-full">
                          <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-1.58-.08-3.26-1.14-4.32s-2.74-1.4-4.32-1.14C14.15 2.08 12.78 1.2 11.2 1.2s-2.95.88-3.66 2.18c-1.58-.26-3.26.08-4.32 1.14s-1.4 2.74-1.14 4.32C.88 9.55 0 10.92 0 12.5s.88 2.95 2.18 3.66c-.26 1.58.08 3.26 1.14 4.32s2.74 1.4 4.32 1.14c.71 1.3 2.08 2.18 3.66 2.18s2.95-.88 3.66-2.18c1.58.26 3.26-.08 4.32-1.14s1.4-2.74 1.14-4.32c1.31-.71 2.19-2.08 2.19-3.66zm-12.85 4.73l-4.14-4.14 1.41-1.41 2.73 2.73 6.6-6.6 1.41 1.41-8.01 8.01z" />
                          </svg>
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">@{user.username}</span>
                  </div>
                </div>
                <Button size="sm" className="rounded-full font-bold px-4 h-8">
                  Follow
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Button 
            variant="ghost" 
            className="w-full justify-start rounded-none h-12 text-primary hover:bg-accent hover:text-primary px-4"
          >
            Show more
          </Button>
        </CardFooter>
      </Card>

      {/* Footer Links */}
      <footer className="px-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <a href="#" className="hover:underline">Terms of Service</a>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <a href="#" className="hover:underline">Cookie Policy</a>
        <a href="#" className="hover:underline">Accessibility</a>
        <a href="#" className="hover:underline">Ads info</a>
        <div className="flex items-center gap-1 cursor-pointer hover:underline">
          More <MoreHorizontal className="h-3 w-3" />
        </div>
        <span>© 2026 Twitter Corp.</span>
      </footer>

      {/* Floating Action for Mobile (Hidden by default, triggered by Layout if needed) */}
      <div className="lg:hidden">
        {/* This sidebar is typically hidden on mobile and shown via a drawer in Layout.tsx */}
      </div>
    </aside>
  );
}
