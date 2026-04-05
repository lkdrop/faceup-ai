'use client'

import { useWizardStore, type AgeRange } from '@/lib/wizard-store'
import OptionCard from './OptionCard'
import NextButton from './NextButton'

const options: { value: AgeRange; emoji: string; label: string }[] = [
  { value: '18-25', emoji: '🧑', label: '18–25 anos' },
  { value: '26-35', emoji: '👨', label: '26–35 anos' },
  { value: '36-45', emoji: '🧔', label: '36–45 anos' },
  { value: '46-55', emoji: '👨‍🦳', label: '46–55 anos' },
  { value: '56+', emoji: '👴', label: '56+ anos' },
]

export default function StepAge() {
  const { ageRange, setAgeRange } = useWizardStore()

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Qual sua faixa etária?</h2>
      <p className="text-sm text-white/40 mb-8">Para gerar fotos com aparência natural e proporção adequada.</p>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {options.map(opt => (
          <OptionCard
            key={opt.value}
            selected={ageRange === opt.value}
            onClick={() => setAgeRange(opt.value)}
            emoji={opt.emoji}
            label={opt.label}
          />
        ))}
      </div>

      <NextButton disabled={!ageRange} />
    </div>
  )
}
