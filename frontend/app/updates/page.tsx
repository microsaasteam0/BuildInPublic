import { Metadata } from 'next'
import UpdatesClient from './UpdatesClient'

export const metadata: Metadata = {
  title: 'Product Updates | BuildInPublic',
  description: 'See what is new in BuildInPublic, including feature releases and bug fixes.',
  keywords: 'buildinpublic updates, changelog, feature releases',
  alternates: {
    canonical: '/updates',
  },
  openGraph: {
    title: 'BuildInPublic Updates',
    description: 'Latest updates, improvements, and fixes.',
    type: 'website',
    url: '/updates',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildInPublic Updates',
    description: 'Latest updates, improvements, and fixes.',
    images: ['/twitter-image.png'],
  },
}

export default function UpdatesPage() {
  return <UpdatesClient />
}