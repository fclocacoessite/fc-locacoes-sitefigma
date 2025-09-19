import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    // Validar status
    const validStatuses = ['pending', 'approved', 'rejected', 'active', 'completed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    // Atualizar consignação
    const { data, error } = await supabaseAdmin
      .from('consignments')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
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

    // Se a consignação foi aprovada, criar veículo automaticamente
    if (status === 'approved') {
      try {
        console.log('🚗 Criando veículo a partir da consignação aprovada')
        
        const vehicleResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/vehicles/create-from-consignment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            consignmentId: id
          })
        })

        const vehicleData = await vehicleResponse.json()
        
        if (vehicleData.success) {
          console.log('✅ Veículo criado com sucesso na frota:', vehicleData.vehicle.id)
        } else {
          console.warn('⚠️ Erro ao criar veículo (não crítico):', vehicleData.error)
        }
      } catch (vehicleError) {
        console.warn('⚠️ Erro ao criar veículo (não crítico):', vehicleError)
        // Não falhar a aprovação se der erro na criação do veículo
      }
    }

    return NextResponse.json({ 
      success: true,
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

    // Verificar se a consignação existe
    const { data: existingConsignment, error: fetchError } = await supabaseAdmin
      .from('consignments')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existingConsignment) {
      return NextResponse.json(
        { error: 'Consignação não encontrada' },
        { status: 404 }
      )
    }

    // Deletar consignação
    const { error } = await supabaseAdmin
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
      message: 'Consignação excluída com sucesso'
    })

  } catch (error) {
    console.error('Erro na API de consignação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}