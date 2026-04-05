'use client'

import { useWizardStore } from '@/lib/wizard-store'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/logo'

import StepGender from './StepGender'
import StepStyle from './StepStyle'
import StepUpload from './StepUpload'
import StepConfirm from './StepConfirm'

const TOTAL_STEPS = 4

const steps = [
  { label: 'Gênero' },
  { label: 'Estilo' },
  { label: 'Selfies' },
  { label: 'Plano' },
]

const stepComponents = [StepGender, StepStyle, StepUpload, StepConfirm]

export default function WizardShell() {
  const { step, prevStep } = useWizardStore()
  const CurrentStep = stepComponents[step - 1]
  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">

      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-white/60" />
              </button>
            ) : (
              <Link
                href="/"
                className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-white/60" />
              </Link>
            )}
            <div className="h-4 w-px bg-white/[0.08]" />
            <p className="text-sm text-white/40">
              Passo <span className="text-white font-semibold">{step}</span> de {TOTAL_STEPS}
            </p>
          </div>

          <Link href="/">
            <Logo size={28} dark />
          </Link>
        </div>

        {/* Progress bar */}
        <div className="h-[2px] bg-white/[0.04]">
          <motion.div
            className="h-full bg-[#FF7A1A]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex gap-10">

        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block w-44 shrink-0 pt-1">
          <nav className="sticky top-24 flex flex-col gap-1">
            {steps.map((s, i) => {
              const n = i + 1
              const isDone = n < step
              const isCurrent = n === step

              return (
                <div
                  key={n}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isCurrent ? 'bg-white/[0.06]' : ''
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    isDone
                      ? 'bg-[#FF7A1A]'
                      : isCurrent
                        ? 'border-2 border-[#FF7A1A]'
                        : 'border border-white/[0.12]'
                  }`}>
                    {isDone
                      ? <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      : <span className={`text-[10px] font-bold ${isCurrent ? 'text-[#FF7A1A]' : 'text-white/20'}`}>{n}</span>
                    }
                  </div>
                  <span className={`text-sm transition-colors ${
                    isCurrent ? 'text-white font-semibold'
                    : isDone ? 'text-white/40'
                    : 'text-white/20'
                  }`}>
                    {s.label}
                  </span>
                </div>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              <CurrentStep />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
