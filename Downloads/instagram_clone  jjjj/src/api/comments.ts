import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Comment = Database['public']['Tables']['comments']['Row']
type CommentInsert = Database['public']['Tables']['comments']['Insert']
type CommentUpdate = Database['public']['Tables']['comments']['Update']

export interface CommentWithProfile extends Comment {
  profiles: {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
    is_verified: boolean
  }
  replies?: CommentWithProfile[]
}

// Create comment
export const createComment = async (commentData: CommentInsert): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comments')
    .insert(commentData)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get post comments
export const getPostComments = async (postId: string): Promise<CommentWithProfile[]> => {
  const { data, error } = await supabase
    .from('comments')
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
    .eq('post_id', postId)
    .is('parent_id', null)
    .order('created_at', { ascending: true })

  if (error) throw error

  // Get replies for each comment
  const commentsWithReplies = await Promise.all(
    data.map(async (comment) => {
      const replies = await getCommentReplies(comment.id)
      return { ...comment, replies } as CommentWithProfile
    })
  )

  return commentsWithReplies
}

// Get comment replies
export const getCommentReplies = async (commentId: string): Promise<CommentWithProfile[]> => {
  const { data, error } = await supabase
    .from('comments')
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
    .eq('parent_id', commentId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as CommentWithProfile[]
}

// Update comment
export const updateComment = async (commentId: string, updates: CommentUpdate): Promise<Comment> => {
  const { data, error } = await supabase
    .from('comments')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete comment
export const deleteComment = async (commentId: string): Promise<void> => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) throw error
}

// Get single comment
export const getComment = async (commentId: string): Promise<CommentWithProfile | null> => {
  const { data, error } = await supabase
    .from('comments')
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
    .eq('id', commentId)
    .single()

  if (error) return null
  return data as CommentWithProfile
}