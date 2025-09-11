import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const uid: string | undefined = body?.uid
    const role: string | undefined = body?.role
    const name: string | undefined = body?.name

    if (!uid || !role) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios: uid, role' }, { status: 400 })
    }

    // Atualiza user_metadata no Auth
    // @ts-ignore: tipos variam por versão
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(uid, {
      user_metadata: { role, ...(name ? { name } : {}) },
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    // Garante linha em public.users com o mesmo papel
    const { error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert({ id: uid, role, name: name ?? null })
      .select('id')
      .single()

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 })
  }
}


