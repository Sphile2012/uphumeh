import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Post = Database['public']['Tables']['posts']['Row']
type PostInsert = Database['public']['Tables']['posts']['Insert']
type PostUpdate = Database['public']['Tables']['posts']['Update']

export interface PostWithProfile extends Post {
  profiles: {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
    is_verified: boolean
  }
  is_liked?: boolean
  is_saved?: boolean
}

// Create new post
export const createPost = async (postData: PostInsert): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get posts for feed (with pagination)
export const getFeedPosts = async (page = 0, limit = 10): Promise<PostWithProfile[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url,
        is_verified
      )
    `)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (error) throw error
  return data as PostWithProfile[]
}

// Get posts by user
export const getUserPosts = async (userId: string): Promise<PostWithProfile[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url,
        is_verified
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as PostWithProfile[]
}

// Get single post
export const getPost = async (postId: string): Promise<PostWithProfile | null> => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url,
        is_verified
      )
    `)
    .eq('id', postId)
    .single()

  if (error) return null
  return data as PostWithProfile
}

// Update post
export const updatePost = async (postId: string, updates: PostUpdate): Promise<Post> => {
  const { data, error } = await supabase
    .from('posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', postId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete post
export const deletePost = async (postId: string): Promise<void> => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) throw error
}

// Like/unlike post
export const toggleLike = async (postId: string, userId: string): Promise<boolean> => {
  // Check if already liked
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) throw error
    return false
  } else {
    // Like
    const { error } = await supabase
      .from('likes')
      .insert({ post_id: postId, user_id: userId })

    if (error) throw error
    return true
  }
}

// Check if user liked post
export const isPostLiked = async (postId: string, userId: string): Promise<boolean> => {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  return !!data
}