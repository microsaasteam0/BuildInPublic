'use client'

import { Sparkles, Users, Crown, Menu, X, Rocket, Zap, LogIn, LogOut } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import ThemeSwitcher from './ThemeSwitcher'
import MobileMenu from './MobileMenu'
import axios from 'axios'
import { API_URL } from '@/lib/api-config'
import { requestCache } from '@/lib/cache-util'
import { useAuth } from '../contexts/AuthContext'

interface NavbarProps {
  showAuthButtons?: boolean
  isAuthenticated?: boolean
  user?: any
  usageStats?: any
  activeMainTab?: string
  onSignIn?: () => void
  onSignUp?: () => void
  onUserDashboard?: () => void
  onCommunityClick?: () => void
  onTabChange?: (tab: string) => void
}

export default function Navbar({
  showAuthButtons = true,
  isAuthenticated = false,
  user = null,
  usageStats = null,
  activeMainTab = 'home',
  onSignIn,
  onSignUp,
  onUserDashboard,
  onTabChange
}: NavbarProps) {
  const { logout } = useAuth()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  const [internalUsageStats, setInternalUsageStats] = useState<any>(null)

  // Use passed usageStats or internal one
  const displayUsageStats = usageStats || internalUsageStats

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch usage stats if not provided
  useEffect(() => {
    const fetchStats = async () => {
      if (isAuthenticated && !usageStats && user?.id) {
        try {
          const stats = await requestCache.get(
            `usage-stats-${user.id}`,
            async () => {
              const res = await axios.get(`${API_URL}/api/v1/auth/usage-stats`, {
                timeout: 15000
              })
              return res.data
            },
            10 * 1000 // 10s short-lived cache for "real-time" feel
          )
          setInternalUsageStats(stats)
        } catch (err) {
          console.error("Error fetching navbar stats:", err)
        }
      }
    }
    fetchStats()
  }, [isAuthenticated, usageStats, user?.id])

  const navLinks = [
    { name: 'Home', href: '/', show: true },
    { name: 'Features', href: '/features', show: !isAuthenticated },
    { name: 'Pricing', href: '/pricing', show: true }, // Always show pricing/subscription
    { name: 'Community', href: '/community', show: isAuthenticated },
    { name: 'Blog', href: '/blog', show: true },
    { name: 'About', href: '/about', show: !isAuthenticated },
  ]

  const handleSignIn = () => {
    if (onSignIn) onSignIn()
    else window.location.href = '/?auth=login'
  }

  const handleSignUp = () => {
    if (onSignUp) onSignUp()
    else window.location.href = '/?auth=register'
  }

  const isValidImageUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false
    if (url.startsWith('data:image/')) return true
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
        ? 'bg-zinc-50/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-slate-800 shadow-sm py-2 sm:py-3'
        : 'bg-zinc-50/80 dark:bg-slate-950/80 backdrop-blur-sm py-3 sm:py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between gap-2">

          {/* Logo - Industrial Identity Frame */}
          <Link href="/" className="flex items-center group gap-2 sm:gap-3 flex-shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-slate-900 rounded-xl shadow-2xl shadow-indigo-500/10 flex items-center justify-center p-1.5 border border-zinc-200 dark:border-slate-800 transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 overflow-hidden">
              <Image
                src="/icon-32.png"
                alt="BuildInPublic Logo"
                width={32}
                height={32}
                unoptimized
                className="w-full h-full object-contain relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
            </div>
            <span className="text-base sm:text-xl md:text-2xl font-display font-black tracking-tighter text-slate-900 dark:text-white whitespace-nowrap uppercase">
              BuildIn<span className="text-indigo-600 dark:text-indigo-400">Public</span>
            </span>
          </Link>

          {/* Desktop Navigation - Advanced Glass Center Pill */}
          <div className="hidden md:flex items-center gap-1 bg-white/50 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.03)] dark:shadow-[0_0_20px_rgba(0,0,0,0.2)]">
              {navLinks.filter(link => link.show).map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

                return (
                  <div key={link.name} className="relative">
                    <Link
                      href={link.href}
                      className={`relative px-4 lg:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 tracking-wide flex items-center gap-1.5 whitespace-nowrap overflow-hidden ${isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
                        }`}
                    >
                      {isActive && (
                        <span className="absolute inset-0 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 z-0 rounded-xl" />
                      )}

                      {link.name === 'Community' && (
                        <Users className="w-3.5 h-3.5 relative z-10" />
                      )}

                      <span className="relative z-10">
                        {link.name}
                      </span>

                      {link.name === 'Pricing' && isAuthenticated && !user?.is_premium && (
                        <span className="relative z-10 flex h-2 w-2 ml-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                      )}
                    </Link>
                  </div>
                )
              })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
            <ThemeSwitcher />

            <div className="hidden md:flex items-center space-x-2 lg:space-x-4 pl-2 lg:pl-4 border-l border-slate-200 dark:border-slate-800/50">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 lg:gap-4">
                  {/* Usage Counter - High Contrast Industrial */}
                  {displayUsageStats && (
                    <div className="hidden lg:flex items-center px-4 py-2 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)] group/usage">
                      <Zap className={`w-3.5 h-3.5 mr-2 ${displayUsageStats.remaining_requests === 0 ? 'text-slate-400' : 'text-indigo-400 fill-indigo-400/20 animate-pulse'}`} />
                      <span className="text-[11px] font-black text-indigo-500 dark:text-indigo-300 tracking-[0.2em] font-mono">
                        {displayUsageStats.remaining_requests}/{displayUsageStats.rate_limit} <span className="opacity-50">POSTS LEFT</span>
                      </span>
                    </div>
                  )}

                  {/* Upgrade Pill - Gold Kinetic */}
                  {!user?.is_premium && (
                    <Link href="/pricing" className="px-3 lg:px-4 py-2 bg-gradient-to-br from-amber-400/20 to-orange-500/10 dark:from-amber-400/10 dark:to-orange-500/5 border border-amber-500/30 rounded-xl flex items-center gap-2 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all hover:scale-105 group/upgrade relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/upgrade:translate-x-full transition-transform duration-1000 skew-x-12" />
                      <Crown className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
                      <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 tracking-[0.2em] font-mono hidden lg:inline">UPGRADE</span>
                    </Link>
                  )}

                  {/* Sign Out Button - Muted to Alert */}
                  <button
                    onClick={logout}
                    className="hidden lg:flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 rounded-xl text-[11px] font-black transition-all border border-transparent hover:border-rose-500/20 font-mono tracking-[0.2em]"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>LOGOUT</span>
                  </button>

                  {/* User Avatar - Premium Gradient */}
                  <button
                    onClick={onUserDashboard}
                    aria-label="Open dashboard"
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all border-2 border-white dark:border-slate-800 relative overflow-hidden group/avatar"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                    {user?.profile_picture && isValidImageUrl(user.profile_picture) ? (
                      <Image
                        src={user.profile_picture}
                        alt="Profile"
                        fill
                        className="object-cover group-hover/avatar:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <span className="font-black text-xs font-mono relative z-10">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                    {/* Notification dot if generations low */}
                    {displayUsageStats?.remaining_requests <= 1 && (
                      <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 border border-white dark:border-slate-900 rounded-full animate-ping"></span>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 lg:gap-3">
                  <button
                    onClick={handleSignIn}
                    className="text-[10px] lg:text-xs font-black text-zinc-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 tracking-[0.15em] lg:tracking-[0.2em] px-3 lg:px-4 py-2 transition-colors font-mono whitespace-nowrap"
                  >
                    Log in
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="group relative px-4 lg:px-8 xl:px-10 py-2.5 lg:py-3.5 bg-indigo-600 text-white text-[10px] lg:text-xs xl:text-sm font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all hover:-translate-y-1 tracking-widest overflow-hidden font-mono whitespace-nowrap"
                  >
                    <div className="absolute inset-0 shimmer-text opacity-20 pointer-events-none" />
                    <span className="flex items-center gap-1.5 lg:gap-2 relative z-10">
                      Sign up <Rocket className="w-3 h-3 lg:w-3.5 lg:h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button - pass props correctly */}
            <div className="md:hidden flex-shrink-0">
              <MobileMenu
                isAuthenticated={isAuthenticated}
                user={user}
                onSignIn={handleSignIn}
                onSignUp={handleSignUp}
                onDashboard={onUserDashboard}
                onTabChange={onTabChange}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}