import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminView = searchParams.get('admin') === 'true'
    
    let query = supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false })

    // Se não for visualização admin, mostrar apenas veículos disponíveis
    if (!adminView) {
      query = query.eq('is_available', true)
    }

    const { data: vehicles, error } = await query

    if (error) {
      console.error('Erro ao buscar veículos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar veículos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ vehicles })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar veículo:', error)
      return NextResponse.json(
        { error: 'Erro ao criar veículo' },
        { status: 500 }
      )
    }

    return NextResponse.json({ vehicle }, { status: 201 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
