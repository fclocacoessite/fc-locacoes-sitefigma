'use client'

import { RouteProtection } from '@/components/RouteProtection'
import { usePathname } from 'next/navigation'

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Não proteger a rota de login do portal do cliente
  if (pathname?.startsWith('/portal-cliente/login')) {
    return <>{children}</>
  }

  return (
    <RouteProtection 
      allowedRoles={['client']} 
      redirectTo="/portal-cliente/login"
    >
      {children}
    </RouteProtection>
  )
}
