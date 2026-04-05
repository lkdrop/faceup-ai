'use client'

import { useWizardStore, type Ethnicity } from '@/lib/wizard-store'
import OptionCard from './OptionCard'
import NextButton from './NextButton'

const options: { value: Ethnicity; emoji: string; label: string }[] = [
  { value: 'asian', emoji: '🧑🏻', label: 'Asiático' },
  { value: 'black', emoji: '🧑🏿', label: 'Negro' },
  { value: 'hispanic', emoji: '🧑🏽', label: 'Latino/Hispânico' },
  { value: 'middle-eastern', emoji: '🧑🏾', label: 'Oriente Médio' },
  { value: 'white', emoji: '🧑🏼', label: 'Branco' },
  { value: 'mixed', emoji: '🤝', label: 'Misto/Pardo' },
  { value: 'other', emoji: '🌍', label: 'Outro' },
]

export default function StepEthnicity() {
  const { ethnicity, setEthnicity } = useWizardStore()

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Qual sua etnia?</h2>
      <p className="text-sm text-white/40 mb-8">Ajuda a IA a preservar fielmente os traços do seu rosto.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map(opt => (
          <OptionCard
            key={opt.value}
            selected={ethnicity === opt.value}
            onClick={() => setEthnicity(opt.value)}
            emoji={opt.emoji}
            label={opt.label}
          />
        ))}
      </div>

      <NextButton disabled={!ethnicity} />
    </div>
  )
}
