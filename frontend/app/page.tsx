'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Loader2, Zap } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { useFeatureGate } from '../hooks/useFeatureGate'
import { useUserPreferences } from '../contexts/UserPreferencesContext'
import { usePaymentProcessing } from '../contexts/PaymentProcessingContext'
import { requestCache } from '@/lib/cache-util'
import { API_URL } from '@/lib/api-config'

// Components
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthModal from '../components/AuthModal'
import PaymentModal from '../components/PaymentModal'
import CustomTemplateModal from '../components/CustomTemplateModal'
import TemplateSelector from '../components/TemplateSelector'
import DashboardModal from '../components/DashboardModal'
import SupportModal from '../components/SupportModal'
import SubscriptionWarning from '../components/SubscriptionWarning'

// New Landing Components
// New Landing Components
import HeroSection from '../components/landing/HeroSection'
import HowItWorks from '../components/landing/HowItWorks'
import RepurposeInterface from '../components/landing/RepurposeInterface'

interface SocialMediaResponse {
  twitter_thread: string[]
  original_content_preview: string
}

type TabType = 'home' | 'features' | 'pricing' | 'updates' | 'about' | 'community'
type OnboardingStep = 'welcome' | 'choose-input' | 'add-content' | 'transform' | 'results' | 'completed'

