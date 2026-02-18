import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

export default function SEOHead({
  title = 'BuildInPublic - Turn Your Build Logs into X Threads',
  description = 'The engine for founders building in public. Turn your daily build logs into high-authority X threads instantly with AI. Join 1,200+ founders growing on X.',
  keywords = 'build in public, founder content, X threads, Twitter threads, build log, daily updates, AI content creation, founder marketing, social media automation',
  image = '/og-image.png',
  url = 'https://buildinpublic.entrext.com',
  type = 'website'
}: SEOHeadProps) {
  const fullTitle = title.includes('BuildInPublic') ? title : `${title} | BuildInPublic`
  const fullUrl = url.startsWith('http') ? url : `https://buildinpublic.entrext.com${url}`
  const fullImage = image.startsWith('http') ? image : `https://buildinpublic.entrext.com${image}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="BuildInPublic" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="BuildInPublic" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@buildinpublic" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "BuildInPublic",
            "description": description,
            "url": fullUrl,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "BuildInPublic",
              "url": "https://buildinpublic.entrext.com"
            }
          })
        }}
      />
    </Head>
  )
}