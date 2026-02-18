import { Metadata } from 'next'
import CommunityClient from './CommunityClient'

export const metadata: Metadata = {
  title: 'Community Templates Hub | BuildInPublic AI Content Creator Network',
  description: 'Join the BuildInPublic creator community. Browse and use proven AI content repurposing templates shared by successful marketers and creators.',
  keywords: 'content repurposing templates, community AI templates, social media content hub, shared content strategies',
  openGraph: {
    title: 'BuildInPublic Community Hub - Proven Content Templates',
    description: 'Discover and share top-performing AI repurposing templates for every social platform.',
    type: 'website',
  },
}

export default function CommunityPage() {
  return <CommunityClient />
}