'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, ArrowLeft, Loader2, Home } from 'lucide-react'
import Link from 'next/link'

interface RouteProtectionProps {
  children: React.ReactNode
  allowedRoles: ('admin' | 'manager' | 'client')[]
  redirectTo?: string
  fallback?: React.ReactNode
}

export function RouteProtection({ 
  children, 
  allowedRoles, 
  redirectTo = '/',
  fallback 
}: RouteProtectionProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const router = useRouter()
  const pathname = usePathname()
  const { user, session } = useAuth()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!session || !user) {
          setIsAuthorized(false)
          setIsLoading(false)
          return
        }

        const role = user.user_metadata?.role || 'client'
        setUserRole(role)
        
        if (allowedRoles.includes(role as any)) {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setIsAuthorized(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [session, user, allowedRoles])

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-xl">Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Você não tem permissão para acessar esta área.
            </p>
            {userRole && (
              <p className="text-sm text-gray-500">
                Seu nível de acesso: <span className="font-medium">{userRole}</span>
              </p>
            )}
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href={redirectTo}>
                  <Home className="h-4 w-4 mr-2" />
                  Ir para o Site
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/signin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Fazer Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
