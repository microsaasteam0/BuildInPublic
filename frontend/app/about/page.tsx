import { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About BuildInPublic | Our Mission and Team',
  description: 'Learn why we built BuildInPublic and how we help founders share their work with simple, clear posts.',
  keywords: 'about buildinpublic, founder content tool, build in public software, entrext labs',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About BuildInPublic',
    description: 'Meet the team and mission behind BuildInPublic.',
    type: 'website',
    url: '/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About BuildInPublic',
    description: 'Meet the team and mission behind BuildInPublic.',
    images: ['/twitter-image.png'],
  },
}

export default function AboutPage() {
  return <AboutClient />
}