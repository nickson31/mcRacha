import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Lead = {
  id: string
  nombre: string
  linkedin_url: string | null
  foto_url: string | null
  tier: 'BALLENA' | 'PARTNER' | 'CREADOR' | 'RESTO'
  etiqueta_perfil: string | null
  trayectoria_analizada: string | null
  dato_gancho: string | null
  mensaje_1: string | null
  mensaje_2: string | null
  mensaje_3: string | null
  mensaje_4: string | null
  mensaje_5: string | null
  estado_linkedin: 'pendiente' | 'solicitud' | 'mensaje_directo' | 'contactado' | 'respondio'
  estado_custom: string | null
  me_gusta: boolean
  no_me_gusta: boolean
  leido: boolean
  observaciones: string | null
  created_at: string
  updated_at: string
}

export type LeadActividad = {
  id: string
  lead_id: string
  tipo: string
  contenido: string | null
  created_at: string
}
