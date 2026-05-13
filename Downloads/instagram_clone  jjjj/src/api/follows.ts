import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Follow = Database['public']['Tables']['follows']['Row']

export interface FollowWithProfile {
  id: string
  created_at: string
  profiles: {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
    is_verified: boolean
    follower_count: number
    following_count: number
  }
}

// Follow user
export const followUser = async (followerId: string, followingId: string): Promise<Follow> => {
  const { data, error } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId })
    .select()
    .single()

  if (error) throw error
  return data
}

// Unfollow user
export const unfollowUser = async (followerId: string, followingId: string): Promise<void> => {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)

  if (error) throw error
}

// Check if user is following another user
export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  const { data } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single()

  return !!data
}

// Get user followers
export const getUserFollowers = async (userId: string): Promise<FollowWithProfile[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      id,
      created_at,
      profiles:follower_id (
        id,
        username,
        full_name,
        avatar_url,
        is_verified,
        follower_count,
        following_count
      )
    `)
    .eq('following_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as FollowWithProfile[]
}

// Get user following
export const getUserFollowing = async (userId: string): Promise<FollowWithProfile[]> => {
  const { data, error } = await supabase
    .from('follows')
    .select(`
      id,
      created_at,
      profiles:following_id (
        id,
        username,
        full_name,
        avatar_url,
        is_verified,
        follower_count,
        following_count
      )
    `)
    .eq('follower_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as FollowWithProfile[]
}

// Get mutual followers
export const getMutualFollowers = async (userId1: string, userId2: string) => {
  const { data, error } = await supabase.rpc('get_mutual_followers', {
    user1_id: userId1,
    user2_id: userId2
  })

  if (error) throw error
  return data
}

// Get suggested users to follow
export const getSuggestedUsers = async (userId: string, limit = 10) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', userId)
    .not('id', 'in', `(
      SELECT following_id FROM follows WHERE follower_id = '${userId}'
    )`)
    .order('follower_count', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}