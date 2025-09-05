import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Buscar imagens de um veículo
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const { data: images, error } = await supabase
      .from('vehicle_images')
      .select('id, image_type, image_name, image_size, is_primary, created_at')
      .eq('vehicle_id', id)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erro ao buscar imagens:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar imagens' },
        { status: 500 }
      )
    }

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Adicionar imagem a um veículo
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const formData = await request.formData()
    const file: File | null = formData.get('file') as unknown as File
    const isPrimary = formData.get('isPrimary') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Apenas arquivos de imagem são permitidos' }, { status: 400 })
    }

    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB' }, { status: 400 })
    }

    // Converter arquivo para buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Se esta for a imagem principal, remover a flag de outras imagens
    if (isPrimary) {
      await supabase
        .from('vehicle_images')
        .update({ is_primary: false })
        .eq('vehicle_id', id)
    }

    // Inserir nova imagem
    const { data: image, error } = await supabase
      .from('vehicle_images')
      .insert([{
        vehicle_id: id,
        image_data: buffer,
        image_type: file.type,
        image_name: file.name,
        image_size: file.size,
        is_primary: isPrimary
      }])
      .select('id, image_type, image_name, image_size, is_primary, created_at')
      .single()

    if (error) {
      console.error('Erro ao salvar imagem:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar imagem' },
        { status: 500 }
      )
    }

    return NextResponse.json({ image }, { status: 201 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
