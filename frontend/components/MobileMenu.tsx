'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X, Crown, Users, Home, Zap, Sparkles, MessageSquare, Info, LayoutDashboard, LogOut, Rocket } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileMenuProps {
  isAuthenticated: boolean
  user?: any
  onSignIn?: () => void
  onSignUp?: () => void
  onDashboard?: () => void
  onTabChange?: (tab: string) => void
}

export default function MobileMenu({
  isAuthenticated,
  user,
  onSignIn,
  onSignUp,
  onDashboard,
  onTabChange
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { logout } = useAuth()
  const pathname = usePathname()

  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Block scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on route change
  useEffect(() => {
    closeMenu()
  }, [pathname])

  const isActive = (path: string) =>
    pathname === path || (path !== '/' && pathname.startsWith(path))

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

  const allLinks = [
    { name: 'Home', href: '/', icon: isAuthenticated ? Zap : Home },
    { name: 'Pricing', href: '/pricing', icon: Crown },
    { name: 'Community', href: '/community', icon: Users, authOnly: true },
    { name: 'Blog', href: '/blog', icon: MessageSquare },
    { name: 'Features', href: '/features', icon: Sparkles, marketingOnly: true },
    { name: 'Updates', href: '/updates', icon: Rocket, marketingOnly: true },
    { name: 'About', href: '/about', icon: Info, marketingOnly: true },
  ]

  const navLinks = allLinks.filter(link => {
    if (isAuthenticated) return !link.marketingOnly
    return !link.authOnly
  })

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex justify-end"
          style={{ zIndex: 99999 }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMenu}
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="relative w-[85vw] max-w-[320px] h-full flex flex-col overflow-hidden"
            style={{ zIndex: 100000 }}
          >
            {/* Panel background */}
            <div className="absolute inset-0 bg-zinc-50 dark:bg-slate-950 border-l border-zinc-200 dark:border-slate-800" />

            {/* Content wrapper */}
            <div className="relative flex flex-col h-full overflow-y-auto">

              {/* ── Header ── */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-slate-800 bg-zinc-50/95 dark:bg-slate-950/95 backdrop-blur sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center p-1.5 border border-zinc-200 dark:border-slate-800 shadow-sm">
                    <Image src="/logo.png" alt="BuildInPublic" width={28} height={28} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-base font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                    Build<span className="text-indigo-600 dark:text-indigo-400">In</span>Public
                  </span>
                </div>
                <button
                  onClick={closeMenu}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-slate-700 transition-all active:scale-95 border border-zinc-200 dark:border-slate-700/50"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── User Info (authenticated) ── */}
              {isAuthenticated && user && (
                <div className="px-5 py-4 border-b border-zinc-200 dark:border-slate-800 bg-zinc-100/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center relative overflow-hidden ring-2 ring-indigo-500/20 flex-shrink-0">
                      {user.profile_picture && isValidImageUrl(user.profile_picture) ? (
                        <Image
                          src={user.profile_picture}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="font-black text-base text-white font-mono">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-slate-900 dark:text-white truncate tracking-tight">
                        {user.username || 'User'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                        {user.email}
                      </p>
                      {user.is_premium && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                          <Crown className="w-2.5 h-2.5" /> Pro
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => { onDashboard?.(); closeMenu(); }}
                    className="w-full py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border border-indigo-500/20 uppercase tracking-widest"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                  </button>
                </div>
              )}

              {/* ── Navigation Links ── */}
              <nav className="flex-1 px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={closeMenu}
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all font-black text-sm uppercase tracking-wide ${active
                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white border border-transparent'
                        }`}
                    >
                      <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-indigo-500' : 'opacity-60'}`} />
                      <span>{link.name}</span>
                      {link.href === '/pricing' && isAuthenticated && !user?.is_premium && (
                        <span className="ml-auto flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* ── Footer Actions ── */}
              <div className="px-5 py-5 border-t border-zinc-200 dark:border-slate-800 bg-zinc-50/80 dark:bg-slate-950/80">
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); closeMenu(); }}
                    className="w-full px-4 py-3 rounded-2xl bg-red-500/10 text-red-500 dark:text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 border border-red-500/20"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => { onSignUp?.(); closeMenu(); }}
                      className="w-full px-4 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:scale-95"
                    >
                      Get Started Free 🚀
                    </button>
                    <button
                      onClick={() => { onSignIn?.(); closeMenu(); }}
                      className="w-full px-4 py-3.5 rounded-2xl bg-zinc-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-slate-700 transition-all border border-zinc-200 dark:border-slate-700"
                    >
                      Sign In
                    </button>
                  </div>
                )}

                <p className="mt-5 text-center text-[10px] text-slate-400 dark:text-slate-600 font-mono">
                  © 2026 BuildInPublic · Entrext Labs
                </p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-slate-800/80 hover:bg-zinc-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm border border-zinc-200 dark:border-slate-700 active:scale-95 transition-all"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Portal-rendered menu (outside navbar stacking context) */}
      {mounted && createPortal(menuContent, document.body)}
    </>
  )
}