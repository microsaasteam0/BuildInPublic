'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import axios from 'axios'
import { API_URL } from '@/lib/api-config'
import toast from 'react-hot-toast'

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token.')
        }
    }, [token])

    const validateForm = () => {
        if (!password) {
            setError('Password is required')
            return false
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return false
        }
        // Updated complexity requirement to match backend validator: letters AND numbers
        if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
            setError('Password must contain letters and numbers')
            return false
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!token) {
            setError('Missing reset token. Please request a new link.')
            return
        }

        if (!validateForm()) return

        setIsSubmitting(true)

        try {
            await axios.post(`${API_URL}/api/v1/auth/reset-password`, {
                token,
                new_password: password
            })

            setIsSuccess(true)
            toast.success('PASSWORD_RESET_SUCCESSFUL')

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/')
            }, 3000)
        } catch (err: any) {
            console.error('Reset password error:', err)
            const message = err.response?.data?.detail || 'Failed to reset password. The link may have expired.'
            setError(message)
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="bg-zinc-50 dark:bg-[#020617] border border-zinc-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-4xl text-center group relative overflow-hidden mx-4">
                {/* Blueprint Overlay */}
                <div className="absolute inset-0 bg-grid-blueprint-light opacity-5 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-8 border border-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>

                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tighter">
                        Access Restored
                    </h2>

                    <p className="text-zinc-500 dark:text-slate-400 mb-10 text-sm font-medium leading-relaxed">
                        Your security key has been updated successfully.
                        <br />Redirecting to secure login...
                    </p>

                    <Link
                        href="/"
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all duration-300 shadow-2xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em] text-xs flex items-center justify-center"
                    >
                        Proceed_to_Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-zinc-50 dark:bg-[#020617] border border-zinc-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-4xl group relative overflow-hidden mx-4">
            {/* Blueprint Overlay */}
            <div className="absolute inset-0 bg-grid-blueprint-light opacity-5 pointer-events-none" />

            {/* Kinetic Scanline */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scanline pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 space-y-6 mb-10">
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-500/20">
                        <Lock className="w-3.5 h-3.5" />
                        SECURE_RESET
                    </div>
                    <Link
                        href="/"
                        className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </div>

                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                        Reset_Key
                    </h2>
                    <div className="h-1.5 w-16 bg-indigo-600 rounded-full"></div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Enter your new security credentials below.
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                {/* New Password */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                        New Parameter: Security_Key
                    </label>
                    <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors w-5 h-5" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full pl-12 pr-12 py-4 bg-slate-100/50 dark:bg-white/5 border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all font-medium ${error && !password ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'}`}
                            placeholder="Min. 8 chars"
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
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                        Confirm Parameter
                    </label>
                    <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors w-5 h-5" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full pl-12 pr-12 py-4 bg-slate-100/50 dark:bg-white/5 border rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all font-medium ${error && (!confirmPassword || password !== confirmPassword) ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'}`}
                            placeholder="Repeat password"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || !token}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed group/btn overflow-hidden relative"
                >
                    <div className="absolute inset-0 shimmer-text opacity-20" />
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="uppercase tracking-widest text-xs">Updating...</span>
                        </>
                    ) : (
                        <span className="uppercase tracking-[0.2em] text-xs relative z-10">
                            Update_Security_Key
                        </span>
                    )}
                </button>
            </form>

            {/* Terminal Status Deco */}
            <div className="absolute bottom-4 right-10 opacity-20 pointer-events-none hidden md:block">
                <span className="text-[10px] font-mono font-black text-indigo-500 uppercase tracking-widest">ENCRYPTION_LAYER_ACTIVE</span>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen w-full bg-grid-slate-200/50 dark:bg-grid-slate-900/50 bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4">
            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-slate-50/90 dark:bg-[#020617]/90 pointer-events-none" />

            <div className="relative z-10 w-full flex justify-center">
                <Suspense fallback={
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Loading_Module...</p>
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
