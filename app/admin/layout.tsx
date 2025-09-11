'use client'

import { RouteProtection } from '@/components/RouteProtection'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteProtection 
      allowedRoles={['admin', 'manager']} 
      redirectTo="/"
    >
      {children}
    </RouteProtection>
  )
}
