'use client'

import { Lead } from '@/lib/supabase'
import {
    Heart, HeartOff, Eye, Mail, MessageSquare,
    Send, CheckCircle, ExternalLink, Link,
    MessageCircle, Zap, Shield, Linkedin
} from 'lucide-react'

interface RightPanelProps {
    lead: Lead
    onUpdate: (id: string, updates: Partial<Lead>) => void
    onOpenLinkedIn: () => void
}

export default function RightPanel({
    lead,
    onUpdate,
    onOpenLinkedIn
}: RightPanelProps) {

    const toggleStatus = (key: keyof Lead) => {
        onUpdate(lead.id, { [key]: !lead[key] })
    }

    const setStatus = (val: Lead['estado_linkedin']) => {
        onUpdate(lead.id, { estado_linkedin: val })
    }

    return (
        <div className="flex flex-col h-full text-sm">
            {/* Lead Summary Header */}
            <div className="p-4 border-b border-[#2a2a3a] bg-[#0a0a0f]">
                <h3 className="text-[#9090a8] uppercase text-[10px] font-bold tracking-wider mb-2">Estado del Lead</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                        <button
                            onClick={() => toggleStatus('me_gusta')}
                            className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${lead.me_gusta ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-transparent border-[#2a2a3a] text-[#505068]'
                                }`}
                        >
                            <Heart size={14} fill={lead.me_gusta ? "currentColor" : "none"} /> <span className="text-[10px] font-bold">FAV</span>
                        </button>
                        <button
                            onClick={() => toggleStatus('no_me_gusta')}
                            className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${lead.no_me_gusta ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-transparent border-[#2a2a3a] text-[#505068]'
                                }`}
                        >
                            <HeartOff size={14} /> <span className="text-[10px] font-bold">RECH</span>
                        </button>
                    </div>

                    <button
                        onClick={() => toggleStatus('leido')}
                        className={`w-full py-1.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${lead.leido ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-transparent border-[#2a2a3a] text-[#505068]'
                            }`}
                    >
                        <Eye size={14} /> <span className="text-[10px] font-bold uppercase tracking-tight">{lead.leido ? 'Visto' : 'Marcar visto'}</span>
                    </button>
                </div>
            </div>

            {/* Action Badges as requested */}
            <div className="p-4 border-b border-[#2a2a3a]">
                <h3 className="text-[#9090a8] uppercase text-[10px] font-bold tracking-wider mb-3">Acciones LinkedIn</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { id: 'solicitud', label: 'Solicitud', icon: Link, color: 'text-blue-400' },
                        { id: 'mensaje_directo', label: 'InMail', icon: Send, color: 'text-purple-400' },
                        { id: 'contactado', label: 'Contactado', icon: MessageSquare, color: 'text-green-400' },
                        { id: 'respondio', label: 'Respondió', icon: MessageCircle, color: 'text-yellow-400' },
                    ].map(status => (
                        <button
                            key={status.id}
                            onClick={() => setStatus(status.id as any)}
                            className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${lead.estado_linkedin === status.id
                                ? 'bg-[#1b1b26] border-[#6c63ff] ring-1 ring-[#6c63ff]/30'
                                : 'bg-transparent border-[#2a2a3a] text-[#9090a8] hover:border-[#3a3a4a]'
                                }`}
                        >
                            <status.icon size={16} className={lead.estado_linkedin === status.id ? status.color : 'text-[#505068]'} />
                            <span className="text-[9px] font-bold uppercase">{status.label}</span>
                        </button>
                    ))}
                </div>

                {/* Custom text status as requested */}
                <div className="mt-4">
                    <label className="text-[10px] font-bold text-[#505068] uppercase mb-1 block">Estado personalizable</label>
                    <input
                        type="text"
                        placeholder="Ej: Pendiente de Zoom..."
                        className="input-dark py-1.5 text-xs text-center"
                        value={lead.estado_custom || ''}
                        onChange={(e) => onUpdate(lead.id, { estado_custom: e.target.value })}
                    />
                </div>
            </div>

            {/* Racha Quick Brief */}
            <div className="p-4 flex-1">
                <h3 className="text-[#9090a8] uppercase text-[10px] font-bold tracking-wider mb-3 flex items-center gap-2">
                    <Zap size={12} className="text-yellow-500" /> Referencia Racha
                </h3>

                <div className="space-y-3">
                    <div className="p-3 bg-black/30 border border-[#2a2a3a] rounded-xl">
                        <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                            <Shield size={12} className="text-blue-400" /> Blue-Chip Strategy
                        </div>
                        <p className="text-[10px] text-[#9090a8] leading-tight">
                            75% BTC/ETH, 20% Stables. Auditado 100% on-chain. Transparencia total.
                        </p>
                    </div>

                    <div className="p-3 bg-black/30 border border-[#2a2a3a] rounded-xl whitespace-pre-wrap">
                        <div className="flex items-center gap-2 text-xs font-bold text-white mb-1">
                            <Zap size={12} className="text-yellow-400" /> Yield Target
                        </div>
                        <div className="text-lg font-bold text-yellow-500">30-40% <span className="text-[10px]">APR NETO</span></div>
                    </div>
                </div>

                <button
                    onClick={onOpenLinkedIn}
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-[#0077b5] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg"
                >
                    <Linkedin size={14} /> Perfil LinkedIn
                </button>
            </div>

            {/* Undo shortcut info */}
            <div className="p-4 bg-[#0a0a0f] border-t border-[#2a2a3a] text-center text-[10px] text-[#404058]">
                Atajo: <kbd className="bg-[#1a1a24] px-1.5 py-0.5 rounded border border-[#2a2a3a] text-[#9090a8]">L</kbd> abre LinkedIn
            </div>
        </div>
    )
}
