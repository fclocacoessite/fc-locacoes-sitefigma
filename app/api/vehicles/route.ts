import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const adminView = searchParams.get('admin') === 'true'
    
    // Campos ultra-otimizados para máxima performance
    const publicFields = adminView 
      ? '*' 
      : 'id,brand,model,year,plate,category,daily_rate,weekly_rate,monthly_rate,is_available,image_url,photos,status,featured,description,capacity_ton,height_m,cabine_suplementar,carroceria_aberta,banheiro,features,documents,owner_id,source,approval_status,created_at'
    
    let query = supabase
      .from('vehicles')
      .select(publicFields)
      .order('featured', { ascending: false }) // Destaques primeiro
      .order('created_at', { ascending: false })

    // Se não for visualização admin, mostrar veículos disponíveis, locados e em manutenção
    // Aceitar tanto status em português quanto em inglês para compatibilidade
    if (!adminView) {
      query = query.in('status', ['disponivel', 'alugado', 'manutencao', 'available', 'rented', 'maintenance'])
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
    const optimizedVehicles = adminView ? vehicles : vehicles?.map((vehicle: any) => ({
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

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Variáveis de ambiente do Supabase não configuradas')
      return NextResponse.json({ error: 'Configuração do servidor inválida' }, { status: 500 })
    }

    // Tentar autenticação via header Authorization: Bearer <token>
    const authHeader = request.headers.get('authorization') || ''
    const bearerToken = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null

    let authenticatedUserId: string | null = null
    let authenticatedUserRole: string = 'client'

    if (bearerToken) {
      try {
        const { data: userData, error: userErr } = await supabase.auth.getUser(bearerToken)
        if (!userErr && userData?.user) {
          authenticatedUserId = userData.user.id
          authenticatedUserRole = (userData.user.user_metadata as any)?.role || 'client'
        }
      } catch (e) {
        // Ignorar e seguir para fallback por cookies
      }
    }

    // Criar cliente Supabase no servidor com cookies da request
    const serverClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            try {
              return request.cookies.getAll() || []
            } catch (error) {
              console.error('Erro ao obter cookies:', error)
              return []
            }
          },
          setAll() {
            // noop: Next.js route handlers não permitem set direto em request cookies
          },
        },
      }
    )

    // Obter sessão via cookies se não autenticado por Authorization
    let userId = authenticatedUserId
    let userRole = authenticatedUserRole
    if (!userId) {
      try {
        const { data, error: sessionError } = await serverClient.auth.getSession()
        const session = data?.session
        if (!session || sessionError) {
          return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
        }
        userId = session.user.id
        userRole = (session.user.user_metadata as any)?.role || 'client'
      } catch (error) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
      }
    }

    // Construir payload com regras por role
    const isAdmin = userRole === 'admin' || userRole === 'manager'

    const payload: Record<string, any> = {
      brand: body.brand,
      model: body.model,
      year: body.year,
      plate: body.plate,
      category: body.category,
      daily_rate: body.daily_rate,
      weekly_rate: body.weekly_rate ?? null,
      monthly_rate: body.monthly_rate ?? null,
      is_available: !!body.is_available,
      image_url: body.image_url ?? null,
      description: body.description ?? null,
      features: Array.isArray(body.features) ? body.features : [],
      photos: Array.isArray(body.photos) ? body.photos : [],
      documents: Array.isArray(body.documents) ? body.documents : [],
      status: body.status ?? 'disponivel',
      featured: !!body.featured,
    }


    // Executar inserção: se Authorization válido (admin/manager), usar supabaseAdmin
    // caso contrário, usar serverClient (cookie session com RLS)
    const useAdmin = userRole === 'admin' || userRole === 'manager'
    const { data: vehicle, error } = useAdmin
      ? await supabaseAdmin
          .from('vehicles')
          .insert(payload)
          .select()
          .single()
      : await serverClient
          .from('vehicles')
          .insert(payload)
          .select()
          .single()

    if (error) {
      console.error('Erro ao criar veículo:', error)
      return NextResponse.json({ error: 'Erro ao criar veículo' }, { status: 500 })
    }

    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}