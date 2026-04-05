'use client'

import { useWizardStore, type Outfit } from '@/lib/wizard-store'
import NextButton from './NextButton'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const outfitOptions: { value: Outfit; label: string; emoji: string; desc: string; gender?: string }[] = [
  { value: 'suit-tie', label: 'Terno c/ gravata', emoji: '👔', desc: 'Formal e executivo' },
  { value: 'suit-no-tie', label: 'Terno s/ gravata', emoji: '🤵', desc: 'Moderno e elegante' },
  { value: 'blazer-casual', label: 'Blazer casual', emoji: '🧥', desc: 'Smart casual' },
  { value: 'smart-casual', label: 'Smart casual', emoji: '👕', desc: 'Camisa + jeans' },
  { value: 'business-casual', label: 'Social leve', emoji: '👔', desc: 'Camisa social' },
  { value: 'polo', label: 'Polo', emoji: '🏌️', desc: 'Casual elegante' },
  { value: 'dress-formal', label: 'Vestido formal', emoji: '👗', desc: 'Elegante e sofisticado', gender: 'female' },
  { value: 'dress-casual', label: 'Vestido casual', emoji: '👘', desc: 'Leve e moderno', gender: 'female' },
  { value: 'blouse-professional', label: 'Blusa social', emoji: '👚', desc: 'Profissional e clean', gender: 'female' },
]

export default function StepOutfits() {
  const { outfits: selected, toggleOutfit, gender, plan } = useWizardStore()
  const maxOutfits = plan === 'premium' ? 99 : plan === 'professional' ? 6 : 3

  const filteredOptions = outfitOptions.filter(o => {
    if (!o.gender) return true
    if (gender === 'female' || gender === 'non-binary') return true
    return !o.gender
  })

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Estilos de roupa</h2>
      <p className="text-sm text-white/40 mb-8">
        Escolha os looks que quer nas fotos. {selected.length > 0 && `(${selected.length} selecionados)`}
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
                'relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center',
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
              <span className="text-2xl">{outfit.emoji}</span>
              <span className="text-sm font-semibold">{outfit.label}</span>
              <span className="text-[11px] text-white/30">{outfit.desc}</span>
            </button>
          )
        })}
      </div>

      <NextButton disabled={selected.length === 0} />
    </div>
  )
}
