export interface Tweet {
  id: string
  content: string
  author_id: string
  created_at: string
  updated_at: string
  likes_count: number
  retweets_count: number
  replies_count: number
  author?: Profile
  isLiked?: boolean
  isRetweeted?: boolean
}

export interface Profile {
  id: string
  username: string
  display_name: string
  bio?: string
  avatar_url?: string
  banner_url?: string
  followers_count: number
  following_count: number
  tweets_count: number
  created_at: string
  updated_at: string
}

export interface Like {
  id: string
  user_id: string
  tweet_id: string
  created_at: string
}

export interface Follow {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read: boolean
}

let currentUser: Profile | null = null
let profiles: Profile[] = []
let tweets: Tweet[] = []
const likes: Like[] = []
const follows: Follow[] = []
const messages: Message[] = []

const initializeMockData = () => {
  if (profiles.length === 0) {
    profiles = [
      {
        id: 'user-1',
        username: 'phumeh',
        display_name: 'Phumeh',
        bio: 'Creator of this Twitter clone',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Phumeh',
        followers_count: 1250,
        following_count: 340,
        tweets_count: 89,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    tweets = [
      {
        id: 'tweet-1',
        content: 'Just launched my Twitter clone! Built with React and TypeScript',
        author_id: 'user-1',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        likes_count: 42,
        retweets_count: 12,
        replies_count: 8,
        author: profiles[0],
      },
    ]
  }
  
  // Load any stored profiles from localStorage
  const storedProfiles = localStorage.getItem('allProfiles')
  if (storedProfiles) {
    const parsed = JSON.parse(storedProfiles)
    // Merge with existing profiles, avoiding duplicates
    parsed.forEach((profile: Profile) => {
      if (!profiles.find(p => p.id === profile.id)) {
        profiles.push(profile)
      }
    })
  }
}

export const signUp = async (email: string, password: string, username: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Initialize data first
  initializeMockData()
  
  const newUser: Profile = {
    id: `user-${Date.now()}`,
    username,
    display_name: username,
    bio: '',
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    followers_count: 0,
    following_count: 0,
    tweets_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  profiles.push(newUser)
  currentUser = newUser
  
  // Store both current user and all profiles
  localStorage.setItem('currentUser', JSON.stringify(newUser))
  localStorage.setItem('allProfiles', JSON.stringify(profiles))
  
  return { data: { user: newUser }, error: null }
}

export const signIn = async (email: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  initializeMockData()
  currentUser = profiles[0]
  localStorage.setItem('currentUser', JSON.stringify(currentUser))
  
  return { data: { user: currentUser }, error: null }
}

export const signOut = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  currentUser = null
  localStorage.removeItem('currentUser')
  return { error: null }
}

export const getCurrentUser = async () => {
  const stored = localStorage.getItem('currentUser')
  console.log('getCurrentUser - stored:', stored)
  if (stored) {
    currentUser = JSON.parse(stored)
    initializeMockData()
    console.log('getCurrentUser - returning:', currentUser)
  }
  return currentUser
}

export const getProfile = async (userId: string): Promise<Profile | null> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  initializeMockData()
  return profiles.find(p => p.id === userId) || null
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const profile = profiles.find(p => p.id === userId)
  if (profile) {
    Object.assign(profile, updates, { updated_at: new Date().toISOString() })
    if (currentUser?.id === userId) {
      currentUser = profile
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
    }
  }
  return { data: profile, error: null }
}

export const getTweets = async (limit = 20, offset = 0): Promise<Tweet[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  initializeMockData()
  return tweets.slice(offset, offset + limit)
}

export const createTweet = async (content: string, authorId: string) => {
  await new Promise(resolve => setTimeout(resolve, 400))
  
  const author = profiles.find(p => p.id === authorId)
  const newTweet: Tweet = {
    id: `tweet-${Date.now()}`,
    content,
    author_id: authorId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    likes_count: 0,
    retweets_count: 0,
    replies_count: 0,
    author,
  }
  
  tweets.unshift(newTweet)
  if (author) author.tweets_count++
  
  return { data: newTweet, error: null }
}

export const deleteTweet = async (tweetId: string) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const index = tweets.findIndex(t => t.id === tweetId)
  if (index !== -1) {
    const tweet = tweets[index]
    const author = profiles.find(p => p.id === tweet.author_id)
    if (author) author.tweets_count--
    tweets.splice(index, 1)
  }
  return { error: null }
}

export const likeTweet = async (tweetId: string, userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const like: Like = {
    id: `like-${Date.now()}`,
    user_id: userId,
    tweet_id: tweetId,
    created_at: new Date().toISOString(),
  }
  
  likes.push(like)
  const tweet = tweets.find(t => t.id === tweetId)
  if (tweet) {
    tweet.likes_count++
    tweet.isLiked = true
  }
  
  return { data: like, error: null }
}

export const unlikeTweet = async (tweetId: string, userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const index = likes.findIndex(l => l.tweet_id === tweetId && l.user_id === userId)
  if (index !== -1) {
    likes.splice(index, 1)
    const tweet = tweets.find(t => t.id === tweetId)
    if (tweet) {
      tweet.likes_count = Math.max(0, tweet.likes_count - 1)
      tweet.isLiked = false
    }
  }
  
  return { error: null }
}

export const getTweetLikes = async (tweetId: string): Promise<Like[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return likes.filter(l => l.tweet_id === tweetId)
}

export const followUser = async (followerId: string, followingId: string) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const follow: Follow = {
    id: `follow-${Date.now()}`,
    follower_id: followerId,
    following_id: followingId,
    created_at: new Date().toISOString(),
  }
  
  follows.push(follow)
  
  const follower = profiles.find(p => p.id === followerId)
  const following = profiles.find(p => p.id === followingId)
  if (follower) follower.following_count++
  if (following) following.followers_count++
  
  return { data: follow, error: null }
}

export const unfollowUser = async (followerId: string, followingId: string) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const index = follows.findIndex(f => f.follower_id === followerId && f.following_id === followingId)
  if (index !== -1) {
    follows.splice(index, 1)
    
    const follower = profiles.find(p => p.id === followerId)
    const following = profiles.find(p => p.id === followingId)
    if (follower) follower.following_count = Math.max(0, follower.following_count - 1)
    if (following) following.followers_count = Math.max(0, following.followers_count - 1)
  }
  
  return { error: null }
}

export const getFollowers = async (userId: string): Promise<Follow[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return follows.filter(f => f.following_id === userId)
}

export const getFollowing = async (userId: string): Promise<Follow[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return follows.filter(f => f.follower_id === userId)
}

export const getMessages = async (userId1: string, userId2: string): Promise<Message[]> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return messages.filter(m => 
    (m.sender_id === userId1 && m.receiver_id === userId2) ||
    (m.sender_id === userId2 && m.receiver_id === userId1)
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
}

export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const message: Message = {
    id: `msg-${Date.now()}`,
    sender_id: senderId,
    receiver_id: receiverId,
    content,
    created_at: new Date().toISOString(),
    read: false,
  }
  
  messages.push(message)
  return { data: message, error: null }
}

initializeMockData()
