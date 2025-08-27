import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const payload: Record<string, unknown> = {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    anonQueryOk: false,
    serviceQueryOk: false,
    authAdminOk: false,
  }

  // Teste simples com o cliente público (anon)
  try {
    const { error } = await supabase.from('vehicles').select('*').limit(1)
    payload.anonQueryOk = !error
    if (error) payload.anonQueryError = error.message
  } catch (e: any) {
    payload.anonQueryError = String(e?.message ?? e)
  }

  // Teste com a service role (consulta de contagem)
  try {
    const { error } = await supabaseAdmin
      .from('vehicles')
      .select('id', { count: 'exact', head: true })
    payload.serviceQueryOk = !error
    if (error) payload.serviceQueryError = error.message
  } catch (e: any) {
    payload.serviceQueryError = String(e?.message ?? e)
  }

  // Teste de acesso admin ao auth (lista de usuários)
  try {
    // @ts-ignore - tipos do admin variam por versão
    const { error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 })
    payload.authAdminOk = !error
    if (error) payload.authAdminError = error.message
  } catch (e: any) {
    payload.authAdminError = String(e?.message ?? e)
  }

  return NextResponse.json(payload, { status: 200 })
}


