'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Plus, Edit, Trash2, Star, Globe, Lock, Copy, Eye, Tag, Calendar, TrendingUp, Crown, Zap, Twitter } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import CustomTemplateModal from './CustomTemplateModal'
import { useAuth } from '../contexts/AuthContext'
import { API_URL } from '../lib/api-config'

interface CustomTemplate {
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
  is_own_template?: boolean
}

interface CustomTemplateManagerProps {
  onTemplateSelect?: (template: CustomTemplate) => void
  showSelectButton?: boolean
  hideHeader?: boolean // Add prop to hide header when used in dashboard
  onClose?: () => void // Add prop to close modal when navigating
}

const CustomTemplateManager: React.FC<CustomTemplateManagerProps> = ({
  onTemplateSelect,
  showSelectButton = false,
  hideHeader = false,
  onClose
}) => {
  const { user } = useAuth()
  const router = useRouter()
  const [templates, setTemplates] = useState<CustomTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedTemplate, setExpandedTemplate] = useState<number | null>(null)

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'blog', label: 'Blog Posts' },
    { value: 'newsletter', label: 'Newsletters' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'social', label: 'Social Media' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    // Only load templates for premium users
    if (user?.is_premium) {
      loadTemplates()
    } else {
      // Clear templates for non-premium users
      setTemplates([])
      setIsLoading(false)
    }
  }, [selectedCategory, user?.is_premium])

  const loadTemplates = async () => {
    // Don't load templates for non-premium users
    if (!user?.is_premium) {
      setTemplates([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      // Only load user's own templates in the management interface
      params.append('include_public', 'false')

      const url = `${API_URL}/api/v1/templates/?${params.toString()}`
      const response = await axios.get(url)
      setTemplates(response.data)
    } catch (error: any) {
      console.error('Error loading templates:', error)
      if (error.response?.status === 403) {
        toast.error('ERROR_PRO_LICENSE_REQUIRED')
      } else {
        toast.error('ERROR_TEMPLATE_SYNC_FAILURE')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateCreated = (newTemplate: CustomTemplate) => {
    setTemplates(prev => [newTemplate, ...prev])
    setShowCreateModal(false)
    setEditingTemplate(null)
  }

  const handleTemplateUpdated = (updatedTemplate: CustomTemplate) => {
    setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t))
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = async (templateId: number) => {
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return
    }

    try {
      await axios.delete(`${API_URL}/api/v1/templates/${templateId}`)
      setTemplates(prev => prev.filter(t => t.id !== templateId))
      toast.success('TEMPLATE_PURGE_SUCCESS')
    } catch (error: any) {
      console.error('Error deleting template:', error)
      toast.error('ERROR_TEMPLATE_PURGE_FAILURE')
    }
  }

  const handleUseTemplate = async (template: CustomTemplate) => {
    try {
      // Increment usage count
      await axios.post(`${API_URL}/api/v1/templates/${template.id}/use`)

      // Update local state
      setTemplates(prev => prev.map(t =>
        t.id === template.id
          ? { ...t, usage_count: t.usage_count + 1 }
          : t
      ))

      if (onTemplateSelect) {
        onTemplateSelect(template)
      }

      toast.success('PROTOCOL_TEMPLATE_LOAD_SUCCESS')
    } catch (error: any) {
      console.error('Error using template:', error)
      toast.error('ERROR_TEMPLATE_EXEC_FAILURE')
    }
  }

  const handleCopyContent = async (content: string, templateName: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success('PROTOCOL_CLIPBOARD_SUCCESS')
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = content
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success(`"${templateName}" content copied to clipboard!`)
    }
  }

  const toggleFavorite = async (template: CustomTemplate) => {
    try {
      const response = await axios.put(`${API_URL}/api/v1/templates/${template.id}`, {
        is_favorite: !template.is_favorite
      })

      setTemplates(prev => prev.map(t =>
        t.id === template.id
          ? { ...t, is_favorite: !t.is_favorite }
          : t
      ))

      toast.success(template.is_favorite ? 'NODE_FAVORITE_REMOVED' : 'NODE_FAVORITE_STABLE')
    } catch (error: any) {
      console.error('Error toggling favorite:', error)
      toast.error('ERROR_FAVORITE_SYNC_FAILURE')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'blog': return '📝'
      case 'newsletter': return '📧'
      case 'marketing': return '🎯'
      case 'social': return '📱'
      default: return '📄'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredTemplates = templates.filter(template => {
    if (selectedCategory === 'all') return true
    return template.category === selectedCategory
  })

  return (
    <div className="space-y-6">
      {/* Header - Only show if not hidden */}
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Custom Templates</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.is_premium
                ? 'Create and manage your reusable content templates'
                : 'Upgrade to Pro to create and manage custom templates'
              }
            </p>
          </div>
          {user?.is_premium ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                <Crown className="w-4 h-4 text-yellow-500 dark:text-yellow-400 mr-2" />
                <span className="text-yellow-500 dark:text-yellow-400 font-medium text-sm">Pro Feature</span>
              </div>
              <button
                onClick={() => toast.error('ERROR_PRO_LICENSE_REQUIRED')}
                className="px-4 py-2 bg-gray-600/20 text-gray-500 rounded-lg font-medium transition-all duration-200 flex items-center cursor-not-allowed border border-gray-600/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </button>
            </div>
          )}
        </div>
      )}

      {/* New Template Button for Dashboard (when header is hidden) */}
      {hideHeader && user?.is_premium && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border font-mono ${selectedCategory === category.value
              ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
              : 'bg-zinc-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-zinc-200 dark:border-white/5 hover:bg-zinc-200 dark:hover:bg-white/10'
              }`}
          >
            {category.label.replace(' ', '_').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 dark:bg-white/[0.02] border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-[3rem]">
          <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-50" />
            <FileText className="w-10 h-10 text-indigo-500 relative z-10" />
          </div>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter">
            SCHEMATIC_EMPTY
          </h4>
          <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-mono text-[11px] uppercase tracking-[0.2em] leading-relaxed">
            No custom blueprints detected in the current index.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl active:scale-95 flex items-center gap-3 mx-auto"
          >
            <Plus className="w-4 h-4" />
            GENERATE_NEW_SCHEMATIC
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-zinc-50 dark:bg-slate-900 border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-8 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-500 group shadow-sm hover:shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:bg-indigo-500/10 transition-colors" />

              {/* Template Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mr-5 border border-zinc-200 dark:border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-black text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                      {template.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-mono">{template.category}</span>
                      {template.is_public ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Public schematic" />
                      ) : (
                        <Lock className="w-3 h-3 text-slate-400/50" />
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavorite(template)}
                  className={`p-2 rounded-xl transition-all ${template.is_favorite
                    ? 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
                    : 'text-slate-300 hover:text-amber-500 hover:bg-amber-500/10 border border-transparent'
                    }`}
                >
                  <Star className={`w-4 h-4 ${template.is_favorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Description */}
              {template.description && (
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">
                  {template.description}
                </p>
              )}

              {/* Tags */}
              {template.tags && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {template.tags.split(',').slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-zinc-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-zinc-200 dark:border-white/5 font-mono"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-8 font-mono uppercase tracking-widest border-t border-zinc-100 dark:border-white/5 pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 opacity-40" />
                  Used_{template.usage_count}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 opacity-40" />
                  {formatDate(template.created_at)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {showSelectButton && onTemplateSelect && (
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    ACTIVATE
                  </button>
                )}

                <button
                  onClick={() => handleCopyContent(template.content, template.name)}
                  className="p-3 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all border border-transparent hover:border-indigo-500/20"
                >
                  <Copy className="w-4.5 h-4.5" />
                </button>

                <div className="flex gap-1 ml-auto">
                  <button
                    onClick={() => {
                      if (!user?.is_premium) {
                        toast.error('PRO_LICENSE_REQUIRED')
                        return
                      }
                      setEditingTemplate(template)
                    }}
                    className={`p-3 transition-all rounded-xl ${user?.is_premium
                      ? 'text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10'
                      : 'text-slate-200 cursor-not-allowed'
                      }`}
                    disabled={!user?.is_premium}
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (!user?.is_premium) {
                        toast.error('PRO_LICENSE_REQUIRED')
                        return
                      }
                      handleDeleteTemplate(template.id)
                    }}
                    className={`p-3 transition-all rounded-xl ${user?.is_premium
                      ? 'text-slate-400 hover:text-red-500 hover:bg-red-500/10'
                      : 'text-slate-200 cursor-not-allowed'
                      }`}
                    disabled={!user?.is_premium}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal - Pro Only */}
      {user?.is_premium && (
        <CustomTemplateModal
          isOpen={showCreateModal || !!editingTemplate}
          onClose={() => {
            setShowCreateModal(false)
            setEditingTemplate(null)
          }}
          onTemplateCreated={editingTemplate ? handleTemplateUpdated : handleTemplateCreated}
          editTemplate={editingTemplate}
        />
      )}
    </div>
  )
}

export default CustomTemplateManager