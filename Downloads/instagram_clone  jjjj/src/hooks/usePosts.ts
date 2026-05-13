import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import { mockPosts } from '@/data/index'
import { Post } from '@/lib/index'

// Supabase imports (will be used when configured)
let getFeedPosts: any, getUserPosts: any, toggleLike: any, createPost: any, deletePostApi: any
try {
  const postsApi = require('@/api/posts')
  getFeedPosts = postsApi.getFeedPosts
  getUserPosts = postsApi.getUserPosts
  toggleLike = postsApi.toggleLike
  createPost = postsApi.createPost
  deletePostApi = postsApi.deletePost
} catch (error) {
  // Supabase API not available
}

// Global state for mock data
let globalPostsState: Post[] = [...mockPosts]
const listeners = new Set<(posts: Post[]) => void>()

const notifyListeners = () => {
  const updatedPosts = [...globalPostsState]
  listeners.forEach((listener) => listener(updatedPosts))
}

export const usePosts = () => {
  const { user, isSupabaseConfigured } = useAuth()
  const queryClient = useQueryClient()
  const [mockPosts, setMockPosts] = useState<Post[]>(globalPostsState)

  // Listen to mock data changes
  useEffect(() => {
    if (!isSupabaseConfigured) {
      const handler = (newPosts: Post[]) => setMockPosts(newPosts)
      listeners.add(handler)
      return () => {
        listeners.delete(handler)
      }
    }
  }, [isSupabaseConfigured])

  // Supabase queries (only when configured)
  const supabaseFeedQuery = useQuery({
    queryKey: ['posts', 'feed'],
    queryFn: () => getFeedPosts?.(0, 20) || [],
    enabled: !!user && isSupabaseConfigured && !!getFeedPosts
  })

  const getUserPostsQuery = useCallback((userId: string) => {
    if (!isSupabaseConfigured) {
      return {
        data: globalPostsState.filter(post => post.userId === userId),
        isLoading: false,
        error: null
      }
    }

    return useQuery({
      queryKey: ['posts', 'user', userId],
      queryFn: () => getUserPosts?.(userId) || [],
      enabled: !!userId && !!getUserPosts
    })
  }, [isSupabaseConfigured])

  // Create post mutation (Supabase)
  const createPostMutation = useMutation({
    mutationFn: (postData: any) => createPost?.(postData) || Promise.resolve({}),
    onSuccess: () => {
      if (isSupabaseConfigured) {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
    },
    enabled: isSupabaseConfigured && !!createPost
  })

  // Toggle like mutation (Supabase)
  const toggleLikeMutation = useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) => 
      toggleLike?.(postId, userId) || Promise.resolve(false),
    onMutate: async ({ postId }) => {
      if (isSupabaseConfigured) {
        await queryClient.cancelQueries({ queryKey: ['posts'] })
        const previousPosts = queryClient.getQueryData(['posts', 'feed'])
        
        queryClient.setQueryData(['posts', 'feed'], (old: any[] = []) =>
          old.map(post =>
            post.id === postId
              ? {
                  ...post,
                  is_liked: !post.is_liked,
                  likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1
                }
              : post
          )
        )
        
        return { previousPosts }
      }
    },
    onError: (err, variables, context) => {
      if (isSupabaseConfigured && context?.previousPosts) {
        queryClient.setQueryData(['posts', 'feed'], context.previousPosts)
      }
    },
    onSettled: () => {
      if (isSupabaseConfigured) {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
    },
    enabled: isSupabaseConfigured && !!toggleLike
  })

  // Mock data functions
  const likePostMock = useCallback((postId: string) => {
    globalPostsState = globalPostsState.map((post) => {
      if (post.id === postId) {
        const isLiked = !post.isLiked
        return {
          ...post,
          isLiked,
          likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
        }
      }
      return post
    })
    notifyListeners()
  }, [])

  const savePostMock = useCallback((postId: string) => {
    globalPostsState = globalPostsState.map((post) =>
      post.id === postId ? { ...post, isSaved: !post.isSaved } : post
    )
    notifyListeners()
  }, [])

  const addCommentMock = useCallback((postId: string, text: string) => {
    if (!text.trim()) return
    
    globalPostsState = globalPostsState.map((post) =>
      post.id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post
    )
    notifyListeners()
  }, [])

  const deletePostMock = useCallback((postId: string) => {
    globalPostsState = globalPostsState.filter((post) => post.id !== postId)
    notifyListeners()
  }, [])

  // Main functions
  const likePost = useCallback((postId: string) => {
    if (!user) return
    
    if (isSupabaseConfigured) {
      toggleLikeMutation.mutate({ postId, userId: user.id })
    } else {
      likePostMock(postId)
    }
  }, [user, isSupabaseConfigured, toggleLikeMutation, likePostMock])

  const createNewPost = useCallback((postData: any) => {
    if (isSupabaseConfigured) {
      return createPostMutation.mutateAsync(postData)
    } else {
      // Mock create post
      const newPost: Post = {
        id: `p${Date.now()}`,
        userId: user?.id || 'mock-user-id',
        user: {
          id: user?.id || 'mock-user-id',
          username: user?.user_metadata?.username || 'phumeh_mjoli',
          fullName: user?.user_metadata?.full_name || 'Phumeh Mjoli',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
          bio: '',
          followerCount: 0,
          followingCount: 0,
          postCount: 0,
          isVerified: false,
          isPrivate: false
        },
        type: postData.type || 'image',
        mediaUrls: postData.media_urls || [],
        caption: postData.caption || '',
        hashtags: postData.hashtags || [],
        location: postData.location,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
        isSaved: false
      }
      
      globalPostsState = [newPost, ...globalPostsState]
      notifyListeners()
      return Promise.resolve(newPost)
    }
  }, [user, isSupabaseConfigured, createPostMutation])

  const deletePost = useCallback(async (postId: string) => {
    if (isSupabaseConfigured && deletePostApi) {
      await deletePostApi(postId)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    } else {
      deletePostMock(postId)
    }
  }, [isSupabaseConfigured, deletePostMock, queryClient])

  // Computed values
  const posts = isSupabaseConfigured ? (supabaseFeedQuery.data || []) : mockPosts
  const reels = useMemo(() => posts.filter((post: any) => post.type === 'video'), [posts])
  const savedPosts = useMemo(() => posts.filter((post: any) => post.isSaved), [posts])

  const getPostsByUsername = useCallback(
    (username: string) => {
      return posts.filter((post: any) => post.user?.username === username)
    },
    [posts]
  )

  const getPostsByUserId = useCallback(
    (userId: string) => {
      return posts.filter((post: any) => post.userId === userId || post.user_id === userId)
    },
    [posts]
  )

  return {
    posts,
    feedPosts: posts,
    reels,
    savedPosts,
    feedLoading: isSupabaseConfigured ? supabaseFeedQuery.isLoading : false,
    feedError: isSupabaseConfigured ? supabaseFeedQuery.error : null,
    refetchFeed: isSupabaseConfigured ? supabaseFeedQuery.refetch : () => {},
    getUserPostsQuery,
    likePost,
    savePost: savePostMock,
    addComment: addCommentMock,
    createNewPost,
    deletePost,
    getPostsByUsername,
    getPostsByUserId,
    isCreatingPost: isSupabaseConfigured ? createPostMutation.isPending : false,
    isLiking: isSupabaseConfigured ? toggleLikeMutation.isPending : false
  }
}