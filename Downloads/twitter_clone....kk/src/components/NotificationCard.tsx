import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Repeat2, UserPlus, MessageCircle, AtSign } from 'lucide-react';
import { Notification, ROUTE_PATHS } from '@/lib/index';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NotificationCardProps {
  notification: Notification;
}

/**
 * Formats the notification timestamp into a relative string.
 */
const formatNotificationTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * NotificationCard component for displaying various user interactions.
 * Design follows the 'Social Pulse' vibe with Bento surfaces and Neo-minimalism.
 */
export function NotificationCard({ notification }: NotificationCardProps) {
  const { fromUser, type, tweet, createdAt, isRead } = notification;

  const getNotificationConfig = () => {
    switch (type) {
      case 'like':
        return {
          icon: Heart,
          iconClass: 'text-destructive fill-destructive',
          label: 'liked your post',
          link: ROUTE_PATHS.HOME, // In a real app, link to specific tweet
        };
      case 'retweet':
        return {
          icon: Repeat2,
          iconClass: 'text-primary',
          label: 'reposted your post',
          link: ROUTE_PATHS.HOME,
        };
      case 'follow':
        return {
          icon: UserPlus,
          iconClass: 'text-primary',
          label: 'followed you',
          link: ROUTE_PATHS.PROFILE.replace(':username', fromUser?.username || ''),
        };
      case 'reply':
        return {
          icon: MessageCircle,
          iconClass: 'text-primary',
          label: 'replied to your post',
          link: ROUTE_PATHS.HOME,
        };
      case 'mention':
        return {
          icon: AtSign,
          iconClass: 'text-primary',
          label: 'mentioned you',
          link: ROUTE_PATHS.HOME,
        };
      default:
        return {
          icon: AtSign,
          iconClass: 'text-muted-foreground',
          label: 'interacted with you',
          link: ROUTE_PATHS.HOME,
        };
    }
  };

  const config = getNotificationConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-3 p-4 border-b border-border transition-all duration-200 hover:bg-accent/30 cursor-pointer relative group',
        !isRead && 'bg-primary/5'
      )}
    >
      {/* Unread Indicator Line */}
      {!isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
      )}

      {/* Left Column: Notification Type Icon */}
      <div className="flex flex-col items-center w-10 shrink-0 pt-1">
        <Icon className={cn('w-6 h-6 mb-2', config.iconClass)} />
      </div>

      {/* Right Column: Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <Link 
            to={ROUTE_PATHS.PROFILE.replace(':username', fromUser?.username || '')}
            className="flex items-center gap-2 group/avatar"
          >
            <Avatar className="w-8 h-8 border border-border group-hover/avatar:ring-2 group-hover/avatar:ring-primary/20 transition-all">
              <AvatarImage src={fromUser?.avatarUrl} alt={fromUser?.displayName} />
              <AvatarFallback className="bg-muted text-xs">
                {fromUser?.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <span className="text-xs text-muted-foreground font-mono">
            {formatNotificationTime(createdAt)}
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-1">
          <Link
            to={ROUTE_PATHS.PROFILE.replace(':username', fromUser?.username || '')}
            className="font-bold hover:underline truncate max-w-[150px]"
          >
            {fromUser?.displayName}
          </Link>
          <span className="text-muted-foreground">{config.label}</span>
        </div>

        {/* Content Snippet (for likes, retweets, replies, mentions) */}
        {tweet && (
          <div className="mt-2 p-3 rounded-2xl border border-border bg-card/50 text-sm text-muted-foreground line-clamp-3 hover:border-primary/30 transition-colors">
            {tweet.content}
          </div>
        )}

        {/* Follow Bio (only for follow type) */}
        {type === 'follow' && fromUser?.bio && (
          <p className="text-sm text-muted-foreground italic line-clamp-2">
            {fromUser.bio}
          </p>
        )}
      </div>

      {/* Context Menu / Action Button Placeholder */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-primary/10 rounded-full text-muted-foreground transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
