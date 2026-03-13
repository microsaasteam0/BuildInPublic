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

  return (
    <div key={remountKey}>
      <div
        className="upvote-widget"
        data-application-id="69b3b8edf6afcee5f4330531"
        data-user-id={userData?.id || ''}
        data-email={userData?.email || ''}
        data-position="right"
      />
      <Script src="https://upvote.entrext.com/widget.js" strategy="afterInteractive" />
    </div>
  )
}
