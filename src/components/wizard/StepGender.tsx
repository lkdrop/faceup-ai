'use client'

import { useWizardStore, type Gender } from '@/lib/wizard-store'
import OptionCard from './OptionCard'
import NextButton from './NextButton'

// Minimal inline SVG icons — no emojis
const MaleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="14" r="5" />
    <path d="m19 5-5.5 5.5M19 5h-5M19 5v5" />
  </svg>
)

const FemaleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14v7M9 18h6" />
  </svg>
)

const NeutralIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 7V4M12 20v-3M7 12H4M20 12h-3" />
  </svg>
)

const options: { value: Gender; icon: React.ReactNode; label: string; description: string }[] = [
  { value: 'male',       icon: <MaleIcon />,    label: 'Masculino',    description: 'Fotos com trajes masculinos' },
  { value: 'female',     icon: <FemaleIcon />,  label: 'Feminino',     description: 'Fotos com trajes femininos' },
  { value: 'non-binary', icon: <NeutralIcon />, label: 'Não-binário',  description: 'Estilo neutro e versátil' },
]

export default function StepGender() {
  const { gender, setGender } = useWizardStore()

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 1</p>
      <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Qual é o seu gênero?</h2>
      <p className="text-sm sm:text-base text-white/40 mb-6 sm:mb-10 leading-relaxed">
        Isso permite à IA gerar os trajes e estilos corretos para você.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map(opt => (
          <OptionCard
            key={opt.value}
            selected={gender === opt.value}
            onClick={() => setGender(opt.value)}
            icon={opt.icon}
            label={opt.label}
            description={opt.description}
          />
        ))}
      </div>

      <NextButton disabled={!gender} />
    </div>
  )
}
