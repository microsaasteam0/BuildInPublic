'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle, Crown, Users, FileText, Download, Zap, Shield, Loader2, Activity, Box, Terminal, Workflow, Database } from 'lucide-react'

interface DowngradeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}

export default function DowngradeModal({ isOpen, onClose, onConfirm, isLoading }: DowngradeModalProps) {
  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const featuresYouWillLose = [
    {
      icon: <Zap className="w-5 h-5 text-red-500" />,
      title: '20 Daily Neural Syntheses',
      description: 'Back to 2 units per cycle [Basic Build-Log]'
    },
    {
      icon: <Activity className="w-5 h-5 text-red-500" />,
      title: 'Deep Build-Log Analysis',
      description: 'Loss of high-velocity narrative ingestion'
    },
    {
      icon: <Workflow className="w-5 h-5 text-red-500" />,
      title: 'Multi-Thread Synthesis',
      description: 'No more automated serial distribution'
    },
    {
      icon: <Database className="w-5 h-5 text-red-500" />,
      title: 'Unlimited Permanent Vault',
      description: 'Historical project memory will be restricted'
    },
    {
      icon: <Shield className="w-5 h-5 text-red-500" />,
      title: 'Brand-Voice Profiles',
      description: 'Personalized AI personas will be locked'
    },
    {
      icon: <Download className="w-5 h-5 text-red-500" />,
      title: 'Technical Data Export',
      description: 'No Markdown or JSON schematic dumps'
    }
  ]

  return createPortal(
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[2000000] flex items-center justify-center p-4">
      <div className="relative bg-slate-900 rounded-[2.5rem] border border-red-500/30 max-w-xl w-full max-h-[90vh] overflow-hidden shadow-3xl animate-kinetic-glow">

        {/* Innovative 'Builder' Background Matrix */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-grid-blueprint-light opacity-[0.10]" />
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent pointer-events-none" />

          {/* Moving Scanline */}
          <div className="absolute inset-0 overflow-hidden opacity-5">
            <div className="w-full h-1 bg-red-500 animate-scanline" />
          </div>
        </div>

        {/* Header */}
        <div className="relative p-8 pb-4 flex items-center justify-between z-10 border-b border-white/5">
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/20 mb-2">
              <Activity className="w-3 h-3 animate-pulse" />
              TERMINATION_PHASE.ACTIVE
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="p-2.5 bg-red-500/20 rounded-xl border border-red-500/30">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight uppercase">Downgrade Core</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.1em] mt-0.5">ID: DEPLOY_TERMINATION_PROTOCOL</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full p-2.5 transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative p-5 sm:p-8 pt-4 sm:pt-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] z-10 custom-scrollbar">
          {/* Warning Message */}
          <div className="relative bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 overflow-hidden group">
            <div className="absolute inset-0 bg-grid-blueprint-light opacity-5 transition-opacity" />
            <div className="relative flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 border border-red-500/30">
                <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-black text-red-500 mb-1 sm:mb-1.5 uppercase tracking-tighter text-xs sm:text-sm flex items-center gap-2">
                  <span className="animate-pulse">●</span> ERROR: IRREVERSIBLE_ACTION
                </h3>
                <p className="text-red-400/80 text-[10px] sm:text-xs font-medium leading-relaxed">
                  Your Pro_Engine environment will be terminated. Access to neural synthesis vaults and personalization schematics will be restricted. Data in your permanent vault may be archived or inaccessible.
                </p>
              </div>
            </div>
          </div>

          {/* Features You'll Lose */}
          <div className="mb-8">
            <h3 className="text-[10px] font-black text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-[0.2em] font-mono">
              <Crown className="w-3 h-3 text-indigo-500" />
              DEPRECATED_CAPABILITIES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {featuresYouWillLose.map((feature, index) => (
                <div key={index} className="flex flex-col gap-1.5 sm:gap-2 p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 hover:border-red-500/20 hover:bg-white/10 transition-all duration-300 group/item">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover/item:scale-110 transition-transform">
                    {React.cloneElement(feature.icon as React.ReactElement, { className: 'w-3.5 h-3.5 text-red-500' })}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-[10px] sm:text-[11px] uppercase tracking-tight group-hover/item:text-red-400 transition-colors">{feature.title}</h4>
                    <p className="text-slate-500 text-[9px] sm:text-[10px] leading-snug mt-0.5">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
            {/* What You'll Keep */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em] font-mono">
                RETAINED_RESOURCES
              </h3>
              <div className="bg-emerald-500/5 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-4 sm:p-5 font-mono">
                <ul className="space-y-2.5 sm:space-y-3">
                  {[
                    '2 DAILY GENERATIONS',
                    'BASIC BUILD-LOG SYNTHESIS',
                    'STANDARD TEMPLATES',
                    'CORE TONE PARAMETERS',
                    '24HR HISTORY BUFFER'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 sm:gap-3 text-[9px] sm:text-[10px] text-emerald-500 font-bold tracking-widest uppercase">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Alternative Options */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em] font-mono">
                SAFETY_PROTOCOLS
              </h3>
              <div className="bg-indigo-500/5 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-4 sm:p-5">
                <ul className="space-y-2.5 sm:space-y-3">
                  {[
                    'SUSPEND_SYNAPSE_STREAM',
                    'MISSION_CONTROL_SYNC',
                    'VAULT_SCHEMATIC_DUMP'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 sm:gap-3 text-[9px] sm:text-[10px] text-indigo-400 font-bold tracking-widest uppercase">
                      <Terminal className="w-2.5 h-2.5 text-indigo-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Pillar */}
        <div className="relative p-6 sm:p-8 bg-black/40 border-t border-white/5 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
              <div className="text-[9px] sm:text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                TERMINATION_IMMEDIATE_EFFECT
              </div>
              <p className="text-slate-500 text-[8px] sm:text-[9px] uppercase font-bold tracking-tighter">ENVIRONMENT_WIPE_SCHEDULED_T-0</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full md:w-auto">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest px-4 py-2.5 transition-colors font-mono"
              >
                ABORT_TERMINATION
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="w-full sm:w-auto group relative py-3 sm:py-3.5 px-6 sm:px-8 bg-red-600 text-white rounded-xl font-black text-[10px] shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.02] hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden uppercase tracking-widest font-mono"
              >
                <div className="absolute inset-0 shimmer-text opacity-30" />
                <span className="relative flex items-center justify-center gap-2 whitespace-nowrap">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      DOWNGRADING...
                    </>
                  ) : (
                    <>
                      CONFIRM_DOWNGRADE
                      <Box className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}