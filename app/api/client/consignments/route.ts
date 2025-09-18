import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Buscar o email do usuário autenticado
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token de autorização não fornecido' 
      }, { status: 401 })
    }

    // Validar o token JWT do Supabase e obter email do usuário
    const token = authHeader.replace(/^Bearer\s+/i, '')
    const { data: userResult, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userResult?.user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token inválido' 
      }, { status: 401 })
    }
    const tokenEmail = userResult.user.email
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email') || tokenEmail || undefined
    
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email do cliente não fornecido' 
      }, { status: 400 })
    }

    // Buscar consignações do cliente pelo email
    const { data: consignments, error } = await supabaseAdmin
      .from('consignments')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar consignações do cliente:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Erro interno do servidor' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      consignments: consignments || [],
      total: consignments?.length || 0
    })

  } catch (error) {
    console.error('Erro na API de consignações do cliente:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🚀 Iniciando POST /api/client/consignments')
    console.log('📋 Dados recebidos na API:', body)
    
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
    
    if (!ownerName || !email || !phone || !brand || !model || !year ||
        !category || !condition || !dailyRate) {
      return NextResponse.json(
        { error: 'Campos obrigatórios não preenchidos' },
        { status: 400 }
      )
    }

    // Validar aceite dos termos
    if (!acceptTerms) {
      return NextResponse.json(
        { error: 'É necessário aceitar os termos e condições' },
        { status: 400 }
      )
    }

    // Converter valores numéricos
    const yearNum = parseInt(year.toString())
    if (isNaN(yearNum) || yearNum < 1990 || yearNum > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { error: 'Ano inválido' },
        { status: 400 }
      )
    }

    const dailyRateNum = parseFloat(dailyRate.toString())
    if (isNaN(dailyRateNum) || dailyRateNum <= 0) {
      return NextResponse.json(
        { error: 'Valor da diária inválido' },
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
      photos: photos || [],
      status: 'pending' as const,
      submitted_at: submittedAt || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Inserir no banco de dados
    console.log('Tentando inserir consignação:', consignmentData)
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

    console.log('Consignação inserida com sucesso:', data)

    return NextResponse.json({
      success: true,
      message: 'Consignação criada com sucesso',
      consignment: data[0]
    })

  } catch (error) {
    console.error('Erro inesperado na API de consignações do cliente:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
