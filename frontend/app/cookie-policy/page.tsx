import { Metadata } from 'next'
import CookieContent from './CookieContent'

export const metadata: Metadata = {
    title: 'Cookie Policy | BuildInPublic',
    description: 'Information about how BuildInPublic uses cookies and similar technologies.',
    openGraph: {
        title: 'Cookie Policy | BuildInPublic',
        description: 'Information about how BuildInPublic uses cookies and similar technologies.',
    }
}

export default function CookiePage() {
    return <CookieContent />
}
