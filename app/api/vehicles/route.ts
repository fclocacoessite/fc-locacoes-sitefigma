import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminView = searchParams.get('admin') === 'true'
    
    // Campos ultra-otimizados para máxima performance
    const publicFields = adminView 
      ? '*' 
      : 'id,brand,model,year,plate,category,daily_rate,weekly_rate,monthly_rate,is_available,image_url,photos,status,featured,description,capacity_ton,height_m,cabine_suplementar,carroceria_aberta,banheiro,features,documents'
    
    let query = supabase
      .from('vehicles')
      .select(publicFields)
      .order('featured', { ascending: false }) // Destaques primeiro
      .order('created_at', { ascending: false })

    // Se não for visualização admin, mostrar veículos disponíveis, locados e em manutenção
    if (!adminView) {
      query = query.in('status', ['available', 'rented', 'maintenance'])
    }

    const { data: vehicles, error } = await query

    if (error) {
      console.error('Erro ao buscar veículos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar veículos' },
        { status: 500 }
      )
    }

    // Otimizar dados para o site público (apenas campos essenciais)
    const optimizedVehicles = adminView ? vehicles : vehicles?.map(vehicle => ({
      ...vehicle,
      // Garantir que photos seja um array (todas as fotos para a página da frota)
      photos: Array.isArray(vehicle.photos) ? vehicle.photos : [],
      // Campos opcionais apenas se existirem
      description: vehicle.description || '',
      capacity_ton: vehicle.capacity_ton || null,
      height_m: vehicle.height_m || null,
      cabine_suplementar: vehicle.cabine_suplementar || false,
      carroceria_aberta: vehicle.carroceria_aberta || false,
      banheiro: vehicle.banheiro || false,
      features: Array.isArray(vehicle.features) ? vehicle.features : [],
      documents: Array.isArray(vehicle.documents) ? vehicle.documents : []
    }))

    // Cache headers otimizados - sem cache para admin, cache curto para público
    const response = NextResponse.json({ vehicles: optimizedVehicles })
    
    if (adminView) {
      // Cache mínimo para admin (5 segundos)
      response.headers.set('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=10')
    } else {
      // Cache mais agressivo para site público (2 minutos)
      response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300')
    }
    
    return response
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