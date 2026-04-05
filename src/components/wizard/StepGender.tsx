'use client'

import { useWizardStore, type Gender } from '@/lib/wizard-store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const MaleIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="14" r="5" />
    <path d="m19 5-5.5 5.5M19 5h-5M19 5v5" />
  </svg>
)

const FemaleIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14v7M9 18h6" />
  </svg>
)

const NeutralIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 7V4M12 20v-3M7 12H4M20 12h-3" />
  </svg>
)

const options: { value: Gender; icon: React.ReactNode; label: string; desc: string }[] = [
  { value: 'male',       icon: <MaleIcon />,    label: 'Masculino',   desc: 'Fotos com trajes e estilos masculinos' },
  { value: 'female',     icon: <FemaleIcon />,  label: 'Feminino',    desc: 'Fotos com trajes e estilos femininos' },
  { value: 'non-binary', icon: <NeutralIcon />, label: 'Outro',       desc: 'Estilo neutro e versátil' },
]

export default function StepGender() {
  const { gender, setGender, nextStep } = useWizardStore()

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 1 de 4</p>
      <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Quem vai nas fotos?</h2>
      <p className="text-sm sm:text-base text-white/40 mb-6 sm:mb-10 leading-relaxed">
        Isso garante que a IA gere os estilos de roupa e pose corretos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map(opt => {
          const selected = gender === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => { setGender(opt.value); setTimeout(nextStep, 200) }}
              className={cn(
                'relative flex flex-col items-start gap-3 p-6 rounded-2xl border transition-all duration-150 text-left w-full',
                selected
                  ? 'border-[#FF7A1A]/60 bg-[#FF7A1A]/[0.07] shadow-[0_0_0_1px_rgba(255,122,26,0.3)]'
                  : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.14] hover:bg-white/[0.05]'
              )}
            >
              {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}
              <div className={cn('text-white/40 transition-colors mb-1', selected && 'text-[#FF7A1A]')}>
                {opt.icon}
              </div>
              <span className={cn('text-base font-bold leading-tight transition-colors', selected ? 'text-white' : 'text-white/70')}>
                {opt.label}
              </span>
              <span className="text-sm text-white/35 leading-snug">{opt.desc}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
