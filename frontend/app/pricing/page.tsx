import { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing - BuildInPublic AI Content Repurposing Plans',
  description: 'Choose the best plan for your build-in-public journey. Compare BuildInPublic plans for X (Twitter) thread generation and founder content automation.',
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