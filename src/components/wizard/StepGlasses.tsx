'use client'

import { useWizardStore, type Glasses } from '@/lib/wizard-store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import NextButton from './NextButton'

const GlassesNoneIcon = () => (
  <svg width="56" height="32" viewBox="0 0 40 24" fill="none">
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
    <circle cx="28" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
    <path d="M18 12h4" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const GlassesRegularIcon = () => (
  <svg width="60" height="28" viewBox="0 0 44 20" fill="none">
    <rect x="2" y="3" width="16" height="14" rx="6" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="26" y="3" width="16" height="14" rx="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 10h8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 8 C0 5 0 3 2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M42 8 C44 5 44 3 42 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const GlassesSunIcon = () => (
  <svg width="60" height="28" viewBox="0 0 44 20" fill="none">
    <rect x="2" y="3" width="16" height="14" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="26" y="3" width="16" height="14" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 10h8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 8 C0 5 0 3 2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M42 8 C44 5 44 3 42 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const options: { value: Glasses; icon: React.ReactNode; label: string; description: string }[] = [
  { value: 'none',        icon: <GlassesNoneIcon />,    label: 'Sem óculos',     description: 'Aparência sem óculos' },
  { value: 'regular',     icon: <GlassesRegularIcon />, label: 'Óculos de grau', description: 'Armação clássica' },
  { value: 'sunglasses',  icon: <GlassesSunIcon />,     label: 'Óculos de sol',  description: 'Lentes escuras' },
]

export default function StepGlasses() {
  const { glasses, setGlasses } = useWizardStore()

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 8</p>
      <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Usa óculos?</h2>
      <p className="text-sm sm:text-base text-white/40 mb-6 sm:mb-10 leading-relaxed">
        Selecione se quer aparecer com óculos nas fotos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        {options.map(opt => {
          const selected = glasses === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setGlasses(opt.value)}
              className={cn(
                'relative flex flex-col items-center gap-3 py-6 px-3 sm:gap-4 sm:py-12 sm:px-4 rounded-2xl border transition-all duration-150',
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
              {opt.icon}
              <div className="text-center">
                <p className={cn('text-base font-bold', selected ? 'text-white' : 'text-white/60')}>{opt.label}</p>
                <p className="text-xs text-white/30 mt-1">{opt.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <NextButton disabled={!glasses} />
    </div>
  )
}
