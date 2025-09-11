import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const serverClient = createClient(supabaseUrl, supabaseKey)

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, rejection_reason, admin_notes } = body

    // Validar status
    if (!['approved', 'rejected'].includes(status)) {
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

    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString()
    } else if (status === 'rejected') {
      updateData.rejected_at = new Date().toISOString()
      if (rejection_reason) {
        updateData.rejection_reason = rejection_reason
      }
    }

    if (admin_notes) {
      updateData.admin_notes = admin_notes
    }

    // Atualizar no banco de dados
    const { data, error } = await serverClient
      .from('consignments')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Erro ao atualizar consignação:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Consignação não encontrada' },
        { status: 404 }
      )
    }

    // Se aprovada, criar veículo na tabela de veículos
    if (status === 'approved') {
      const consignment = data[0]
      
      const vehicleData = {
        brand: consignment.brand,
        model: consignment.model,
        year: consignment.year,
        category: consignment.category,
        capacity: consignment.capacity,
        condition: consignment.condition,
        mileage: consignment.mileage,
        daily_rate: consignment.daily_rate,
        description: consignment.description,
        photos: consignment.photos,
        status: 'available',
        featured: false,
        source: 'consigned',
        owner_id: null, // Será preenchido quando o proprietário se cadastrar
        approval_status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: vehicleError } = await serverClient
        .from('vehicles')
        .insert([vehicleData])

      if (vehicleError) {
        console.error('Erro ao criar veículo:', vehicleError)
        // Não falhar a operação, apenas logar o erro
      }
    }

    return NextResponse.json({
      success: true,
      message: `Consignação ${status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso`,
      consignment: data[0]
    })

  } catch (error) {
    console.error('Erro na API de consignação:', error)
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

    const { error } = await serverClient
      .from('consignments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar consignação:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Consignação deletada com sucesso'
    })

  } catch (error) {
    console.error('Erro na API de consignação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

