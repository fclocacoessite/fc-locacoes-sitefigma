import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// DELETE - Excluir imagem
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const { error } = await supabase
      .from('vehicle_images')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao excluir imagem:', error)
      return NextResponse.json(
        { error: 'Erro ao excluir imagem' },
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

// PUT - Atualizar imagem (principalmente para definir como principal)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { is_primary, vehicle_id } = body

    // Se for definir como principal, remover flag de outras imagens do mesmo veículo
    if (is_primary && vehicle_id) {
      await supabase
        .from('vehicle_images')
        .update({ is_primary: false })
        .eq('vehicle_id', vehicle_id)
        .neq('id', id)
    }

    const { data: image, error } = await supabase
      .from('vehicle_images')
      .update({ is_primary })
      .eq('id', id)
      .select('id, image_type, image_name, image_size, is_primary, created_at')
      .single()

    if (error) {
      console.error('Erro ao atualizar imagem:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar imagem' },
        { status: 500 }
      )
    }

    return NextResponse.json({ image })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}