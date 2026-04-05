import { create } from 'zustand'

export type Gender = 'male' | 'female' | 'non-binary'
export type AgeRange = '18-25' | '26-35' | '36-45' | '46-55' | '56+'
export type HairLength = 'bald' | 'short' | 'medium' | 'long'
export type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'white'
export type Ethnicity = 'asian' | 'black' | 'hispanic' | 'middle-eastern' | 'white' | 'mixed' | 'other'
export type BodyType = 'slim' | 'athletic' | 'average' | 'plus-size'
export type Glasses = 'none' | 'regular' | 'sunglasses'
export type Background = 'studio-white' | 'studio-gray' | 'office' | 'outdoor-park' | 'outdoor-city' | 'gradient'
export type Outfit = 'suit-tie' | 'suit-no-tie' | 'blazer-casual' | 'smart-casual' | 'business-casual' | 'polo' | 'dress-formal' | 'dress-casual' | 'blouse-professional'

export interface WizardState {
  step: number
  gender: Gender | null
  ageRange: AgeRange | null
  hairLength: HairLength | null
  hairColor: HairColor | null
  ethnicity: Ethnicity | null
  bodyType: BodyType | null
  photos: File[]
  photosPreviews: string[]
  glasses: Glasses | null
  backgrounds: Background[]
  outfits: Outfit[]
  plan: 'essential' | 'professional' | 'premium' | null

  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setGender: (gender: Gender) => void
  setAgeRange: (age: AgeRange) => void
  setHairLength: (hair: HairLength) => void
  setHairColor: (color: HairColor) => void
  setEthnicity: (ethnicity: Ethnicity) => void
  setBodyType: (body: BodyType) => void
  setPhotos: (photos: File[], previews: string[]) => void
  addPhoto: (photo: File, preview: string) => void
  removePhoto: (index: number) => void
  setGlasses: (glasses: Glasses) => void
  toggleBackground: (bg: Background) => void
  toggleOutfit: (outfit: Outfit) => void
  setPlan: (plan: 'essential' | 'professional' | 'premium') => void
  reset: () => void
}

const TOTAL_STEPS = 11

export const useWizardStore = create<WizardState>((set, get) => ({
  step: 1,
  gender: null,
  ageRange: null,
  hairLength: null,
  hairColor: null,
  ethnicity: null,
  bodyType: null,
  photos: [],
  photosPreviews: [],
  glasses: null,
  backgrounds: [],
  outfits: [],
  plan: null,

  setStep: (step) => set({ step: Math.max(1, Math.min(TOTAL_STEPS, step)) }),
  nextStep: () => set((s) => ({ step: Math.min(TOTAL_STEPS, s.step + 1) })),
  prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
  setGender: (gender) => set({ gender }),
  setAgeRange: (ageRange) => set({ ageRange }),
  setHairLength: (hairLength) => set({ hairLength }),
  setHairColor: (hairColor) => set({ hairColor }),
  setEthnicity: (ethnicity) => set({ ethnicity }),
  setBodyType: (bodyType) => set({ bodyType }),
  setPhotos: (photos, photosPreviews) => set({ photos, photosPreviews }),
  addPhoto: (photo, preview) => set((s) => ({
    photos: [...s.photos, photo],
    photosPreviews: [...s.photosPreviews, preview],
  })),
  removePhoto: (index) => set((s) => ({
    photos: s.photos.filter((_, i) => i !== index),
    photosPreviews: s.photosPreviews.filter((_, i) => i !== index),
  })),
  setGlasses: (glasses) => set({ glasses }),
  toggleBackground: (bg) => set((s) => ({
    backgrounds: s.backgrounds.includes(bg)
      ? s.backgrounds.filter(b => b !== bg)
      : [...s.backgrounds, bg],
  })),
  toggleOutfit: (outfit) => set((s) => ({
    outfits: s.outfits.includes(outfit)
      ? s.outfits.filter(o => o !== outfit)
      : [...s.outfits, outfit],
  })),
  setPlan: (plan) => set({ plan }),
  reset: () => set({
    step: 1, gender: null, ageRange: null, hairLength: null, hairColor: null,
    ethnicity: null, bodyType: null, photos: [], photosPreviews: [],
    glasses: null, backgrounds: [], outfits: [], plan: null,
  }),
}))
