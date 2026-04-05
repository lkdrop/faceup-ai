'use client'

import { useWizardStore, type HairLength } from '@/lib/wizard-store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import NextButton from './NextButton'

// Hair length SVG icons — simple line drawings
const HairIcons: Record<HairLength, React.ReactNode> = {
  bald: (
    <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="20" cy="18" r="6" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  short: (
    <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="22" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M11 22 C11 14 29 14 29 22" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12"/>
    </svg>
  ),
  medium: (
    <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="18" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 18 C10 26 12 34 14 34 C12 30 12 26 12 18Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
      <path d="M28 18 C30 26 28 34 26 34 C28 30 28 26 28 18Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  long: (
    <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="16" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 16 C9 28 10 38 13 38 C11 32 11 26 12 16Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
      <path d="M28 16 C31 28 30 38 27 38 C29 32 29 26 28 16Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
}

const options: { value: HairLength; label: string; description: string }[] = [
  { value: 'bald',   label: 'Careca',   description: 'Sem cabelo ou raspado' },
  { value: 'short',  label: 'Curto',    description: 'Até a orelha' },
  { value: 'medium', label: 'Médio',    description: 'Até o ombro' },
  { value: 'long',   label: 'Longo',    description: 'Abaixo do ombro' },
]

export default function StepHairLength() {
  const { hairLength, setHairLength } = useWizardStore()

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 3</p>
      <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Comprimento do cabelo</h2>
      <p className="text-sm sm:text-base text-white/40 mb-6 sm:mb-10 leading-relaxed">
        Selecione o mais próximo do seu cabelo atual.
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {options.map(opt => {
          const selected = hairLength === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setHairLength(opt.value)}
              className={cn(
                'relative flex flex-col items-center gap-3 pt-7 pb-5 px-3 sm:gap-4 sm:pt-10 sm:pb-7 sm:px-4 rounded-2xl border transition-all duration-150',
                selected
                  ? 'border-[#FF7A1A]/60 bg-[#FF7A1A]/[0.07] text-[#FF7A1A]'
                  : 'border-white/[0.07] bg-white/[0.03] text-white/30 hover:border-white/[0.14] hover:text-white/50'
              )}
            >
              {selected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#FF7A1A] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              )}
              {HairIcons[opt.value]}
              <div className="text-center">
                <p className={cn('text-base font-bold', selected ? 'text-white' : 'text-white/60')}>{opt.label}</p>
                <p className="text-xs text-white/30 mt-1">{opt.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <NextButton disabled={!hairLength} />
    </div>
  )
}
