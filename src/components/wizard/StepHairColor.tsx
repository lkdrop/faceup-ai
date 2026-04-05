'use client'

import { useWizardStore, type HairColor } from '@/lib/wizard-store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import NextButton from './NextButton'

const options: { value: HairColor; color: string; label: string }[] = [
  { value: 'black',  color: '#1C1C1C',         label: 'Preto' },
  { value: 'brown',  color: '#5C3317',         label: 'Castanho' },
  { value: 'blonde', color: '#C9962B',         label: 'Loiro' },
  { value: 'red',    color: '#8B3A2A',         label: 'Ruivo' },
  { value: 'gray',   color: '#888888',         label: 'Grisalho' },
  { value: 'white',  color: 'linear-gradient(135deg,#ddd,#f5f5f5)', label: 'Branco' },
]

export default function StepHairColor() {
  const { hairColor, setHairColor } = useWizardStore()

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 4</p>
      <h2 className="text-2xl font-bold mb-1.5 tracking-tight">Cor do cabelo</h2>
      <p className="text-sm text-white/40 mb-8 leading-relaxed">
        Selecione a cor mais próxima do seu cabelo natural.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {options.map(opt => {
          const selected = hairColor === opt.value
          const isGradient = opt.color.startsWith('linear')
          return (
            <button
              key={opt.value}
              onClick={() => setHairColor(opt.value)}
              className={cn(
                'flex flex-col items-center gap-3 py-4 px-2 rounded-xl border transition-all duration-150',
                selected
                  ? 'border-[#FF7A1A]/60 bg-[#FF7A1A]/[0.07]'
                  : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.14]'
              )}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                <div
                  className="w-full h-full"
                  style={isGradient
                    ? { background: opt.color }
                    : { backgroundColor: opt.color }
                  }
                />
                {selected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className={cn('text-xs font-medium', selected ? 'text-white' : 'text-white/50')}>
                {opt.label}
              </span>
            </button>
          )
        })}
      </div>

      <NextButton disabled={!hairColor} />
    </div>
  )
}
