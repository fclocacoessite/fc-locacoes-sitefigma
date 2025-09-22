import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Aceitar Authorization Bearer opcionalmente para garantir que venha de um admin
    const authHeader = request.headers.get('authorization') || ''
    const bearerToken = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null

    if (bearerToken) {
      const { data: userData } = await supabase.auth.getUser(bearerToken)
      const role = (userData?.user?.user_metadata as any)?.role || 'client'
      if (role !== 'admin' && role !== 'manager') {
        return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
      }
    }

    // Simular invalidação de cache
    // Em produção, você pode usar Redis ou outro sistema de cache
    console.log('🔄 Cache invalidado - dados atualizados')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache invalidado com sucesso',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao invalidar cache:', error)
    return NextResponse.json(
      { error: 'Erro ao invalidar cache' },
      { status: 500 }
    )
  }
}
