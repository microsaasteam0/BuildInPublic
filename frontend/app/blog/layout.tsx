import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog | BuildInPublic',
    description: 'Read simple guides on building in public, writing better posts, and growing your audience.',
    keywords: 'build in public blog, founder marketing tips, x thread guides, social growth',
    openGraph: {
        title: 'BuildInPublic Blog',
        description: 'Practical guides for founders who want to share their work.',
        type: 'website',
    },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
