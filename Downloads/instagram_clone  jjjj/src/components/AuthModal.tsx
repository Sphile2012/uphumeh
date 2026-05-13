import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Instagram, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        })
        onClose()
      } else {
        if (!formData.username.trim()) {
          toast.error('Username is required')
          return
        }
        if (!formData.fullName.trim()) {
          toast.error('Full name is required')
          return
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          return
        }
        
        await register({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          fullName: formData.fullName
        })
        onClose()
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      // Error is already handled by the auth hook with toast
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Instagram className="w-12 h-12" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {isLogin ? 'Welcome back' : 'Join Phume'}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Sign in with any email and password (demo mode)' 
                  : 'Create an account to start sharing'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <Button
                    variant="link"
                    className="p-0 ml-1 h-auto font-semibold"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </Button>
                </p>
              </div>

              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full mb-2"
                >
                  Continue as Guest
                </Button>
                
                {!isLogin && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setFormData({
                        email: 'phume@example.com',
                        password: 'password123',
                        username: 'phume_user',
                        fullName: 'Phume User'
                      })
                    }}
                    className="w-full text-sm text-muted-foreground"
                  >
                    Fill Sample Data
                  </Button>
                )}
                
                {isLogin && (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setFormData({
                          email: 'phumeh@phume.com',
                          password: 'demo123',
                          username: '',
                          fullName: ''
                        })
                      }}
                      className="w-full text-sm text-muted-foreground"
                    >
                      Use Phumeh Account
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Demo mode: Any email and password will work
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}