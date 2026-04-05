/**
 * Astria.ai API client
 * Full fine-tuning pipeline for AI professional headshots
 */

const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY!
const ASTRIA_BASE = 'https://api.astria.ai'

// ─── Pack Definitions ────────────────────────────────────────────────────────
export const PACKS = {
  'corporate-headshots': {
    id: 690204,         // Astria "Corporate Headshots" gallery pack
    name: 'Corporate Headshots',
    label: 'Fotos Corporativas',
    description: 'Fundo neutro, terno/blazer, iluminação de estúdio profissional.',
    previewImage: '/gallery/astria-person.jpg',
    promptsMale: [
      'sks man corporate headshot, professional business portrait, wearing dark suit and tie, white studio background, soft studio lighting, 8k, photorealistic, sharp focus',
      'sks man headshot, linkedin profile photo, smart blazer, light gray background, natural light, professional, editorial quality',
      'sks man executive portrait, formal attire, bokeh background, warm office environment, high-end photography',
      'sks man business photo, wearing blue dress shirt, clean white background, direct eye contact, confident expression, 8k uhd',
    ],
    promptsFemale: [
      'sks woman corporate headshot, professional business portrait, elegant blazer, white studio background, soft lighting, 8k, photorealistic',
      'sks woman linkedin photo, smart professional attire, gray background, natural office light, editorial quality',
      'sks woman executive portrait, formal dress or blouse, warm bokeh, professional studio, high-end photography',
      'sks woman business headshot, navy blazer, direct eye contact, clean background, 8k uhd, sharp focus',
    ],
  },
  'dating-profile': {
    id: 690204,
    name: 'Dating Profile',
    label: 'Perfil de Encontros',
    description: 'Looks casuais, ambientes naturais, expressão genuína.',
    previewImage: '/gallery/astria-dating-man.jpg',
    promptsMale: [
      'sks man casual dating profile photo, smiling outdoors, natural daylight, park background, relaxed pose, photorealistic, 8k',
      'sks man lifestyle photo, casual shirt, coffee shop background, warm light, genuine smile, editorial quality',
      'sks man outdoor portrait, relaxed outfit, sunset light, candid style, warm tones',
    ],
    promptsFemale: [
      'sks woman casual dating profile, smiling outdoors, natural daylight, park or city background, warm colors, photorealistic',
      'sks woman lifestyle portrait, summer dress, golden hour light, natural smile, editorial quality, 8k',
      'sks woman outdoor photo, casual elegant look, bokeh background, radiant natural light',
    ],
  },
  'social-media': {
    id: 690204,
    name: 'Social Media',
    label: 'Redes Sociais',
    description: 'Looks estilosos, fundos dinâmicos, vibe criativa.',
    previewImage: '/gallery/astria-styled1.jpg',
    promptsMale: [
      'sks man stylish social media photo, trendy outfit, dynamic urban background, editorial fashion photography, 8k',
      'sks man creative portrait, modern casual wear, colorful background, high energy, photorealistic',
    ],
    promptsFemale: [
      'sks woman stylish social media portrait, fashionable outfit, vibrant background, editorial quality, 8k',
      'sks woman creative headshot, modern fashion, colorful bokeh, high-end photography',
    ],
  },
} as const

export type PackKey = keyof typeof PACKS

// ─── Types ───────────────────────────────────────────────────────────────────
export interface AstiraTune {
  id: number
  title: string
  trained_at: string | null
  started_training_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
  orig_images: string[]
  prompts: AstriaPrompt[]
  callback: string | null
  model_type: string | null
  token: string
  base_tune_id: number
}

export interface AstriaPrompt {
  id: number
  text: string
  trained_at: string | null
  started_training_at: string | null
  num_images: number
  callback: string | null
  images: AstriaImage[]
  created_at: string
  updated_at: string
}

export interface AstriaImage {
  id: number
  url: string
}

// ─── API Helpers ─────────────────────────────────────────────────────────────
async function astriaFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${ASTRIA_BASE}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${ASTRIA_API_KEY}`,
      ...options.headers,
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Astria API error ${res.status}: ${body}`)
  }
  return res
}

// ─── Create Tune (Fine-Tune) ──────────────────────────────────────────────────
export async function createTune(params: {
  title: string
  packId: number
  imageUrls: string[]
  callbackUrl?: string
}): Promise<AstiraTune> {
  const formData = new FormData()
  formData.append('tune[title]', params.title)
  formData.append('tune[base_tune_id]', String(params.packId))

  for (const url of params.imageUrls) {
    formData.append('tune[image_urls][]', url)
  }

  if (params.callbackUrl) {
    formData.append('tune[callback]', params.callbackUrl)
  }

  const res = await astriaFetch('/tunes', {
    method: 'POST',
    body: formData,
  })

  return res.json()
}

// ─── Get Tune ────────────────────────────────────────────────────────────────
export async function getTune(tuneId: number | string): Promise<AstiraTune> {
  const res = await astriaFetch(`/tunes/${tuneId}`)
  return res.json()
}

// ─── Create Prompts (Generate Images) ────────────────────────────────────────
export async function generateImages(params: {
  tuneId: number | string
  prompts: string[]
  numImages?: number
  callbackUrl?: string
}): Promise<AstriaPrompt[]> {
  const results: AstriaPrompt[] = []

  for (const text of params.prompts) {
    const formData = new FormData()
    formData.append('prompt[text]', text)
    formData.append('prompt[num_images]', String(params.numImages ?? 4))
    if (params.callbackUrl) {
      formData.append('prompt[callback]', params.callbackUrl)
    }

    const res = await astriaFetch(`/tunes/${params.tuneId}/prompts`, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    results.push(data)
  }

  return results
}

// ─── Get Prompt Status ───────────────────────────────────────────────────────
export async function getPrompt(
  tuneId: number | string,
  promptId: number | string
): Promise<AstriaPrompt> {
  const res = await astriaFetch(`/tunes/${tuneId}/prompts/${promptId}`)
  return res.json()
}

// ─── Pack Helpers ─────────────────────────────────────────────────────────────
export function getPackPrompts(packKey: PackKey, gender: 'male' | 'female' | 'non-binary'): string[] {
  const pack = PACKS[packKey]
  return gender === 'female' ? [...pack.promptsFemale] : [...pack.promptsMale]
}

export function getNumImages(plan: 'essential' | 'professional' | 'premium'): number {
  return { essential: 40, professional: 80, premium: 120 }[plan]
}

// Images per prompt based on plan and prompt count
export function imagesPerPrompt(plan: 'essential' | 'professional' | 'premium', promptCount: number): number {
  return Math.ceil(getNumImages(plan) / promptCount)
}
