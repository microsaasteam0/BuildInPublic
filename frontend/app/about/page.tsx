import { Metadata } from 'next'
import AboutClient from './AboutClient'

export const metadata: Metadata = {
  title: 'About BuildInPublic - Mission & Team | AI Content Strategy',
  description: 'Discover the mission behind BuildInPublic. We empower creators and marketers to multiply their reach through AI-powered content transformation and social media optimization.',
  keywords: 'about BuildInPublic, content creator mission, AI content strategy, Entrext Labs, social media growth tools',
  openGraph: {
    title: 'BuildInPublic AI - Empowering Creators and Marketers',
    description: 'Learn about our mission to revolutionize content repurposing with intelligent AI solutions.',
    type: 'website',
  },
}

export default function AboutPage() {
  return <AboutClient />
}