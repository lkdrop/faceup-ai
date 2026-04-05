'use client'

import { useWizardStore, type BodyType } from '@/lib/wizard-store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import NextButton from './NextButton'

// Simple body silhouette icons
const BodyIcons: Record<BodyType, React.ReactNode> = {
  slim: (
    <svg width="32" height="48" viewBox="0 0 32 48" fill="none">
      <ellipse cx="16" cy="8" rx="5" ry="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 20 C8 16 10 14 16 14 C22 14 24 16 22 20 L21 34 L18 34 L16 28 L14 34 L11 34 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08"/>
      <path d="M11 34 L9 46 M21 34 L23 46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  athletic: (
    <svg width="36" height="48" viewBox="0 0 36 48" fill="none">
      <ellipse cx="18" cy="8" rx="5.5" ry="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 20 C7 15 9 14 18 14 C27 14 29 15 27 20 L25 34 L22 34 L18 27 L14 34 L11 34 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12"/>
      <path d="M11 34 L9 46 M25 34 L27 46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  average: (
    <svg width="34" height="48" viewBox="0 0 34 48" fill="none">
      <ellipse cx="17" cy="8" rx="5.5" ry="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 20 C7 15 10 14 17 14 C24 14 27 15 25 20 L24 34 L21 34 L17 28 L13 34 L10 34 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
      <path d="M10 34 L8 46 M24 34 L26 46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'plus-size': (
    <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
      <ellipse cx="20" cy="8" rx="6" ry="6.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 22 C5 16 9 14 20 14 C31 14 35 16 32 22 L30 34 L27 34 L20 28 L13 34 L10 34 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
      <path d="M10 34 L7 46 M30 34 L33 46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

const options: { value: BodyType; label: string; description: string }[] = [
  { value: 'slim',       label: 'Magro',     description: 'Silhueta mais fina' },
  { value: 'athletic',   label: 'Atlético',  description: 'Definido e musculoso' },
  { value: 'average',    label: 'Médio',     description: 'Proporção padrão' },
  { value: 'plus-size',  label: 'Plus size', description: 'Silhueta mais ampla' },
]

export default function StepBodyType() {
  const { bodyType, setBodyType } = useWizardStore()

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 6</p>
      <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Tipo de corpo</h2>
      <p className="text-sm sm:text-base text-white/40 mb-6 sm:mb-10 leading-relaxed">
        Para que as roupas caiam naturalmente nas fotos.
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {options.map(opt => {
          const selected = bodyType === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setBodyType(opt.value)}
              className={cn(
                'relative flex flex-col items-center gap-3 pt-8 pb-5 px-3 sm:gap-4 sm:pt-12 sm:pb-8 rounded-2xl border transition-all duration-150',
                selected
                  ? 'border-[#FF7A1A]/60 bg-[#FF7A1A]/[0.07] text-[#FF7A1A]'
                  : 'border-white/[0.07] bg-white/[0.03] text-white/25 hover:border-white/[0.14] hover:text-white/40'
              )}
            >
              {selected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#FF7A1A] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              )}
              {BodyIcons[opt.value]}
              <div className="text-center">
                <p className={cn('text-base font-bold', selected ? 'text-white' : 'text-white/60')}>{opt.label}</p>
                <p className="text-xs text-white/30 mt-1">{opt.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <NextButton disabled={!bodyType} />
    </div>
  )
}
