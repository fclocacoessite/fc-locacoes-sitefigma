import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Criando veículo a partir de consignação aprovada')
    
    const body = await request.json()
    const { consignmentId } = body

    if (!consignmentId) {
      return NextResponse.json(
        { error: 'ID da consignação é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar dados da consignação
    const { data: consignment, error: consignmentError } = await supabaseAdmin
      .from('consignments')
      .select('*')
      .eq('id', consignmentId)
      .eq('status', 'approved')
      .single()

    if (consignmentError || !consignment) {
      console.error('Erro ao buscar consignação:', consignmentError)
      return NextResponse.json(
        { error: 'Consignação não encontrada ou não aprovada' },
        { status: 404 }
      )
    }

    // Gerar placa única baseada no ID da consignação
    const plateSuffix = consignmentId.slice(-4).toUpperCase()
    const generatedPlate = `CON-${plateSuffix}`

    // Verificar se já existe um veículo com essa placa
    const { data: existingVehicle } = await supabaseAdmin
      .from('vehicles')
      .select('id')
      .eq('plate', generatedPlate)
      .single()

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'Veículo já foi criado a partir desta consignação' },
        { status: 409 }
      )
    }

    // Preparar dados do veículo
    const vehicleData = {
      brand: consignment.brand,
      model: consignment.model,
      year: consignment.year,
      plate: generatedPlate,
      category: consignment.category,
      daily_rate: consignment.daily_rate,
      weekly_rate: Math.round(consignment.daily_rate * 6), // 6 dias = 1 semana
      monthly_rate: Math.round(consignment.daily_rate * 25), // 25 dias = 1 mês
      is_available: true,
      description: consignment.description || `Veículo ${consignment.brand} ${consignment.model} ${consignment.year}`,
      capacity_ton: consignment.capacity ? parseFloat(consignment.capacity) : null,
      cabine_suplementar: false, // Padrão para veículos consignados
      carroceria_aberta: false, // Padrão para veículos consignados
      banheiro: false, // Padrão para veículos consignados
      photos: consignment.photos || [],
      documents: ['CRLV', 'Seguro'], // Documentos padrão
      features: [], // Array vazio por padrão
      status: 'available',
      featured: false, // Não destacar veículos consignados
      source: 'consigned' as const,
      approval_status: 'approved' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Criar veículo
    const { data: vehicle, error: vehicleError } = await supabaseAdmin
      .from('vehicles')
      .insert([vehicleData])
      .select()
      .single()

    if (vehicleError) {
      console.error('Erro ao criar veículo:', vehicleError)
      return NextResponse.json(
        { error: 'Erro ao criar veículo', details: vehicleError.message },
        { status: 500 }
      )
    }

    console.log('✅ Veículo criado com sucesso:', vehicle.id)

    return NextResponse.json({
      success: true,
      message: 'Veículo criado com sucesso na frota',
      vehicle: vehicle
    })

  } catch (error) {
    console.error('Erro na API de criação de veículo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
