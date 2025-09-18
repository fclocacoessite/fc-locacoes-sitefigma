import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, rejection_reason, admin_notes } = body

    // Validar status
    const validStatuses = ['pending', 'approved', 'rejected', 'active', 'completed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    // Adicionar timestamps específicos baseados no status
    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString()
    } else if (status === 'rejected') {
      updateData.rejected_at = new Date().toISOString()
      if (rejection_reason) {
        updateData.rejection_reason = rejection_reason
      }
    }

    // Adicionar notas do administrador se fornecidas
    if (admin_notes) {
      updateData.admin_notes = admin_notes
    }

    // Atualizar consignação
    const { data, error } = await supabaseAdmin
      .from('consignments')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Erro ao atualizar consignação:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor', details: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Consignação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Status da consignação atualizado com sucesso',
      consignment: data[0]
    })

  } catch (error) {
    console.error('Erro na API de atualização de consignação:', error)
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

    // Buscar consignação específica
    const { data, error } = await supabaseAdmin
      .from('consignments')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar consignação:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor', details: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Consignação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      consignment: data
    })

  } catch (error) {
    console.error('Erro na API de busca de consignação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

