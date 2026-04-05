'use client'

import { useCallback, useRef } from 'react'
import { useWizardStore } from '@/lib/wizard-store'
import NextButton from './NextButton'
import { Camera, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const MIN_PHOTOS = 6
const MAX_PHOTOS = 12

const tips = [
  'Diferentes ângulos (frente, perfil, ¾)',
  'Boa iluminação (luz natural é a melhor)',
  'Rosto limpo e visível',
  'Diferentes expressões (sorrindo, sério)',
  'Sem filtros ou efeitos',
  'Fundo simples (não importa muito)',
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

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Envie suas selfies</h2>
      <p className="text-sm text-white/40 mb-6">
        Envie {MIN_PHOTOS}-{MAX_PHOTOS} fotos do seu rosto. Quanto mais variadas, melhores os resultados.
      </p>

      {/* Tips */}
      <div className="bg-[#FF7A1A]/5 border border-[#FF7A1A]/10 rounded-xl p-4 mb-6">
        <p className="text-xs font-bold text-[#FF7A1A] mb-2">📸 Dicas para melhores resultados:</p>
        <div className="grid grid-cols-2 gap-1.5">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-white/50">
              <CheckCircle2 className="w-3 h-3 text-[#FF7A1A] mt-0.5 flex-shrink-0" />
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Upload area */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className="grid grid-cols-3 sm:grid-cols-4 gap-3"
      >
        {/* Existing photos */}
        {photosPreviews.map((preview, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border-2 border-white/10 group">
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => removePhoto(i)}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>
            <div className="absolute bottom-1.5 left-1.5 w-5 h-5 bg-green-500/90 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>
        ))}

        {/* Add button */}
        {photos.length < MAX_PHOTOS && (
          <button
            onClick={() => inputRef.current?.click()}
            className={cn(
              'aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all',
              photos.length < MIN_PHOTOS
                ? 'border-[#FF7A1A]/30 bg-[#FF7A1A]/5 hover:bg-[#FF7A1A]/10'
                : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
            )}
          >
            <Plus className="w-6 h-6 text-white/30" />
            <span className="text-[10px] text-white/30">Adicionar</span>
          </button>
        )}

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, MIN_PHOTOS - photos.length - 1) }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-xl border-2 border-dashed border-white/5 flex items-center justify-center">
            <Camera className="w-5 h-5 text-white/10" />
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={e => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Counter */}
      <div className="mt-4 flex items-center gap-2">
        {photos.length < MIN_PHOTOS ? (
          <AlertCircle className="w-4 h-4 text-yellow-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-green-400" />
        )}
        <span className={cn(
          'text-sm font-medium',
          photos.length < MIN_PHOTOS ? 'text-yellow-400' : 'text-green-400'
        )}>
          {photos.length}/{MAX_PHOTOS} fotos
          {photos.length < MIN_PHOTOS && ` — faltam ${MIN_PHOTOS - photos.length}`}
        </span>
      </div>

      <NextButton disabled={photos.length < MIN_PHOTOS} />
    </div>
  )
}
