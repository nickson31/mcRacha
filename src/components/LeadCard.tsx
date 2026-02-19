'use client'

import { useState, useEffect, useRef } from 'react'
import { Lead } from '@/lib/supabase'
import {
    Linkedin, ExternalLink, MapPin, Briefcase,
    ThumbsUp, ThumbsDown, User, Info, MessageSquare,
    History, Target, ShieldCheck, Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LeadCardProps {
    lead: Lead
    onUpdate: (id: string, updates: Partial<Lead>) => void
    onLike: () => void
    onDislike: () => void
    onOpenLinkedIn: () => void
}

export default function LeadCard({
    lead,
    onUpdate,
    onLike,
    onDislike,
    onOpenLinkedIn
}: LeadCardProps) {
    const [localObs, setLocalObs] = useState(lead.observaciones || '')
    const [activeMessage, setActiveMessage] = useState(1)
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Sync local observations when lead changes
    useEffect(() => {
        setLocalObs(lead.observaciones || '')
        setActiveMessage(1)
    }, [lead.id])

    // Autosave observations
    const handleObsChange = (val: string) => {
        setLocalObs(val)
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = setTimeout(() => {
            onUpdate(lead.id, { observaciones: val })
        }, 1000)
    }

    const renderColorCodedMessage = (text: string | null) => {
        if (!text) return <span className="text-[#9090a8] italic">No redactado</span>

        // Logic to highlight specific keywords or patterns if needed
        // For now, let's look for bracketed tags or common terms as requested
        // "🔵 Azul = Dato personalizado del gancho, 🟢 Verde = Propuesta de valor RACHA, 🟡 Amarillo = CTA"

        const parts = text.split(/(\[.*?\])/g)
        return parts.map((part, i) => {
            if (part.startsWith('[') && part.endsWith(']')) {
                const content = part.slice(1, -1)
                if (content.toLowerCase().includes('blue') || content.toLowerCase().includes('azul') || content.toLowerCase().includes('gancho')) {
                    return <span key={i} className="highlight-blue">{content}</span>
                }
                if (content.toLowerCase().includes('green') || content.toLowerCase().includes('verde') || content.toLowerCase().includes('racha') || content.toLowerCase().includes('valor')) {
                    return <span key={i} className="highlight-green">{content}</span>
                }
                if (content.toLowerCase().includes('yellow') || content.toLowerCase().includes('amarillo') || content.toLowerCase().includes('cta') || content.toLowerCase().includes('accion')) {
                    return <span key={i} className="highlight-yellow">{content}</span>
                }
                if (content.toLowerCase().includes('red') || content.toLowerCase().includes('rojo') || content.toLowerCase().includes('urgencia')) {
                    return <span key={i} className="highlight-red">{content}</span>
                }
                return <span key={i} className="bg-[#2a2a3a] px-1 rounded">{content}</span>
            }
            return part
        })
    }

    return (
        <motion.div
            key={lead.id}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="card w-full max-w-[600px] flex flex-col shadow-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="p-6 border-b border-[#2a2a3a] bg-gradient-to-br from-[#1b1b26] to-[#16161e]">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#2a2a3a] flex items-center justify-center border-2 border-[#6c63ff] overflow-hidden flex-shrink-0">
                        {lead.foto_url ? (
                            <img src={lead.foto_url} alt={lead.nombre} className="w-full h-full object-cover" />
                        ) : (
                            <User size={32} className="text-[#6c63ff]" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <h1 className="text-xl font-bold tracking-tight">{lead.nombre}</h1>
                            <div className="flex gap-2">
                                <span className={`status-badge tier-${lead.tier.toLowerCase()}`}>{lead.tier}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-[#9090a8] mb-3">
                            <div className="flex items-center gap-1">
                                <Briefcase size={14} />
                                <span>{lead.etiqueta_perfil || 'Lead Racha'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Linkedin size={14} />
                                <button onClick={onOpenLinkedIn} className="hover:text-[#6c63ff] flex items-center gap-1 transition-colors">
                                    LinkedIn <ExternalLink size={12} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={onDislike} className="btn-ghost px-3 py-1 text-xs hover:border-red-500/50 hover:text-red-400">
                                <ThumbsDown size={14} className="inline mr-1" /> Descartar
                            </button>
                            <button onClick={onLike} className="btn-primary px-3 py-1 text-xs">
                                <ThumbsUp size={14} className="inline mr-1" /> Me gusta
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-0 scroll-smooth custom-scrollbar" style={{ maxHeight: 'calc(100vh - 280px)' }}>

                {/* SECTION 1: Resumen Ejecutivo */}
                <div className="p-6 section-blue border-b border-[#2a2a3a]">
                    <div className="flex items-center gap-2 mb-3 text-blue-400 font-bold text-xs uppercase tracking-widest">
                        <Info size={14} /> Resumen Ejecutivo
                    </div>
                    <p className="text-sm leading-relaxed text-[#f0f0f5]">
                        {lead.trayectoria_analizada || 'Cargando análisis detallado de la trayectoria profesional...'}
                    </p>
                </div>

                {/* SECTION 2: Trayectoria Profesional */}
                <div className="p-6 section-green border-b border-[#2a2a3a]">
                    <div className="flex items-center gap-2 mb-3 text-green-400 font-bold text-xs uppercase tracking-widest">
                        <Briefcase size={14} /> Trayectoria y Perfil
                    </div>
                    <p className="text-sm leading-relaxed text-[#f0f0f5]">
                        <span className="text-green-300 font-medium">Perfil:</span> {lead.etiqueta_perfil}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase font-bold text-green-200 opacity-70">
                        <span className="bg-green-900/40 px-2 py-0.5 rounded border border-green-800/40">AUDITABLE ON-CHAIN</span>
                        <span className="bg-green-900/40 px-2 py-0.5 rounded border border-green-800/40">YIELD STRATEGY</span>
                    </div>
                </div>

                {/* SECTION 3: El Gancho */}
                <div className="p-6 section-yellow border-b border-[#2a2a3a]">
                    <div className="flex items-center gap-2 mb-3 text-yellow-500 font-bold text-xs uppercase tracking-widest">
                        <Target size={14} /> El Dato Gancho
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-xl">
                        <p className="text-sm italic text-yellow-50">{lead.dato_gancho || 'Analizando perfil para extraer gancho personalizado...'}</p>
                    </div>
                </div>

                {/* SECTION 4: Mensajería IA (5 Mensajes redactados) */}
                <div className="p-0 border-b border-[#2a2a3a]">
                    <div className="p-6 pb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest">
                            <MessageSquare size={14} /> Mensajería IA Enriquecida
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex px-6 gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <button
                                key={i}
                                onClick={() => setActiveMessage(i)}
                                className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${activeMessage === i
                                        ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                        : 'bg-[#1a1a24] border-[#2a2a3a] text-[#606078] hover:border-[#3a3a4a]'
                                    }`}
                            >
                                M{i}
                            </button>
                        ))}
                    </div>

                    <div className="px-6 pb-6">
                        <div className="bg-[#12121a] border border-[#2a2a3a] rounded-xl p-5 relative group">
                            <div className="text-xs text-[#606078] absolute top-2 right-3 font-mono">#{activeMessage}</div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {renderColorCodedMessage((lead as any)[`mensaje_${activeMessage}`] || lead.mensaje_1)}
                            </p>
                            <button
                                className="mt-4 text-[11px] text-[#6c63ff] hover:text-white flex items-center gap-1 font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                    const txt = (lead as any)[`mensaje_${activeMessage}`] || lead.mensaje_1 || ''
                                    navigator.clipboard.writeText(txt)
                                }}
                            >
                                📋 COPIAR MENSAJE
                            </button>
                        </div>
                    </div>
                </div>

                {/* SECTION 5: Observaciones (Caja final) */}
                <div className="p-6 section-gray">
                    <div className="flex items-center gap-2 mb-3 text-[#9090a8] font-bold text-xs uppercase tracking-widest">
                        <History size={14} /> Notas del Comercial
                    </div>
                    <textarea
                        placeholder="Escribe aquí tus observaciones sobre este lead..."
                        className="input-dark w-full min-h-[150px] p-4 bg-black/40 text-sm border-dashed border-[#3a3a4a]"
                        value={localObs}
                        onChange={(e) => handleObsChange(e.target.value)}
                    />
                    <div className="mt-2 flex items-center justify-between text-[10px] text-[#505068]">
                        <span className="flex items-center gap-1"><ShieldCheck size={10} /> Guardado automático en Supabase</span>
                        <span>{localObs.length} caracteres</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
