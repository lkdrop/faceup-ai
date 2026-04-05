import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export default replicate

// LoRA trainer model
export const LORA_TRAINER = 'ostris/flux-dev-lora-trainer'

// Generation model (flux-dev with LoRA weights)
export const GENERATION_MODEL = 'black-forest-labs/flux-dev'

// Training config
export const TRAINING_CONFIG = {
  steps: 1000,
  lora_rank: 16,
  optimizer: 'adamw8bit',
  batch_size: 1,
  resolution: '512,768,1024',
  autocaption: true,
  trigger_word: 'FACEUP_SUBJECT',
  learning_rate: 0.0004,
}

// Generation prompts by style
export function buildPrompt(opts: {
  trigger: string
  gender: string
  outfit: string
  background: string
  glasses: string
  hairLength: string
  hairColor: string
}) {
  const genderTerm = opts.gender === 'male' ? 'man' : opts.gender === 'female' ? 'woman' : 'person'

  const outfitPrompts: Record<string, string> = {
    'suit-tie': 'wearing a navy blue suit with a tie',
    'suit-no-tie': 'wearing a dark charcoal suit without a tie, open collar',
    'blazer-casual': 'wearing a casual blazer over a t-shirt',
    'smart-casual': 'wearing a button-down shirt with sleeves rolled up',
    'business-casual': 'wearing a crisp white dress shirt',
    'polo': 'wearing a fitted polo shirt',
    'dress-formal': 'wearing an elegant formal dress',
    'dress-casual': 'wearing a stylish casual dress',
    'blouse-professional': 'wearing a professional blouse',
  }

  const bgPrompts: Record<string, string> = {
    'studio-white': 'clean white studio background, professional lighting',
    'studio-gray': 'neutral gray studio backdrop, soft lighting',
    'office': 'modern office background, blurred, bokeh',
    'outdoor-park': 'outdoor park setting, green trees, natural light, golden hour',
    'outdoor-city': 'urban city street background, buildings, blurred',
    'gradient': 'smooth gradient background, professional studio',
  }

  const glassesPrompt = opts.glasses === 'regular' ? ', wearing glasses' : opts.glasses === 'sunglasses' ? ', wearing sunglasses' : ''

  return `professional headshot portrait of ${opts.trigger} as a ${genderTerm}, ${opts.hairLength} ${opts.hairColor} hair, ${outfitPrompts[opts.outfit] || 'professional attire'}${glassesPrompt}, ${bgPrompts[opts.background] || 'studio background'}, sharp focus, high resolution, 8k, photorealistic, corporate portrait photography`
}
