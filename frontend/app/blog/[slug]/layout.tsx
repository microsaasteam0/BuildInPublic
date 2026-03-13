import { Metadata } from 'next'
import { getPostBySlug } from '@/lib/blog-data'

interface Props {
    params: { slug: string }
    children: React.ReactNode
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = getPostBySlug(params.slug)

    if (!post) {
        return {
            title: 'Post Not Found | BuildInPublic Blog',
            robots: {
                index: false,
                follow: false,
            },
        }
    }

    return {
        title: `${post.title} | BuildInPublic Blog`,
        description: post.excerpt,
        keywords: post.tags.join(', '),
        alternates: {
            canonical: `/blog/${post.slug}`,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            url: `/blog/${post.slug}`,
            siteName: 'BuildInPublic',
            publishedTime: post.publishedAt,
            authors: [post.author.name],
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image],
            creator: '@entrextlabs',
            site: '@entrextlabs',
        },
    }
}

export default function BlogPostLayout({ params, children }: Props) {
    const post = getPostBySlug(params.slug)

    if (!post) {
        return <>{children}</>
    }

    const blogPostingSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: [post.image],
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
            '@type': 'Person',
            name: post.author.name,
        },
        publisher: {
            '@type': 'Organization',
            name: 'BuildInPublic',
            url: 'https://buildinpublic.entrext.com',
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://buildinpublic.entrext.com/blog/${post.slug}`,
        },
        keywords: post.tags.join(', '),
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://buildinpublic.entrext.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://buildinpublic.entrext.com/blog',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://buildinpublic.entrext.com/blog/${post.slug}`,
            },
        ],
    }

    return (
        <>
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
            />
            <script
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {children}
        </>
    )
}
