import { Metadata } from 'next'
import UpdatesClient from './UpdatesClient'

export const metadata: Metadata = {
  title: 'Product Updates | BuildInPublic',
  description: 'See what is new in BuildInPublic, including feature releases and bug fixes.',
  keywords: 'buildinpublic updates, changelog, feature releases',
  openGraph: {
    title: 'BuildInPublic Updates',
    description: 'Latest updates, improvements, and fixes.',
    type: 'website',
  },
}

export default function UpdatesPage() {
  return <UpdatesClient />
}