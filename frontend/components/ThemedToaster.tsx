'use client'

import { Toaster, ToastBar, toast } from 'react-hot-toast'
import { X as CloseIcon } from 'lucide-react'
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
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
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
        >
            {(t) => (
                <ToastBar toast={t}>
                    {({ icon, message }) => (
                        <>
                            {icon}
                            <div className="flex-1 min-w-0 flex justify-between items-center gap-4">
                                <div className="flex-1 min-w-0 truncate pr-2">
                                    {message}
                                </div>
                                {t.type !== 'loading' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toast.dismiss(t.id);
                                        }}
                                        className="flex-shrink-0 p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                        aria-label="Close"
                                    >
                                        <CloseIcon size={14} />
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </ToastBar>
            )}
        </Toaster>
    )
}
