'use client'

import React from 'react'
import { X, AlertTriangle, Crown, Users, FileText, Download, Zap, Shield } from 'lucide-react'

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
      icon: <Zap className="w-5 h-5 text-red-400" />,
      title: '20 Daily Neural Syntheses',
      description: 'Back to 2 generations per day [Basic Build-Log]'
    },
    {
      icon: <FileText className="w-5 h-5 text-red-400" />,
      title: 'Multi-Thread URL Synthesis',
      description: 'No more direct URL content extraction'
    },
    {
      icon: <Shield className="w-5 h-5 text-red-400" />,
      title: 'Permanent Vault Storage',
      description: 'Lose access to your historical project memory'
    },
    {
      icon: <Download className="w-5 h-5 text-red-400" />,
      title: 'Technical Data Export',
      description: 'No Markdown, JSON, or CSV schema exports'
    },
    {
      icon: <FileText className="w-5 h-5 text-red-400" />,
      title: 'Brand-Voice Profiles',
      description: 'Cannot utilize personalized AI personas'
    },
    {
      icon: <Users className="w-5 h-5 text-red-400" />,
      title: 'Priority Schematic Execution',
      description: 'Slower processing speeds on peak loads'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Downgrade to Free_Build</h2>
              <p className="text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Status: DEPLOY_TERMINATION_PROTOCOL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Warning Message */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-black text-red-800 dark:text-red-400 mb-1 uppercase tracking-tight">
                  CRITICAL: IRREVERSIBLE_ACTION
                </h3>
                <p className="text-red-700 dark:text-red-300 text-xs font-medium leading-relaxed">
                  Your Pro_Engine environment will be terminated. Access to neural synthesis vaults and personalization schematics will be restricted. Data in your permanent vault may be archived or inaccessible.
                </p>
              </div>
            </div>
          </div>

          {/* Features You'll Lose */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Pro Features You'll Lose
            </h3>
            <div className="space-y-3">
              {featuresYouWillLose.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  {feature.icon}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{feature.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What You'll Keep */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What You'll Keep (Free Plan)
            </h3>
            <div className="bg-green-50 dark:bg-emerald-900/10 border border-green-200 dark:border-emerald-800/50 rounded-lg p-4 font-mono">
              <ul className="space-y-2 text-[10px] text-green-800 dark:text-emerald-400 font-bold uppercase tracking-wide">
                <li>• 2 DAILY SYNTHESES [STABLE_BUILD]</li>
                <li>• CORE BUILD-LOG PROCESSING</li>
                <li>• X/TWITTER THREAD SCHEMATICS</li>
                <li>• SECURE_COPY PROTOCOL</li>
                <li>• 24-HOUR HISTORY BUFFER</li>
              </ul>
            </div>
          </div>

          {/* Alternative Options */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
              Consider These Alternatives
            </h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• Pause your subscription temporarily instead of cancelling</li>
              <li>• Contact support if you're having billing issues</li>
              <li>• Export your saved content before downgrading</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            This will cancel your subscription immediately
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors disabled:opacity-50"
            >
              Keep Pro Plan
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Downgrading...
                </>
              ) : (
                'YES, INITIALIZE_DOWNGRADE'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}