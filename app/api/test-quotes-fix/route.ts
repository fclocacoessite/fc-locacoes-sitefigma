import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Dados recebidos:', body)
    
    // Teste de inserção de orçamento com os nomes corretos dos campos
    const quoteData = {
      client_name: body.client_name || 'Cliente Teste',
      client_email: body.client_email || 'teste@exemplo.com',
      client_phone: body.client_phone || '(11) 99999-9999',
      vehicle_id: body.vehicle_id || '00000000-0000-0000-0000-000000000000',
      start_date: body.start_date || '2024-01-01',
      end_date: body.end_date || '2024-01-03',
      total_days: body.total_days || 2,
      total_cost: body.total_cost || 200.00,
      status: 'pending',
      message: body.message || 'Teste de orçamento após correção'
    }

    console.log('Dados do orçamento:', quoteData)

    const { data: quote, error } = await supabase
      .from('quotes')
      .insert([quoteData])
      .select()
      .single()

    if (error) {
      console.error('Erro detalhado:', error)
      return NextResponse.json({
        success: false,
        error: 'Erro ao inserir orçamento de teste',
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Orçamento de teste criado com sucesso após correção',
      quote
    })

  } catch (error) {
    console.error('Erro no teste de inserção:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno no teste de inserção',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Verificar se conseguimos buscar orçamentos existentes
    const { data: quotes, error } = await supabase
      .from('quotes')
      .select('*')
      .limit(5)

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar orçamentos',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Orçamentos encontrados com sucesso',
      quotes: quotes || []
    })

  } catch (error) {
    console.error('Erro no teste de busca:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno no teste de busca',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
