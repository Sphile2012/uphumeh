import { useState, useEffect } from 'react'
import { getCurrentUser, getProfile, signOut, Profile } from '@/api/backend'

export const useAuth = () => {
  // Return mock user data for demo purposes
  const mockProfile: Profile = {
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
  }

  const mockUser = { id: 'demo-user' }

  const logout = async () => {
    // Demo logout - just reload page
    window.location.reload()
  }

  return {
    user: mockUser,
    profile: mockProfile,
    loading: false,
    isAuthenticated: true,
    logout,
  }
}
