/**
 * Core constants, types, and route definitions for the Twitter clone.
 * © 2026 Twitter Clone Project. All rights reserved.
 */

export const ROUTE_PATHS = {
  HOME: '/',
  EXPLORE: '/explore',
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
  PROFILE: '/profile/:username',
  SETTINGS: '/settings',
} as const;

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio: string;
  location?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  createdAt: string;
}

export interface Tweet {
  id: string;
  userId: string;
  user?: User; // Populated user data for display
  content: string;
  mediaUrls?: string[];
  createdAt: string;
  likesCount: number;
  retweetsCount: number;
  repliesCount: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
  isBookmarked?: boolean;
  replyToId?: string;
  thread?: Tweet[]; // For displaying conversation threads
}

export type NotificationType = 'like' | 'retweet' | 'follow' | 'mention' | 'reply';

export interface Notification {
  id: string;
  type: NotificationType;
  fromUserId: string;
  fromUser?: User;
  tweetId?: string;
  tweet?: Tweet;
  createdAt: string;
  isRead: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface Trend {
  id: string;
  name: string;
  category: string;
  tweetCount: number;
}

/**
 * Helper type for navigation item configuration
 */
export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  activeIcon?: React.ComponentType<{ size?: number | string; className?: string }>;
}
