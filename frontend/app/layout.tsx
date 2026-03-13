import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'
import ClientProviders from '../components/ClientProviders'
import UpvoteWidget from '../components/UpvoteWidget'
import Script from 'next/script'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production'
    ? 'https://buildinpublic.entrext.com'
    : 'http://localhost:3000'
  ),
  title: {
    default: 'BuildInPublic - Turn Daily Work Into Social Posts',
    template: '%s | BuildInPublic'
  },
  description: 'BuildInPublic helps founders turn daily notes into clear social posts and X threads in minutes.',
  applicationName: 'BuildInPublic',
  keywords: [
    'build in public',
    'x thread generator',
    'twitter thread generator',
    'social post generator',
    'founder content tool',
    'startup marketing tool',
    'indie hacker tool',
    'build log to post',
    'ai writing assistant'
  ],
  authors: [{ name: 'Entrext Labs', url: 'https://entrext.in' }],
  creator: 'Entrext Labs',
  publisher: 'Entrext Labs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'business',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'BuildInPublic',
    title: 'BuildInPublic - Turn Daily Work Into Social Posts',
    description: 'Write quick daily notes, then turn them into polished social posts and X threads.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BuildInPublic app dashboard',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildInPublic - Daily Notes to X Threads',
    description: 'Turn daily progress notes into clear social posts in minutes.',
    creator: '@entrextlabs',
    site: '@entrextlabs',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'BuildInPublic',
    statusBarStyle: 'default',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'googlebee6251a11ace561',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* CRITICAL: Theme Script - Must be first to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function setTheme() {
                  try {
                    var theme = localStorage.getItem('buildinpublic-theme') || 'dark';
                    var resolvedTheme = theme;
                    
                    if (theme === 'system') {
                      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    
                    var root = document.documentElement;
                    
                    // Remove any existing theme classes
                    root.classList.remove('light', 'dark', 'theme-loaded');
                    
                    if (resolvedTheme === 'dark') {
                      root.classList.add('dark');
                      root.style.colorScheme = 'dark';
                      root.style.setProperty('--bg-color', '#111827');
                      root.style.setProperty('--text-color', '#ffffff');
                    } else {
                      root.style.colorScheme = 'light';
                      root.style.setProperty('--bg-color', '#f9fafb');
                      root.style.setProperty('--text-color', '#111827');
                    }
                    
                    // Update theme-color meta tag
                    var metaThemeColor = document.querySelector('meta[name="theme-color"]');
                    if (metaThemeColor) {
                      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#111827' : '#ffffff');
                    }
                    
                    // Enable transitions after a brief delay
                    setTimeout(function() {
                      root.classList.add('theme-loaded');
                    }, 50);
                  } catch (e) {
                    // Fallback to dark theme
                    var root = document.documentElement;
                    root.classList.add('dark');
                    root.style.colorScheme = 'dark';
                    root.style.setProperty('--bg-color', '#111827');
                    root.style.setProperty('--text-color', '#ffffff');
                    setTimeout(function() {
                      root.classList.add('theme-loaded');
                    }, 50);
                  }
                }
                
                // Set theme immediately
                setTheme();
                
                // Set theme again when DOM is ready (double insurance)
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', setTheme);
                } else {
                  setTheme();
                }
              })();
            `
          }}
        />


        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-48.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-189ZC0LVQB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-189ZC0LVQB');
          `}
        </Script>

        {/* Structured Data for SEO/AI-SEO/AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "BuildInPublic",
              "alternateName": "BuildInPublic AI",
              "description": "BuildInPublic helps founders turn daily notes into clear social posts and X threads.",
              "url": "https://buildinpublic.entrext.com",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web, Windows, macOS, Linux, Android, iOS",
              "keywords": "build in public, x thread generator, social post generator, ai writing assistant",
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "USD",
                "lowPrice": "0",
                "highPrice": "15.00",
                "offerCount": "2",
                "offers": [
                  {
                    "@type": "Offer",
                    "name": "Free Plan",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  {
                    "@type": "Offer",
                    "name": "Pro Plan",
                    "price": "15.00",
                    "priceCurrency": "USD"
                  }
                ]
              },
              "creator": {
                "@type": "Organization",
                "name": "Entrext Labs",
                "url": "https://entrext.in",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://buildinpublic.entrext.com/logo.png"
                }
              },
              "featureList": [
                "Turn notes into social posts",
                "Generate X threads",
                "Save and reuse templates",
                "Track your usage"
              ],
              "screenshot": "https://buildinpublic.entrext.com/og-image.png",
              "softwareVersion": "1.0.0"
            })
          }}
        />

        <ClientProviders>
          {children}
        </ClientProviders>
        <UpvoteWidget />
      </body>
    </html>
  )
}