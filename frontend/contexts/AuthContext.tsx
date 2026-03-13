'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '@/lib/api-config'
import toast from 'react-hot-toast'
import { syncUpvoteLogin, syncUpvoteLogout } from '@/lib/upvote-sync'

interface User {
  id: number
  email: string
  username: string
  full_name?: string
  profile_picture?: string
  is_active: boolean
  is_verified: boolean
  is_premium: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, username: string, password: string, fullName?: string) => Promise<boolean>
  googleAuth: (googleToken: string) => Promise<boolean>
  logout: () => void
  refreshToken: () => Promise<boolean>
  updateUser: (userData: Partial<User>) => void
  forceRestoreAuth: () => boolean
  refreshUser: () => Promise<User | null>
  requestPasswordReset: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastLoginTime, setLastLoginTime] = useState<number | null>(null)

  const isAuthenticated = !!user && !!token

  // Preload usage stats function
  const preloadUsageStats = async (userData: User) => {
    try {
      // console.log('🚀 Preloading usage stats for user:', userData.username)
      const cacheKey = `usage-stats-${userData.id}`

      // Check if we already have cached data
      const existingCache = sessionStorage.getItem(`cache-${cacheKey}`)
      if (existingCache) {
        // console.log('📦 Usage stats already cached, skipping preload')
        return
      }

      // Preload usage stats
      const response = await axios.get(`${API_URL}/api/v1/auth/usage-stats`, {
        timeout: 5000
      })

      // Store in cache with long TTL
      const cacheData = {
        data: response.data,
        timestamp: Date.now()
      }
      sessionStorage.setItem(`cache-${cacheKey}`, JSON.stringify(cacheData))
      // console.log('✅ Usage stats preloaded and cached')

    } catch (error) {
      // console.log('⚠️ Failed to preload usage stats:', error)
      // Don't throw error, just log it
    }
  }

  // Preload content history function
  const preloadContentHistory = async (userData: User) => {
    try {
      // console.log('🚀 Preloading content history for user:', userData.username)
      const cacheKey = `dashboard-content-history-${userData.id}`

      // Check if we already have cached data
      const existingCache = sessionStorage.getItem(`cache-${cacheKey}`)
      if (existingCache) {
        // console.log('📦 Content history already cached, skipping preload')
        return
      }

      // Preload content history (available for all users)
      const response = await axios.get(`${API_URL}/api/v1/content/history`, {
        timeout: 5000
      })

      // Store in cache with long TTL (30 minutes)
      const cacheData = {
        data: response.data || [],
        timestamp: Date.now()
      }
      sessionStorage.setItem(`cache-${cacheKey}`, JSON.stringify(cacheData))
      // console.log('✅ Content history preloaded and cached')

    } catch (error) {
      // console.log('⚠️ Failed to preload content history:', error)
      // Don't throw error, just log it
    }
  }

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('access_token')
        const storedRefreshToken = localStorage.getItem('refresh_token')
        const storedUser = localStorage.getItem('user')

        // console.log('🔍 Initializing auth state...')
        // console.log('📦 Stored token exists:', !!storedToken)
        // console.log('📦 Stored user exists:', !!storedUser)

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setToken(storedToken)
          setRefreshTokenValue(storedRefreshToken)
          setUser(parsedUser)
          syncUpvoteLogin(parsedUser)

          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`

          // console.log('✅ Auth state restored from localStorage')

          // Preload usage stats immediately after auth restoration
          setTimeout(() => {
            preloadUsageStats(parsedUser)
            preloadContentHistory(parsedUser)
          }, 100)

          // Only verify token occasionally and be more lenient with failures
          try {
            // Only verify token once per session to avoid excessive calls
            const lastVerified = sessionStorage.getItem('token_last_verified')
            const now = Date.now()
            const oneHour = 60 * 60 * 1000 // Increased to 1 hour

            if (!lastVerified || (now - parseInt(lastVerified)) > oneHour) {
              // console.log('🔄 Verifying token (last verified over 1 hour ago)...')
              const meResponse = await axios.get(`${API_URL}/api/v1/auth/me`, {
                timeout: 5000 // 5 second timeout
              })
              sessionStorage.setItem('token_last_verified', now.toString())
              // console.log('✅ Token verification successful')

              // Update user data with fresh data from server
              const freshUserData = meResponse.data
              setUser(freshUserData)
              localStorage.setItem('user', JSON.stringify(freshUserData))
              // console.log('🔄 User data refreshed from server')
            } else {
              // console.log('✅ Token verification skipped (recently verified)')
            }
          } catch (error: any) {
            // console.log('⚠️ Token verification failed:', error.response?.status, error.message)

            // Only clear auth for specific error conditions
            if (error.response?.status === 401 || error.response?.status === 403) {
              // Don't clear auth immediately after login (within 30 seconds)
              const timeSinceLogin = lastLoginTime ? Date.now() - lastLoginTime : Infinity
              const thirtySeconds = 30 * 1000

              if (timeSinceLogin < thirtySeconds) {
                // console.log('⚠️ Token verification failed but user just logged in, keeping auth state')
                return // Don't clear auth immediately after login
              }

              // console.log('🔄 Token appears invalid (401/403), attempting refresh...')

              // Try to refresh token first
              if (storedRefreshToken) {
                const refreshed = await refreshToken()
                if (!refreshed) {
                  // console.log('❌ Token refresh failed, clearing auth')
                  clearAuthData()
                } else {
                  // console.log('✅ Token refreshed successfully')
                }
              } else {
                // console.log('❌ No refresh token available, clearing auth')
                clearAuthData()
              }
            } else {
              // For network errors, server errors, etc., keep the user logged in
              // console.log('⚠️ Token verification failed due to network/server issue, keeping user logged in')
              // Don't clear auth data - could be temporary network issue
            }
          }
        } else {
          // console.log('📭 No stored auth data found')
        }
      } catch (error) {
        // console.error('❌ Error initializing auth:', error)
        // Don't automatically clear auth data on initialization errors
        // console.log('⚠️ Auth initialization error, but keeping any existing auth state')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', password)

      const response = await axios.post(
        `${API_URL}/api/v1/auth/login`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      const { access_token, refresh_token, user: userData } = response.data

      // Store tokens and user data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user', JSON.stringify(userData))

      setToken(access_token)
      setRefreshTokenValue(refresh_token)
      setUser(userData)
      setLastLoginTime(Date.now()) // Track login time

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      // Preload usage stats
      setTimeout(() => {
        preloadUsageStats(userData)
        preloadContentHistory(userData)
      }, 100)

      syncUpvoteLogin(userData)

      toast.success('IDENTITY_RECOGNIZED')
      return true
    } catch (error: any) {
      // console.error('Login error:', error)
      let message = 'Login failed'
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          message = error.response.data.detail
        } else if (Array.isArray(error.response.data.detail)) {
          message = error.response.data.detail[0]?.msg || message
        } else if (typeof error.response.data.detail === 'object') {
          message = error.response.data.detail.message || message
        }
      }
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const googleAuth = async (googleToken: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      // console.log('🔄 Starting Google Auth with token:', googleToken?.substring(0, 50) + '...')

      const response = await axios.post(
        `${API_URL}/api/v1/auth/google`,
        {
          token: googleToken,
        }
      )

      // console.log('✅ Google Auth Response:', response.data)
      const { access_token, refresh_token, user: userData } = response.data

      // console.log('👤 User data from Google auth:', userData)
      // console.log('🖼️ Profile picture from response:', userData.profile_picture)

      // Store tokens and user data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user', JSON.stringify(userData))

      setToken(access_token)
      setRefreshTokenValue(refresh_token)
      setUser(userData)
      setLastLoginTime(Date.now()) // Track login time

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      // Preload usage stats
      setTimeout(() => {
        preloadUsageStats(userData)
        preloadContentHistory(userData)
      }, 100)

      syncUpvoteLogin(userData)

      toast.success('ENGINE_SYNC_COMPLETE')
      return true
    } catch (error: any) {
      // console.error('❌ Google auth error:', error)
      let message = 'Google authentication failed'
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          message = error.response.data.detail
        } else if (Array.isArray(error.response.data.detail)) {
          message = error.response.data.detail[0]?.msg || message
        } else if (typeof error.response.data.detail === 'object') {
          message = error.response.data.detail.message || message
        }
      }
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    email: string,
    username: string,
    password: string,
    fullName?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true)

      const response = await axios.post(
        `${API_URL}/api/v1/auth/register`,
        {
          email,
          username,
          password,
          full_name: fullName,
        }
      )

      const { access_token, refresh_token, user: userData } = response.data

      // If no tokens were provided (e.g., local user needs verification),
      // we don't log them in yet.
      if (!access_token || !refresh_token) {
        // console.log('📝 Registration successful, but email verification required.')
        return true
      }

      // Store tokens and user data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('user', JSON.stringify(userData))

      setToken(access_token)
      setRefreshTokenValue(refresh_token)
      setUser(userData)
      setLastLoginTime(Date.now()) // Track login time

      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      // Preload usage stats
      setTimeout(() => {
        preloadUsageStats(userData)
      }, 100)

      syncUpvoteLogin(userData)

      toast.success('IDENTITY_REGISTERED_SUCCESS')
      return true
    } catch (error: any) {
      // console.error('Registration error:', error)
      let message = 'Registration failed'
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          message = error.response.data.detail
        } else if (Array.isArray(error.response.data.detail)) {
          message = error.response.data.detail[0]?.msg || message
        } else if (typeof error.response.data.detail === 'object') {
          message = error.response.data.detail.message || message
        }
      }
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!refreshTokenValue) return false

      const response = await axios.post(
        `${API_URL}/api/v1/auth/refresh`,
        {
          refresh_token: refreshTokenValue,
        }
      )

      const { access_token } = response.data

      localStorage.setItem('access_token', access_token)
      setToken(access_token)

      // Update default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`

      return true
    } catch (error) {
      // console.error('Token refresh error:', error)
      return false
    }
  }

  const clearAuthData = () => {
    // Clear stored data
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')

    // Clear state
    setToken(null)
    setRefreshTokenValue(null)
    setUser(null)
    setLastLoginTime(null)

    syncUpvoteLogout()

    // Remove authorization header
    delete axios.defaults.headers.common['Authorization']

    // Clear all cached usage stats
    if (typeof window !== 'undefined') {
      const keysToRemove: string[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith('cache-usage-stats-')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key))
    }
  }

  const logout = () => {
    // Only show success message if user was actually logged in
    const wasLoggedIn = !!user && !!token

    clearAuthData()

    // Only show logout success if user was actually authenticated
    if (wasLoggedIn) {
      toast.success('SESSION_TERMINATED')
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const forceRestoreAuth = () => {
    // console.log('🔄 Force restoring auth from localStorage...')
    const storedToken = localStorage.getItem('access_token')
    const storedRefreshToken = localStorage.getItem('refresh_token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setToken(storedToken)
      setRefreshTokenValue(storedRefreshToken)
      setUser(parsedUser)
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      syncUpvoteLogin(parsedUser)
      // console.log('✅ Auth restored from localStorage')
      return true
    }
    // console.log('❌ No auth data to restore')
    return false
  }

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // Only handle 401 errors for authenticated requests
        if (error.response?.status === 401 && !originalRequest._retry && token) {
          originalRequest._retry = true

          // console.log('🔄 401 error detected, attempting token refresh...')
          const refreshed = await refreshToken()
          if (refreshed) {
            // console.log('✅ Token refreshed, retrying request')
            // Get the fresh token from storage
            const newToken = localStorage.getItem('access_token')
            if (newToken) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`
              return axios(originalRequest)
            }
          } else {
            // console.log('❌ Token refresh failed, logging out user')
            clearAuthData()
            toast.error('SESSION_EXPIRED_RE_AUTH_REQUIRED')
          }
        }

        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [token, refreshTokenValue])

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    googleAuth,
    logout,
    refreshToken,
    updateUser,
    forceRestoreAuth,
    refreshUser: async () => {
      try {
        if (!token) return null
        const response = await axios.get(`${API_URL}/api/v1/auth/me`)
        const freshUser = response.data
        setUser(freshUser)
        localStorage.setItem('user', JSON.stringify(freshUser))
        sessionStorage.setItem('token_last_verified', Date.now().toString())
        return freshUser
      } catch (error) {
        console.error('Failed to refresh user:', error)
        return null
      }
    },
    requestPasswordReset: async (email: string) => {
      try {
        setIsLoading(true)
        await axios.post(`${API_URL}/api/v1/auth/request-password-reset`, { email })
        toast.success('IF_ACCOUNT_EXISTS_EMAIL_SENT')
        return true
      } catch (error: any) {
        // Even if it fails, we typically don't show specific error for security, 
        // but if the API returns a generic success for all requests, we might never get here unless network error.
        console.error('Password reset request error:', error)
        toast.error('FAILED_TO_SEND_RESET_LINK')
        return false
      } finally {
        setIsLoading(false)
      }
    }
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}