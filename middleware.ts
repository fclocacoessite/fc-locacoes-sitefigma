import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Adicionar headers de segurança
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  // Para evitar conflitos de instâncias do Supabase, 
  // deixar os componentes verificarem a autenticação
  // O middleware só adiciona headers de segurança

  return response
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/portal-cliente/:path*',
    '/auth/:path*',
    '/consignacao/:path*'
  ]
}