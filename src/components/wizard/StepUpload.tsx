'use client'

import { useCallback, useRef } from 'react'
import { useWizardStore } from '@/lib/wizard-store'
import NextButton from './NextButton'
import { Upload, X, AlertCircle, CheckCircle2, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

const MIN_PHOTOS = 6
const MAX_PHOTOS = 15

const tips = [
  { icon: '1', label: 'Rosto visível', desc: 'Sem óculos escuros ou chapéu' },
  { icon: '2', label: 'Boa iluminação', desc: 'Luz natural é ideal' },
  { icon: '3', label: 'Ângulos variados', desc: 'Frente, perfil e ¾' },
  { icon: '4', label: 'Expressões diversas', desc: 'Sorrindo e neutro' },
  { icon: '5', label: 'Sem filtros', desc: 'Fotos naturais, sem edição' },
  { icon: '6', label: 'Só você na foto', desc: 'Sem outras pessoas' },
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
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Passo 3 de 4</p>
      <h2 className="text-2xl sm:text-3xl font-black text-[#111111] mb-2 tracking-tight">Envie suas selfies</h2>
      <p className="text-sm sm:text-base text-neutral-500 mb-6 sm:mb-8 leading-relaxed">
        Envie {MIN_PHOTOS} a {MAX_PHOTOS} fotos do seu rosto. A IA aprende seus traços faciais para gerar retratos realistas.
      </p>

      {/* Tips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6 sm:mb-8">
        {tips.map((tip) => (
          <div key={tip.icon} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-neutral-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A1A] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-neutral-600 leading-tight">{tip.label}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upload area */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Main drop zone when no photos */}
        {photos.length === 0 && (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-4 py-16 rounded-2xl border-2 border-dashed border-[#FF7A1A]/30 bg-[#FF7A1A]/[0.04] hover:bg-[#FF7A1A]/[0.08] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#FF7A1A]/10 flex items-center justify-center">
              <Camera className="w-7 h-7 text-[#FF7A1A]/60" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-neutral-600">Clique para selecionar fotos</p>
              <p className="text-xs text-neutral-400 mt-1">ou arraste e solte aqui</p>
            </div>
            <p className="text-[11px] text-neutral-400">JPG, PNG ou WebP — Mínimo {MIN_PHOTOS} fotos</p>
          </button>
        )}

        {/* Photo grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {photosPreviews.map((preview, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200 group">
                <img src={preview} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}

            {photos.length < MAX_PHOTOS && (
              <button
                onClick={() => inputRef.current?.click()}
                className={cn(
                  'aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all',
                  hasEnough
                    ? 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    : 'border-[#FF7A1A]/30 bg-[#FF7A1A]/[0.04] hover:bg-[#FF7A1A]/[0.08]'
                )}
              >
                <Upload className={cn('w-5 h-5', hasEnough ? 'text-neutral-300' : 'text-[#FF7A1A]/50')} />
                <span className={cn('text-[10px] font-medium', hasEnough ? 'text-neutral-300' : 'text-[#FF7A1A]/50')}>
                  Adicionar
                </span>
              </button>
            )}
          </div>
        )}
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
      {photos.length > 0 && (
        <div className="mt-5 flex items-center gap-2">
          {hasEnough
            ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            : <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          }
          <span className={cn('text-sm font-medium', hasEnough ? 'text-green-600' : 'text-amber-500')}>
            {photos.length} de {MAX_PHOTOS} fotos
            {!hasEnough && ` — adicione mais ${MIN_PHOTOS - photos.length}`}
          </span>
        </div>
      )}

      <NextButton disabled={!hasEnough} />
    </div>
  )
}
