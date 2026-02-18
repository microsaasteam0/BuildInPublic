'use client'

import { Toaster } from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemedToaster() {
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === 'dark'

    return (
        <Toaster
            position="top-right"
            containerStyle={{
                zIndex: 2000000,
            }}
            toastOptions={{
                duration: 4000,
                className: isDark
                    ? 'bg-slate-950 text-white border-l-4 border-indigo-500 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-none relative overflow-hidden group'
                    : 'bg-white text-slate-900 border-l-4 border-indigo-600 shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-none relative overflow-hidden group',
                style: {
                    zIndex: 2000000,
                    padding: '16px 24px',
                    fontSize: '11px',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.25em',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: isDark ? '#020617' : '#ffffff',
                    color: isDark ? '#ffffff' : '#0f172a',
                    border: isDark ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(99, 102, 241, 0.1)',
                    borderLeft: isDark ? '4px solid #6366f1' : '4px solid #4f46e5',
                },
                success: {
                    iconTheme: {
                        primary: isDark ? '#6366f1' : '#4f46e5',
                        secondary: '#ffffff',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                    },
                },
            }}
        />
    )
}
