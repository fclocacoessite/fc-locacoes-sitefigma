'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let mounted = true

    // Obter sessão inicial apenas uma vez
    const getSession = async () => {
      if (initialized) return
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
          setInitialized(true)
        }
      } catch (error) {
        console.error('Erro ao obter sessão:', error)
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    getSession()

    // Escutar mudanças de autenticação apenas após inicialização
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        if (!mounted || !initialized) return
        
        // Só processar eventos importantes para evitar re-renderizações desnecessárias
        if (event === 'SIGNED_IN') {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          setLoading(false)
        }
        // Ignorar TOKEN_REFRESHED para evitar re-renderizações
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [initialized])

  const signOut = async () => {
    try {
      console.log('Fazendo logout...')
      
      // Fazer logout do Supabase primeiro
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro ao fazer logout:', error)
      } else {
        console.log('Logout realizado com sucesso')
      }
      
      // Limpar estado local
      setUser(null)
      setSession(null)
      
      // Redirecionar imediatamente
      window.location.href = '/'
      
    } catch (error) {
      console.error('Erro inesperado ao fazer logout:', error)
      // Mesmo com erro, limpar estado e redirecionar
      setUser(null)
      setSession(null)
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}