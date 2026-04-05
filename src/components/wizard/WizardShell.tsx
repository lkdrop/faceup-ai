'use client'

import { useWizardStore } from '@/lib/wizard-store'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera, X } from 'lucide-react'
import Link from 'next/link'
// Custom progress bar (simpler than shadcn)

import StepGender from './StepGender'
import StepAge from './StepAge'
import StepHairLength from './StepHairLength'
import StepHairColor from './StepHairColor'
import StepEthnicity from './StepEthnicity'
import StepBodyType from './StepBodyType'
import StepUpload from './StepUpload'
import StepGlasses from './StepGlasses'
import StepBackgrounds from './StepBackgrounds'
import StepOutfits from './StepOutfits'
import StepConfirm from './StepConfirm'

const TOTAL_STEPS = 11

const stepTitles = [
  'Gênero',
  'Faixa etária',
  'Comprimento do cabelo',
  'Cor do cabelo',
  'Etnia',
  'Tipo de corpo',
  'Suas selfies',
  'Óculos',
  'Cenários',
  'Estilos de roupa',
  'Confirmação',
]

const stepComponents = [
  StepGender,
  StepAge,
  StepHairLength,
  StepHairColor,
  StepEthnicity,
  StepBodyType,
  StepUpload,
  StepGlasses,
  StepBackgrounds,
  StepOutfits,
  StepConfirm,
]

export default function WizardShell() {
  const { step, prevStep } = useWizardStore()
  const CurrentStep = stepComponents[step - 1]
  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {step > 1 ? (
                <button onClick={prevStep} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <Link href="/" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              )}
              <div>
                <p className="text-xs text-white/30">Passo {step} de {TOTAL_STEPS}</p>
                <p className="text-sm font-semibold">{stepTitles[step - 1]}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF7A1A] to-[#FFB340] flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-[#0A0A0A]" />
                </div>
                <span className="text-sm font-bold hidden sm:block">
                  Face<span className="text-[#FF7A1A]">Up</span><span className="text-white/30">.AI</span>
                </span>
              </Link>
            </div>
          </div>

          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF7A1A] to-[#FFB340] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <CurrentStep />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
