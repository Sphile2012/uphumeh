export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string
          avatar_url: string | null
          bio: string | null
          website: string | null
          follower_count: number
          following_count: number
          post_count: number
          is_verified: boolean
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          follower_count?: number
          following_count?: number
          post_count?: number
          is_verified?: boolean
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          follower_count?: number
          following_count?: number
          post_count?: number
          is_verified?: boolean
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          type: 'image' | 'video' | 'carousel'
          media_urls: string[]
          caption: string
          hashtags: string[]
          location: string | null
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'image' | 'video' | 'carousel'
          media_urls: string[]
          caption: string
          hashtags?: string[]
          location?: string | null
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'image' | 'video' | 'carousel'
          media_urls?: string[]
          caption?: string
          hashtags?: string[]
          location?: string | null
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      stories: {
        Row: {
          id: string
          user_id: string
          media_url: string
          type: 'image' | 'video'
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          media_url: string
          type: 'image' | 'video'
          created_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          media_url?: string
          type?: 'image' | 'video'
          created_at?: string
          expires_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          text: string
          likes_count: number
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          text: string
          likes_count?: number
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          text?: string
          likes_count?: number
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          text: string | null
          media_url: string | null
          type: 'text' | 'image' | 'video' | 'voice'
          is_read: boolean
          is_vanishing: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          text?: string | null
          media_url?: string | null
          type: 'text' | 'image' | 'video' | 'voice'
          is_read?: boolean
          is_vanishing?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          text?: string | null
          media_url?: string | null
          type?: 'text' | 'image' | 'video' | 'voice'
          is_read?: boolean
          is_vanishing?: boolean
          created_at?: string
        }
      }
      story_views: {
        Row: {
          id: string
          story_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          story_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          story_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}