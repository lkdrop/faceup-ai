'use client'

import { useWizardStore } from '@/lib/wizard-store'
import { PACKS, type PackKey } from '@/lib/astria'
import { cn } from '@/lib/utils'
import { Check, Briefcase, Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import NextButton from './NextButton'

const packIcons: Record<PackKey, React.ReactNode> = {
  'corporate-headshots': <Briefcase className="w-5 h-5" />,
  'dating-profile':      <Heart className="w-5 h-5" />,
  'social-media':        <Share2 className="w-5 h-5" />,
}

const packExamples: Record<PackKey, string[]> = {
  'corporate-headshots': [
    'Terno e gravata, fundo de estúdio',
    'Blazer profissional, fundo cinza',
    'Camisa social, ambiente corporativo',
    'Perfil LinkedIn, iluminação natural',
  ],
  'dating-profile': [
    'Look casual em parque ao ar livre',
    'Sorriso natural, cafeteria',
    'Estilo lifestyle, golden hour',
    'Roupa casual elegante, cenário urbano',
  ],
  'social-media': [
    'Look estiloso, fundo dinâmico urbano',
    'Fotografia editorial, moda',
    'Retrato criativo, fundo colorido',
    'Visual moderno, alta qualidade',
  ],
}

export default function StepStyle() {
  const { packKey, setPackKey } = useWizardStore()

  return (
    <div>
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Passo 2 de 4</p>
      <h2 className="text-2xl sm:text-3xl font-black text-[#111111] mb-2 tracking-tight">Escolha o estilo</h2>
      <p className="text-sm sm:text-base text-neutral-500 mb-6 sm:mb-10 leading-relaxed">
        Cada estilo gera fotos com roupas, poses e fundos diferentes.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {(Object.keys(PACKS) as PackKey[]).map(key => {
          const pack = PACKS[key]
          const selected = packKey === key
          const examples = packExamples[key]

          return (
            <button
              key={key}
              onClick={() => setPackKey(key)}
              className={cn(
                'relative flex flex-col sm:flex-row items-start gap-4 p-5 sm:p-6 rounded-2xl border transition-all duration-150 text-left w-full',
                selected
                  ? 'border-[#FF7A1A] bg-[#FF7A1A]/[0.06] shadow-[0_0_0_1px_rgba(255,122,26,0.2)]'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
              )}
            >
              {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Preview image */}
              <div className="relative w-full sm:w-28 h-36 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-neutral-200">
                <Image
                  src={pack.previewImage}
                  alt={pack.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 112px"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('text-neutral-300', selected && 'text-[#FF7A1A]')}>
                    {packIcons[key]}
                  </div>
                  <h3 className={cn('text-base font-bold', selected ? 'text-[#111111]' : 'text-neutral-700')}>
                    {pack.label}
                  </h3>
                </div>
                <p className="text-sm text-neutral-400 mb-3">{pack.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {examples.map((ex, i) => (
                    <span key={i} className="text-[11px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <NextButton disabled={!packKey} />
    </div>
  )
}