function HomeContent() {
  const { user, isAuthenticated, isLoading: authLoading, forceRestoreAuth, updateUser } = useAuth()
  const featureGate = useFeatureGate()
  const { autoSaveEnabled } = useUserPreferences()
  const { isProcessingPayment, setIsProcessingPayment } = usePaymentProcessing()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isMountedRef = useRef(true)

  // Get initial tab
  const [activeMainTab, setActiveMainTab] = useState<TabType>('home')

  // App State
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SocialMediaResponse | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'url'>('content')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome')
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [transformProgress, setTransformProgress] = useState(0)
  const [currentProcessingStep, setCurrentProcessingStep] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login')
  const [usageStats, setUsageStats] = useState<any>(null)
  const [paymentProcessed, setPaymentProcessed] = useState(false)
  const [verificationInProgress, setVerificationInProgress] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showCustomTemplateModal, setShowCustomTemplateModal] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [templateSelectorSource, setTemplateSelectorSource] = useState<string>('all')
  const [showDashboard, setShowDashboard] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [enabledPlatforms, setEnabledPlatforms] = useState<string[]>(['twitter'])
  const [browserFingerprint, setBrowserFingerprint] = useState<any>(null)

  // Personalization State
  const [personalization, setPersonalization] = useState({
    audience: '',
    tone: 'Professional',
    mood: 'Neutral',
    goal: '',
    event: '',
    importance: '',
    highlights: '',
    role: '',
    lessons: '',
    shoutouts: '',
    xThreadType: 'Educational',
    cta: ''
  })
  const [showPersonalization, setShowPersonalization] = useState(true)

  useEffect(() => {
    return () => { isMountedRef.current = false }
  }, [])

  // Load pending template or autosaved draft
  useEffect(() => {
    const pendingTemplateStr = localStorage.getItem('pendingTemplate')
    if (pendingTemplateStr) {
      try {
        const template = JSON.parse(pendingTemplateStr)
        setContent(template.content)
        setActiveTab('content')
        toast.success(`Template "${template.name}" loaded!`)
        localStorage.removeItem('pendingTemplate')
      } catch (e) {
        localStorage.removeItem('pendingTemplate')
      }
    } else {
      // Try to load autosaved draft
      const savedDraft = localStorage.getItem('autosave_draft_content')
      if (savedDraft && !content) {
        setContent(savedDraft)
        // Optional: toast('Restored unsaved draft', { icon: '📝' })
      }
    }
  }, [isAuthenticated])

  // Auto-save draft
  useEffect(() => {
    if (!content || !autoSaveEnabled) return

    const timeoutId = setTimeout(() => {
      localStorage.setItem('autosave_draft_content', content)
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [content, autoSaveEnabled])

  // Browser info
  useEffect(() => {
    const collectBrowserInfo = () => {
      const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        timestamp: Date.now()
      }
      setBrowserFingerprint(fingerprint)
    }
    collectBrowserInfo()
  }, [])

  // Auth success
  useEffect(() => {
    const handleAuthSuccess = () => forceRestoreAuth()
    window.addEventListener('auth-success', handleAuthSuccess)
    return () => window.removeEventListener('auth-success', handleAuthSuccess)
  }, [forceRestoreAuth])

  // Tab switch
  useEffect(() => {
    const handleSwitchTab = (event: CustomEvent) => {
      if (event.detail?.tab) {
        setActiveMainTab(event.detail.tab as TabType)
        if (event.detail.tab === 'pricing') window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    window.addEventListener('switch-tab', handleSwitchTab as EventListener)
    return () => window.removeEventListener('switch-tab', handleSwitchTab as EventListener)
  }, [])

  // First visit logic
  useEffect(() => {
    const hasVisited = localStorage.getItem('reword-visited')
    if (!hasVisited && !isAuthenticated) {
      setShowOnboarding(true)
      setIsFirstVisit(true)
    } else {
      setIsFirstVisit(false)
    }
    if (!authLoading && !isAuthenticated) {
      const storedToken = localStorage.getItem('access_token')
      if (storedToken) forceRestoreAuth()
    }
  }, [isAuthenticated, authLoading, forceRestoreAuth])

  // Load usage stats
  const loadUsageStats = useCallback(async () => {
    if (isAuthenticated && user) {
      try {
        const cacheKey = `usage-stats-${user.id}`
        const stats = await requestCache.get(
          cacheKey,
          async () => {
            const response = await axios.get(`${API_URL}/api/v1/auth/usage-stats`)
            return response.data
          },
          30 * 60 * 1000
        )
        setUsageStats(stats)
      } catch (error) {
        setUsageStats({
          total_generations: 0,
          remaining_requests: 2,
          rate_limit: 2,
          is_premium: false,
          subscription_tier: 'free'
        })
      }
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (!isProcessingPayment) loadUsageStats()
  }, [isAuthenticated, user?.id, isProcessingPayment, loadUsageStats])

  // Payment Verification Logic
  const verifyPayment = useCallback(async (subscriptionId?: string, paymentId?: string) => {
    if (verificationInProgress) return
    setVerificationInProgress(true)
    try {
      const verifyResponse = await axios.post(`${API_URL}/api/v1/payment/check-status`, {
        subscription_id: subscriptionId,
        payment_id: paymentId
      })
      if (verifyResponse.data.success) {
        if (verifyResponse.data.status === 'failed') {
          toast.error('Payment verification failed. Please try again.')
          return
        }
        if (verifyResponse.data.is_premium) {
          updateUser({ is_premium: true })
          toast.success('🎉 Premium features unlocked!')
          if (user?.id) requestCache.invalidate(`usage-stats-${user.id}`)
        } else {
          toast.success('Payment processed! upgraded shortly.')
        }
      } else {
        toast.error('Payment verification failed.')
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Please log in again to complete the upgrade')
      }
    } finally {
      setVerificationInProgress(false)
    }
  }, [updateUser, verificationInProgress, user?.id])

  // Handle Payment Success Redirect
  useEffect(() => {
    if (typeof window !== 'undefined' && !paymentProcessed && !isProcessingPayment) {
      const urlParams = new URLSearchParams(window.location.search)
      const paymentStatus = urlParams.get('payment')
      const subscriptionId = urlParams.get('subscription_id') || undefined
      const paymentId = urlParams.get('payment_id') || undefined

      if (paymentStatus === 'success') {
        setIsProcessingPayment(true)
        setPaymentProcessed(true)
        window.history.replaceState({}, document.title, window.location.pathname)
        toast.success('🎉 Payment successful! Verifying...')

        setTimeout(() => {
          if (isAuthenticated && user) {
            verifyPayment(subscriptionId, paymentId).finally(() => {
              setIsProcessingPayment(false)
              setTimeout(() => setShowDashboard(true), 2000)
            })
          } else {
            forceRestoreAuth()
            setTimeout(() => {
              verifyPayment(subscriptionId, paymentId).finally(() => setIsProcessingPayment(false))
            }, 1000)
          }
        }, 1000)
      }
    }
  }, [isAuthenticated, paymentProcessed, isProcessingPayment, user, verifyPayment, forceRestoreAuth, setIsProcessingPayment])

  const handleSaveContent = async (title: string, type: string, contentStr: string, showToastMsg = true) => {
    if (!isAuthenticated) return
    try {
      await axios.post(`${API_URL}/api/v1/content/save`, {
        title: title || 'Untitled',
        content_type: type,
        content: contentStr,
        source_url: activeTab === 'url' ? url : undefined
      })
      if (showToastMsg) toast.success('Content saved to dashboard!')
      requestCache.invalidate(`dashboard-saved-content-${user?.id}`)
      // Also invalidate history as saving might update "is_saved" status in history if applicable
      requestCache.invalidate(`dashboard-content-history-${user?.id}`)
    } catch (error) {
      if (showToastMsg) toast.error('Failed to save content')
    }
  }

  const handleSubmit = async () => {
    if (!content.trim() && !url.trim()) {
      toast.error('Please enter content or URL')
      return
    }

    setIsLoading(true)
    setResults(null)
    setTransformProgress(0)

    let progress = 0
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 10
        setTransformProgress(Math.min(progress, 90))
        if (progress < 30) setCurrentProcessingStep('Analyzing content...')
        else if (progress < 60) setCurrentProcessingStep('Extracting insights...')
        else setCurrentProcessingStep('Generating social posts...')
      }
    }, 500)

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/repurpose`,
        activeTab === 'url'
          ? { url, context: personalization, enabled_platforms: enabledPlatforms }
          : { content, context: personalization, enabled_platforms: enabledPlatforms },
        { timeout: 120000 }
      )

      clearInterval(progressInterval)
      setTransformProgress(100)
      setCurrentProcessingStep('Complete!')
      setResults(response.data)
      toast.success('🚀 Posts are ready!')

      requestCache.invalidate(`usage-stats-${user?.id}`)
      requestCache.invalidate(`dashboard-content-history-${user?.id}`)
      loadUsageStats()

      if (isAuthenticated && user?.is_premium && autoSaveEnabled) {
        handleSaveContent(
          `Auto-saved: ${new Date().toLocaleDateString()}`,
          'auto-generated',
          JSON.stringify({
            twitter: response.data.twitter_thread,
            original: activeTab === 'url' ? url : content
          }),
          false
        )
      }

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 500)

    } catch (error: any) {
      clearInterval(progressInterval)
      setTransformProgress(0)

      if (error.response?.status === 429) {
        toast.error('Rate limit exceeded. Please upgrade or wait.')
        if (!isAuthenticated) {
          setTimeout(() => {
            setShowAuthModal(true)
            setAuthModalMode('register')
          }, 1500)
        } else {
          setShowPaymentModal(true)
        }
      } else {
        toast.error('Failed to generate content. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-indigo-100 font-sans">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        usageStats={usageStats}
        activeMainTab={activeMainTab}
        onSignIn={() => { setShowAuthModal(true); setAuthModalMode('login') }}
        onSignUp={() => { setShowAuthModal(true); setAuthModalMode('register') }}
        onUserDashboard={() => setShowDashboard(true)}
        onTabChange={(tab) => setActiveMainTab(tab as TabType)}
      />

      <main className="pt-24 pb-20 relative">
        <SubscriptionWarning />

        {activeMainTab === 'home' && (
          <div className="animate-fade-in">
            {!results && (
              <>
                <HeroSection
                  isAuthenticated={isAuthenticated}
                  onStartCreating={() => document.getElementById('repurpose-tool')?.scrollIntoView({ behavior: 'smooth' })}
                  onSignIn={() => { setShowAuthModal(true); setAuthModalMode('login') }}
                  onSignUp={() => { setShowAuthModal(true); setAuthModalMode('register') }}
                />
                <HowItWorks />
              </>
            )}

            <RepurposeInterface
              isAuthenticated={isAuthenticated}
              user={user}
              usageStats={usageStats}
              featureGate={featureGate}
              content={content}
              setContent={setContent}
              url={url}
              setUrl={setUrl}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              results={results}
              transformProgress={transformProgress}
              currentProcessingStep={currentProcessingStep}
              handleSaveContent={(t, type, c) => handleSaveContent(t, type, c, true)}
              personalization={personalization}
              setPersonalization={setPersonalization}
              showPersonalization={showPersonalization}
              setShowPersonalization={setShowPersonalization}
              onShowAuthModal={(mode) => { setShowAuthModal(true); setAuthModalMode(mode) }}
              onShowPaymentModal={() => setShowPaymentModal(true)}
              onShowDashboard={() => setShowDashboard(true)}
              onStartOnboarding={() => setShowOnboarding(true)}
              onShowCustomTemplateModal={() => setShowCustomTemplateModal(true)}
              onShowTemplateSelector={() => { setTemplateSelectorSource('all'); setShowTemplateSelector(true) }}
              setTemplateSelectorSource={setTemplateSelectorSource}
            />
          </div>
        )}

        {activeMainTab !== 'home' && (
          <div className="container mx-auto px-4 py-20 text-center">
            <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-muted-foreground">This section is being updated with our new design.</p>
            <button
              onClick={() => setActiveMainTab('home')}
              className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
            >
              Return Home
            </button>
          </div>
        )}
      </main>

      <Footer onSupportClick={() => setShowSupportModal(true)} />

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        selectedPlan={user?.is_premium ? 'pro' : 'free'}
      />

      <DashboardModal
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
        externalUsageStats={usageStats}
      />

      <CustomTemplateModal
        isOpen={showCustomTemplateModal}
        onClose={() => setShowCustomTemplateModal(false)}
        onTemplateCreated={() => {
          toast.success('Template saved!')
          setShowCustomTemplateModal(false)
        }}
      />

      <TemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onTemplateSelect={(template: { content: string }) => {
          setContent(template.content)
          setActiveTab('content')
          setShowTemplateSelector(false)
          toast.success('Template loaded!')
          document.getElementById('repurpose-tool')?.scrollIntoView({ behavior: 'smooth' })
        }}
        defaultSource={templateSelectorSource}
      />

      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
