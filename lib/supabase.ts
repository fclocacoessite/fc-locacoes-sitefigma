// Re-exportar os clientes do arquivo singleton
export { supabase, supabaseAdmin } from './supabase-client'

// Tipos para o banco de dados
export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  plate: string
  category: string
  daily_rate: number
  weekly_rate?: number | null
  monthly_rate?: number | null
  is_available: boolean
  image_url?: string | null
  description?: string
  capacity_ton?: number | null
  height_m?: number | null
  cabine_suplementar: boolean
  carroceria_aberta: boolean
  banheiro: boolean
  photos: string[]
  documents: string[]
  features?: string[]
  status: string
  featured: boolean
  owner_id?: string | null
  source?: 'company' | 'consigned'
  approval_status?: 'pending' | 'approved' | 'rejected'
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
