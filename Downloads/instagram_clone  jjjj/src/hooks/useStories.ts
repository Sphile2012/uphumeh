import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { useImageUpload } from './useImageUpload'
import { toast } from 'sonner'

export interface Story {
  id: string
  userId: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  caption?: string
  createdAt: string
  expiresAt: string
  isViewed: boolean
}

export interface Highlight {
  id: string
  userId: string
  title: string
  coverImage: string
  stories: Story[]
  createdAt: string
}

// Mock data for demo mode
let mockStories: Story[] = []
let mockHighlights: Highlight[] = [
  {
    id: 'h1',
    userId: 'mock-user-id',
    title: 'Highlight 1',
    coverImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    stories: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'h2',
    userId: 'mock-user-id',
    title: 'Highlight 2',
    coverImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    stories: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'h3',
    userId: 'mock-user-id',
    title: 'Highlight 3',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    stories: [],
    createdAt: new Date().toISOString()
  }
]

const listeners = new Set<() => void>()

const notifyListeners = () => {
  listeners.forEach(listener => listener())
}

export const useStories = () => {
  const { user, isSupabaseConfigured } = useAuth()
  const { uploadImage } = useImageUpload()
  const [isCreating, setIsCreating] = useState(false)

  const createStory = useCallback(async (file: File, caption?: string): Promise<Story> => {
    if (!user) throw new Error('User not authenticated')
    
    setIsCreating(true)
    
    try {
      // Upload image
      const mediaUrl = await uploadImage(file)
      
      // Create story object
      const story: Story = {
        id: `story-${Date.now()}`,
        userId: user.id,
        mediaUrl,
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
        caption,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        isViewed: false
      }
      
      // In demo mode, add to mock data
      if (!isSupabaseConfigured) {
        mockStories.unshift(story)
        notifyListeners()
      }
      
      // TODO: In real app, save to Supabase
      // const { data, error } = await supabase
      //   .from('stories')
      //   .insert(story)
      
      toast.success('Story created successfully! 📸')
      return story
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create story')
      throw error
    } finally {
      setIsCreating(false)
    }
  }, [user, isSupabaseConfigured, uploadImage])

  const createHighlight = useCallback(async (title: string, coverImage: string, storyIds: string[] = []): Promise<Highlight> => {
    if (!user) throw new Error('User not authenticated')
    
    try {
      const highlight: Highlight = {
        id: `highlight-${Date.now()}`,
        userId: user.id,
        title,
        coverImage,
        stories: mockStories.filter(story => storyIds.includes(story.id)),
        createdAt: new Date().toISOString()
      }
      
      // In demo mode, add to mock data
      if (!isSupabaseConfigured) {
        mockHighlights.push(highlight)
        notifyListeners()
      }
      
      // TODO: In real app, save to Supabase
      // const { data, error } = await supabase
      //   .from('highlights')
      //   .insert(highlight)
      
      toast.success(`Highlight "${title}" created! ✨`)
      return highlight
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create highlight')
      throw error
    }
  }, [user, isSupabaseConfigured])

  const getUserHighlights = useCallback((userId: string): Highlight[] => {
    return mockHighlights.filter(highlight => highlight.userId === userId)
  }, [])

  const getUserStories = useCallback((userId: string): Story[] => {
    const now = new Date()
    return mockStories.filter(story => 
      story.userId === userId && 
      new Date(story.expiresAt) > now
    )
  }, [])

  const deleteHighlight = useCallback(async (highlightId: string) => {
    try {
      mockHighlights = mockHighlights.filter(h => h.id !== highlightId)
      notifyListeners()
      toast.success('Highlight deleted')
    } catch (error: any) {
      toast.error('Failed to delete highlight')
    }
  }, [])

  return {
    createStory,
    createHighlight,
    getUserHighlights,
    getUserStories,
    deleteHighlight,
    isCreating,
    highlights: mockHighlights,
    stories: mockStories
  }
}