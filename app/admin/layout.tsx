'use client'

import { RouteProtection } from '@/components/RouteProtection'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Não proteger a rota de login do admin
  if (pathname?.startsWith('/admin/login')) {
    return <>{children}</>
  }

  return (
    <RouteProtection 
      allowedRoles={['admin', 'manager']} 
      redirectTo="/admin/login"
    >
      {children}
    </RouteProtection>
  )
}
