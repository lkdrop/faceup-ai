'use client'

import { useWizardStore, type HairLength } from '@/lib/wizard-store'
import OptionCard from './OptionCard'
import NextButton from './NextButton'

const options: { value: HairLength; emoji: string; label: string }[] = [
  { value: 'bald', emoji: '👨‍🦲', label: 'Careca' },
  { value: 'short', emoji: '💇', label: 'Curto' },
  { value: 'medium', emoji: '🧑‍🦱', label: 'Médio' },
  { value: 'long', emoji: '👩‍🦰', label: 'Longo' },
]

export default function StepHairLength() {
  const { hairLength, setHairLength } = useWizardStore()

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Comprimento do cabelo</h2>
      <p className="text-sm text-white/40 mb-8">Selecione o comprimento mais próximo do seu cabelo atual.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {options.map(opt => (
          <OptionCard
            key={opt.value}
            selected={hairLength === opt.value}
            onClick={() => setHairLength(opt.value)}
            emoji={opt.emoji}
            label={opt.label}
          />
        ))}
      </div>

      <NextButton disabled={!hairLength} />
    </div>
  )
}
