'use client'

import { useWizardStore, type Outfit } from '@/lib/wizard-store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import NextButton from './NextButton'

// Visual fabric swatches — color blocks representing outfit tone
const outfitConfig: {
  value: Outfit
  label: string
  desc: string
  swatch: string
  gender?: 'female'
}[] = [
  { value: 'suit-tie',            label: 'Terno com gravata',  desc: 'Formal, executivo',        swatch: '#1E2D40' },
  { value: 'suit-no-tie',         label: 'Terno sem gravata',  desc: 'Moderno e elegante',       swatch: '#2C3E50' },
  { value: 'blazer-casual',       label: 'Blazer casual',      desc: 'Smart casual polido',      swatch: '#3D4E5C' },
  { value: 'smart-casual',        label: 'Smart casual',       desc: 'Camisa social + jeans',    swatch: '#4A6080' },
  { value: 'business-casual',     label: 'Social leve',        desc: 'Camisa sem gravata',       swatch: '#5B7FA6' },
  { value: 'polo',                label: 'Polo',               desc: 'Casual e elegante',        swatch: '#4B6B55' },
  { value: 'dress-formal',        label: 'Vestido formal',     desc: 'Elegante e sofisticado',   swatch: '#6B3F6B',  gender: 'female' },
  { value: 'dress-casual',        label: 'Vestido casual',     desc: 'Leve e moderno',           swatch: '#7A5C8A',  gender: 'female' },
  { value: 'blouse-professional', label: 'Blusa social',       desc: 'Profissional e clean',     swatch: '#C4A882',  gender: 'female' },
]

export default function StepOutfits() {
  const { outfits: selected, toggleOutfit, gender, plan } = useWizardStore()
  const maxOutfits = plan === 'premium' ? 99 : plan === 'professional' ? 6 : 3

  const filteredOptions = outfitConfig.filter(o => {
    if (!o.gender) return true
    return gender === 'female' || gender === 'non-binary'
  })

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 10</p>
      <h2 className="text-2xl font-bold mb-1.5 tracking-tight">Estilos de roupa</h2>
      <p className="text-sm text-white/40 mb-8 leading-relaxed">
        Escolha os looks que quer nas fotos.
        {selected.length > 0 && (
          <span className="ml-1.5 px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50 text-xs font-medium">
            {selected.length} selecionados
          </span>
        )}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredOptions.map(outfit => {
          const isSelected = selected.includes(outfit.value)
          const isDisabled = !isSelected && selected.length >= maxOutfits

          return (
            <button
              key={outfit.value}
              onClick={() => !isDisabled && toggleOutfit(outfit.value)}
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
              {/* Fabric color swatch */}
              <div
                className="h-14 w-full"
                style={{ backgroundColor: outfit.swatch }}
              >
                {/* Subtle texture overlay */}
                <div className="w-full h-full"
                  style={{
                    background: `linear-gradient(135deg, ${outfit.swatch}dd, ${outfit.swatch}88)`,
                    mixBlendMode: 'overlay',
                  }}
                />
              </div>

              {/* Info */}
              <div className={cn('px-3 py-3', isSelected ? 'bg-[#FF7A1A]/[0.08]' : 'bg-white/[0.03]')}>
                <p className={cn('text-sm font-semibold leading-tight', isSelected ? 'text-white' : 'text-white/60')}>
                  {outfit.label}
                </p>
                <p className="text-[11px] text-white/25 mt-0.5">{outfit.desc}</p>
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

      {selected.length >= maxOutfits && maxOutfits < 99 && (
        <p className="mt-4 text-xs text-amber-400/70">
          Limite do plano atingido. Faça upgrade para selecionar mais estilos.
        </p>
      )}

      <NextButton disabled={selected.length === 0} />
    </div>
  )
}
