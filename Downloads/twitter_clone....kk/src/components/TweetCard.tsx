import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share, 
  MoreHorizontal, 
  Bookmark, 
  CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Tweet, ROUTE_PATHS } from '@/lib/index';
import { useTweets } from '@/hooks/useTweets';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TweetCardProps {
  tweet: Tweet;
  showThread?: boolean;
}

export function TweetCard({ tweet, showThread = false }: TweetCardProps) {
  const navigate = useNavigate();
  const { likeTweet, retweetTweet, deleteTweet } = useTweets();
  const { user, content, mediaUrls, createdAt, likesCount, retweetsCount, repliesCount, isLiked, isRetweeted } = tweet;

  if (!user) return null;

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(ROUTE_PATHS.PROFILE.replace(':username', user.username));
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: false })
    .replace('about ', '')
    .replace('less than a minute', 'now')
    .replace('minute', 'm')
    .replace('minutes', 'm')
    .replace('hour', 'h')
    .replace('hours', 'h')
    .replace('day', 'd')
    .replace('days', 'd');

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative flex w-full gap-3 border-b border-border p-4 transition-colors hover:bg-muted/30 cursor-pointer",
        showThread && "pb-0 border-b-0"
      )}
      onClick={() => navigate(`/tweet/${tweet.id}`)}
    >
      {/* Avatar Section & Thread Line */}
      <div className="flex flex-col items-center">
        <Avatar 
          className="h-10 w-10 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleProfileClick}
        >
          <AvatarImage src={user.avatarUrl} alt={user.displayName} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {user.displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {showThread && (
          <div className="mt-2 w-0.5 grow rounded-full bg-border" />
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
            <span 
              className="font-bold text-foreground hover:underline cursor-pointer truncate"
              onClick={handleProfileClick}
            >
              {user.displayName}
            </span>
            {user.isVerified && (
              <CheckCircle2 className="h-4 w-4 fill-primary text-primary-foreground flex-shrink-0" />
            )}
            <span className="text-muted-foreground text-sm truncate">@{user.username}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{timeAgo}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={() => deleteTweet(tweet.id)}>
                Delete Post
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Pin to profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Add to list</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Mute @{user.username}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-[15px] leading-normal break-words text-foreground">
          {content}
        </div>

        {/* Media Grid */}
        {mediaUrls && mediaUrls.length > 0 && (
          <div className={cn(
            "mt-3 overflow-hidden rounded-2xl border border-border grid gap-0.5",
            mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
          )}>
            {mediaUrls.map((url, idx) => (
              <img 
                key={idx} 
                src={url} 
                alt="Tweet media" 
                className={cn(
                  "h-full w-full object-cover max-h-[512px]",
                  mediaUrls.length === 3 && idx === 0 && "row-span-2"
                )}
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-3 flex items-center justify-between max-w-md -ml-2 text-muted-foreground">
          {/* Reply */}
          <div className="flex items-center group/action">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full group-hover/action:text-primary group-hover/action:bg-primary/10"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="h-[18px] w-[18px]" />
            </Button>
            <span className="text-xs group-hover/action:text-primary">{repliesCount > 0 ? repliesCount : ''}</span>
          </div>

          {/* Retweet */}
          <div className="flex items-center group/action">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-9 w-9 rounded-full group-hover/action:text-emerald-500 group-hover/action:bg-emerald-500/10",
                isRetweeted && "text-emerald-500"
              )}
              onClick={(e) => handleAction(e, () => retweetTweet(tweet.id))}
            >
              <Repeat2 className="h-[18px] w-[18px]" />
            </Button>
            <span className={cn("text-xs group-hover/action:text-emerald-500", isRetweeted && "text-emerald-500")}>
              {retweetsCount > 0 ? retweetsCount : ''}
            </span>
          </div>

          {/* Like */}
          <div className="flex items-center group/action">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-9 w-9 rounded-full group-hover/action:text-rose-500 group-hover/action:bg-rose-500/10",
                isLiked && "text-rose-500"
              )}
              onClick={(e) => handleAction(e, () => likeTweet(tweet.id))}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLiked ? 'liked' : 'unliked'}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Heart className={cn("h-[18px] w-[18px]", isLiked && "fill-current")} />
                </motion.div>
              </AnimatePresence>
            </Button>
            <span className={cn("text-xs group-hover/action:text-rose-500", isLiked && "text-rose-500")}>
              {likesCount > 0 ? likesCount : ''}
            </span>
          </div>

          {/* Share & Bookmark */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full hover:text-primary hover:bg-primary/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Bookmark className="h-[18px] w-[18px]" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full hover:text-primary hover:bg-primary/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Share className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
