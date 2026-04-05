'use client'

import { useWizardStore, type Ethnicity } from '@/lib/wizard-store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import NextButton from './NextButton'

// Skin tone swatches — accurate, respectful representation
const skinTones: Record<Ethnicity, string> = {
  asian:          '#E8C49A',
  black:          '#7B4A2D',
  hispanic:       '#C08560',
  'middle-eastern': '#B8884A',
  white:          '#EDD5B3',
  mixed:          '#D4A574',
  other:          '#C8A882',
}

const options: { value: Ethnicity; label: string }[] = [
  { value: 'asian',           label: 'Asiático' },
  { value: 'black',           label: 'Negro' },
  { value: 'hispanic',        label: 'Latino' },
  { value: 'middle-eastern',  label: 'Oriente Médio' },
  { value: 'white',           label: 'Branco' },
  { value: 'mixed',           label: 'Misto / Pardo' },
  { value: 'other',           label: 'Outro' },
]

export default function StepEthnicity() {
  const { ethnicity, setEthnicity } = useWizardStore()

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 5</p>
      <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Qual sua etnia?</h2>
      <p className="text-sm sm:text-base text-white/40 mb-6 sm:mb-10 leading-relaxed">
        Ajuda a IA a preservar fielmente os traços do seu rosto.
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {options.map(opt => {
          const selected = ethnicity === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setEthnicity(opt.value)}
              className={cn(
                'relative flex items-center gap-3 p-3.5 sm:gap-4 sm:p-5 rounded-2xl border transition-all duration-150',
                selected
                  ? 'border-[#FF7A1A]/60 bg-[#FF7A1A]/[0.07]'
                  : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]'
              )}
            >
              {selected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#FF7A1A] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              )}
              <div
                className="w-10 h-10 rounded-full shrink-0 border border-white/10"
                style={{ backgroundColor: skinTones[opt.value] }}
              />
              <span className={cn('text-base font-semibold leading-tight', selected ? 'text-white' : 'text-white/60')}>
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>

      <NextButton disabled={!ethnicity} />
    </div>
  )
}
