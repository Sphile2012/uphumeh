import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTweets, createTweet, likeTweet, unlikeTweet, deleteTweet, Tweet } from '@/api/backend'
import { useAuth } from './useAuth'

export const useTweets = () => {
  // Mock tweets for demo
  const mockTweets: Tweet[] = [
    {
      id: 'tweet-1',
      content: 'Just launched my Twitter clone! Built with React, TypeScript, and lots of ☕. The responsive design looks amazing on both mobile and desktop! 🚀',
      author_id: 'demo-user',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      likes_count: 42,
      retweets_count: 12,
      replies_count: 8,
      author: {
        id: 'demo-user',
        username: 'phumeh',
        display_name: 'Phumeh',
        bio: 'Creator of this Twitter clone 🚀',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Phumeh',
        banner_url: '',
        followers_count: 1250,
        following_count: 340,
        tweets_count: 89,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: 'tweet-2',
      content: 'The mobile experience is buttery smooth! 📱 Swipe gestures, responsive layout, and dark mode support. This is how Twitter should feel on mobile.',
      author_id: 'user-2',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString(),
      likes_count: 28,
      retweets_count: 5,
      replies_count: 3,
      author: {
        id: 'user-2',
        username: 'techdev',
        display_name: 'Tech Developer',
        bio: 'Full-stack developer | React enthusiast',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechDev',
        banner_url: '',
        followers_count: 890,
        following_count: 210,
        tweets_count: 156,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      isLiked: true,
      isRetweeted: false,
    },
    {
      id: 'tweet-3',
      content: 'Love the attention to detail! The animations, the typography, the spacing - everything feels polished. Great work! 👏',
      author_id: 'user-3',
      created_at: new Date(Date.now() - 10800000).toISOString(),
      updated_at: new Date(Date.now() - 10800000).toISOString(),
      likes_count: 15,
      retweets_count: 2,
      replies_count: 1,
      author: {
        id: 'user-3',
        username: 'designer_jane',
        display_name: 'Jane Designer',
        bio: 'UI/UX Designer | Making the web beautiful',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        banner_url: '',
        followers_count: 567,
        following_count: 123,
        tweets_count: 234,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      isLiked: false,
      isRetweeted: false,
    },
  ]

  const queryClient = useQueryClient()

  // Mock mutations for demo
  const createTweetMutation = {
    mutateAsync: async ({ content }: { content: string; authorId: string }) => {
      // Simulate creating a tweet
      return { data: { id: 'new-tweet', content }, error: null }
    },
    isPending: false,
  }

  const likeTweetMutation = {
    mutateAsync: async ({ tweetId }: { tweetId: string; userId: string }) => {
      // Simulate liking
      return { data: {}, error: null }
    },
    isPending: false,
  }

  const unlikeTweetMutation = {
    mutateAsync: async ({ tweetId }: { tweetId: string; userId: string }) => {
      // Simulate unliking
      return { data: {}, error: null }
    },
    isPending: false,
  }

  const deleteTweetMutation = {
    mutateAsync: async (tweetId: string) => {
      // Simulate deleting
      return { data: {}, error: null }
    },
    isPending: false,
  }

  // Mock functions
  const postTweet = useCallback(async (content: string) => {
    if (!content.trim()) throw new Error('Tweet cannot be empty')
    if (content.length > 280) throw new Error('Tweet exceeds 280 characters')
    return createTweetMutation.mutateAsync({ content, authorId: 'demo-user' })
  }, [])

  const toggleLike = useCallback(async (tweetId: string, isLiked: boolean) => {
    if (isLiked) {
      return unlikeTweetMutation.mutateAsync({ tweetId, userId: 'demo-user' })
    } else {
      return likeTweetMutation.mutateAsync({ tweetId, userId: 'demo-user' })
    }
  }, [])

  const removeTweet = useCallback(async (tweetId: string) => {
    return deleteTweetMutation.mutateAsync(tweetId)
  }, [])

  const getTweetsByUserId = useCallback((userId: string) => {
    return mockTweets.filter((tweet) => tweet.author_id === userId)
  }, [])

  const getTweetById = useCallback((tweetId: string) => {
    return mockTweets.find((tweet) => tweet.id === tweetId)
  }, [])

  return {
    tweets: mockTweets,
    isLoading: false,
    error: null,
    postTweet,
    toggleLike,
    removeTweet,
    getTweetsByUserId,
    getTweetById,
    refetch: () => {},
    totalTweetsCount: mockTweets.length,
    isCreating: false,
    isLiking: false,
    isDeleting: false,
  }
}
