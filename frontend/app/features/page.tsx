import { Metadata } from 'next'
import FeaturesClient from './FeaturesClient'

export const metadata: Metadata = {
  title: 'Features - AI Content Repurposing Capabilities | BuildInPublic',
  description: 'Explore the powerful AI features of BuildInPublic. Transform your daily build logs into high-authority X (Twitter) threads automatically with our Neuro-Sync engine.',
  keywords: 'BuildInPublic features, X thread generator, Twitter thread AI, build log automation, founder content engine, build in public tool',
  openGraph: {
    title: 'BuildInPublic AI Features - Intelligent Content Transformation',
    description: 'Powerful AI-driven features to optimize your content for every social platform.',
    type: 'website',
  },
}

export default function Features() {
  return <FeaturesClient />
}