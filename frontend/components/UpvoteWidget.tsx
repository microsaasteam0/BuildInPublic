'use client'

import { useEffect, useState, useCallback } from 'react'
import Script from 'next/script'

type UpvoteUser = {
  id?: string | number
  email?: string
}

declare global {
  interface Window {
    __upvote_cleanup?: () => void
  }
}

export default function UpvoteWidget() {
  const [userData, setUserData] = useState<UpvoteUser | null>(null)
  const [remountKey, setRemountKey] = useState(0)
  const [shouldLoadWidget, setShouldLoadWidget] = useState(false)

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch(`/api/auth/session?t=${Date.now()}`)
      if (!res.ok) {
        setUserData(null)
        return
      }
      const data = await res.json()
      setUserData(data.user?.email ? data.user : null)
    } catch {
      setUserData(null)
    }
  }, [])

  useEffect(() => {
    fetchSession()

    const handleLogin = (e: Event) => {
      const customEvent = e as CustomEvent<UpvoteUser>
      setUserData(customEvent.detail)
      setRemountKey((k) => k + 1)
    }

    const handleLogout = () => {
      setUserData(null)
      setRemountKey((k) => k + 1)
      if (window.__upvote_cleanup) window.__upvote_cleanup()
    }

    window.addEventListener('upvote:login', handleLogin)
    window.addEventListener('upvote:logout', handleLogout)
    window.addEventListener('focus', fetchSession)

    return () => {
      window.removeEventListener('upvote:login', handleLogin)
      window.removeEventListener('upvote:logout', handleLogout)
      window.removeEventListener('focus', fetchSession)
    }
  }, [fetchSession])

  useEffect(() => {
    const enableWidget = () => setShouldLoadWidget(true)
    const timerId = window.setTimeout(enableWidget, 15000)

    window.addEventListener('mousemove', enableWidget, { once: true })
    window.addEventListener('touchstart', enableWidget, { once: true })
    window.addEventListener('keydown', enableWidget, { once: true })

    return () => {
      window.clearTimeout(timerId)
      window.removeEventListener('mousemove', enableWidget)
      window.removeEventListener('touchstart', enableWidget)
      window.removeEventListener('keydown', enableWidget)
    }
  }, [])

  useEffect(() => {
    if (!shouldLoadWidget) return

    const setIframeTitles = () => {
      const iframes = document.querySelectorAll('.upvote-widget iframe')
      iframes.forEach((iframe, idx) => {
        if (!iframe.getAttribute('title')) {
          iframe.setAttribute('title', `Product feedback widget ${idx + 1}`)
        }
      })
    }

    setIframeTitles()

    const observer = new MutationObserver(() => setIframeTitles())
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [shouldLoadWidget])

  return (
    <div key={remountKey}>
      <div
        className="upvote-widget"
        data-application-id="69b3b8edf6afcee5f4330531"
        data-user-id={userData?.id || ''}
        data-email={userData?.email || ''}
        data-position="right"
      />
      {shouldLoadWidget && <Script src="https://upvote.entrext.com/widget.js" strategy="lazyOnload" />}
    </div>
  )
}
