import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando criação de usuário admin...')

    // Dados do admin padrão
    const adminData = {
      email: 'admin@fclocacoes.com.br',
      password: 'admin123456',
      user_metadata: {
        name: 'Administrador FC Locações',
        role: 'admin',
        phone: '(21) 99215-4030',
        company: 'FC Locações'
      }
    }

    // Criar usuário admin
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password,
      user_metadata: adminData.user_metadata,
      email_confirm: true // Confirmar email automaticamente
    })

    if (error) {
      console.error('Erro ao criar usuário admin:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 400 })
    }

    console.log('Usuário admin criado com sucesso:', data.user?.email)

    return NextResponse.json({ 
      success: true, 
      message: 'Usuário admin criado com sucesso',
      user: {
        email: data.user?.email,
        id: data.user?.id
      }
    })

  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar se já existe um usuário admin
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('Erro ao listar usuários:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 400 })
    }

    const adminUsers = users.users.filter(user => 
      user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'manager'
    )

    return NextResponse.json({ 
      success: true, 
      hasAdmin: adminUsers.length > 0,
      adminCount: adminUsers.length,
      admins: adminUsers.map(user => ({
        email: user.email,
        role: user.user_metadata?.role,
        created_at: user.created_at
      }))
    })

  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
