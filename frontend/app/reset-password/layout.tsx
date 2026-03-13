import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password | BuildInPublic',
  description: 'Create a new password to regain access to your account.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children
}
