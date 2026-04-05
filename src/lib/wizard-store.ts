import { create } from 'zustand'
import type { PackKey } from './astria'

export type Gender = 'male' | 'female' | 'non-binary'
export type Plan = 'essential' | 'professional' | 'premium'

export interface WizardState {
  step: number
  gender: Gender | null
  packKey: PackKey | null
  photos: File[]
  photosPreviews: string[]
  plan: Plan | null

  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setGender: (gender: Gender) => void
  setPackKey: (packKey: PackKey) => void
  setPhotos: (photos: File[], previews: string[]) => void
  addPhoto: (photo: File, preview: string) => void
  removePhoto: (index: number) => void
  setPlan: (plan: Plan) => void
  reset: () => void
}

const TOTAL_STEPS = 4

export const useWizardStore = create<WizardState>((set) => ({
  step: 1,
  gender: null,
  packKey: null,
  photos: [],
  photosPreviews: [],
  plan: null,

  setStep: (step) => set({ step: Math.max(1, Math.min(TOTAL_STEPS, step)) }),
  nextStep: () => set((s) => ({ step: Math.min(TOTAL_STEPS, s.step + 1) })),
  prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
  setGender: (gender) => set({ gender }),
  setPackKey: (packKey) => set({ packKey }),
  setPhotos: (photos, photosPreviews) => set({ photos, photosPreviews }),
  addPhoto: (photo, preview) => set((s) => ({
    photos: [...s.photos, photo],
    photosPreviews: [...s.photosPreviews, preview],
  })),
  removePhoto: (index) => set((s) => ({
    photos: s.photos.filter((_, i) => i !== index),
    photosPreviews: s.photosPreviews.filter((_, i) => i !== index),
  })),
  setPlan: (plan) => set({ plan }),
  reset: () => set({
    step: 1, gender: null, packKey: null,
    photos: [], photosPreviews: [], plan: null,
  }),
}))
