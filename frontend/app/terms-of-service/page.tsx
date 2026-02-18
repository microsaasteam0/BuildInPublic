import { Metadata } from 'next'
import TermsContent from './TermsContent'

export const metadata: Metadata = {
    title: 'Terms of Service | BuildInPublic',
    description: 'The terms and conditions for using the BuildInPublic AI platform.',
    openGraph: {
        title: 'Terms of Service | BuildInPublic',
        description: 'The terms and conditions for using the BuildInPublic AI platform.',
    }
}

export default function TermsPage() {
    return <TermsContent />
}
