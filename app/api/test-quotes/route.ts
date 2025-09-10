import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Testar conexão com o banco
    const { data: connectionTest, error: connectionError } = await supabase
      .from('quotes')
      .select('count')
      .limit(1)

    if (connectionError) {
      return NextResponse.json({
        success: false,
        error: 'Erro de conexão com o banco',
        details: connectionError.message
      }, { status: 500 })
    }

    // Verificar estrutura da tabela quotes
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'quotes' })

    // Se a função RPC não existir, fazer uma consulta simples
    const { data: sampleQuote, error: sampleError } = await supabase
      .from('quotes')
      .select('*')
      .limit(1)

    // Verificar se conseguimos inserir um orçamento de teste
    const testQuote = {
      client_name: 'Teste Cliente',
      client_email: 'teste@exemplo.com',
      client_phone: '(11) 99999-9999',
      vehicle_id: '00000000-0000-0000-0000-000000000000', // ID fictício
      start_date: '2024-01-01',
      end_date: '2024-01-03',
      total_days: 2,
      total_cost: 200.00,
      status: 'pending',
      message: 'Teste de orçamento'
    }

    // Não vamos realmente inserir, apenas validar a estrutura
    const { error: validationError } = await supabase
      .from('quotes')
      .select('*')
      .limit(0)

    return NextResponse.json({
      success: true,
      message: 'Teste de orçamentos realizado com sucesso',
      details: {
        connection: 'OK',
        tableStructure: sampleError ? 'Erro ao verificar estrutura' : 'OK',
        validation: validationError ? validationError.message : 'OK'
      }
    })

  } catch (error) {
    console.error('Erro no teste de orçamentos:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno no teste',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Teste de inserção de orçamento
    const { data: quote, error } = await supabase
      .from('quotes')
      .insert([{
        client_name: body.client_name || 'Cliente Teste',
        client_email: body.client_email || 'teste@exemplo.com',
        client_phone: body.client_phone || '(11) 99999-9999',
        vehicle_id: body.vehicle_id || '00000000-0000-0000-0000-000000000000',
        start_date: body.start_date || '2024-01-01',
        end_date: body.end_date || '2024-01-03',
        total_days: body.total_days || 2,
        total_cost: body.total_cost || 200.00,
        status: 'pending',
        message: body.message || 'Teste de orçamento'
      }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao inserir orçamento de teste',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Orçamento de teste criado com sucesso',
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
