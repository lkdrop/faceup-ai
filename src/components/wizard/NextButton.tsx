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
          'flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all duration-150',
          disabled
            ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            : 'bg-[#FF7A1A] text-white hover:bg-[#e86c10] active:scale-[0.98] shadow-lg shadow-orange-200'
        )}
      >
        {label}
        <ArrowRight className="w-4 h-4" />
      </button>
      {disabled && (
        <p className="text-xs text-neutral-400">Selecione uma opção para continuar</p>
      )}
    </div>
  )
}
