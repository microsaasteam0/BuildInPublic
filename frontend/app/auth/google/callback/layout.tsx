import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Google Sign-In | BuildInPublic',
  description: 'Completing your Google sign-in...',
  robots: {
    index: false,
    follow: false,
  },
}

export default function GoogleCallbackLayout({ children }: { children: React.ReactNode }) {
  return children
}
