'use client'

import { useWizardStore } from '@/lib/wizard-store'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NextButtonProps {
  disabled?: boolean
  label?: string
  onClick?: () => void
}

export default function NextButton({ disabled = false, label = 'Continuar', onClick }: NextButtonProps) {
  const { nextStep } = useWizardStore()

  return (
    <div className="mt-8 sm:mt-14 flex items-center gap-4">
      <button
        onClick={onClick || nextStep}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-150',
          disabled
            ? 'bg-white/[0.04] text-white/20 cursor-not-allowed'
            : 'bg-[#FF7A1A] text-white hover:bg-[#FF8C36] active:scale-[0.98] shadow-[0_4px_20px_rgba(255,122,26,0.25)]'
        )}
      >
        {label}
        <ArrowRight className="w-4 h-4" />
      </button>
      {disabled && (
        <p className="text-xs text-white/25">Selecione uma opção para continuar</p>
      )}
    </div>
  )
}
