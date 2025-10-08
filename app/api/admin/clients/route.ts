import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os usuários do Supabase Auth
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('Erro ao buscar usuários:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 400 })
    }

    // Filtrar apenas clientes (role = 'client')
    const clients = users.users
      .filter(user => user.user_metadata?.role === 'client')
      .map(user => ({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.full_name || 'Nome não informado',
        phone: user.user_metadata?.phone || 'Telefone não informado',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
        is_active: !!user.email_confirmed_at,
        avatar_url: user.user_metadata?.avatar_url || null
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ 
      success: true, 
      clients,
      total: clients.length
    })

  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, action, data } = await request.json()

    if (!userId || !action) {
      return NextResponse.json({ 
        success: false, 
        error: 'Parâmetros obrigatórios: userId e action' 
      }, { status: 400 })
    }

    let result

    switch (action) {
      case 'ban':
        result = await supabaseAdmin.auth.admin.updateUserById(userId, {
          ban_duration: '876000h' // 100 anos (efetivamente permanente)
        })
        break

      case 'unban':
        result = await supabaseAdmin.auth.admin.updateUserById(userId, {
          ban_duration: 'none'
        })
        break

      case 'update_metadata':
        result = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: data
        })
        break

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Ação não reconhecida' 
        }, { status: 400 })
    }

    if (result.error) {
      console.error('Erro ao atualizar usuário:', result.error)
      return NextResponse.json({ 
        success: false, 
        error: result.error.message 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Usuário atualizado com sucesso' 
    })

  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
