import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Usar variáveis de ambiente ou fallback para desenvolvimento
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gdwpvvdncdqesakkfmle.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODkyNzksImV4cCI6MjA3MDk2NTI3OX0.SBaaDe0_RxnHE0IJie1FwSgCIE2PY6hggiocEOdZBIg'

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verificar sessão
  const { data: { session } } = await supabase.auth.getSession()

  // Adicionar headers de segurança
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  const { pathname } = request.nextUrl

  // Rotas admin - apenas admin e manager
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    
    const userRole = session.user.user_metadata?.role || 'client'
    if (userRole !== 'admin' && userRole !== 'manager') {
      return NextResponse.redirect(new URL('/portal-cliente', request.url))
    }
  }

  // Portal cliente - permitir acesso temporariamente para teste
  if (pathname.startsWith('/portal-cliente')) {
    // Temporariamente permitir acesso sem autenticação para teste
    console.log('Acessando portal-cliente, sessão:', !!session)
  }

  // Rotas de autenticação - redirecionar se já estiver logado
  if (pathname.startsWith('/auth') && session) {
    const userRole = session.user.user_metadata?.role || 'client'
    if (userRole === 'admin' || userRole === 'manager') {
      return NextResponse.redirect(new URL('/admin', request.url))
    } else {
      return NextResponse.redirect(new URL('/portal-cliente', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/portal-cliente/:path*',
    '/auth/:path*'
  ]
}
