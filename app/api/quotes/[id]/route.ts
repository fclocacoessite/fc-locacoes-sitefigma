import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Validação básica
    if (!body.status) {
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'expired']
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    // Atualizar o orçamento
    const { data: quote, error } = await supabase
      .from('quotes')
      .update({ 
        status: body.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar orçamento:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar orçamento' },
        { status: 500 }
      )
    }

    if (!quote) {
      return NextResponse.json(
        { error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ quote })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se o orçamento existe
    const { data: existingQuote, error: fetchError } = await supabase
      .from('quotes')
      .select('id, client_name')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Erro ao buscar orçamento:', fetchError)
      return NextResponse.json(
        { error: 'Erro ao buscar orçamento' },
        { status: 500 }
      )
    }

    if (!existingQuote) {
      return NextResponse.json(
        { error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    // Excluir o orçamento
    const { error: deleteError } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Erro ao excluir orçamento:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao excluir orçamento' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'Orçamento excluído com sucesso',
      deletedQuote: existingQuote
    })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { data: quote, error } = await supabase
      .from('quotes')
      .select(`
        *,
        vehicles (
          brand,
          model,
          year,
          plate,
          daily_rate
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar orçamento:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar orçamento' },
        { status: 500 }
      )
    }

    if (!quote) {
      return NextResponse.json(
        { error: 'Orçamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ quote })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
