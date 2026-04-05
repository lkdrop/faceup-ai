'use client'

import { useWizardStore, type HairColor } from '@/lib/wizard-store'
import NextButton from './NextButton'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const options: { value: HairColor; color: string; label: string }[] = [
  { value: 'black', color: '#1a1a1a', label: 'Preto' },
  { value: 'brown', color: '#5C3317', label: 'Castanho' },
  { value: 'blonde', color: '#D4A843', label: 'Loiro' },
  { value: 'red', color: '#A0522D', label: 'Ruivo' },
  { value: 'gray', color: '#808080', label: 'Grisalho' },
  { value: 'white', color: '#E8E8E8', label: 'Branco' },
]

export default function StepHairColor() {
  const { hairColor, setHairColor } = useWizardStore()

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Cor do cabelo</h2>
      <p className="text-sm text-white/40 mb-8">Selecione a cor mais próxima do seu cabelo natural.</p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => setHairColor(opt.value)}
            className={cn(
              'flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all',
              hairColor === opt.value
                ? 'border-[#FF7A1A] bg-[#FF7A1A]/10'
                : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
            )}
          >
            <div className="relative w-12 h-12 rounded-full border-2 border-white/10" style={{ backgroundColor: opt.color }}>
              {hairColor === opt.value && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-[#FF7A1A]/30">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-white/70">{opt.label}</span>
          </button>
        ))}
      </div>

      <NextButton disabled={!hairColor} />
    </div>
  )
}
