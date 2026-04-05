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
    <div className="mt-8 flex justify-center">
      <button
        onClick={onClick || nextStep}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all',
          disabled
            ? 'bg-white/5 text-white/20 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#FF7A1A] to-[#FFB340] text-[#0A0A0A] hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]'
        )}
      >
        {label} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
