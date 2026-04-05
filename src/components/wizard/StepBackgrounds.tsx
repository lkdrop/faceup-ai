'use client'

import { useWizardStore, type Background } from '@/lib/wizard-store'
import NextButton from './NextButton'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const backgrounds: { value: Background; label: string; preview: string; desc: string }[] = [
  { value: 'studio-white', label: 'Estúdio branco', preview: '⬜', desc: 'Fundo limpo e profissional' },
  { value: 'studio-gray', label: 'Estúdio cinza', preview: '🔲', desc: 'Clássico para headshots' },
  { value: 'office', label: 'Escritório', preview: '🏢', desc: 'Ambiente corporativo' },
  { value: 'outdoor-park', label: 'Parque', preview: '🌳', desc: 'Ao ar livre, natureza' },
  { value: 'outdoor-city', label: 'Cidade', preview: '🏙️', desc: 'Ruas e prédios urbanos' },
  { value: 'gradient', label: 'Gradiente', preview: '🎨', desc: 'Fundo com cores suaves' },
]

export default function StepBackgrounds() {
  const { backgrounds: selected, toggleBackground, plan } = useWizardStore()
  const maxBgs = plan === 'premium' ? 99 : plan === 'professional' ? 6 : 3

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Escolha os cenários</h2>
      <p className="text-sm text-white/40 mb-8">
        Selecione os fundos que quer nas suas fotos. {selected.length > 0 && `(${selected.length} selecionados)`}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {backgrounds.map(bg => {
          const isSelected = selected.includes(bg.value)
          const isDisabled = !isSelected && selected.length >= maxBgs

          return (
            <button
              key={bg.value}
              onClick={() => !isDisabled && toggleBackground(bg.value)}
              disabled={isDisabled}
              className={cn(
                'relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all text-center',
                isSelected
                  ? 'border-[#FF7A1A] bg-[#FF7A1A]/10'
                  : isDisabled
                    ? 'border-white/5 bg-white/[0.01] opacity-40 cursor-not-allowed'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#0A0A0A]" />
                </div>
              )}
              <span className="text-3xl">{bg.preview}</span>
              <span className="text-sm font-semibold">{bg.label}</span>
              <span className="text-xs text-white/30">{bg.desc}</span>
            </button>
          )
        })}
      </div>

      <NextButton disabled={selected.length === 0} />
    </div>
  )
}
