'use client'

import ThemedToaster from './ThemedToaster'
import { AuthProvider } from '../contexts/AuthContext'
import { UserPreferencesProvider } from '../contexts/UserPreferencesContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { PaymentProcessingProvider } from '../contexts/PaymentProcessingContext'
import { SubscriptionProvider } from '../contexts/SubscriptionContext'
import SupportWidget from './SupportWidget'

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <PaymentProcessingProvider>
            <UserPreferencesProvider>
              {children}
              <SupportWidget />
              <ThemedToaster />
            </UserPreferencesProvider>
          </PaymentProcessingProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}