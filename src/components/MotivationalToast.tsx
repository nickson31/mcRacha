'use client'

import { X, Bell, Zap } from 'lucide-react'

interface MotivationalToastProps {
    message: string
    exiting: boolean
    onClose: () => void
}

export default function MotivationalToast({
    message,
    exiting,
    onClose
}: MotivationalToastProps) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 
      bg-[#1b1b26] border border-[#6c63ff]/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] 
      min-w-[320px] max-w-[400px] border-l-4 border-l-[#6c63ff]
      ${exiting ? 'toast-out' : 'toast-in'}`}
        >
            <div className="w-10 h-10 rounded-full bg-[#6c63ff]/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                <Zap size={20} className="text-[#6c63ff]" fill="currentColor" />
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                    <Bell size={12} className="text-[#6c63ff]" />
                    <span className="text-[10px] font-bold text-[#6c63ff] uppercase tracking-widest">Racha Motivation</span>
                </div>
                <p className="text-sm font-medium text-white leading-snug">
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors text-[#505068]"
            >
                <X size={16} />
            </button>
        </div>
    )
}
