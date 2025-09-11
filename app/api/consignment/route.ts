import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const serverClient = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
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
      submittedAt
    } = body

    // Validar dados obrigatórios
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

    // Validar telefone (formato básico)
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Formato de telefone inválido. Use: (XX) XXXXX-XXXX' },
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
    const dailyRateNum = parseFloat(dailyRate.replace(/[^\d,]/g, '').replace(',', '.'))
    if (isNaN(dailyRateNum) || dailyRateNum <= 0) {
      return NextResponse.json(
        { error: 'Valor da diária inválido' },
        { status: 400 }
      )
    }

    // Validar fotos
    if (!photos || photos.length < 3) {
      return NextResponse.json(
        { error: 'É necessário enviar pelo menos 3 fotos' },
        { status: 400 }
      )
    }

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
      status: 'pending',
      submitted_at: submittedAt || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Inserir no banco de dados
    const { data, error } = await serverClient
      .from('consignments')
      .insert([consignmentData])
      .select()

    if (error) {
      console.error('Erro ao inserir consignação:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    // Enviar email de confirmação (simulado)
    console.log(`Consignação ${consignmentId} criada com sucesso para ${email}`)

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
    const { data, error } = await serverClient
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

