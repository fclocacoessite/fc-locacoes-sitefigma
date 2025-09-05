// Re-exportar os clientes do arquivo singleton
export { supabase, supabaseAdmin } from './supabase-client'

// Tipos para o banco de dados
export interface Vehicle {
  id: string
  category: string
  model: string
  description?: string
  capacity_ton?: number
  height_m?: number
  cabine_suplementar: boolean
  carroceria_aberta: boolean
  banheiro: boolean
  photos: string[]
  documents: string[]
  features?: string[]
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
