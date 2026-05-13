import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Story = Database['public']['Tables']['stories']['Row']
type StoryInsert = Database['public']['Tables']['stories']['Insert']

export interface StoryWithProfile extends Story {
  profiles: {
    id: string
    username: string
    full_name: string
    avatar_url: string | null
  }
  is_seen?: boolean
}

// Create new story
export const createStory = async (storyData: StoryInsert): Promise<Story> => {
  const { data, error } = await supabase
    .from('stories')
    .insert(storyData)
    .select()
    .single()

  if (error) throw error
  return data
}

// Get active stories (not expired)
export const getActiveStories = async (): Promise<StoryWithProfile[]> => {
  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as StoryWithProfile[]
}

// Get user stories
export const getUserStories = async (userId: string): Promise<StoryWithProfile[]> => {
  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('user_id', userId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as StoryWithProfile[]
}

// Mark story as viewed
export const markStoryAsViewed = async (storyId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('story_views')
    .insert({ story_id: storyId, user_id: userId })

  if (error && !error.message.includes('duplicate')) {
    throw error
  }
}

// Check if story is viewed by user
export const isStoryViewed = async (storyId: string, userId: string): Promise<boolean> => {
  const { data } = await supabase
    .from('story_views')
    .select('id')
    .eq('story_id', storyId)
    .eq('user_id', userId)
    .single()

  return !!data
}

// Delete story
export const deleteStory = async (storyId: string): Promise<void> => {
  const { error } = await supabase
    .from('stories')
    .delete()
    .eq('id', storyId)

  if (error) throw error
}

// Get story viewers
export const getStoryViewers = async (storyId: string) => {
  const { data, error } = await supabase
    .from('story_views')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('story_id', storyId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}