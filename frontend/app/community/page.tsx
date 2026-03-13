import { Metadata } from 'next'
import CommunityClient from './CommunityClient'

export const metadata: Metadata = {
  title: 'Community Templates | BuildInPublic',
  description: 'Browse templates shared by the community and use them to write better posts faster.',
  keywords: 'community templates, social post templates, buildinpublic community',
  alternates: {
    canonical: '/community',
  },
  openGraph: {
    title: 'BuildInPublic Community Templates',
    description: 'Find and share templates for posts and threads.',
    type: 'website',
    url: '/community',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildInPublic Community Templates',
    description: 'Find and share templates for posts and threads.',
    images: ['/twitter-image.png'],
  },
}

export default function CommunityPage() {
  return <CommunityClient />
}