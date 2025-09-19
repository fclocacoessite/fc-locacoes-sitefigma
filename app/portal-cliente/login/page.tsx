'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'

// Forçar render dinâmico para evitar pré-renderização
export const dynamic = 'force-dynamic'

export default function ClientPortalLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Verificar se já está logado como cliente
  useEffect(() => {
    let isMounted = true
    
    const checkSession = async () => {
      if (!isMounted) return
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session && isMounted) {
          const userRole = session.user.user_metadata?.role || 'client'
          if (userRole === 'client') {
            console.log('🔄 Cliente já logado, redirecionando...')
            router.replace('/portal-cliente')
          } else if (userRole === 'admin' || userRole === 'manager') {
            // Se for admin, redireciona para portal admin
            console.log('🔄 Usuário é admin, redirecionando para portal admin...')
            router.replace('/admin')
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      }
    }
    
    // Verificar apenas uma vez
    checkSession()

    return () => {
      isMounted = false
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Iniciando processo de login do cliente...')
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
        
        if (userRole === 'client') {
          console.log('🔄 Redirecionando para /portal-cliente...')
          router.replace('/portal-cliente')
        } else if (userRole === 'admin' || userRole === 'manager') {
          console.log('🔄 Admin detectado, redirecionando para /admin...')
          router.replace('/admin')
        } else {
          console.log('🚫 Acesso negado - role:', userRole)
          setError('Acesso negado. Role de usuário não reconhecido.')
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
            Portal do Cliente
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acesse sua área pessoal
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center space-x-2">
              <User className="h-5 w-5 text-orange-500" />
              <span>Login do Cliente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="seu@email.com"
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
                    placeholder="Sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/signup" className="text-sm text-gray-500 hover:text-gray-700">
                Não tem conta? Cadastre-se
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


