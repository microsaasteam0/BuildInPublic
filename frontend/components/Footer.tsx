'use client'

import { useState } from 'react'
import { Sparkles, Heart, ChevronDown, Mail, Instagram, Linkedin, MessageSquare, ExternalLink, Globe, Twitter, Rocket, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

interface FooterProps {
  onSupportClick?: () => void
}

export default function Footer({ onSupportClick }: FooterProps) {
  const { user, isAuthenticated } = useAuth()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) {
      toast.error('Please enter your email')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newsletterEmail)) {
      toast.error('Invalid email address')
      return
    }
    setIsSubscribing(true)
    try {
      const encodedEmail = encodeURIComponent(newsletterEmail)
      const substackUrl = `https://entrextlabs.substack.com/subscribe?email=${encodedEmail}`
      toast.success('Redirecting to Substack...')
      setTimeout(() => {
        window.open(substackUrl, '_blank')
        setNewsletterEmail('')
      }, 1000)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsSubscribing(false)
    }
  }

  const sections = [
    {
      title: 'Product',
      links: [
        { name: 'Pricing', href: '/pricing', external: false },
        { name: 'Features', href: '/features', external: false },
        { name: 'Dashboard', href: isAuthenticated ? '/dashboard' : '/pricing', external: false },
        { name: 'Updates', href: '/updates', external: false },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about', external: false, internalAbout: true },
        { name: 'Entrext Labs', href: 'https://www.entrext.com/', external: true },
        { name: 'Careers', href: 'https://deformity.ai/d/C-P5znqtG_ZZ', external: true },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy-policy', external: false },
        { name: 'Terms of Service', href: '/terms-of-service', external: false },
        { name: 'Cookie Policy', href: '/cookie-policy', external: false },
      ]
    }
  ]

  const socialLinks = [
    {
      name: 'Discord',
      href: 'https://discord.com/invite/ZZx3cBrx2',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2] hover:text-white'
    },
    {
      name: 'Entrext Labs',
      href: 'https://linktr.ee/entrext.in',
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/entrext/posts/?feedView=all',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/entrext.labs/',
      icon: <Instagram className="w-5 h-5" />,
      color: 'bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C] hover:text-white'
    },
    {
      name: 'Newsletter',
      href: 'https://entrextlabs.substack.com/subscribe',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-[#FF6719]/10 text-[#FF6719] hover:bg-[#FF6719] hover:text-white'
    }
  ]

  return (
    <footer className="bg-zinc-50 dark:bg-slate-950 border-t border-zinc-200 dark:border-slate-800 mt-20 relative overflow-hidden" aria-label="BuildInPublic Footer">
      {/* Industrial Decorative Layer */}
      <div className="absolute inset-0 bg-grid-blueprint opacity-[0.05] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Brand Identity & Newsletter Protocol */}
          <div className="lg:col-span-5 space-y-12">
            <div className="flex flex-col space-y-8">
              <Link href="/" className="flex items-center group gap-4 w-fit">
                <div className="relative w-12 h-12 bg-zinc-100 dark:bg-slate-900 rounded-2xl shadow-2xl flex items-center justify-center p-2 border border-zinc-200 dark:border-slate-800 transform transition-all duration-500 group-hover:rotate-6">
                  <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-contain" />
                </div>
                <span className="text-3xl font-display font-black tracking-tighter text-zinc-900 dark:text-white">
                  BuildIn<span className="text-indigo-600 dark:text-indigo-400">Public</span>
                </span>
              </Link>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-sm font-bold tracking-tight opacity-80">
                Turn your notes into social growth. Built for founders.
              </p>

              {/* Security_Sync Socials */}
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3.5 rounded-2xl border border-zinc-200 dark:border-slate-800 transition-all duration-300 bg-zinc-100 dark:bg-slate-900 group shadow-sm hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10`}
                    title={social.name}
                  >
                    <div className="transition-transform duration-300 group-hover:-translate-y-1">
                      {social.icon}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Protocol */}
            <div className="p-6 sm:p-10 bg-zinc-100 dark:bg-slate-900 rounded-[2.5rem] border border-zinc-200 dark:border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-grid-blueprint opacity-[0.02] pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                  <Zap className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1.5">Weekly newsletter</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black text-slate-500 tracking-widest">Get updates</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleNewsletterSubscribe} className="space-y-4 relative z-10">
                <input
                  type="email"
                  placeholder="Email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-slate-950 border border-zinc-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-black tracking-tight sm:tracking-widest focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white placeholder:text-zinc-400/50"
                  disabled={isSubscribing}
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] sm:text-[11px] font-black tracking-widest sm:tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isSubscribing ? 'Processing...' : 'Subscribe'}
                  {!isSubscribing && <ChevronDown className="w-4 h-4 -rotate-90" />}
                </button>
              </form>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 pt-0 lg:pt-8">
            {sections.map((section) => (
              <div key={section.title} className="space-y-10">
                <h3 className="text-[10px] font-black tracking-[0.4em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-slate-400/30" />
                  {section.title}
                </h3>
                <ul className="space-y-5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        target={link.external ? "_blank" : "_self"}
                        className="text-[13px] font-black tracking-widest text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-2 group w-fit"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">_</span>
                        {link.name}
                        {link.external && <ExternalLink className="w-3 h-3 opacity-30" />}
                      </Link>
                    </li>
                  ))}
                  {section.title === 'Company' && (
                    <li>
                      <button
                        onClick={onSupportClick}
                        className="text-[13px] font-black tracking-widest text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center gap-2 group"
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">_</span>
                        Support
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar - Industrial Footer Protocol */}
        <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black tracking-[0.3em] text-zinc-400 dark:text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} BuildInPublic. All rights reserved.
          </p>

          <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.3em] text-zinc-900 dark:text-white bg-zinc-100 dark:bg-slate-900 border border-zinc-200 dark:border-slate-800 px-6 py-3 rounded-2xl shadow-xl">
            <span className="opacity-60">Built by</span>
            <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-800" />
            <a href="https://entrext.in" target="_blank" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
              Entrext Labs
              <Zap className="w-3 h-3 text-indigo-500 fill-current animate-pulse" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}