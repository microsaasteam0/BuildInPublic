import { Metadata } from 'next'
import UpdatesClient from './UpdatesClient'

export const metadata: Metadata = {
  title: 'Product Updates & Changelog | BuildInPublic AI Improvement',
  description: 'Stay informed about the latest BuildInPublic features, AI enhancements, and platform improvements. Track our journey in making content repurposing easier.',
  keywords: 'BuildInPublic updates, AI changelog, new content features, social media tool updates, product roadmap',
  openGraph: {
    title: 'BuildInPublic AI Updates - What\'s New in Content Transformation',
    description: 'Latest feature releases and AI improvements for the BuildInPublic platform.',
    type: 'website',
  },
}

export default function UpdatesPage() {
  return <UpdatesClient />
}