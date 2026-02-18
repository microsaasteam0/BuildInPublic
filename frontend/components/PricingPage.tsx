import React, { useState } from 'react'
import { Check, X, Crown, Users, Sparkles, BarChart3, Heart, Plus, Minus, Zap, Shield, ArrowRight, Star, Terminal, Box, Cpu, Workflow, Database, Brackets, Activity, Lock, Rocket, Network } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import PaymentModal from './PaymentModal'
import AuthModal from './AuthModal'
import DowngradeModal from './DowngradeModal'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from '@/lib/api-config'
import { motion, AnimatePresence } from 'framer-motion'

interface PricingPageProps {
  onSignUp: (plan: string) => void
}

interface FAQItemProps {
  faq: {
    question: string
    answer: string
  }
}

function FAQItem({ faq }: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-zinc-200 dark:border-slate-800/80 rounded-[2.5rem] overflow-hidden bg-zinc-100/40 dark:bg-slate-900/40 backdrop-blur-xl transition-all duration-300 group">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 md:px-10 py-6 md:py-8 text-left flex items-center justify-between hover:bg-indigo-500/[0.02] transition-colors duration-200"
      >
        <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white pr-6 tracking-tight uppercase">
          {faq.question}
        </span>
        <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isExpanded ? "bg-indigo-600 text-white rotate-180 shadow-lg shadow-indigo-600/20" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
          }`}>
          {isExpanded ? <Minus className="w-5 h-5 md:w-6 md:h-6" /> : <Plus className="w-5 h-5 md:w-6 md:h-6" />}
        </div>
      </button>

      {isExpanded && (
        <div className="overflow-hidden border-t border-slate-200 dark:border-slate-800/50">
          <div className="px-6 md:px-10 pb-8 md:pb-10 pt-8 text-slate-600 dark:text-slate-400 leading-relaxed text-base md:text-lg font-medium mt-2">
            <div className="flex gap-4">
              <div className="w-1 h-auto md:w-1.5 bg-indigo-500/20 rounded-full shrink-0" />
              {faq.answer}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PricingPage({ onSignUp }: PricingPageProps) {
  const { isAuthenticated, user, updateUser, refreshUser } = useAuth()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  // Refresh user data on mount to ensure accurate plan status
  React.useEffect(() => {
    if (isAuthenticated) {
      refreshUser()
    }
  }, [isAuthenticated])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('pro')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register')
  const [isDowngrading, setIsDowngrading] = useState(false)
  const [showDowngradeModal, setShowDowngradeModal] = useState(false)

  const handleDowngradeToFree = async () => {
    if (!user?.is_premium) return

    setIsDowngrading(true)
    try {
      sessionStorage.setItem('manual_cancellation', 'true')
      const response = await axios.post(`${API_URL}/api/v1/payment/cancel`)

      if (response.data.success) {
        updateUser({ is_premium: false })
        const keys = Object.keys(sessionStorage)
        keys.forEach(key => {
          if (key.includes('usage_stats') || key.includes('dashboard_stats')) {
            sessionStorage.removeItem(key)
          }
        })
        window.dispatchEvent(new CustomEvent('subscription-cancelled', {
          detail: { is_premium: false }
        }))
        toast.success('SUBSCRIPTION_TERMINATED_SUCCESS')
        setShowDowngradeModal(false)
        onSignUp('free')
      } else {
        toast.error(response.data.message || 'ERROR_DOWNGRADE_FAILURE')
      }
    } catch (error: any) {
      console.error('Error downgrading subscription:', error)
      if (error.response?.status === 400) {
        toast.error('ERROR_NO_ACTIVE_SUBSCRIPTION')
      } else {
        toast.error('ERROR_DOWNGRADE_FAILURE')
      }
    } finally {
      setIsDowngrading(false)
    }
  }

  const handlePlanSelection = (planId: string) => {
    if (planId === 'free') {
      if (user?.is_premium) {
        setShowDowngradeModal(true)
      } else {
        onSignUp(planId)
      }
    } else {
      if (!isAuthenticated) {
        setSelectedPlan(planId)
        setAuthModalMode('register')
        setShowAuthModal(true)
        return
      }
      setSelectedPlan(planId)
      setShowPaymentModal(true)
    }
  }

  const handleAuthModalClose = () => {
    setShowAuthModal(false)
    if (isAuthenticated) {
      setTimeout(() => {
        setShowPaymentModal(true)
      }, 100)
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      description: 'The easiest way to start sharing your work.',
      price: { monthly: 0, yearly: 0 },
      badge: 'FREE',
      features: [
        '2 Daily Posts [X/Twitter]',
        'Basic Post Creation',
        'Standard Templates',
        '24-Hour History',
        'Basic Tone Settings'
      ],
      limitations: [
        'No Advanced Thread Formats',
        'No Thread Analytics',
        'No Unlimited Saved Posts',
        'No Custom AI Voices'
      ],
      cta: 'Start for Free',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      description: 'Advanced tools to grow your brand faster.',
      price: { monthly: 15, yearly: 144 },
      badge: 'RECOMMENDED',
      features: [
        '20 Daily Posts [X/Twitter]',
        'Advanced Content Analysis',
        'Automated Thread Creation',
        'Unlimited Saved Posts',
        'Custom AI Voice Profiles',
        'Priority Processing',
        'Early Access: New Formats',
        'Export to Markdown & JSON'
      ],
      limitations: [],
      cta: 'Upgrade to Pro',
      popular: true,
    }
  ]

  const faqs = [
    {
      question: 'How does the daily generation cycle reset?',
      answer: "Systems reset on a rolling 24-hour cycle for Free_Build users. Pro_Engineers utilize a 20-unit daily buffer that resets at 00:00 UTC, ensuring maximum uptime for your building-in-public workflow."
    },
    {
      question: 'What platforms are currently supported?',
      answer: "X (Twitter) Thread synthesis is stable for all tiers. Pro_Engine supports Advanced Thread Formats and analytics derived from your single build-log."
    },
    {
      question: 'Can I use my existing unstructured notes?',
      answer: "Yes. The engine is designed to ingest raw brain-dumps, bullet points, or stream-of-consciousness logs and structure them into high-authority social content."
    },
    {
      question: 'Is my brand-voice data isolated?',
      answer: "Absolute isolation. Your build-logs, personalizations, and generated narratives are stored in a private vault partition. We do not aggregate your proprietary data for cross-user model training."
    },
    {
      question: 'How does the Permanent Vault work?',
      answer: "The Vault serves as your project's historical memory. Pro users can save any generation permanently, allowing you to reference past build-phases and maintain consistent narrative continuity over months or years."
    }
  ]

  return (
    <div className="space-y-40 py-16">

      {/* Header Section - Builder Aesthetic */}
      <div className="text-center space-y-6 sm:space-y-10 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center px-4 sm:px-5 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[9px] sm:text-[10px] font-black uppercase tracking-widest sm:tracking-[0.4em] font-mono shadow-sm">
          <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
          {user?.is_premium ? 'PRO PLAN ACTIVE' : 'FREE PLAN ACTIVE'}
        </div>

        <div className="relative inline-block w-full">
          <h1 className="text-4xl sm:text-6xl md:text-9xl font-display font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none relative z-20">
            Select your <br />
            <span className="text-indigo-600 dark:text-indigo-400 inline-block font-black">
              Ideal Plan.
            </span>
          </h1>
        </div>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto text-balance">
          Choose the plan that fits your content needs. Start growing your audience today.
        </p>

        {/* Improved Billing Toggle - Industrial Design */}
        <div className="flex justify-center pt-8 sm:pt-12">
          <div className="bg-zinc-200/50 dark:bg-slate-900/50 p-1.5 sm:p-2 rounded-[1.5rem] sm:rounded-3xl border-2 border-zinc-200 dark:border-slate-800 inline-flex shadow-inner backdrop-blur-3xl relative overflow-hidden group max-w-full">
            <div className="absolute inset-0 bg-grid-blueprint-light opacity-5 pointer-events-none" />
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 sm:px-10 py-3 sm:py-4 rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-widest transition-all duration-500 relative z-10 ${billingCycle === 'monthly'
                ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Cycle: Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 sm:px-10 py-3 sm:py-4 rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-widest transition-all duration-500 flex items-center gap-2 sm:gap-3 relative z-10 ${billingCycle === 'yearly'
                ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/40'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Cycle: Yearly
              <span className="text-[9px] sm:text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 font-black">
                -20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Pricing Cards - High Authority */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[1000px] h-[300px] md:h-[600px] bg-indigo-500/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none -z-10" />

        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-6 sm:p-8 md:p-12 rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[4rem] flex flex-col group overflow-hidden ${plan.popular
              ? 'bg-zinc-50 dark:bg-[#020617] border-2 border-indigo-600 shadow-4xl shadow-indigo-600/20 md:scale-[1.02] z-20'
              : 'bg-zinc-100/40 dark:bg-slate-900/40 backdrop-blur-3xl border border-zinc-200 dark:border-slate-800/80'
              }`}
          >
            {/* Blueprint Overlay on Cards */}
            <div className="absolute inset-0 bg-grid-blueprint-light opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            {/* Horizontal Scanline */}
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50 blur-sm opacity-0 group-hover:opacity-100 group-hover:animate-scanline pointer-events-none" />

            <div className="flex justify-between items-start mb-8 sm:mb-12 relative z-10 gap-4">
              <div className="space-y-3 min-w-0">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-black tracking-[0.1em] sm:tracking-[0.2em] uppercase border ${plan.popular ? "bg-indigo-600/10 text-indigo-500 border-indigo-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                  }`}>
                  {plan.badge || "STABLE_BUILD"}
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase truncate">{plan.name}</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] sm:text-xs tracking-widest">{plan.description}</p>
              </div>

              <div className={`p-4 rounded-[1.5rem] sm:rounded-[2rem] flex-shrink-0 ${plan.popular ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                {plan.id === 'pro' ? <Cpu className="w-6 h-6 sm:w-8 sm:h-8" /> : <Brackets className="w-6 h-6 sm:w-8 sm:h-8" />}
              </div>
            </div>

            <div className="mb-10 sm:mb-14 p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] bg-zinc-200/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 relative overflow-hidden group/price">
              <div className="absolute inset-0 bg-grid-blueprint-light opacity-5 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-center gap-4">
                <div className="text-center">
                  <span className="text-2xl sm:text-4xl font-black text-slate-900/40 dark:text-white/20 mr-2">$</span>
                  <span className="text-6xl sm:text-8xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter transition-transform group-hover/price:scale-110 duration-700 inline-block">
                    {plan.price[billingCycle]}
                  </span>
                  <span className="text-slate-500 font-black uppercase text-[10px] sm:text-xs tracking-widest block mt-3 sm:mt-4">
                    / {billingCycle === 'monthly' ? 'month_cycle' : 'year_cycle'}
                  </span>
                </div>
              </div>
            </div>

            <ul className="space-y-6 mb-16 flex-1 relative z-10">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-sm group/feat">
                  <div className={`mr-5 p-1.5 rounded-xl border transition-all ${plan.popular ? "bg-indigo-600/10 border-indigo-500/20 text-indigo-500" : "bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400"
                    }`}>
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-bold tracking-tight uppercase text-xs group-hover/feat:text-indigo-500 transition-colors">{feature}</span>
                </li>
              ))}
              {plan.limitations.map((limitation, i) => (
                <li key={i} className="flex items-center text-sm opacity-30 grayscale blur-[0.5px]">
                  <div className="mr-5 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-400">
                    <X className="w-4 h-4" />
                  </div>
                  <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">{limitation}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePlanSelection(plan.id)}
              disabled={isAuthenticated && (
                (plan.id === 'free' && !user?.is_premium) ||
                (plan.id === 'pro' && user?.is_premium)
              )}
              className={`w-full py-5 sm:py-7 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-base sm:text-lg uppercase tracking-tight sm:tracking-[0.2em] transition-all duration-500 relative overflow-hidden flex items-center justify-center gap-3 sm:gap-4 ${isAuthenticated && ((plan.id === 'free' && !user?.is_premium) || (plan.id === 'pro' && user?.is_premium))
                ? 'bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/20 cursor-not-allowed uppercase'
                : plan.popular
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-3xl shadow-indigo-600/40 hover:scale-[1.03] active:scale-95 group/btn'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.03] active:scale-95 group/btn'
                }`}
            >
              {isAuthenticated && ((plan.id === 'free' && !user?.is_premium) || (plan.id === 'pro' && user?.is_premium)) ? (
                <span className="flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base tracking-tight sm:tracking-widest">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="whitespace-nowrap">Current Build Active</span>
                </span>
              ) : (
                <>
                  {plan.popular && <Rocket className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform shrink-0" />}
                  <span className="truncate">{plan.cta}</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Technical Comparison Matrix - Engineered Layout */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-zinc-100/60 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] md:rounded-[5rem] overflow-hidden border border-zinc-200 dark:border-white/10 shadow-5xl group relative">
          {/* Internal Blueprint Texture */}
          <div className="absolute inset-0 bg-grid-blueprint-light opacity-5 pointer-events-none" />

          <div className="p-10 md:p-20 border-b border-slate-200 dark:border-white/5 text-center relative overflow-hidden group/header">
            {/* Corner Markers */}
            <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-indigo-500/30" />
            <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-indigo-500/30" />

            {/* Kinetic Scanline for Header */}
            <div className="absolute inset-x-0 h-[1px] bg-indigo-500/20 top-0 animate-scanline pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest sm:tracking-[0.3em] mb-6 border border-indigo-500/20 relative z-10">
              <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              PLAN_COMPARISON
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase relative z-10 leading-[0.85]">
              <span className="text-indigo-500">Feature</span>_Matrix
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[9px] sm:text-[10px] md:text-xs tracking-widest sm:tracking-[0.4em] mt-8 flex items-center justify-center gap-4 px-2">
              <span className="hidden md:block w-12 h-[1px] bg-slate-200 dark:bg-white/10" />
              Complete Feature Comparison
              <span className="hidden md:block w-12 h-[1px] bg-slate-200 dark:bg-white/10" />
            </p>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-center border-collapse min-w-[600px] md:min-w-0">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/5">
                  <th className="px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 text-left font-black text-[9px] sm:text-[11px] uppercase tracking-widest sm:tracking-[0.4em] text-zinc-400 dark:text-slate-400 font-mono">
                    [00] PARAMETER
                  </th>
                  <th className="px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 font-black text-[9px] sm:text-[11px] uppercase tracking-widest sm:tracking-[0.4em] text-zinc-400 dark:text-slate-400 font-mono">
                    [01] STARTER
                  </th>
                  <th className="px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 font-black text-[9px] sm:text-[11px] uppercase tracking-widest sm:tracking-[0.4em] text-indigo-500 font-mono bg-indigo-500/[0.02]">
                    [02] PRO_V1
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                {[
                  { name: 'LATENCY', free: 'STD', pro: 'ULTRA_LOW', icon: Zap },
                  { name: 'LOG_ANALYSIS', free: false, pro: true, icon: Database },
                  { name: 'INGESTION', free: '10K', pro: '50K', icon: Cpu },
                  { name: 'RETENTION', free: '24H', pro: 'LIFETIME', icon: Lock },
                  { name: 'SCHEMATICS', free: false, pro: true, icon: Brackets },
                  { name: 'DISTRIBUTION', free: false, pro: true, icon: Network },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-indigo-600/[0.04] border-b border-slate-200/50 dark:border-white/[0.03] last:border-0 transition-all group/row font-mono relative overflow-hidden">
                    <td className="px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 text-left font-black text-[12px] sm:text-[13px] text-slate-800 dark:text-slate-100 group-hover/row:text-indigo-500 transition-colors uppercase flex items-center gap-3 sm:gap-6">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center opacity-70 group-hover/row:opacity-100 group-hover/row:scale-110 group-hover/row:bg-indigo-500/10 transition-all border border-transparent group-hover/row:border-indigo-500/20 shadow-inner shrink-0">
                        {row.icon && <row.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-zinc-500 dark:text-slate-300 group-hover/row:text-indigo-500" />}
                      </div>
                      <span className="tracking-tight uppercase text-[10px] sm:text-xs md:text-sm truncate">{row.name.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 text-slate-500 dark:text-slate-500 font-bold text-[10px] sm:text-xs">
                      {typeof row.free === 'boolean' ? (
                        row.free ? (
                          <div className="inline-flex items-center gap-2 text-emerald-500/50">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 opacity-40">
                            <div className="w-8 sm:w-16 h-1 bg-slate-200 dark:bg-white/10 rounded-full" />
                          </div>
                        )
                      ) : (
                        <span className="uppercase tracking-widest">{row.free}</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 font-black text-slate-900 dark:text-white text-xs sm:text-base tracking-tighter bg-indigo-500/[0.02] relative">
                      <div className="absolute inset-y-0 left-0 w-[2px] bg-indigo-500/20 group-hover/row:bg-indigo-500 transition-colors" />
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <div className="inline-flex items-center gap-2 sm:gap-3 text-indigo-500">
                            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/40">
                              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className="text-[11px] sm:text-[13px] font-black uppercase tracking-widest sm:tracking-[0.2em]">ACT</span>
                          </div>
                        ) : (
                          <Minus className="w-5 h-5 sm:w-6 sm:h-6 mx-auto opacity-10" />
                        )
                      ) : (
                        <div className="flex flex-col items-center gap-1 sm:gap-2">
                          <span className="uppercase text-[11px] sm:text-sm md:text-base font-black tracking-tight sm:tracking-[0.1em] bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-indigo-300 to-indigo-600 truncate max-w-[80px] sm:max-w-none">{row.pro}</span>
                          <div className="flex gap-1 justify-center">
                            {[1, 2, 3].map(d => (
                              <div key={d} className="w-3 sm:w-4 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Technical Note */}
          <div className="p-6 bg-zinc-100/50 dark:bg-white/[0.02] border-t border-zinc-200 dark:border-white/5 text-center">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">
              [ SECURE_ENVIRONMENT_STABLE_V1.04 ]
            </p>
          </div>
        </div>
      </div>

      {/* Engineering FAQ Section */}
      <div className="max-w-5xl mx-auto px-6 pb-40">
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1 rounded-lg bg-indigo-600/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
            <Workflow className="w-3.5 h-3.5" />
            HELP_CENTER
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.9]">Common Questions</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Everything you need to know</p>
        </div>
        <div className="grid md:grid-cols-1 gap-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selectedPlan={selectedPlan}
        billingCycle={billingCycle}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        initialMode={authModalMode}
      />

      <DowngradeModal
        isOpen={showDowngradeModal}
        onClose={() => setShowDowngradeModal(false)}
        onConfirm={handleDowngradeToFree}
        isLoading={isDowngrading}
      />
    </div>
  )
}