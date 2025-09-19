import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Remover campos que não devem ser atualizados
    const { id: _, created_at, updated_at, ...updateData } = body
    
    // Filtrar apenas campos que realmente mudaram (otimização)
    const fieldsToUpdate: any = {}
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        fieldsToUpdate[key] = updateData[key]
      }
    })
    
    // Remover campos que podem não existir na tabela
    delete fieldsToUpdate.updated_at
    delete fieldsToUpdate.created_at
    
    // Fazer a atualização diretamente
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update(fieldsToUpdate)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar veículo:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar veículo', details: error.message },
        { status: 500 }
      )
    }

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Veículo não encontrado após atualização' },
        { status: 404 }
      )
    }

    return NextResponse.json({ vehicle })
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
    
    // Primeiro verificar se o veículo existe
    const { data: existingVehicle, error: checkError } = await supabase
      .from('vehicles')
      .select('id')
      .eq('id', id)
      .single()

    if (checkError || !existingVehicle) {
      console.error('Veículo não encontrado:', checkError)
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      )
    }
    
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao excluir veículo:', error)
      return NextResponse.json(
        { error: 'Erro ao excluir veículo' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
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
    
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar veículo:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar veículo' },
        { status: 500 }
      )
    }

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      )
    }


    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}