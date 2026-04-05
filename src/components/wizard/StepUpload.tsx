'use client'

import { useCallback, useRef } from 'react'
import { useWizardStore } from '@/lib/wizard-store'
import NextButton from './NextButton'
import { Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const MIN_PHOTOS = 6
const MAX_PHOTOS = 12

const tips = [
  { label: 'Ângulos variados', desc: 'Frente, perfil e ¾' },
  { label: 'Boa iluminação', desc: 'Luz natural funciona melhor' },
  { label: 'Rosto visível', desc: 'Sem obstruções ou sombras fortes' },
  { label: 'Expressões diversas', desc: 'Sorrindo e expressão neutra' },
  { label: 'Sem filtros', desc: 'Fotos naturais dão melhores resultados' },
  { label: 'Fundo simples', desc: 'Não precisa ser perfeito' },
]

export default function StepUpload() {
  const { photos, photosPreviews, addPhoto, removePhoto } = useWizardStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach(file => {
      if (photos.length >= MAX_PHOTOS) return
      if (!file.type.startsWith('image/')) return
      const preview = URL.createObjectURL(file)
      addPhoto(file, preview)
    })
  }, [photos.length, addPhoto])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const hasEnough = photos.length >= MIN_PHOTOS

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 7</p>
      <h2 className="text-2xl font-bold mb-1.5 tracking-tight">Envie suas fotos</h2>
      <p className="text-sm text-white/40 mb-8 leading-relaxed">
        {MIN_PHOTOS}–{MAX_PHOTOS} fotos do seu rosto. Quanto mais variadas, melhores os resultados.
      </p>

      {/* Tips strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A1A] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white/60 leading-tight">{tip.label}</p>
              <p className="text-[11px] text-white/25 mt-0.5 leading-tight">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload grid */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className="grid grid-cols-3 sm:grid-cols-4 gap-2.5"
      >
        {/* Uploaded photos */}
        {photosPreviews.map((preview, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-white/[0.06] group">
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
            <button
              onClick={() => removePhoto(i)}
              className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}

        {/* Add button */}
        {photos.length < MAX_PHOTOS && (
          <button
            onClick={() => inputRef.current?.click()}
            className={cn(
              'aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all',
              hasEnough
                ? 'border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]'
                : 'border-[#FF7A1A]/25 bg-[#FF7A1A]/[0.04] hover:bg-[#FF7A1A]/[0.08]'
            )}
          >
            <Upload className={cn('w-5 h-5', hasEnough ? 'text-white/20' : 'text-[#FF7A1A]/50')} />
            <span className={cn('text-[10px] font-medium', hasEnough ? 'text-white/20' : 'text-[#FF7A1A]/50')}>
              Adicionar
            </span>
          </button>
        )}

        {/* Empty placeholder slots */}
        {Array.from({ length: Math.max(0, MIN_PHOTOS - photos.length - 1) }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-xl border border-dashed border-white/[0.05] bg-white/[0.01]" />
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
        onChange={e => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Counter */}
      <div className="mt-5 flex items-center gap-2">
        {hasEnough
          ? <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        }
        <span className={cn('text-sm font-medium', hasEnough ? 'text-green-400' : 'text-amber-400')}>
          {photos.length} de {MAX_PHOTOS} fotos
          {!hasEnough && ` — adicione mais ${MIN_PHOTOS - photos.length}`}
        </span>
      </div>

      <NextButton disabled={!hasEnough} />
    </div>
  )
}
