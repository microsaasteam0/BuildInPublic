import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Shield, Zap, TrendingUp, CheckCircle, LogIn, ArrowRight, Activity, Cpu, Box, Terminal } from 'lucide-react'

interface HeroSectionProps {
    isAuthenticated: boolean
    onStartCreating: () => void
    onSignIn: () => void
    onSignUp: () => void
}

export default function HeroSection({ isAuthenticated, onStartCreating, onSignIn, onSignUp }: HeroSectionProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-32 selection:bg-indigo-500/30">

            {/* Innovative 'Builder' Background Matrix */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div 
                    style={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
                    className="absolute inset-0 bg-grid-blueprint opacity-[0.4] dark:opacity-[0.2]" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-50/50 dark:to-black/50" />
                
                {/* Floating Decorative Elements */}
                <motion.div 
                    animate={{ 
                        y: [0, -20, 0],
                        rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[15%] left-[10%] w-24 h-24 bg-indigo-500/5 rounded-3xl border border-indigo-500/10 backdrop-blur-3xl hidden lg:block"
                />
                <motion.div 
                    animate={{ 
                        y: [0, 20, 0],
                        rotate: [0, -10, 0]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[20%] right-[10%] w-32 h-32 bg-purple-500/5 rounded-[2.5rem] border border-purple-500/10 backdrop-blur-3xl hidden lg:block"
                />

                <motion.div 
                    style={{ x: -mousePosition.x, y: -mousePosition.y }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[600px] sm:h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-40" 
                />
            </div>

            <div className="container relative z-10 px-4 sm:px-6 mx-auto text-center">

                {/* Animated Badge - Built with Kinetic Glow */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 mb-6 sm:mb-10 border border-indigo-500/30 rounded-full bg-indigo-500/5 shadow-2xl relative group cursor-pointer overflow-hidden"
                >
                    <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500 mr-1.5 sm:mr-2" />
                    <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-[0.4em] uppercase relative font-mono">
                        Ready to build
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-2 sm:ml-3 animate-pulse" />
                </motion.div>

                {/* Main Headline with Letter Staggering */}
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-black tracking-tighter mb-6 sm:mb-8 leading-[0.95] text-slate-900 dark:text-white px-2"
                >
                    Turn Daily Work Into <br />
                    <span className="text-gradient drop-shadow-sm">Social Posts</span> <br className="hidden sm:block" />
                    You Can <span className="text-indigo-500 relative inline-block">
                        Share
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute -bottom-1 sm:-bottom-2 left-0 h-1 sm:h-1.5 bg-indigo-500/20 rounded-full overflow-hidden"
                        >
                            <motion.div 
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-1/2 h-full bg-indigo-500" 
                            />
                        </motion.div>
                    </span>
                </motion.h1>

                {/* Sub-headline with Shimmer Effect */}
                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-700 dark:text-slate-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4"
                >
                    Write what you worked on today. We turn it into clear posts in seconds.
                </motion.p>

                {/* CTAs with Builder Glow */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16 sm:mb-24 px-4"
                >
                    {isAuthenticated ? (
                        <button
                            onClick={onStartCreating}
                            className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/40 transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95 overflow-hidden"
                        >
                            <div className="absolute inset-0 shimmer-text opacity-20 pointer-events-none" />
                            <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                                <Box className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                                <span className="tracking-widest text-[10px] sm:text-xs uppercase font-mono">Open_Dashboard</span>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onSignUp}
                                className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/40 transition-all hover:scale-105 hover:bg-indigo-700 active:scale-95 overflow-hidden"
                            >
                                <div className="absolute inset-0 shimmer-text opacity-20 pointer-events-none" />
                                <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
                                    <span className="tracking-widest text-[10px] sm:text-xs uppercase font-mono">Initialize_Build</span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            <button
                                onClick={onSignIn}
                                className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 font-black rounded-2xl shadow-xl transition-all hover:scale-105 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95"
                            >
                                <div className="flex items-center justify-center gap-2 sm:gap-3">
                                    <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                                    <span className="tracking-widest text-[10px] sm:text-xs uppercase font-mono">Sign_In</span>
                                </div>
                            </button>
                        </>
                    )}
                </motion.div>

                {/* Trust Matrix - Interactive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
                    {[
                        { icon: Zap, title: "Velocity", desc: "Synthesis in < 2s", color: "indigo" },
                        { icon: Cpu, title: "Precision", desc: "No manual formatting", color: "purple" },
                        { icon: Shield, title: "Security", desc: "Encrypted memory vault", color: "emerald" }
                    ].map((card, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 + 0.4 }}
                            className="glass-card p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 group hover:border-indigo-500/30 transition-all text-left relative overflow-hidden"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-${card.color}-500/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-${card.color}-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner`}>
                                <card.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <h2 className="font-black text-lg sm:text-xl mb-2 text-zinc-900 dark:text-white tracking-tighter uppercase font-display">{card.title}</h2>
                            <p className="text-xs sm:text-sm text-zinc-700 dark:text-slate-300 font-medium leading-relaxed font-mono opacity-80">{card.desc}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    )
}
