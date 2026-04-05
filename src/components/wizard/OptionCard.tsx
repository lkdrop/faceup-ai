'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface OptionCardProps {
  selected: boolean
  onClick: () => void
  label: string
  emoji?: string
  description?: string
  className?: string
}

export default function OptionCard({ selected, onClick, label, emoji, description, className }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 text-center',
        selected
          ? 'border-[#FF7A1A] bg-[#FF7A1A]/10 shadow-lg shadow-orange-500/10'
          : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]',
        className
      )}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center">
          <Check className="w-3 h-3 text-[#0A0A0A]" />
        </div>
      )}
      {emoji && <span className="text-3xl">{emoji}</span>}
      <span className="text-sm font-semibold">{label}</span>
      {description && <span className="text-xs text-white/40">{description}</span>}
    </button>
  )
}
