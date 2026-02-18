'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, Zap, Shield, TrendingUp, Sparkles, Layout, MessageSquare, Repeat, Gauge, Rocket, ArrowRight, Share2, Target, Users, HardHat, Hammer, Construction, Terminal, Box, Cpu, Workflow, Database, Network, Brackets } from 'lucide-react'
import Link from 'next/link'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import { UserPreferencesProvider } from '../../contexts/UserPreferencesContext'
import { ThemeProvider } from '../../contexts/ThemeContext'
import Navbar from '../../components/Navbar'
import AuthModal from '../../components/AuthModal'
import DashboardModal from '../../components/DashboardModal'
import Footer from '../../components/Footer'
import { motion, AnimatePresence } from 'framer-motion'

function FeaturesContent() {
  const { user, isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')
  const [showDashboard, setShowDashboard] = useState(false)
  const [activeSchematic, setActiveSchematic] = useState(0)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const item: any = {
    hidden: { opacity: 0, y: 40, scale: 0.9, rotateX: -10 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15
      }
    }
  }

  const schematicSteps = [
    { title: "LOG_CAPTURE", desc: "Structured ingestion of Morning Plans & Evening Reflections", icon: Database },
    { title: "NEURAL_SYNC", desc: "Semantic parsing of daily building milestones", icon: Cpu },
    { title: "LOGIC_SYNTH", desc: "Manufacturing high-authority social storylines", icon: Workflow },
    { title: "THREAD_SYNC", desc: "Native X (Twitter) thread compilation and formatting", icon: Repeat }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Revolutionary 'Builder' Background Matrix */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-blueprint-light opacity-30 dark:opacity-10" />
        <div className="absolute top-[10%] right-[-5%] w-[45%] h-[45%] bg-indigo-500/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] left-[-5%] w-[45%] h-[45%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse-slow delay-1000" />

        {/* Dynamic Global Scanline */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="w-full h-1 bg-indigo-500 animate-scanline shadow-[0_0_20px_rgba(99,102,241,1)]" />
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        activeMainTab="features"
        onSignIn={() => { setShowAuthModal(true); setAuthModalMode('login') }}
        onSignUp={() => { setShowAuthModal(true); setAuthModalMode('register') }}
        onUserDashboard={() => setShowDashboard(true)}
      />

      <main className="relative z-10 pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-24 sm:space-y-40">

          {/* Engineering Header - Kinetic Primitive */}
          <div className="text-center space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-4 sm:px-5 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[9px] sm:text-[11px] font-black uppercase tracking-widest sm:tracking-[0.4em] font-mono shadow-sm animate-kinetic-glow"
            >
              <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              BUILD_ENV.FEATURE_SET
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl md:text-9xl font-display font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85] uppercase text-balance"
            >
              High-Authority <br />
              <span className="text-gradient">Engineered</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium px-2 sm:px-0"
            >
              Our neural distribution architecture decomposes your building process into high-performance social assets, automatically.
            </motion.p>
          </div>

          {/* Neural Schematic Module - New Section */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 10, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "circOut" }}
            className="relative p-8 sm:p-12 md:p-20 rounded-[2.5rem] sm:rounded-[4rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-grid-blueprint-light opacity-5 pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-10 sm:gap-16 items-center flex-row-reverse">
              <div className="lg:col-span-5 space-y-8 sm:space-y-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                  <Workflow className="w-3 h-3" />
                  SYSTEM_SCHEMATIC
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] text-balance">
                  Automated <br className="hidden sm:block" /> Distribution Pipeline
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {schematicSteps.map((step, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSchematic(i)}
                      className={`w-full text-left p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all flex items-center gap-4 sm:gap-6 group/btn ${activeSchematic === i
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20"
                        : "bg-transparent border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-white/5"
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activeSchematic === i ? "bg-white/20" : "bg-indigo-500/10 text-indigo-500"
                        }`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm tracking-widest uppercase">{step.title}</h4>
                        <p className={`text-xs mt-1 font-medium ${activeSchematic === i ? "text-indigo-100" : "text-slate-500"}`}>
                          {step.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 h-[300px] sm:h-[400px] md:h-[500px] relative bg-slate-100 dark:bg-[#020617] rounded-[2rem] sm:rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 overflow-hidden p-6 sm:p-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-blueprint-light opacity-10 pointer-events-none" />

                {/* Animated Data Visualization */}
                <div className="relative w-full aspect-square max-w-[200px] sm:max-w-sm flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 sm:inset-8 border-2 border-dashed border-purple-500/20 rounded-full"
                  />

                  <div className="relative z-10 w-16 h-16 sm:w-24 h-16 sm:h-24 bg-indigo-600 rounded-2xl sm:rounded-[2rem] flex items-center justify-center shadow-3xl shadow-indigo-600/50 group-hover:scale-110 transition-transform duration-500">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeSchematic}
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                        className="text-white"
                      >
                        {React.createElement(schematicSteps[activeSchematic].icon, { className: "w-7 h-7 sm:w-10 sm:h-10" })}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Floating Data Nodes */}
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                      style={{
                        transform: `rotate(${deg}deg) translate(80px, 0) rotate(-${deg}deg)`
                      }}
                      className="absolute w-2 h-2 sm:w-4 h-2 sm:h-4 rounded-full bg-indigo-500/30 blur-sm"
                    />
                  ))}
                </div>

                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 flex justify-between items-center text-[8px] sm:text-[10px] font-mono font-black text-indigo-500/60 tracking-widest uppercase">
                  <div>&gt; STATUS_STREAMING</div>
                  <div className="hidden sm:block">ENV: PRODUCTION_READY</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature Grid - Enhanced Visual Rhythm */}
          <div className="space-y-12 sm:space-y-20">
            <div className="flex items-end justify-between border-b border-slate-200 dark:border-white/5 pb-8 sm:pb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Core Modules</h2>
              <div className="hidden md:flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-500" /> READY</span>
                <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-500" /> ACTIVE</span>
              </div>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {[
                {
                  icon: Hammer,
                  title: "Founder's Build Logs",
                  desc: "Capture Morning To-Dos and Evening Reflections. Our AI extracts the 'build patterns' from your raw daily activity stream.",
                  tag: "Phase 1"
                },
                {
                  icon: Construction,
                  title: "High-Authority Synthesis",
                  desc: "Transforms fragmented logic into professional threads designed specifically for X (Twitter) engagement velocity.",
                  tag: "Phase 2"
                },
                {
                  icon: Users,
                  title: "Community Logic Module",
                  desc: "Access a vault of proven templates for Blog posts, Newsletters, and Marketing. Engineered for the modern creator.",
                  tag: "Phase 3"
                },
                {
                  icon: Repeat,
                  title: "X Thread Optimization",
                  desc: "Single-deploy optimization engine for X (Twitter). Strategic reach engineered for high-engagement thread velocity.",
                  tag: "Phase 4"
                },
                {
                  icon: Target,
                  title: "Brand Voice Schematics",
                  desc: "Outcome-tailored synthesis that replicates your unique creative signature across every generated asset.",
                  tag: "Phase 5"
                },
                {
                  icon: Rocket,
                  title: "Technical Build Logs",
                  desc: "Deconstruct your raw engineering updates into semantic components. Re-synthesize daily progress into native social content.",
                  tag: "Phase 6"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-2xl transition-all duration-500"
                >
                  {/* Horizontal Scanline on Card */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
                    <div className="w-full h-full bg-grid-blueprint-light bg-[size:10px_10px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500 to-transparent h-[50%] animate-scanline" />
                  </div>

                  <div className="relative z-10 w-full">
                    <span className="inline-block px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-500/20">
                      {feature.tag}
                    </span>
                    <div className="w-12 h-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 sm:mb-8 text-indigo-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                      <feature.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight group-hover:text-indigo-500 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[13px] sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Neural Synthesis Module - Immersive CTA Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative p-8 sm:p-12 md:p-24 rounded-[2.5rem] sm:rounded-[4rem] bg-indigo-600 text-white overflow-hidden shadow-3xl"
          >
            <div className="absolute inset-0 bg-grid-blueprint opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-[100px] -ml-48 -mb-48" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 sm:gap-20 items-center">
              <div className="space-y-8 sm:space-y-10">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                  <Box className="w-4 h-4" />
                  NEURO_SYNC.ALPHA
                </div>
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-tight tracking-tighter text-balance">
                  One Draft. <br />
                  <span className="text-indigo-200">Total Reach.</span>
                </h2>
                <p className="text-lg sm:text-xl text-indigo-100 font-medium leading-relaxed max-w-xl">
                  Our Neuro-Sync Engine analyzes the deep semantics of your daily build logs to re-engineer your project milestones into high-performance X threads.
                </p>
                <div className="space-y-4 sm:space-y-6">
                  {[
                    "Daily Build-Log Synthesis.",
                    "Raw Logic Distribution.",
                    "Permanent Vault Storage."
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 sm:gap-4 group">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all border border-white/10 shrink-0">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-200" />
                      </div>
                      <span className="text-base sm:text-lg font-bold tracking-tight">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative bg-white/5 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 border border-white/10 shadow-3xl group overflow-hidden">
                {/* Decorative Code Bits */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                <div className="space-y-4 sm:space-y-6 font-mono text-[11px] sm:text-sm overflow-hidden">
                  <div className="flex items-center justify-between mb-2 sm:mb-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-400" />
                      <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-yellow-400" />
                      <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">DEPLOY_TERMINAL</span>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-indigo-300">&gt;&gt;&gt; NEURAL_PIPE_INIT</p>
                    <p className="text-white/60 truncate">[0.12s] Parsing Morning...</p>
                    <p className="text-emerald-400 truncate">[0.45s] Parsing Evening...</p>
                    <p className="text-white/60 truncate">[0.89s] Synthesizing...</p>
                    <p className="text-indigo-500 animate-pulse font-black text-[10px] sm:text-xs">&gt;&gt;&gt; COMPILED_SUCCESS</p>
                  </div>

                  <div className="mt-4 sm:mt-8 pt-4 sm:pt-8 border-t border-white/10">
                    <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-100 italic font-medium leading-relaxed text-[10px] sm:text-xs md:text-sm">
                      "Building is not the code, but the distribution of vision. Solved X..."
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <div className="h-1 sm:h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-indigo-400"
                      />
                    </div>
                    <div className="h-1 sm:h-1.5 flex-1 bg-white/10 rounded-full" />
                    <div className="h-1 sm:h-1.5 flex-1 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Platform Performance Benchmarks */}
          <div className="text-center space-y-12 sm:space-y-24">
            <div className="space-y-4 sm:space-y-6 px-2">
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter text-balance leading-none">Performance Benchmarks</h2>
              <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px] sm:text-xs opacity-70">ENVIRONMENT: STABLE_RELEASE_V1</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {[
                { label: "End-to-End Latency", value: "1.2s", icon: Gauge, color: "blue" },
                { label: "Encryption Grade", value: "Military", icon: Shield, color: "indigo" },
                { label: "Deployment Channel", value: "X / Twitter", icon: Layout, color: "purple" },
                { label: "Success Coefficient", value: "99.9%", icon: TrendingUp, color: "emerald" }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 group hover:border-indigo-500/30 transition-all text-center relative overflow-hidden shadow-xl sm:shadow-2xl">
                  <div className="absolute inset-0 bg-grid-blueprint-light opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                  <div className={`w-12 h-12 sm:w-16 h-12 sm:h-16 bg-${stat.color}-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 text-${stat.color}-500 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-inner border border-white/5`}>
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tighter">{stat.value}</div>
                  <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-500">{stat.label}</div>

                  {/* Status Bar */}
                  <div className="mt-6 sm:mt-8 flex gap-1 sm:gap-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map(dot => (
                      <div key={dot} className={`w-1 h-2.5 sm:h-3 rounded-full ${dot <= 4 ? `bg-${stat.color}-500` : "bg-slate-200 dark:bg-slate-800"}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Setup CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-10 sm:p-20 md:p-32 rounded-[3.5rem] sm:rounded-[5rem] bg-slate-900 text-white relative overflow-hidden shadow-4xl text-center group"
          >
            <div className="absolute inset-0 bg-grid-blueprint opacity-20" />
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50 group-hover:from-indigo-500/20 transition-all duration-1000" />

            <div className="relative z-10 max-w-5xl mx-auto space-y-12 sm:space-y-16">
              <div className="space-y-6 sm:space-y-8">
                <div className="inline-flex items-center gap-3 px-4 sm:px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] sm:text-[10px] font-black uppercase tracking-widest sm:tracking-[0.3em] font-mono">
                  <Brackets className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  SYSTEM_INITIALIZATION
                </div>
                <h2 className="text-4xl sm:text-6xl md:text-9xl font-display font-black leading-none tracking-tighter uppercase text-balance">
                  Launch your <br /><span className="text-gradient inline-block">Public Engine</span>
                </h2>
                <p className="text-base sm:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 opacity-80">
                  Join 1,200+ elite founders transforming their Build Logs into pure distribution authority. Secure your environment today.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 max-w-xs sm:max-w-none mx-auto">
                <button
                  onClick={() => { setShowAuthModal(true); setAuthModalMode('register') }}
                  className="px-8 sm:px-14 py-5 sm:py-7 bg-indigo-600 text-white font-black rounded-2xl sm:rounded-[2rem] hover:scale-105 hover:bg-indigo-700 active:scale-95 transition-all shadow-3xl shadow-indigo-600/40 flex items-center justify-center gap-3 sm:gap-4 group/btn overflow-hidden relative"
                >
                  <div className="absolute inset-0 shimmer-text opacity-20" />
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform relative z-10 shrink-0" />
                  <span className="relative z-10 uppercase tracking-widest sm:tracking-tight text-base sm:text-lg">Initialize</span>
                </button>
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      setShowDashboard(true)
                    } else {
                      setAuthModalMode('login')
                      setShowAuthModal(true)
                    }
                  }}
                  className="px-8 sm:px-14 py-5 sm:py-7 bg-white/5 border sm:border-2 border-white/10 backdrop-blur-xl text-white font-black rounded-2xl sm:rounded-[2rem] hover:bg-white/10 transition-all flex items-center justify-center gap-3 sm:gap-4 hover:border-white/20"
                >
                  <Terminal className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  <span className="uppercase tracking-widest sm:tracking-tight text-base sm:text-lg">Secure Access</span>
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </main >

      <Footer />

      <DashboardModal
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
      />
    </div >
  )
}

export default function FeaturesClient() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserPreferencesProvider>
          <FeaturesContent />
        </UserPreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}