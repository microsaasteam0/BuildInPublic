import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Shield, Zap, TrendingUp, CheckCircle, LogIn, ArrowRight, Activity, Cpu, Box, Terminal } from 'lucide-react'

interface HeroSectionProps {
    isAuthenticated: boolean
    onStartCreating: () => void
    onSignIn: () => void
    onSignUp: () => void
}

export default function HeroSection({ isAuthenticated, onStartCreating, onSignIn, onSignUp }: HeroSectionProps) {
    const [binaryData, setBinaryData] = useState('')

    useEffect(() => {
        // Generate binary noise only on client to prevent hydration mismatch
        setBinaryData(Array(2000).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join(''))
    }, [])

    return (
        <div className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-32 selection:bg-indigo-500/30">

            {/* Innovative 'Builder' Background Matrix */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-grid-blueprint opacity-[0.4] dark:opacity-[0.2]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-50/50 dark:to-black/50" />

                {/* Moving Scanline */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="w-full h-[2px] bg-indigo-500 animate-scanline shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                </div>

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[600px] sm:h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-40 blur-[80px] sm:blur-[120px]" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-slow font-mono text-[8px] text-indigo-500/10 select-none pointer-events-none break-all p-6 sm:p-10">
                    {binaryData}
                </div>
            </div>

            <div className="container relative z-10 px-4 sm:px-6 mx-auto text-center">

                {/* Animated Badge - Built with Kinetic Glow */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 mb-6 sm:mb-10 border border-indigo-500/30 rounded-full bg-indigo-500/5 backdrop-blur-xl shadow-2xl relative group animate-kinetic-glow cursor-pointer overflow-hidden"
                >
                    <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500 mr-1.5 sm:mr-2" />
                    <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] relative">
                        Share Your Build Journey
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-2 sm:ml-3 animate-ping" />
                </motion.div>

                {/* Main Headline with Letter Staggering */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black tracking-tighter mb-6 sm:mb-8 leading-[0.95] text-slate-900 dark:text-white px-2"
                >
                    The <span className="text-gradient animate-pulse">Public Engine</span> <br className="hidden sm:block" />
                    For Modern <span className="text-indigo-500 relative inline-block">
                        Founders
                        <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 sm:h-1 bg-indigo-500/20 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="w-1/2 h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]"
                            />
                        </div>
                    </span>
                </motion.h1>

                {/* Sub-headline with Shimmer Effect */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-600 dark:text-slate-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4"
                >
                    The smartest way to turn your raw <span className="text-indigo-500 font-bold border-b-2 border-indigo-500/20 py-0.5">Build Logs</span> into high-quality social media posts. Share your progress instantly.
                </motion.p>

                {/* CTAs with Builder Glow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16 sm:mb-24 px-4"
                >
                    {isAuthenticated ? (
                        <button
                            onClick={onStartCreating}
                            className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/40 transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95 overflow-hidden"
                        >
                            <div className="absolute inset-0 shimmer-text opacity-20" />
                            <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                                <Box className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                                <span className="tracking-tight uppercase text-xs sm:text-sm">Open Workspace</span>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onSignUp}
                                className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/40 transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95 overflow-hidden"
                            >
                                <div className="absolute inset-0 shimmer-text opacity-20" />
                                <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                                    <span className="tracking-tight uppercase text-xs sm:text-sm">Get Started</span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            <button
                                onClick={onSignIn}
                                className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 font-black rounded-2xl shadow-xl transition-all hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95"
                            >
                                <div className="flex items-center justify-center gap-2 sm:gap-3">
                                    <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                                    <span className="tracking-tight uppercase text-xs sm:text-sm">Sign In</span>
                                </div>
                            </button>
                        </>
                    )}
                </motion.div>

                {/* Trust Matrix - Interactive Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4"
                >
                    {[
                        { icon: Zap, title: "Speed", desc: "Results in seconds", color: "indigo" },
                        { icon: Cpu, title: "AI Content", desc: "AI learns your voice", color: "purple" },
                        { icon: Shield, title: "Secure", desc: "Your data is private", color: "emerald" }
                    ].map((card, i) => (
                        <div key={i} className="glass-card p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 group hover:border-indigo-500/30 transition-all text-left relative overflow-hidden">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-${card.color}-500/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-${card.color}-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                <card.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <h3 className="font-black text-lg sm:text-xl mb-2 text-zinc-900 dark:text-white tracking-tight">{card.title}</h3>
                            <p className="text-xs sm:text-sm text-zinc-500 dark:text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </motion.div>

            </div>
        </div>
    )
}
