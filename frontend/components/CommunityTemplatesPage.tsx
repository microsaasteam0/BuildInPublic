'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Search, Globe, TrendingUp, Calendar, Eye, Copy, FileText, Crown, Lock, Users, Grid, List, RefreshCw, Sparkles, Filter } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { requestCache } from '@/lib/cache-util'
import { API_URL } from '@/lib/api-config'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CommunityTemplate {
  id: number
  name: string
  description?: string
  category: string
  content: string
  tags?: string
  is_public: boolean
  usage_count: number
  is_favorite: boolean
  created_at: string
  updated_at?: string
  user_id: number
  is_own_template: boolean
}

interface CommunityTemplatesPageProps {
  onBack: () => void
  onTemplateSelect?: (template: CommunityTemplate) => void
  onUpgradeClick?: () => void
}

const CommunityTemplatesPage: React.FC<CommunityTemplatesPageProps> = ({
  onBack,
  onTemplateSelect,
  onUpgradeClick
}) => {
  const { user } = useAuth()
  const [templates, setTemplates] = useState<CommunityTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedTemplate, setExpandedTemplate] = useState<number | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🌐' },
    { value: 'blog', label: 'Blog Posts', icon: '📝' },
    { value: 'newsletter', label: 'Newsletters', icon: '📧' },
    { value: 'marketing', label: 'Marketing', icon: '🎯' },
    { value: 'social', label: 'Social Media', icon: '📱' },
    { value: 'other', label: 'Other', icon: '📋' }
  ]

  useEffect(() => {
    const cacheKey = `community-templates-${selectedCategory}-${sortBy}`
    const cachedData = requestCache.getCached<CommunityTemplate[]>(cacheKey)

    if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
      setTemplates(cachedData)
      setIsFromCache(true)
      setIsLoading(false)
    } else {
      setIsLoading(true)
      setIsFromCache(false)
    }

    setTimeout(() => {
      loadCommunityTemplates()
    }, 100)
  }, [selectedCategory, sortBy])

  const loadCommunityTemplates = async () => {
    try {
      if (!isFromCache) setIsLoading(true)

      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)

      const cacheKey = `community-templates-${selectedCategory}-${sortBy}`
      const url = `${API_URL}/api/v1/public/templates?${params.toString()}`

      const response = await requestCache.get(
        cacheKey,
        async () => {
          const res = await axios.get(url)
          return res.data
        },
        5 * 60 * 1000
      )

      let sortedTemplates = response
      if (sortBy === 'popular') {
        sortedTemplates.sort((a: CommunityTemplate, b: CommunityTemplate) => b.usage_count - a.usage_count)
      } else {
        sortedTemplates.sort((a: CommunityTemplate, b: CommunityTemplate) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      }

      setTemplates(sortedTemplates)
      setIsFromCache(false)

    } catch (error: any) {
      console.error('Error loading community templates:', error)
      if (error.response?.status === 401) {
        toast.error('Please sign in again to access community templates')
      } else {
        toast.error('Failed to load community templates')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateUse = async (template: CommunityTemplate) => {
    if (!user?.is_premium) {
      if (onUpgradeClick) onUpgradeClick()
      return
    }

    try {
      await axios.post(`${API_URL}/api/v1/templates/${template.id}/use`)
      setTemplates(prev => prev.map(t =>
        t.id === template.id ? { ...t, usage_count: t.usage_count + 1 } : t
      ))
      const cacheKey = `community-templates-${selectedCategory}-${sortBy}`
      requestCache.invalidate(cacheKey)

      if (onTemplateSelect) onTemplateSelect(template)
      toast.success(`Template "${template.name}" loaded!`)
      onBack()
    } catch (error: any) {
      console.error('Error using template:', error)
      toast.error('Failed to use template')
    }
  }

  const refreshTemplates = async () => {
    const cacheKey = `community-templates-${selectedCategory}-${sortBy}`
    requestCache.invalidate(cacheKey)
    setIsFromCache(false)
    await loadCommunityTemplates()
    toast.success('Templates refreshed!')
  }

  const handleCopyContent = async (content: string, templateName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user?.is_premium) {
      if (onUpgradeClick) onUpgradeClick()
      return
    }

    try {
      await navigator.clipboard.writeText(content)
      toast.success(`"${templateName}" content copied!`)
    } catch (error) {
      toast.error('Failed to copy content')
    }
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchQuery ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const TemplateCard = ({ template }: { template: CommunityTemplate }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative glass-card rounded-2xl p-6 group cursor-pointer border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 ${!user?.is_premium ? 'opacity-90' : ''}`}
      onClick={() => handleTemplateUse(template)}
    >
      {!user?.is_premium && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Crown className="w-10 h-10 text-amber-500 mb-2" />
          <span className="font-bold text-lg mb-1">Pro Feature</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (onUpgradeClick) onUpgradeClick()
            }}
            className="mt-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg"
          >
            Unlock Now
          </button>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl">
            {categories.find(c => c.value === template.category)?.icon || '📄'}
          </div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{template.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground uppercase tracking-wider font-bold">
                {template.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10 leading-relaxed">
        {template.description || "No description provided."}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4 max-h-16 overflow-hidden">
        {template.tags?.split(',').slice(0, 3).map((tag, i) => (
          <span key={i} className="text-xs px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground border border-border/50">
            #{tag.trim()}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> {template.usage_count} uses
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> {new Date(template.created_at).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center justify-center md:justify-start gap-3">
            <Globe className="w-8 h-8 text-primary" />
            Community <span className="text-gradient">Templates</span>
          </h1>
          <p className="text-muted-foreground">Discover proven templates from our creator community.</p>
        </div>

        {!user?.is_premium && (
          <button
            onClick={() => onUpgradeClick?.()}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Crown className="w-4 h-4" /> Unlock All Templates
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="glass-card rounded-2xl p-4 md:p-6 border border-border/50 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/30 rounded-xl pl-12 pr-4 py-3 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.value
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-l border-border pl-0 md:pl-4">
            <button
              onClick={refreshTemplates}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <div className="bg-secondary/30 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading && !isFromCache ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No templates found matching your criteria.</p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          <AnimatePresence>
            {filteredTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Footer Stats */}
      <div className="text-center text-sm text-muted-foreground">
        <p>{filteredTemplates.length} templates available • Updated just now</p>
      </div>
    </div>
  )
}

export default CommunityTemplatesPage