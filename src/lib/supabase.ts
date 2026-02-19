import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// We only initialize the client if we have the credentials.
// This prevents the "supabaseUrl is required" error during the build process
// if the environment variables haven't been set in Vercel yet.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

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
