import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { createServerClient } from '@supabase/ssr'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Tentar autenticação via header Authorization
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
      } catch {}
    }

    // Criar cliente Supabase no servidor com cookies da request
    const serverClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // noop: Next.js route handlers não permitem set direto em request cookies
          },
        },
      }
    )

    // Buscar sessão do usuário via cookies, se não autenticado via header
    let userId = authenticatedUserId
    let userRole = authenticatedUserRole
    if (!userId) {
      const { data: sessionData } = await serverClient.auth.getSession()
      const session = sessionData?.session
      if (!session) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
      }
      userId = session.user.id
      userRole = (session.user.user_metadata as any)?.role || 'client'
    }

    // Verificar se o usuário tem permissão (apenas admin/manager podem editar)
    const isAdmin = userRole === 'admin' || userRole === 'manager'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Sem permissão para editar veículos' }, { status: 403 })
    }
    
    // Remover campos que não devem ser atualizados
    const { id: _, created_at, updated_at, ...updateData } = body
    
    // Filtrar apenas campos que realmente mudaram (otimização)
    const fieldsToUpdate: any = {}
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        fieldsToUpdate[key] = updateData[key]
      }
    })
    
    // Remover campos que podem não existir na tabela
    delete fieldsToUpdate.updated_at
    delete fieldsToUpdate.created_at
    
    // Fazer a atualização usando cliente adequado
    const useAdmin = userRole === 'admin' || userRole === 'manager'
    const { data: vehicle, error } = useAdmin
      ? await supabaseAdmin
          .from('vehicles')
          .update(fieldsToUpdate)
          .eq('id', id)
          .select()
          .single()
      : await serverClient
          .from('vehicles')
          .update(fieldsToUpdate)
          .eq('id', id)
          .select()
          .single()

    if (error) {
      console.error('Erro ao atualizar veículo:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar veículo', details: error.message },
        { status: 500 }
      )
    }

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Veículo não encontrado após atualização' },
        { status: 404 }
      )
    }

    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Variáveis de ambiente do Supabase não configuradas')
      return NextResponse.json({ error: 'Configuração do servidor inválida' }, { status: 500 })
    }

    // Tentar autenticação via header Authorization
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
      } catch {}
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

    // Buscar sessão do usuário via cookies, se não autenticado via header
    let userId = authenticatedUserId
    let userRole = authenticatedUserRole
    if (!userId) {
      const { data: sessionData } = await serverClient.auth.getSession()
      const session = sessionData?.session
      if (!session) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
      }
      userId = session.user.id
      userRole = (session.user.user_metadata as any)?.role || 'client'
    }

    // Verificar se o usuário tem permissão (apenas admin/manager podem excluir)
    const isAdmin = userRole === 'admin' || userRole === 'manager'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Sem permissão para excluir veículos' }, { status: 403 })
    }
    
    // Primeiro verificar se o veículo existe
    const { data: existingVehicle, error: checkError } = await serverClient
      .from('vehicles')
      .select('id')
      .eq('id', id)
      .single()

    if (checkError || !existingVehicle) {
      console.error('Veículo não encontrado:', checkError)
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      )
    }
    
    const useAdmin = userRole === 'admin' || userRole === 'manager'
    const { error } = useAdmin
      ? await supabaseAdmin
          .from('vehicles')
          .delete()
          .eq('id', id)
      : await serverClient
          .from('vehicles')
          .delete()
          .eq('id', id)

    if (error) {
      console.error('Erro ao excluir veículo:', error)
      return NextResponse.json(
        { error: 'Erro ao excluir veículo' },
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar veículo:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar veículo' },
        { status: 500 }
      )
    }

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Veículo não encontrado' },
        { status: 404 }
      )
    }


    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}