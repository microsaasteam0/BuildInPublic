import { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing | BuildInPublic',
  description: 'Pick the plan that fits you. Start free, then upgrade when you need more posts and features.',
  keywords: 'buildinpublic pricing, x thread generator pricing, social post tool plans',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'BuildInPublic Pricing',
    description: 'Simple plans for founders who want to post consistently.',
    type: 'website',
    url: '/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildInPublic Pricing',
    description: 'Simple plans for founders who want to post consistently.',
    images: ['/twitter-image.png'],
  },
}

export default function Pricing() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is there a free plan to start with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. You can start on a free tier and upgrade when you need more output, faster workflows, or additional capabilities.',
        },
      },
      {
        '@type': 'Question',
        name: 'When should I upgrade my plan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Upgrade when your posting cadence increases, your team needs more capacity, or you want access to higher limits and advanced features.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do paid plans help save more founder time?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Paid plans are designed for heavier usage and can reduce repetitive content work for founders who publish consistently.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I see exactly what is included in each plan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All available limits and plan details are shown directly on the pricing page for easy comparison.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PricingClient />
    </>
  )
}