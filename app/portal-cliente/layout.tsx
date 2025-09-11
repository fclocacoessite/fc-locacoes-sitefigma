'use client'

import { RouteProtection } from '@/components/RouteProtection'

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteProtection 
      allowedRoles={['client']} 
      redirectTo="/auth/signin"
    >
      {children}
    </RouteProtection>
  )
}
