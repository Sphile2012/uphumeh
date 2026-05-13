import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from './AuthModal'
import { Button } from './ui/button'
import { Twitter } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  // Always show the Twitter interface - no authentication required
  return <>{children}</>
}
