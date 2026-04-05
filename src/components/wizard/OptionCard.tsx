'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface OptionCardProps {
  selected: boolean
  onClick: () => void
  label: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export default function OptionCard({ selected, onClick, label, description, icon, className }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-start gap-3 p-6 rounded-2xl border transition-all duration-150 text-left w-full',
        selected
          ? 'border-[#FF7A1A]/60 bg-[#FF7A1A]/[0.07] shadow-[0_0_0_1px_rgba(255,122,26,0.3)]'
          : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]',
        className
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      )}
      {icon && (
        <div className={cn('text-white/40 transition-colors mb-1', selected && 'text-[#FF7A1A]')}>
          {icon}
        </div>
      )}
      <span className={cn('text-base font-bold leading-tight transition-colors', selected ? 'text-white' : 'text-white/70')}>
        {label}
      </span>
      {description && (
        <span className="text-sm text-white/35 leading-snug">{description}</span>
      )}
    </button>
  )
}
