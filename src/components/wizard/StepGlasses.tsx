'use client'

import { useWizardStore, type Glasses } from '@/lib/wizard-store'
import OptionCard from './OptionCard'
import NextButton from './NextButton'

const options: { value: Glasses; emoji: string; label: string }[] = [
  { value: 'none', emoji: '👁️', label: 'Sem óculos' },
  { value: 'regular', emoji: '👓', label: 'Óculos de grau' },
  { value: 'sunglasses', emoji: '🕶️', label: 'Óculos de sol' },
]

export default function StepGlasses() {
  const { glasses, setGlasses } = useWizardStore()

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Usa óculos?</h2>
      <p className="text-sm text-white/40 mb-8">Selecione se quer aparecer com óculos nas fotos geradas.</p>

      <div className="grid grid-cols-3 gap-4">
        {options.map(opt => (
          <OptionCard
            key={opt.value}
            selected={glasses === opt.value}
            onClick={() => setGlasses(opt.value)}
            emoji={opt.emoji}
            label={opt.label}
          />
        ))}
      </div>

      <NextButton disabled={!glasses} />
    </div>
  )
}
