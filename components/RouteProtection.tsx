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
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [forceTimeout, setForceTimeout] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, session, loading } = useAuth()

  // Timeout de segurança para evitar travamento
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⚠️ RouteProtection: Timeout atingido, forçando resolução')
      setForceTimeout(true)
    }, 10000) // 10 segundos

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 RouteProtection: Verificando autenticação...', { 
          loading, 
          hasSession: !!session, 
          hasUser: !!user,
          userRole: user?.user_metadata?.role 
        })

        // Se ainda está carregando a autenticação e não atingiu timeout, aguardar
        if (loading && !forceTimeout) {
          console.log('⏳ RouteProtection: Ainda carregando autenticação...')
          return
        }

        if (!session || !user) {
          console.log('❌ RouteProtection: Usuário não autenticado')
          setIsAuthorized(false)
          setUserRole('')
          // Redirecionamento automático quando não autenticado, se redirectTo foi fornecido
          if (redirectTo) {
            console.log('➡️ RouteProtection: Redirecionando para', redirectTo)
            router.replace(redirectTo)
          }
          return
        }

        const role = user.user_metadata?.role || 'client'
        setUserRole(role)
        
        console.log('🔍 RouteProtection: Verificando permissões...', { 
          userRole: role, 
          allowedRoles 
        })
        
        if (allowedRoles.includes(role as any)) {
          console.log('✅ RouteProtection: Acesso autorizado')
          setIsAuthorized(true)
        } else {
          console.log('❌ RouteProtection: Acesso negado')
          setIsAuthorized(false)
          // Redirecionar automaticamente para a rota apropriada quando não autorizado
          if (redirectTo) {
            console.log('➡️ RouteProtection: Redirecionando (sem permissão) para', redirectTo)
            router.replace(redirectTo)
          }
        }
      } catch (error) {
        console.error('❌ RouteProtection: Erro ao verificar autenticação:', error)
        setIsAuthorized(false)
      }
    }

    checkAuth()
  }, [session, user, allowedRoles, loading, forceTimeout])

  if (loading && !forceTimeout) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando acesso...</p>
          {forceTimeout && (
            <p className="text-sm text-orange-600 mt-2">
              Demorando mais que o esperado...
            </p>
          )}
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    // Escolher rota de login adequada para o botão secundário
    const loginHref = allowedRoles.includes('client')
      ? '/portal-cliente/login'
      : '/admin/login'

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
                <Link href={loginHref}>
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
