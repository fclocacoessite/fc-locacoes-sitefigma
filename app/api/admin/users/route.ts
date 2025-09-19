import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    // Mapear usuários com informações completas
    const usersList = users.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.user_metadata?.full_name || 'Nome não informado',
      phone: user.user_metadata?.phone || 'Telefone não informado',
      role: user.user_metadata?.role || 'client',
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at,
      is_active: !user.banned_until,
      is_banned: !!user.banned_until,
      avatar_url: user.user_metadata?.avatar_url || null,
      provider: user.app_metadata?.provider || 'email'
    })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ 
      success: true, 
      users: usersList,
      total: usersList.length
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

    // Buscar informações do usuário para verificar se é admin
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (userError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao buscar informações do usuário' 
      }, { status: 400 })
    }

    const userRole = userData.user.user_metadata?.role || 'client'
    const isAdmin = userRole === 'admin'

    // Proteger administradores de ações destrutivas
    if (isAdmin && (action === 'ban' || action === 'delete')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Não é possível banir ou excluir administradores do sistema' 
      }, { status: 403 })
    }

    // Proteger contra remoção de privilégios de admin
    if (isAdmin && action === 'update_role' && data.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'Não é possível alterar o role de um administrador' 
      }, { status: 403 })
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

      case 'update_role':
        if (!data.role) {
          return NextResponse.json({ 
            success: false, 
            error: 'Role é obrigatório para atualização' 
          }, { status: 400 })
        }
        
        result = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: { 
            ...data,
            role: data.role 
          }
        })
        break

      case 'update_metadata':
        result = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: data
        })
        break

      case 'delete':
        result = await supabaseAdmin.auth.admin.deleteUser(userId)
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
