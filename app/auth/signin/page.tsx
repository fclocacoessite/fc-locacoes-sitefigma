'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

// Forçar render dinâmico para evitar pré-renderização
export const dynamic = 'force-dynamic'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [redirectTo, setRedirectTo] = useState('')
  const router = useRouter()

  // Preencher dados da URL se disponíveis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const emailParam = urlParams.get('email')
      const redirect = urlParams.get('redirect')
      
      if (emailParam) {
        setEmail(emailParam)
      }
      
      if (redirect) {
        setRedirectTo(redirect)
      }
    }
  }, [])

  // Verificar se já está logado e escutar mudanças de autenticação
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const userRole = session.user.user_metadata?.role || 'client'
        console.log('🔍 Verificando sessão existente:', { userRole, email: session.user.email })
        
        if (userRole === 'admin' || userRole === 'manager') {
          console.log('🔄 Admin detectado, redirecionando para /admin')
          router.replace('/admin')
        } else {
          console.log('🔄 Cliente detectado, redirecionando para portal')
          router.replace(redirectTo || '/portal-cliente')
        }
      }
    }
    
    checkSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userRole = session.user.user_metadata?.role || 'client'
          console.log('🔍 Login detectado:', { userRole, email: session.user.email })
          
          if (userRole === 'admin' || userRole === 'manager') {
            console.log('🔄 Admin logado, redirecionando para /admin')
            router.replace('/admin')
          } else {
            console.log('🔄 Cliente logado, redirecionando para portal')
            router.replace(redirectTo || '/portal-cliente')
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        const userRole = data.user.user_metadata?.role || 'client'
        console.log('🔍 Login manual detectado:', { userRole, email: data.user.email })
        
        if (userRole === 'admin' || userRole === 'manager') {
          console.log('🔄 Admin logado manualmente, redirecionando para /admin')
          router.replace('/admin')
        } else {
          console.log('🔄 Cliente logado manualmente, redirecionando para portal')
          router.replace(redirectTo || '/portal-cliente')
        }
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
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
            Faça login para acessar sua área personalizada
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Entrar na sua conta</CardTitle>
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
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link href="/auth/signup" className="text-orange-500 hover:text-orange-600 font-medium">
                  Criar conta
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/admin/login" className="text-sm text-gray-500 hover:text-gray-700">
                Acesso administrativo
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
