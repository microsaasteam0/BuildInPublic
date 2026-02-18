import { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing - Pro_Engine & Free_Build Tiers | BuildInPublic',
  description: 'Choose the best engine configuration for your build-in-public journey. Compare BuildInPublic tiers for high-velocity X (Twitter) thread synthesis and founder content automation.',
  keywords: 'BuildInPublic pricing, X thread generator cost, founder content plans, build in public tool, AI thread generation',
  openGraph: {
    title: 'BuildInPublic AI - Professional Pricing Plans',
    description: 'Affordable AI-powered content repurposing for creators and marketers.',
    type: 'website',
  },
}

export default function Pricing() {
  return <PricingClient />
}