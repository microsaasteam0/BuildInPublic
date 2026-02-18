'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon, Sparkles } from 'lucide-react'

export default function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="p-2.5 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm w-[46px] h-[46px]" />
  )

  const isDark = resolvedTheme === 'dark'

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative p-2.5 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.15)] group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="text-primary"
            >
              <Moon className="w-5 h-5" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-2 h-2 text-primary/50" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="text-orange-500"
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Kinetic Background Glow */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-2xl blur-xl -z-10 ${isDark ? 'bg-indigo-500' : 'bg-orange-400'
          }`}
      />

      {/* Tooltip */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <div className="relative px-3 py-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-lg shadow-2xl">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
          {isDark ? 'Deploy Light' : 'Dark Ops'}
        </div>
      </div>
    </motion.button>
  )
}