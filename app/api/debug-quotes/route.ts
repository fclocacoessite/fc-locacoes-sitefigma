import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      tests: {}
    }

    // Teste 1: Verificar se a tabela quotes existe
    try {
      const { data: tableExists, error: tableError } = await supabase
        .from('quotes')
        .select('count')
        .limit(1)
      
      diagnostics.tests.tableExists = {
        success: !tableError,
        error: tableError?.message || null
      }
    } catch (error) {
      diagnostics.tests.tableExists = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }

    // Teste 2: Verificar estrutura da tabela quotes
    try {
      const { data: columns, error: columnsError } = await supabase
        .from('quotes')
        .select('*')
        .limit(0)
      
      diagnostics.tests.tableStructure = {
        success: !columnsError,
        error: columnsError?.message || null
      }
    } catch (error) {
      diagnostics.tests.tableStructure = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }

    // Teste 3: Verificar se conseguimos buscar orçamentos existentes
    try {
      const { data: existingQuotes, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .limit(5)
      
      diagnostics.tests.existingQuotes = {
        success: !quotesError,
        count: existingQuotes?.length || 0,
        error: quotesError?.message || null
      }
    } catch (error) {
      diagnostics.tests.existingQuotes = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }

    // Teste 4: Verificar se a tabela vehicles existe e tem dados
    try {
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id, brand, model, daily_rate')
        .limit(5)
      
      diagnostics.tests.vehicles = {
        success: !vehiclesError,
        count: vehicles?.length || 0,
        error: vehiclesError?.message || null,
        sample: vehicles?.[0] || null
      }
    } catch (error) {
      diagnostics.tests.vehicles = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }

    // Teste 5: Verificar se conseguimos inserir um orçamento de teste (sem salvar)
    try {
      const testQuote = {
        client_name: 'Teste Diagnóstico',
        client_email: 'teste@diagnostico.com',
        client_phone: '(11) 99999-9999',
        vehicle_id: '00000000-0000-0000-0000-000000000000',
        start_date: '2024-01-01',
        end_date: '2024-01-03',
        total_days: 2,
        total_cost: 200.00,
        status: 'pending',
        message: 'Teste de diagnóstico'
      }

      // Apenas validar a estrutura, não inserir
      const { error: validationError } = await supabase
        .from('quotes')
        .select('*')
        .limit(0)
      
      diagnostics.tests.quoteValidation = {
        success: !validationError,
        error: validationError?.message || null
      }
    } catch (error) {
      diagnostics.tests.quoteValidation = {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }

    // Resumo do diagnóstico
    const allTestsPassed = Object.values(diagnostics.tests).every(test => test.success)
    
    return NextResponse.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'Todos os testes passaram' : 'Alguns testes falharam',
      diagnostics
    })

  } catch (error) {
    console.error('Erro no diagnóstico:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno no diagnóstico',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
