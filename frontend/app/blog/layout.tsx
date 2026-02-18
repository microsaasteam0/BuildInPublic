import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog - High-Authority Distribution Insights | BuildInPublic',
    description: 'Master the art of building in public with BuildInPublic. Insights on transforming raw build logs and daily work into high-authority social content using neural synthesis.',
    keywords: 'build in public strategies, founder marketing, social media growth, content transformation, X thread guides, LinkedIn for founders',
    openGraph: {
        title: 'BuildInPublic Blog - Distribution Strategy & Founder Insights',
        description: 'Expert advice on multiplying your distribution reach using intelligent neural synthesis automation.',
        type: 'website',
    },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
