import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Email | BuildInPublic',
  description: 'Verify your email address to finish setting up your account.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return children
}
