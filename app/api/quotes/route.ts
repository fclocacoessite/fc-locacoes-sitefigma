import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: quotes, error } = await supabase
      .from('quotes')
      .select(`
        *,
        vehicles (
          brand,
          model,
          year,
          daily_rate
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar orçamentos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar orçamentos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ quotes })
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
    
    // Validação básica
    const required = ['client_name', 'client_email', 'client_phone', 'vehicle_id', 'start_date', 'end_date']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório: ${field}` },
          { status: 400 }
        )
      }
    }

    // Calcular dias e custo
    const startDate = new Date(body.start_date)
    const endDate = new Date(body.end_date)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    if (totalDays <= 0) {
      return NextResponse.json(
        { error: 'Data de fim deve ser posterior à data de início' },
        { status: 400 }
      )
    }

    // Buscar dados do veículo para calcular o custo
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('daily_rate, weekly_rate, monthly_rate')
      .eq('id', body.vehicle_id)
      .single()

    if (vehicleError || !vehicle) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      )
    }

    // Calcular custo baseado no período
    let totalCost = 0
    if (totalDays >= 30 && vehicle.monthly_rate) {
      const months = Math.ceil(totalDays / 30)
      totalCost = months * vehicle.monthly_rate
    } else if (totalDays >= 7 && vehicle.weekly_rate) {
      const weeks = Math.ceil(totalDays / 7)
      totalCost = weeks * vehicle.weekly_rate
    } else {
      totalCost = totalDays * vehicle.daily_rate
    }

    const quoteData = {
      ...body,
      total_days: totalDays,
      total_cost: totalCost,
      status: 'pending'
    }

    const { data: quote, error } = await supabase
      .from('quotes')
      .insert([quoteData])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar orçamento:', error)
      return NextResponse.json(
        { error: 'Erro ao criar orçamento' },
        { status: 500 }
      )
    }

    return NextResponse.json({ quote }, { status: 201 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
