import { Metadata } from 'next'
import FeaturesClient from './FeaturesClient'

export const metadata: Metadata = {
  title: 'Features | BuildInPublic',
  description: 'See the features that help you turn daily notes into social posts and X threads faster.',
  keywords: 'buildinpublic features, x thread generator, social post tool, build in public app',
  openGraph: {
    title: 'BuildInPublic Features',
    description: 'Simple tools to turn daily work into content you can share.',
    type: 'website',
  },
}

export default function Features() {
  return <FeaturesClient />
}