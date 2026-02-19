'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, Lead } from '@/lib/supabase'
import LeftPanel from '@/components/LeftPanel'
import LeadCard from '@/components/LeadCard'
import RightPanel from '@/components/RightPanel'
import MotivationalToast from '@/components/MotivationalToast'

const MOTIVATIONAL_MESSAGES = [
  "💪 ¡Cada lead es una oportunidad! Sigue adelante.",
  "🚀 Un mensaje puede cambiar tu mes. ¡Envíalo!",
  "🔥 Los mejores comerciales no esperan, actúan.",
  "💎 Las ballenas no se pescan sin lanzar el anzuelo.",
  "⚡ Consistencia > Intensidad. Un lead más.",
  "🎯 El rechazo es parte del juego. ¡Siguiente!",
  "🌊 Racha: donde el capital trabaja 24/7.",
  "💡 El dato gancho es tu superpoder. Úsalo.",
  "🏆 Los grandes cierres empiezan con un buen mensaje.",
  "🤝 Cada conexión es una puerta. ¿La abres?",
]

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    tier: 'all',
    estado: 'all',
    me_gusta: false,
    no_me_gusta: false,
    leido: 'all',
  })
  const [toast, setToast] = useState<{ message: string; visible: boolean; exiting: boolean }>({
    message: '', visible: false, exiting: false
  })
  const [history, setHistory] = useState<{ index: number; lead: Lead }[]>([])
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const motivationalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load leads
  useEffect(() => {
    loadLeads()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return
      if (e.key === 'ArrowRight' || e.key === 'f') handleLike()
      if (e.key === 'ArrowLeft' || e.key === 'd') handleDislike()
      if (e.key === 'ArrowDown' || e.key === 'n') goNext()
      if (e.key === 'ArrowUp' || e.key === 'p') goPrev()
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') handleUndo()
      if (e.key === 'l') openLinkedIn()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentIndex, filteredLeads])

  // Motivational toasts
  useEffect(() => {
    const scheduleToast = () => {
      const delay = 90000 + Math.random() * 120000 // 1.5–3.5 min
      motivationalTimerRef.current = setTimeout(() => {
        const msg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
        showToast(msg)
        scheduleToast()
      }, delay)
    }
    scheduleToast()
    return () => { if (motivationalTimerRef.current) clearTimeout(motivationalTimerRef.current) }
  }, [])

  // Filter leads
  useEffect(() => {
    let result = [...leads]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(l => l.nombre.toLowerCase().includes(q))
    }
    if (filters.tier !== 'all') result = result.filter(l => l.tier === filters.tier)
    if (filters.estado !== 'all') result = result.filter(l => l.estado_linkedin === filters.estado)
    if (filters.me_gusta) result = result.filter(l => l.me_gusta)
    if (filters.no_me_gusta) result = result.filter(l => l.no_me_gusta)
    if (filters.leido === 'leido') result = result.filter(l => l.leido)
    if (filters.leido === 'no_leido') result = result.filter(l => !l.leido)
    setFilteredLeads(result)
    setCurrentIndex(0)
  }, [leads, search, filters])

  async function loadLeads() {
    setLoading(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error && data) setLeads(data as Lead[])
    setLoading(false)
  }

  function showToast(message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ message, visible: true, exiting: false })
    toastTimerRef.current = setTimeout(() => {
      setToast(t => ({ ...t, exiting: true }))
      setTimeout(() => setToast({ message: '', visible: false, exiting: false }), 350)
    }, 5000)
  }

  function closeToast() {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast(t => ({ ...t, exiting: true }))
    setTimeout(() => setToast({ message: '', visible: false, exiting: false }), 350)
  }

  const currentLead = filteredLeads[currentIndex] || null

  async function updateLead(id: string, updates: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error && data) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    }
  }

  async function markLeido(lead: Lead) {
    if (!lead.leido) await updateLead(lead.id, { leido: true })
  }

  function handleLike() {
    if (!currentLead) return
    setHistory(h => [...h, { index: currentIndex, lead: currentLead }])
    updateLead(currentLead.id, { me_gusta: true, no_me_gusta: false })
    showToast('👍 ¡Lead marcado como me gusta!')
    goNext()
  }

  function handleDislike() {
    if (!currentLead) return
    setHistory(h => [...h, { index: currentIndex, lead: currentLead }])
    updateLead(currentLead.id, { no_me_gusta: true, me_gusta: false })
    goNext()
  }

  function handleUndo() {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    updateLead(last.lead.id, { me_gusta: last.lead.me_gusta, no_me_gusta: last.lead.no_me_gusta })
    setCurrentIndex(last.index)
    showToast('↩ Acción deshecha')
  }

  function goNext() {
    setCurrentIndex(i => Math.min(i + 1, filteredLeads.length - 1))
  }

  function goPrev() {
    setCurrentIndex(i => Math.max(i - 1, 0))
  }

  function openLinkedIn() {
    if (currentLead?.linkedin_url) window.open(currentLead.linkedin_url, '_blank')
  }

  // Mark as read when lead changes
  useEffect(() => {
    if (currentLead) markLeido(currentLead)
  }, [currentIndex, filteredLeads])

  const stats = {
    total: leads.length,
    leidos: leads.filter(l => l.leido).length,
    me_gusta: leads.filter(l => l.me_gusta).length,
    contactados: leads.filter(l => l.estado_linkedin !== 'pendiente').length,
    respondidos: leads.filter(l => l.estado_linkedin === 'respondio').length,
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--bg-primary)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-panel)',
        flexShrink: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, color: 'white',
          }}>R</div>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.5px' }}>Racha CRM</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {filteredLeads.length > 0 ? `${currentIndex + 1} / ${filteredLeads.length}` : '0 leads'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            id="search-input"
            className="input-dark"
            style={{ width: 220 }}
            placeholder="🔍 Buscar por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span>👁 {stats.leidos}</span>
            <span>👍 {stats.me_gusta}</span>
            <span>📤 {stats.contactados}</span>
            <span>💬 {stats.respondidos}</span>
          </div>
        </div>
      </header>

      {/* Main 3-column layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel */}
        <div style={{
          width: 240, flexShrink: 0,
          borderRight: '1px solid var(--border)',
          background: 'var(--bg-panel)',
          overflowY: 'auto',
        }}>
          <LeftPanel
            leads={leads}
            filteredLeads={filteredLeads}
            currentIndex={currentIndex}
            filters={filters}
            stats={stats}
            onFiltersChange={setFilters}
            onNavigate={setCurrentIndex}
            onPrev={goPrev}
            onNext={goNext}
            onUndo={handleUndo}
            canUndo={history.length > 0}
          />
        </div>

        {/* Center — Lead Card */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px 16px',
          gap: 16,
        }}>
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', marginTop: 80, fontSize: 16 }}>
              Cargando leads...
            </div>
          ) : filteredLeads.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', marginTop: 80, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Sin leads</div>
              <div style={{ fontSize: 14 }}>Ajusta los filtros o importa más leads</div>
            </div>
          ) : currentLead ? (
            <LeadCard
              lead={currentLead}
              onUpdate={updateLead}
              onLike={handleLike}
              onDislike={handleDislike}
              onOpenLinkedIn={openLinkedIn}
            />
          ) : null}
        </div>

        {/* Right Panel */}
        <div style={{
          width: 280, flexShrink: 0,
          borderLeft: '1px solid var(--border)',
          background: 'var(--bg-panel)',
          overflowY: 'auto',
        }}>
          {currentLead && (
            <RightPanel
              lead={currentLead}
              onUpdate={updateLead}
              onOpenLinkedIn={openLinkedIn}
            />
          )}
        </div>
      </div>

      {/* Motivational Toast */}
      {toast.visible && (
        <MotivationalToast
          message={toast.message}
          exiting={toast.exiting}
          onClose={closeToast}
        />
      )}
    </div>
  )
}
