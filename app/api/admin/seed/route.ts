import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    const expected = process.env.ADMIN_SEED_TOKEN

    if (!expected) {
      return NextResponse.json({ error: 'ADMIN_SEED_TOKEN não configurado no servidor' }, { status: 500 })
    }
    if (token !== expected) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { email, password, name, role } = body as { email?: string; password?: string; name?: string; role?: 'admin' | 'manager' }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    const createResult = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: name || 'Administrador',
        role: role || 'admin',
      },
    })

    if (createResult.error) {
      return NextResponse.json({ error: createResult.error.message }, { status: 400 })
    }

    const user = createResult.data.user
    return NextResponse.json({ id: user?.id, email: user?.email, role: user?.user_metadata?.role }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro inesperado', details: String(err?.message || err) }, { status: 500 })
  }
}


