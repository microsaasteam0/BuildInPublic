import { Metadata } from 'next'
import FeaturesClient from './FeaturesClient'

export const metadata: Metadata = {
  title: 'Features | BuildInPublic',
  description: 'See the features that help you turn daily notes into social posts and X threads faster.',
  keywords: 'buildinpublic features, x thread generator, social post tool, build in public app',
  alternates: {
    canonical: '/features',
  },
  openGraph: {
    title: 'BuildInPublic Features',
    description: 'Simple tools to turn daily work into content you can share.',
    type: 'website',
    url: '/features',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildInPublic Features',
    description: 'Simple tools to turn daily work into content you can share.',
    images: ['/twitter-image.png'],
  },
}

export default function Features() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does BuildInPublic help me do?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BuildInPublic helps founders turn daily work logs into social-ready posts and threads so they can publish consistently with less effort.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I create both short posts and longer threads?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. You can generate concise social posts and longer thread-style content from the same source notes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this useful if I do not have a content calendar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The workflow is designed for busy founders and works even if you post ad hoc and want to move to a consistent cadence.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I compare plans after reviewing features?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can compare all plans on the pricing page and choose the one that fits your publishing frequency and goals.',
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
      <FeaturesClient />
    </>
  )
}