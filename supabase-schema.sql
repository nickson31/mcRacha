-- Racha CRM — Supabase Schema
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity (from CSV)
  nombre TEXT NOT NULL,
  linkedin_url TEXT UNIQUE,
  foto_url TEXT,
  tier TEXT CHECK (tier IN ('BALLENA','PARTNER','CREADOR','RESTO')) DEFAULT 'RESTO',

  -- Profile analysis
  etiqueta_perfil TEXT,
  trayectoria_analizada TEXT,
  dato_gancho TEXT,

  -- 5 AI-generated messages
  mensaje_1 TEXT,  -- Mensaje principal (del CSV: mensaje_linkedin)
  mensaje_2 TEXT,  -- Variante corta / solicitud de conexión
  mensaje_3 TEXT,  -- Post-conexión / seguimiento
  mensaje_4 TEXT,  -- Alternativo largo / InMail
  mensaje_5 TEXT,  -- Mensaje de reactivación / nurturing

  -- CRM status fields
  estado_linkedin TEXT DEFAULT 'pendiente'
    CHECK (estado_linkedin IN ('pendiente','solicitud','mensaje_directo','contactado','respondio')),
  estado_custom TEXT,              -- Free text custom status
  me_gusta BOOLEAN DEFAULT FALSE,
  no_me_gusta BOOLEAN DEFAULT FALSE,
  leido BOOLEAN DEFAULT FALSE,
  observaciones TEXT,              -- Salesperson notes

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log
CREATE TABLE IF NOT EXISTS lead_actividad (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,  -- 'ESTADO','NOTA','LIKE','DISLIKE','LEIDO'
  contenido TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_tier ON leads(tier);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads(estado_linkedin);
CREATE INDEX IF NOT EXISTS idx_leads_me_gusta ON leads(me_gusta);
CREATE INDEX IF NOT EXISTS idx_leads_leido ON leads(leido);
CREATE INDEX IF NOT EXISTS idx_actividad_lead ON lead_actividad(lead_id);
