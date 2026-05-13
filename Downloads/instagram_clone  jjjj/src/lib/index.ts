export const ROUTE_PATHS = {
  HOME: '/',
  EXPLORE: '/explore',
  REELS: '/reels',
  MESSAGES: '/direct/inbox',
  CREATE: '/create',
  PROFILE: '/profile/:username',
  SEARCH: '/search',
  ACTIVITY: '/accounts/activity',
} as const;

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio?: string;
  website?: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  isFollowing?: boolean;
  hasStory?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  type: 'image' | 'video' | 'carousel';
  mediaUrls: string[];
  caption: string;
  hashtags: string[];
  location?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  isMusic?: boolean;
  musicTrack?: string;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  type: 'image' | 'video';
  createdAt: string;
  expiresAt: string;
  isSeen: boolean;
  reactions?: { emoji: string; count: number }[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  text: string;
  likesCount: number;
  createdAt: string;
  replies?: Comment[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  mediaUrl?: string;
  type: 'text' | 'image' | 'video' | 'voice';
  createdAt: string;
  isRead: boolean;
  isVanishing?: boolean;
}

export type ContentCategory = 'all' | 'users' | 'hashtags' | 'places' | 'audio';
