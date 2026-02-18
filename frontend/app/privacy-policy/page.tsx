import { Metadata } from 'next'
import PrivacyContent from './PrivacyContent'

export const metadata: Metadata = {
    title: 'Privacy Policy | BuildInPublic',
    description: 'How BuildInPublic handles and protects your personal data.',
    openGraph: {
        title: 'Privacy Policy | BuildInPublic',
        description: 'How BuildInPublic handles and protects your personal data.',
    }
}

export default function PrivacyPage() {
    return <PrivacyContent />
}
