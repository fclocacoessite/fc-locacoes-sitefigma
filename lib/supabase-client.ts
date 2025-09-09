import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gdwpvvdncdqesakkfmle.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODkyNzksImV4cCI6MjA3MDk2NTI3OX0.SBaaDe0_RxnHE0IJie1FwSgCIE2PY6hggiocEOdZBIg'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4OTI3OSwiZXhwIjoyMDcwOTY1Mjc5fQ.vx6l5XpyAY_s0K036QLWUcO39YcVWkfC0YKlFgfHS1s'

// Singleton global para evitar múltiplas instâncias
declare global {
  var __supabase: SupabaseClient | undefined
  var __supabaseAdmin: SupabaseClient | undefined
}

// Cliente público (para uso no frontend) - Singleton global
export const supabase = (() => {
  if (typeof window !== 'undefined') {
    // No cliente (browser)
    if (!global.__supabase) {
      global.__supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
      })
    }
    return global.__supabase
  } else {
    // No servidor
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
})()

// Cliente administrativo (para operações do servidor) - Singleton global
export const supabaseAdmin = (() => {
  if (!global.__supabaseAdmin) {
    global.__supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  }
  return global.__supabaseAdmin
})()
