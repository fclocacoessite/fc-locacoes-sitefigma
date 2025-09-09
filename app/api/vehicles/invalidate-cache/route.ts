import { NextResponse } from 'next/server'

export async function POST() {
  try {
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
