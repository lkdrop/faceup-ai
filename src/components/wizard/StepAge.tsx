'use client'

import { useWizardStore, type AgeRange } from '@/lib/wizard-store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import NextButton from './NextButton'

const options: { value: AgeRange; label: string }[] = [
  { value: '18-25', label: '18 – 25' },
  { value: '26-35', label: '26 – 35' },
  { value: '36-45', label: '36 – 45' },
  { value: '46-55', label: '46 – 55' },
  { value: '56+',   label: '56 +' },
]

export default function StepAge() {
  const { ageRange, setAgeRange } = useWizardStore()

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 2</p>
      <h2 className="text-2xl font-bold mb-1.5 tracking-tight">Qual sua faixa etária?</h2>
      <p className="text-sm text-white/40 mb-8 leading-relaxed">
        Garante que a IA preserve sua aparência real nas fotos geradas.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {options.map(opt => {
          const selected = ageRange === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setAgeRange(opt.value)}
              className={cn(
                'relative flex flex-col items-center justify-center py-5 rounded-xl border transition-all duration-150',
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
              <span className={cn('text-base font-bold tracking-tight', selected ? 'text-white' : 'text-white/60')}>
                {opt.label}
              </span>
              <span className="text-[10px] text-white/25 mt-0.5">anos</span>
            </button>
          )
        })}
      </div>

      <NextButton disabled={!ageRange} />
    </div>
  )
}
