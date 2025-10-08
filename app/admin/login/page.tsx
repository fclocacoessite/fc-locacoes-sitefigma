'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'

// Forçar render dinâmico para evitar pré-renderização
export const dynamic = 'force-dynamic'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [showLogoutWarning, setShowLogoutWarning] = useState(false)
  const router = useRouter()

  // Verificar se já está logado
  useEffect(() => {
    let isMounted = true
    
    const checkSession = async () => {
      if (!isMounted) return
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session && isMounted) {
          const userRole = session.user.user_metadata?.role || 'client'
          
          // Se já for admin, redireciona direto
          if (userRole === 'admin' || userRole === 'manager') {
            console.log('🔄 Admin já logado, redirecionando...')
            router.replace('/admin')
          } else {
            // Se for cliente, mostra aviso mas não redireciona
            console.log('⚠️ Cliente logado, precisa deslogar primeiro')
            setCurrentSession(session)
            setShowLogoutWarning(true)
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      }
    }
    
    checkSession()

    return () => {
      isMounted = false
    }
  }, [router])

  const handleLogoutCurrent = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setCurrentSession(null)
      setShowLogoutWarning(false)
      setError('')
      console.log('✅ Logout realizado com sucesso')
    } catch (err) {
      console.error('Erro ao fazer logout:', err)
      setError('Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Se há sessão de cliente ativa, pedir para deslogar primeiro
    if (showLogoutWarning && currentSession) {
      setError('Por favor, saia da conta de cliente primeiro para acessar como administrador.')
      return
    }
    
    console.log('🚀 Iniciando processo de login...')
    setLoading(true)
    setError('')

    console.log('📧 Tentativa de login:', { email, passwordLength: password.length })

    try {
      console.log('🔐 Chamando Supabase auth...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('📨 Resposta do Supabase:', { 
        hasData: !!data, 
        hasUser: !!data?.user, 
        hasSession: !!data?.session,
        error: error?.message 
      })

      if (error) {
        console.error('❌ Erro no login:', error)
        setError(`Erro: ${error.message}`)
        return
      }

      if (data.user) {
        const userRole = data.user.user_metadata?.role || 'client'
        console.log('✅ Login bem-sucedido:', { 
          email: data.user.email, 
          role: userRole,
          userId: data.user.id
        })
        
        if (userRole === 'admin' || userRole === 'manager') {
          console.log('🔄 Redirecionando para /admin...')
          router.replace('/admin')
        } else {
          console.log('🚫 Acesso negado - role:', userRole)
          setError('Acesso negado. Esta área é restrita a administradores.')
        }
      } else {
        console.error('❌ Nenhum usuário retornado')
        setError('Erro: Nenhum usuário retornado')
      }
    } catch (err) {
      console.error('💥 Erro inesperado:', err)
      setError(`Erro inesperado: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
    } finally {
      console.log('🏁 Finalizando processo de login')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <img 
              src="/logo-fc.jpg" 
              alt="FC Locações" 
              className="w-16 h-16 object-cover rounded-lg"
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Portal Administrativo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Área restrita para administradores
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <span>Acesso Administrativo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Aviso de sessão ativa de cliente */}
            {showLogoutWarning && currentSession && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Sessão de Cliente Ativa
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Você está logado como: <strong>{currentSession.user.email}</strong>
                    </p>
                    <p className="mt-1 text-xs text-yellow-600">
                      Para acessar como administrador, você precisa sair da conta de cliente primeiro.
                    </p>
                    <button
                      onClick={handleLogoutCurrent}
                      disabled={loading}
                      className="mt-3 w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saindo...' : 'Sair da Conta de Cliente'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="email">E-mail do administrador</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="admin@fclocacoes.com.br"
                    disabled={showLogoutWarning}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Sua senha administrativa"
                    disabled={showLogoutWarning}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    disabled={showLogoutWarning}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900"
                disabled={loading || showLogoutWarning}
              >
                {loading ? 'Entrando...' : 'Acessar Painel'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/portal-cliente/login" className="text-sm text-gray-500 hover:text-gray-700">
                Portal do Cliente
              </Link>
            </div>
            <div className="mt-2 text-center">
              <Link href="/auth/reset-password" className="text-sm text-blue-600 hover:underline">
                Esqueci minha senha
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  )
}
