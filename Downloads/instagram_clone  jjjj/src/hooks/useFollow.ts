import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

// Mock follow state for demo mode
let mockFollowState: Record<string, boolean> = {}

export const useFollow = () => {
  const { user, isSupabaseConfigured } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const followUser = useCallback(async (targetUserId: string, targetUsername: string) => {
    if (!user) {
      toast.error('Please log in to follow users')
      return
    }

    setIsLoading(true)
    
    try {
      if (isSupabaseConfigured) {
        // TODO: Implement real Supabase follow
        const { followUser: followUserApi } = await import('@/api/follows')
        await followUserApi(user.id, targetUserId)
      } else {
        // Demo mode
        await new Promise(resolve => setTimeout(resolve, 500))
        mockFollowState[targetUserId] = true
      }
      
      toast.success(`Following ${targetUsername}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to follow user')
    } finally {
      setIsLoading(false)
    }
  }, [user, isSupabaseConfigured])

  const unfollowUser = useCallback(async (targetUserId: string, targetUsername: string) => {
    if (!user) return

    setIsLoading(true)
    
    try {
      if (isSupabaseConfigured) {
        // TODO: Implement real Supabase unfollow
        const { unfollowUser: unfollowUserApi } = await import('@/api/follows')
        await unfollowUserApi(user.id, targetUserId)
      } else {
        // Demo mode
        await new Promise(resolve => setTimeout(resolve, 500))
        mockFollowState[targetUserId] = false
      }
      
      toast.success(`Unfollowed ${targetUsername}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to unfollow user')
    } finally {
      setIsLoading(false)
    }
  }, [user, isSupabaseConfigured])

  const isFollowing = useCallback((targetUserId: string) => {
    if (isSupabaseConfigured) {
      // TODO: Implement real check
      return false
    }
    return mockFollowState[targetUserId] || false
  }, [isSupabaseConfigured])

  return {
    followUser,
    unfollowUser,
    isFollowing,
    isLoading
  }
}