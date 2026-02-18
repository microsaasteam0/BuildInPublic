'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

import { API_URL } from '../../lib/api-config'

const VerifyEmailContent = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('Verifying your email...')

    const verificationAttempted = React.useRef(false)

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('No verification token found. Please check your email link.')
            return
        }

        // Prevent double-invocation in strict mode
        if (verificationAttempted.current) {
            return
        }
        verificationAttempted.current = true

        const verifyEmail = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/v1/auth/verify-email?token=${token}`)
                if (response.data.success) {
                    setStatus('success')
                    setMessage(response.data.message || 'Email successfully verified!')
                    toast.success('Email verified successfully!')
                    // Redirect to home after 3 seconds
                    setTimeout(() => {
                        router.push('/')
                    }, 3000)
                } else {
                    setStatus('error')
                    setMessage(response.data.message || 'Verification failed. The link may have expired.')
                }
            } catch (error: any) {
                console.error('Verification error:', error)
                setStatus('error')
                setMessage(error.response?.data?.detail || 'Verification failed. The link may be invalid or expired.')
            }
        }

        verifyEmail()
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 min-h-[70vh] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-zinc-100/40 dark:bg-[#020617]/40 backdrop-blur-3xl rounded-[3rem] p-10 text-center border border-zinc-200 dark:border-slate-800 shadow-4xl group relative overflow-hidden"
            >
                {/* Blueprint Overlay */}
                <div className="absolute inset-0 bg-grid-blueprint-light opacity-5 pointer-events-none" />

                {/* Kinetic Scanline */}
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50 blur-sm opacity-0 group-hover:opacity-100 group-hover:animate-scanline pointer-events-none" />

                <div className="relative z-10">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-8 py-4">
                            <div className="relative">
                                <Loader2 className="w-20 h-20 text-indigo-500 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 bg-indigo-500/10 rounded-full animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                                    PROTOCOL_VERIFICATION_ACTIVE
                                </div>
                                <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Verifying Identity</h2>
                                <p className="text-zinc-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                                    Parsing security token stream... <br />
                                    Awaiting handshake confirmation.
                                </p>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-8 py-4">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 transform rotate-6 hover:rotate-12 transition-transform duration-500 shadow-xl shadow-emerald-500/10">
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </div>
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                    VERIFICATION_COMPLETE_SUCCESS
                                </div>
                                <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Access Authorized</h2>
                                <p className="text-zinc-500 dark:text-slate-400 font-bold text-sm leading-relaxed uppercase tracking-tight">
                                    Identity synced with BuildInPublic Vault.
                                    <br />Redirecting to primary terminal.
                                </p>
                            </div>

                            <Link
                                href="/"
                                className="mt-8 w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all duration-300 shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3 group/btn uppercase tracking-[0.2em] text-xs"
                            >
                                Enter_Terminal <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-8 py-4">
                            <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center border border-rose-500/20 transform -rotate-6 hover:-rotate-12 transition-transform duration-500 shadow-xl shadow-rose-500/10">
                                <XCircle className="w-10 h-10 text-rose-500" />
                            </div>
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
                                    VERIFICATION_STREAM_FAILURE
                                </div>
                                <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Auth Error</h2>
                                <p className="text-rose-500 font-black text-[10px] uppercase tracking-widest bg-rose-500/5 px-4 py-2 rounded-lg border border-rose-500/10">
                                    {message}
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 mt-8 w-full">
                                <Link
                                    href="/"
                                    className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl transition-all duration-300 shadow-xl uppercase tracking-[0.2em] text-xs"
                                >
                                    Return_to_Origin
                                </Link>
                                <button
                                    onClick={() => router.push('/?auth=login')}
                                    className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                                >
                                    Dispatch_New_Security_Token
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col">
            <Navbar />
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
            }>
                <VerifyEmailContent />
            </Suspense>
            <Footer />
        </main>
    )
}
