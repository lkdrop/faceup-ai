'use client'

import { useWizardStore, type Gender } from '@/lib/wizard-store'
import OptionCard from './OptionCard'
import NextButton from './NextButton'

const options: { value: Gender; emoji: string; label: string }[] = [
  { value: 'male', emoji: '👨', label: 'Masculino' },
  { value: 'female', emoji: '👩', label: 'Feminino' },
  { value: 'non-binary', emoji: '🧑', label: 'Não-binário' },
]

export default function StepGender() {
  const { gender, setGender } = useWizardStore()

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Qual é o seu gênero?</h2>
      <p className="text-sm text-white/40 mb-8">Isso ajuda a IA a gerar fotos mais precisas do seu rosto.</p>

      <div className="grid grid-cols-3 gap-4">
        {options.map(opt => (
          <OptionCard
            key={opt.value}
            selected={gender === opt.value}
            onClick={() => setGender(opt.value)}
            emoji={opt.emoji}
            label={opt.label}
          />
        ))}
      </div>

      <NextButton disabled={!gender} />
    </div>
  )
}
