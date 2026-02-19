// CSV import script — run with: npx ts-node scripts/import-csv.ts
// Or: node -e "require('./scripts/import-csv.js')"
// Requires: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// Try to load env manually if .env.local exists, otherwise use system env
const envPath = path.join(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=')
        if (key && val) process.env[key.trim()] = val.trim()
    })
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY son necesarios.')
    console.log('Puedes ponerlos en .env.local o pasarlos por terminal.')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Simple CSV parser for the specific format
function parseCSV(content: string) {
    const lines: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < content.length; i++) {
        const ch = content[i]
        if (ch === '"') {
            inQuotes = !inQuotes
            current += ch
        } else if (ch === '\n' && !inQuotes) {
            lines.push(current)
            current = ''
        } else {
            current += ch
        }
    }
    if (current) lines.push(current)

    const headers = splitCSVLine(lines[0])
    return lines.slice(1).filter(l => l.trim()).map(line => {
        const values = splitCSVLine(line)
        const obj: Record<string, string> = {}
        headers.forEach((h, i) => {
            obj[h.trim()] = (values[i] || '').replace(/^"|"$/g, '').replace(/""/g, '"').trim()
        })
        return obj
    })
}

function splitCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (ch === '"') {
            inQuotes = !inQuotes
            current += ch
        } else if (ch === ',' && !inQuotes) {
            result.push(current)
            current = ''
        } else {
            current += ch
        }
    }
    result.push(current)
    return result
}

async function importCSV() {
    const csvPath = path.join(__dirname, '../crm/CRM_RACHA_PROFUNDO.csv')

    if (!fs.existsSync(csvPath)) {
        console.error('CSV not found at:', csvPath)
        console.log('Place CRM_RACHA_PROFUNDO.csv in the crm/ folder')
        process.exit(1)
    }

    const content = fs.readFileSync(csvPath, 'utf-8')
    const rows = parseCSV(content)

    console.log(`Found ${rows.length} leads to import`)

    // Map CSV columns to DB columns
    // CSV: tier, mensaje_linkedin, trayectoria_analizada, etiqueta_perfil, dato_gancho, Nombre, LinkedIn
    const leads = rows
        .filter(r => r['Nombre'] && r['Nombre'].trim())
        .map(r => ({
            nombre: r['Nombre']?.trim() || '',
            linkedin_url: r['LinkedIn']?.trim() || null,
            tier: (['BALLENA', 'PARTNER', 'CREADOR', 'RESTO'].includes(r['tier']?.trim())
                ? r['tier'].trim()
                : 'RESTO') as 'BALLENA' | 'PARTNER' | 'CREADOR' | 'RESTO',
            etiqueta_perfil: r['etiqueta_perfil']?.trim() || null,
            trayectoria_analizada: r['trayectoria_analizada']?.trim() || null,
            dato_gancho: r['dato_gancho']?.trim() || null,
            mensaje_1: r['mensaje_linkedin']?.trim() || null,
            mensaje_2: null,
            mensaje_3: null,
            mensaje_4: null,
            mensaje_5: null,
            estado_linkedin: 'pendiente' as const,
            me_gusta: false,
            no_me_gusta: false,
            leido: false,
        }))

    console.log(`Importing ${leads.length} valid leads...`)

    // Upsert in batches of 50
    for (let i = 0; i < leads.length; i += 50) {
        const batch = leads.slice(i, i + 50)
        const { error } = await supabase
            .from('leads')
            .upsert(batch, { onConflict: 'linkedin_url', ignoreDuplicates: false })

        if (error) {
            console.error(`Error in batch ${i}-${i + 50}:`, error)
        } else {
            console.log(`✓ Imported batch ${i + 1}-${Math.min(i + 50, leads.length)}`)
        }
    }

    console.log('✅ Import complete!')
}

importCSV().catch(console.error)
