'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useAuth } from '../contexts/AuthContext'

// Declare global google object
declare global {
  interface Window {
    google: any
  }
}

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register' | 'forgot-password'
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    fullName: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSuccessAction, setIsSuccessAction] = useState(false) // Replaces isRegisteredSuccessfully
  const [mounted, setMounted] = useState(false)

  const { login, register, googleAuth, requestPasswordReset } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load Google Identity Services
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true

      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
          })
        }
      }

      // Only add script if it doesn't exist
      if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        document.head.appendChild(script)
      } else if (window.google) {
        // Script already loaded, just initialize
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        })
      }
    }
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleGoogleResponse = async (response: any) => {
    setIsGoogleLoading(true)
    try {
      if (response.credential) {
        const success = await googleAuth(response.credential)
        if (success) {
          onClose()
          setFormData({ email: '', username: '', password: '', fullName: '' })
          setErrors({})
        } else {
          console.error('❌ GoogleAuth returned false')
        }
      } else {
        console.error('❌ No credential in Google response')
      }
    } catch (error) {
      console.error('❌ Google auth error in AuthModal:', error)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleGoogleSignIn = () => {

    // Create Google OAuth URL for redirect flow (not popup)
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/google/callback`
    const scope = 'openid email profile'
    const responseType = 'code'
    // Generate a more robust state parameter
    const state = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`


    // Store the state in sessionStorage for verification
    sessionStorage.setItem('google_oauth_state', state)

    // Verify it was stored
    const storedState = sessionStorage.getItem('google_oauth_state')

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=${responseType}&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`


    // Redirect to Google OAuth in the same tab
    window.location.href = googleAuthUrl
  }

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    // Password validation (skip for forgot-password)
    if (mode !== 'forgot-password') {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain letters and numbers'
      }
    }

    // Username validation for registration
    if (mode === 'register') {
      if (!formData.username) {
        newErrors.username = 'Username is required'
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters'
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      let success = false

      if (mode === 'login') {
        success = await login(formData.email, formData.password)
      } else if (mode === 'register') {
        success = await register(
          formData.email,
          formData.username,
          formData.password,
          formData.fullName || undefined
        )
      } else if (mode === 'forgot-password') {
        success = await requestPasswordReset(formData.email)
      }

      if (success) {
        if (mode === 'register' || mode === 'forgot-password') {
          setIsSuccessAction(true)
        } else {
          onClose()
          setFormData({ email: '', username: '', password: '', fullName: '' })
          setErrors({})
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const switchMode = () => {
    if (mode === 'forgot-password') {
      setMode('login')
    } else {
      setMode(mode === 'login' ? 'register' : 'login')
    }
    setErrors({})
    setFormData({ email: '', username: '', password: '', fullName: '' })
    setIsSuccessAction(false)
  }

  if (isSuccessAction) {
    return createPortal(
      <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[999999] flex items-center justify-center p-4">
        <div className="bg-zinc-50 dark:bg-[#020617] border border-zinc-200 dark:border-slate-800 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 max-w-lg w-full shadow-4xl text-center group relative overflow-hidden">
          {/* Blueprint Overlay */}
          <div className="absolute inset-0 bg-grid-blueprint-light opacity-5 pointer-events-none" />

          {/* Kinetic Scanline */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scanline pointer-events-none" />

          <div className="relative z-10">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20 group-hover:rotate-6 transition-transform duration-500">
              <Mail className="w-10 h-10 text-indigo-500" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 mb-6">
              INITIALIZE_DISPATCH_SUCCESS
            </div>

            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tighter">Check your email</h2>
            <p className="text-zinc-500 dark:text-slate-400 mb-10 text-sm font-medium leading-relaxed">
              We've dispatched a {mode === 'register' ? 'verification' : 'password reset'} link to <br />
              <span className="font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">{formData.email}</span>.
              <br />Authorize via external link.
            </p>

            <button
              onClick={() => {
                onClose();
                setIsSuccessAction(false);
                setFormData({ email: '', username: '', password: '', fullName: '' });
                setMode('login'); // Reset mode to login
              }}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all duration-300 shadow-2xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] text-xs"
            >
              Acknowledge_Receipt
            </button>

            <button
              onClick={() => {
                setIsSuccessAction(false);
                setMode('login');
              }}
              className="mt-6 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:text-indigo-700 transition-colors"
            >
              Return_to_Authentication
            </button>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  return createPortal(
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[999999] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-zinc-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 max-w-lg w-full max-h-[calc(100dvh-2rem)] overflow-y-auto shadow-4xl group relative overflow-hidden hide-scrollbar">
        {/* Blueprint Overlay */}
        <div className="absolute inset-0 bg-grid-blueprint-light opacity-5 pointer-events-none" />

        {/* Kinetic Scanline */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scanline pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 space-y-6 mb-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20">
              <Lock className="w-3.5 h-3.5" />
              {mode === 'login' ? 'AUTH_ACCESS' : mode === 'forgot-password' ? 'RECOVERY_PROTOCOL' : 'INITIALIZE_PROTOCOL'}
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none break-words">
              {mode === 'login' ? 'Welcome_Back' : mode === 'forgot-password' ? 'Reset_Auth' : 'Create_Account'}
            </h2>
            <div className="h-1.5 w-16 bg-indigo-600 rounded-full"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
              Parameter: Email
            </label>
            <div className="relative group/input">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-12 pr-4 py-4 bg-slate-100/50 dark:bg-white/5 border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all font-medium ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                  }`}
                placeholder="system@builder.io"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-2 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Username (Register only) */}
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                Parameter: Username
              </label>
              <div className="relative group/input">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors w-5 h-5" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-slate-100/50 dark:bg-white/5 border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all font-medium ${errors.username ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  placeholder="builder_01"
                  disabled={isSubmitting}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-2 ml-1">{errors.username}</p>
              )}
            </div>
          )}

          {/* Password */}
          {mode !== 'forgot-password' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Parameter: Security_Key
                </label>
              </div>

              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 bg-slate-100/50 dark:bg-white/5 border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all font-medium ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  placeholder="********"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Forgot Password Link - Only in Login mode */}
              {mode === 'login' && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot-password');
                      setErrors({});
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-500 transition-colors"
                  >
                    Forgot_Security_Key?
                  </button>
                </div>
              )}

              {errors.password && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-2 ml-1">{errors.password}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed group/btn overflow-hidden relative"
          >
            <div className="absolute inset-0 shimmer-text opacity-20" />
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="uppercase tracking-widest text-xs">
                  {mode === 'login' ? 'Authenticating...' : mode === 'forgot-password' ? 'Dispatching...' : 'Initializing...'}
                </span>
              </>
            ) : (
              <span className="uppercase tracking-[0.2em] text-xs relative z-10">
                {mode === 'login' ? 'Authorize Engine' : mode === 'forgot-password' ? 'Dispatch_Reset_Link' : 'Deploy Account'}
              </span>
            )}
          </button>
        </form>

        {/* Divider - Hide if forgot-password */}
        {mode !== 'forgot-password' && (
          <div className="mt-10 mb-8 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-5 bg-zinc-50 dark:bg-[#020617] text-slate-500 font-black uppercase tracking-[0.4em]">OR_PROTOCOL</span>
              </div>
            </div>
          </div>
        )}

        {/* Google Sign-In Button - Hide if forgot-password */}
        {mode !== 'forgot-password' && (
          <div className="mb-10 relative z-10">
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting || isGoogleLoading}
              className="w-full py-5 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 disabled:bg-slate-100 text-slate-900 dark:text-white font-black rounded-[1.5rem] transition-all duration-300 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm gap-3 disabled:cursor-not-allowed uppercase tracking-[0.1em] text-xs hover:scale-[1.02] active:scale-95"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                  Auth_with_Cloud...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Identity_Auth.Google
                </>
              )}
            </button>
          </div>
        )}

        {/* Switch Mode */}
        <div className="mt-4 text-center relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 pt-10 pb-4">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-tight">
            {mode === 'login' ? "New Builder?" : mode === 'forgot-password' ? "Remembered It?" : 'Active Architect?'}
            <button
              onClick={switchMode}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 ml-4 font-black uppercase tracking-[0.2em] transition-colors"
              disabled={isSubmitting}
            >
              {mode === 'login' ? 'Initialize_Register' : mode === 'forgot-password' ? 'Back_to_Login' : 'Return_to_Login'}
            </button>
          </p>
        </div>

        {/* Terminal Status Deco */}
        <div className="absolute bottom-4 right-10 opacity-20 pointer-events-none hidden md:block">
          <span className="text-[10px] font-mono font-black text-indigo-500 uppercase tracking-widest">SECURE_TUNNEL_ACTIVE</span>
        </div>
      </div>
    </div>,
    document.body
  )
}
