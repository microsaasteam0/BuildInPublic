import { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing | BuildInPublic',
  description: 'Pick the plan that fits you. Start free, then upgrade when you need more posts and features.',
  keywords: 'buildinpublic pricing, x thread generator pricing, social post tool plans',
  openGraph: {
    title: 'BuildInPublic Pricing',
    description: 'Simple plans for founders who want to post consistently.',
    type: 'website',
  },
}

export default function Pricing() {
  return <PricingClient />
}