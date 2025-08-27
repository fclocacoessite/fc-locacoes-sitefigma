import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase (hardcoded temporariamente para teste)
const supabaseUrl = 'https://gdwpvvdncdqesakkfmle.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODkyNzksImV4cCI6MjA3MDk2NTI3OX0.SBaaDe0_RxnHE0IJie1FwSgCIE2PY6hggiocEOdZBIg'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkd3B2dmRuY2RxZXNha2tmbWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTM4OTI3OSwiZXhwIjoyMDcwOTY1Mjc5fQ.vx6l5XpyAY_s0K036QLWUcO39YcVWkfC0YKlFgfHS1s'

// Cliente público (para uso no frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
})

// Cliente administrativo (para operações do servidor)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Tipos para o banco de dados
export interface Vehicle {
  id: string
  category: string
  model: string
  capacity_ton?: number
  height_m?: number
  cabine_suplementar: boolean
  carroceria_aberta: boolean
  banheiro: boolean
  photos: string[]
  documents: string[]
  status: string
  featured: boolean
  created_at: string
  updated_at?: string
}

export interface Quote {
  id: string
  client_id?: string
  client_name: string
  client_email: string
  client_phone: string
  vehicle_id: string
  start_date: string
  end_date: string
  total_days: number
  total_cost: number
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  message?: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: 'admin' | 'manager' | 'client'
  created_at: string
  updated_at: string
}

export interface Contract {
  id: string
  quote_id: string
  client_id: string
  vehicle_id: string
  start_date: string
  end_date: string
  total_cost: number
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}
