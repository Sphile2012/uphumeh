import { useState, useEffect, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface Profile {
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

export interface SignInData {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  username: string
  fullName: string
}

// Mock user for development when Supabase is not configured
const MOCK_USER: User = {
  id: 'mock-user-id',
  email: 'phumeh@phume.com',
  app_metadata: {},
  user_metadata: {
    username: 'phumeh_mjoli',
    full_name: 'Phumeh Mjoli'
  },
  aud: 'authenticated',
  created_at: new Date().toISOString()
} as User

const MOCK_PROFILE: Profile = {
  id: 'mock-user-id',
  username: 'phumeh_mjoli',
  full_name: 'Phumeh Mjoli',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  bio: 'Creator of Phume 📸 Building the future of social media. Welcome to my Instagram clone!',
  website: 'https://phume.app',
  follower_count: 2840,
  following_count: 450,
  post_count: 124,
  is_verified: true,
  is_private: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)

  useEffect(() => {
    const checkSupabaseConfig = async () => {
      try {
        // Try to get session to test if Supabase is working
        const { data, error } = await supabase.auth.getSession()
        
        // Check if we have a real Supabase URL (not demo)
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const isRealSupabase = supabaseUrl && 
          !supabaseUrl.includes('demo') && 
          !supabaseUrl.includes('placeholder') &&
          !supabaseUrl.includes('your-project')

        if (!isRealSupabase || error) {
          console.log('Using demo mode - Supabase not configured')
          setIsSupabaseConfigured(false)
          setUser(MOCK_USER)
          setProfile(MOCK_PROFILE)
          setLoading(false)
          return
        }

        setIsSupabaseConfigured(true)
        
        if (data.session?.user) {
          setUser(data.session.user)
          
          // Try to get profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single()
          
          if (profileData) {
            setProfile(profileData)
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.log('Supabase not configured, using demo mode:', error)
        setIsSupabaseConfigured(false)
        setUser(MOCK_USER)
        setProfile(MOCK_PROFILE)
        setLoading(false)
      }
    }

    checkSupabaseConfig()

    // Listen for auth changes only if Supabase is configured
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isSupabaseConfigured) return
        
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (profileData) {
            setProfile(profileData)
          }
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (data: SignInData) => {
    if (!isSupabaseConfigured) {
      // Demo mode - accept any login details
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      
      // Accept any email and password in demo mode
      if (data.email && data.password) {
        // Create user based on provided email
        const mockUser = {
          ...MOCK_USER,
          email: data.email,
          user_metadata: {
            username: data.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_'),
            full_name: data.email.split('@')[0].charAt(0).toUpperCase() + data.email.split('@')[0].slice(1)
          }
        }
        
        const mockProfile = {
          ...MOCK_PROFILE,
          username: data.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_'),
          full_name: data.email.split('@')[0].charAt(0).toUpperCase() + data.email.split('@')[0].slice(1),
          bio: `Welcome to Phume! I'm ${data.email.split('@')[0]} 👋`
        }
        
        setUser(mockUser)
        setProfile(mockProfile)
        toast.success('Welcome to Phume!')
        setLoading(false)
        return { user: mockUser, session: null }
      } else {
        setLoading(false)
        throw new Error('Please enter both email and password')
      }
    }

    setLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error
      toast.success('Welcome back!')
      return authData
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }, [isSupabaseConfigured])

  const register = useCallback(async (data: SignUpData): Promise<any> => {
    if (!isSupabaseConfigured) {
      // Demo mode - simulate registration
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
      
      const newMockUser = {
        ...MOCK_USER,
        email: data.email,
        user_metadata: {
          username: data.username,
          full_name: data.fullName
        }
      }
      
      const newMockProfile = {
        ...MOCK_PROFILE,
        username: data.username,
        full_name: data.fullName,
        bio: `Welcome to Phume! I'm ${data.fullName} 👋`
      }
      
      setUser(newMockUser)
      setProfile(newMockProfile)
      toast.success('Account created successfully!')
      setLoading(false)
      return { user: newMockUser, session: null }
    }

    setLoading(true)
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            full_name: data.fullName,
          },
        },
      })

      if (error) throw error
      toast.success('Account created! Check your email to verify.')
      return authData
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }, [isSupabaseConfigured])

  const logout = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setUser(null)
      setProfile(null)
      toast.success('Logged out successfully')
      return
    }

    setLoading(true)
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
    } catch (error: any) {
      toast.error(error.message || 'Logout failed')
      throw error
    } finally {
      setLoading(false)
    }
  }, [isSupabaseConfigured])

  return {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isSupabaseConfigured
  }
}