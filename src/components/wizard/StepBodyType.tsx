'use client'

import { useWizardStore, type BodyType } from '@/lib/wizard-store'
import OptionCard from './OptionCard'
import NextButton from './NextButton'

const options: { value: BodyType; emoji: string; label: string; description: string }[] = [
  { value: 'slim', emoji: '🧍', label: 'Magro', description: 'Corpo mais fino' },
  { value: 'athletic', emoji: '💪', label: 'Atlético', description: 'Corpo definido' },
  { value: 'average', emoji: '🧑‍💼', label: 'Médio', description: 'Corpo padrão' },
  { value: 'plus-size', emoji: '🏋️', label: 'Plus size', description: 'Corpo mais largo' },
]

export default function StepBodyType() {
  const { bodyType, setBodyType } = useWizardStore()

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Tipo de corpo</h2>
      <p className="text-sm text-white/40 mb-8">Para que as roupas caiam naturalmente nas fotos geradas.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {options.map(opt => (
          <OptionCard
            key={opt.value}
            selected={bodyType === opt.value}
            onClick={() => setBodyType(opt.value)}
            emoji={opt.emoji}
            label={opt.label}
            description={opt.description}
          />
        ))}
      </div>

      <NextButton disabled={!bodyType} />
    </div>
  )
}
