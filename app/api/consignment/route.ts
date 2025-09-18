import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando POST /api/consignment')
    
    const body = await request.json()
    
    const {
      ownerName,
      email,
      phone,
      brand,
      model,
      year,
      category,
      capacity,
      condition,
      mileage,
      price,
      dailyRate,
      description,
      photos,
      submittedAt,
      acceptTerms
    } = body

    // Validar dados obrigatórios
    const requiredFields = { ownerName, email, phone, brand, model, year, category, condition, dailyRate }
    
    if (!ownerName || !email || !phone || !brand || !model || !year || !category || !condition || !dailyRate) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar telefone (formato mais flexível)
    const phoneRegex = /^[\d\s\(\)\-\+]+$/
    if (!phoneRegex.test(phone) || phone.length < 10) {
      return NextResponse.json(
        { error: 'Formato de telefone inválido. Use um formato válido como (21) 99999-9999' },
        { status: 400 }
      )
    }

    // Validar ano
    const currentYear = new Date().getFullYear()
    const yearNum = parseInt(year)
    if (isNaN(yearNum) || yearNum < 1990 || yearNum > currentYear + 1) {
      return NextResponse.json(
        { error: 'Ano inválido' },
        { status: 400 }
      )
    }

    // Validar valor da diária
    const dailyRateStr = String(dailyRate).replace(/[^\d,.-]/g, '').replace(',', '.')
    const dailyRateNum = parseFloat(dailyRateStr)
    if (isNaN(dailyRateNum) || dailyRateNum <= 0) {
      return NextResponse.json(
        { error: 'Valor da diária inválido' },
        { status: 400 }
      )
    }

    // Validar fotos (tornar opcional por enquanto)
    // if (!photos || photos.length < 3) {
    //   return NextResponse.json(
    //     { error: 'É necessário enviar pelo menos 3 fotos' },
    //     { status: 400 }
    //   )
    // }

    // Gerar ID único para a consignação
    const consignmentId = `CON-${Date.now().toString().slice(-6)}`

    // Preparar dados para inserção
    const consignmentData = {
      id: consignmentId,
      owner_name: ownerName,
      email: email,
      phone: phone,
      brand: brand,
      model: model,
      year: yearNum,
      category: category,
      capacity: capacity || null,
      condition: condition,
      mileage: mileage || null,
      price: price || null,
      daily_rate: dailyRateNum,
      description: description || null,
      photos: photos,
      status: 'pending' as const,
      submitted_at: submittedAt || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Inserir no banco de dados
    const { data, error } = await supabaseAdmin
      .from('consignments')
      .insert([consignmentData])
      .select()

    if (error) {
      console.error('Erro ao inserir consignação:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitação de consignação enviada com sucesso!',
      consignmentId: consignmentId
    })

  } catch (error) {
    console.error('Erro na API de consignação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('consignments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar consignações:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    return NextResponse.json({ consignments: data })

  } catch (error) {
    console.error('Erro na API de consignação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

