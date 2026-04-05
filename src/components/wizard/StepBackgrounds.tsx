'use client'

import { useWizardStore, type Background } from '@/lib/wizard-store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import NextButton from './NextButton'

// Visual CSS swatches — no emoji
const bgSwatches: Record<Background, { swatch: string; label: string; desc: string }> = {
  'studio-white': {
    swatch: 'bg-[#F8F8F8]',
    label: 'Branco de estúdio',
    desc: 'Fundo limpo e clássico',
  },
  'studio-gray': {
    swatch: 'bg-gradient-to-br from-[#6B6B6B] to-[#8A8A8A]',
    label: 'Cinza de estúdio',
    desc: 'Padrão para headshots',
  },
  'office': {
    swatch: 'bg-gradient-to-br from-[#B8956A] to-[#8B6914]',
    label: 'Escritório',
    desc: 'Ambiente corporativo',
  },
  'outdoor-park': {
    swatch: 'bg-gradient-to-br from-[#4A7C59] to-[#2D5A3D]',
    label: 'Parque',
    desc: 'Ao ar livre, natureza',
  },
  'outdoor-city': {
    swatch: 'bg-gradient-to-br from-[#2C4E7A] to-[#1A3A5C]',
    label: 'Cidade',
    desc: 'Ruas e prédios urbanos',
  },
  'gradient': {
    swatch: 'bg-gradient-to-br from-[#667eea] to-[#764ba2]',
    label: 'Gradiente',
    desc: 'Cores suaves e modernas',
  },
}

const backgroundList: Background[] = [
  'studio-white', 'studio-gray', 'office', 'outdoor-park', 'outdoor-city', 'gradient',
]

export default function StepBackgrounds() {
  const { backgrounds: selected, toggleBackground, plan } = useWizardStore()
  const maxBgs = plan === 'premium' ? 99 : plan === 'professional' ? 6 : 3

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 9</p>
      <h2 className="text-2xl font-bold mb-1.5 tracking-tight">Escolha os cenários</h2>
      <p className="text-sm text-white/40 mb-8 leading-relaxed">
        Selecione os fundos que quer nas suas fotos.
        {selected.length > 0 && (
          <span className="ml-1.5 px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50 text-xs font-medium">
            {selected.length} selecionados
          </span>
        )}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {backgroundList.map(bgKey => {
          const isSelected = selected.includes(bgKey)
          const isDisabled = !isSelected && selected.length >= maxBgs
          const config = bgSwatches[bgKey]

          return (
            <button
              key={bgKey}
              onClick={() => !isDisabled && toggleBackground(bgKey)}
              disabled={isDisabled}
              className={cn(
                'relative flex flex-col rounded-xl border overflow-hidden transition-all duration-150 text-left',
                isSelected
                  ? 'border-[#FF7A1A]/60 shadow-[0_0_0_1px_rgba(255,122,26,0.3)]'
                  : isDisabled
                    ? 'border-white/[0.04] opacity-30 cursor-not-allowed'
                    : 'border-white/[0.07] hover:border-white/[0.16]'
              )}
            >
              {/* Swatch preview */}
              <div className={cn('h-16 w-full', config.swatch)} />

              {/* Label */}
              <div className={cn(
                'px-3 py-3',
                isSelected ? 'bg-[#FF7A1A]/[0.08]' : 'bg-white/[0.03]'
              )}>
                <p className={cn('text-sm font-semibold leading-tight', isSelected ? 'text-white' : 'text-white/60')}>
                  {config.label}
                </p>
                <p className="text-[11px] text-white/25 mt-0.5">{config.desc}</p>
              </div>

              {/* Selected badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center shadow-lg">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selected.length >= maxBgs && maxBgs < 99 && (
        <p className="mt-4 text-xs text-amber-400/70 flex items-center gap-1.5">
          Limite do plano atingido. Faça upgrade para selecionar mais cenários.
        </p>
      )}

      <NextButton disabled={selected.length === 0} />
    </div>
  )
}
