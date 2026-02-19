'use client'

import { Lead } from '@/lib/supabase'
import {
    Users, Star, MessageSquare, CheckCircle, Clock,
    ChevronLeft, ChevronRight, RotateCcw, Filter, Search
} from 'lucide-react'

interface LeftPanelProps {
    leads: Lead[]
    filteredLeads: Lead[]
    currentIndex: number
    filters: any
    stats: any
    onFiltersChange: (filters: any) => void
    onNavigate: (index: number) => void
    onPrev: () => void
    onNext: () => void
    onUndo: () => void
    canUndo: boolean
}

export default function LeftPanel({
    leads,
    filteredLeads,
    currentIndex,
    filters,
    stats,
    onFiltersChange,
    onNavigate,
    onPrev,
    onNext,
    onUndo,
    canUndo
}: LeftPanelProps) {

    const updateFilter = (key: string, value: any) => {
        onFiltersChange({ ...filters, [key]: value })
    }

    return (
        <div className="flex flex-col h-full text-sm">
            {/* Search & Stats Summary */}
            <div className="p-4 border-b border-[#2a2a3a]">
                <h3 className="text-[#9090a8] uppercase text-[10px] font-bold tracking-wider mb-3">Estadísticas</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-[#1a1a24] p-2 rounded-lg border border-[#2a2a3a]">
                        <div className="text-[10px] text-[#9090a8]">Total</div>
                        <div className="text-lg font-bold">{stats.total}</div>
                    </div>
                    <div className="bg-[#1a1a24] p-2 rounded-lg border border-[#2a2a3a]">
                        <div className="text-[10px] text-[#9090a8]">Leídos</div>
                        <div className="text-lg font-bold">{stats.leidos}</div>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9090a8]" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="input-dark pl-9 py-2"
                        value={filters.search || ''}
                        onChange={(e) => updateFilter('search', e.target.value)}
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="p-4 border-b border-[#2a2a3a]">
                <h3 className="text-[#9090a8] uppercase text-[10px] font-bold tracking-wider mb-3">Navegación</h3>
                <div className="flex gap-2">
                    <button onClick={onPrev} disabled={currentIndex === 0} className="btn-ghost flex-1 py-2 px-1">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={onUndo} disabled={!canUndo} className="btn-ghost flex-1 py-2 px-1">
                        <RotateCcw size={16} />
                    </button>
                    <button onClick={onNext} disabled={currentIndex === filteredLeads.length - 1} className="btn-ghost flex-1 py-2 px-1">
                        <ChevronRight size={16} />
                    </button>
                </div>
                <div className="mt-2 text-center text-[11px] text-[#9090a8]">
                    Usa ← ↑ ↓ →
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 flex-1 overflow-y-auto">
                <h3 className="text-[#9090a8] uppercase text-[10px] font-bold tracking-wider mb-3 flex items-center gap-2">
                    <Filter size={12} /> Filtros
                </h3>

                <div className="space-y-4">
                    {/* Tier */}
                    <div>
                        <label className="text-[11px] text-[#9090a8] block mb-2">Por Tier</label>
                        <div className="flex flex-wrap gap-1">
                            {['all', 'BALLENA', 'PARTNER', 'CREADOR', 'RESTO'].map(tier => (
                                <button
                                    key={tier}
                                    onClick={() => updateFilter('tier', tier)}
                                    className={`px-2 py-1 rounded text-[10px] border transition-all ${filters.tier === tier
                                            ? 'bg-[#6c63ff] border-[#6c63ff] text-white font-bold'
                                            : 'bg-transparent border-[#2a2a3a] text-[#9090a8] hover:border-[#3a3a4a]'
                                        }`}
                                >
                                    {tier === 'all' ? 'TODOS' : tier}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="text-[11px] text-[#9090a8] block mb-2">Estado LinkedIn</label>
                        <select
                            className="input-dark text-xs py-1.5"
                            value={filters.estado}
                            onChange={(e) => updateFilter('estado', e.target.value)}
                        >
                            <option value="all">Cualquier estado</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="solicitud">Solicitud enviada</option>
                            <option value="mensaje_directo">Mensaje directo</option>
                            <option value="contactado">Contactado</option>
                            <option value="respondio">Respondió</option>
                        </select>
                    </div>

                    {/* Interés */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.me_gusta}
                                onChange={(e) => updateFilter('me_gusta', e.target.checked)}
                                className="accent-[#6c63ff]"
                            />
                            <span className={`text-[11px] ${filters.me_gusta ? 'text-white' : 'text-[#9090a8]'} group-hover:text-white`}>
                                ⭐ Me gusta
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.no_me_gusta}
                                onChange={(e) => updateFilter('no_me_gusta', e.target.checked)}
                                className="accent-[#6c63ff]"
                            />
                            <span className={`text-[11px] ${filters.no_me_gusta ? 'text-white' : 'text-[#9090a8]'} group-hover:text-white`}>
                                ❌ No me gusta
                            </span>
                        </label>
                    </div>

                    {/* Leído */}
                    <div>
                        <label className="text-[11px] text-[#9090a8] block mb-2">Lectura</label>
                        <div className="flex gap-1">
                            <button
                                onClick={() => updateFilter('leido', 'all')}
                                className={`flex-1 py-1 px-1 rounded text-[10px] border ${filters.leido === 'all' ? 'bg-[#2a2a3a] border-[#6c63ff]' : 'border-[#2a2a3a] text-[#9090a8]'
                                    }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => updateFilter('leido', 'no_leido')}
                                className={`flex-1 py-1 px-1 rounded text-[10px] border ${filters.leido === 'no_leido' ? 'bg-[#2a2a3a] border-[#6c63ff]' : 'border-[#2a2a3a] text-[#9090a8]'
                                    }`}
                            >
                                Sin leer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="p-4 bg-[#0a0a0f] border-t border-[#2a2a3a]">
                <div className="flex items-center gap-2 text-[#9090a8] text-[10px]">
                    <Clock size={12} />
                    <span>Última actualización: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </div>
    )
}
