'use client'

import { useState } from 'react'
import { useWizardStore } from '@/lib/wizard-store'
import { Check, Camera, Shield, Zap, Clock, Loader2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BorderBeam } from '@/components/ui/border-beam'
import { toast } from 'sonner'

const planDetails = {
  essential:    { name: 'Essencial',    price: 49,  photos: 40,  time: '10 min', popular: false },
  professional: { name: 'Profissional', price: 69,  photos: 80,  time: '8 min',  popular: true  },
  premium:      { name: 'Premium',      price: 99,  photos: 120, time: '5 min',  popular: false },
}

type LoadStep = 'idle' | 'uploading' | 'creating-checkout' | 'redirecting'

const loadLabels: Record<LoadStep, string> = {
  idle: '',
  uploading: 'Enviando suas fotos...',
  'creating-checkout': 'Preparando pagamento...',
  redirecting: 'Redirecionando...',
}

const summaryLabels: Record<string, string> = {
  male: 'Masculino', female: 'Feminino', 'non-binary': 'Não-binário',
  bald: 'Careca', short: 'Curto', medium: 'Médio', long: 'Longo',
  black: 'Preto', brown: 'Castanho', blonde: 'Loiro', red: 'Ruivo', gray: 'Grisalho', white: 'Branco',
  asian: 'Asiático', hispanic: 'Latino', 'middle-eastern': 'Oriente Médio', mixed: 'Misto',
  slim: 'Magro', athletic: 'Atlético', average: 'Médio', 'plus-size': 'Plus size',
  none: 'Sem óculos', regular: 'De grau', sunglasses: 'De sol',
}

export default function StepConfirm() {
  const store = useWizardStore()
  const {
    plan, setPlan, photos, backgrounds, outfits,
    gender, ageRange, hairLength, hairColor, ethnicity, bodyType, glasses,
  } = store

  const [loadStep, setLoadStep] = useState<LoadStep>('idle')
  const isLoading = loadStep !== 'idle'

  const handleSubmit = async () => {
    if (!plan || isLoading) return
    if (photos.length < 5) {
      toast.error('Envie pelo menos 5 selfies para continuar.')
      return
    }

    try {
      setLoadStep('uploading')
      const formData = new FormData()
      photos.forEach(photo => formData.append('photos', photo))

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Falha no upload das fotos.')

      const { urls: photoUrls } = await uploadRes.json()
      if (!photoUrls?.length) throw new Error('Nenhuma foto enviada com sucesso.')

      setLoadStep('creating-checkout')
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          packKey: 'corporate-headshots',
          photoUrls,
          wizardData: { gender, ageRange, hairLength, hairColor, ethnicity, bodyType, glasses, backgrounds, outfits },
        }),
      })

      if (!checkoutRes.ok) throw new Error('Falha ao criar sessão de pagamento.')
      const { url } = await checkoutRes.json()
      if (!url) throw new Error('URL de pagamento inválida.')

      setLoadStep('redirecting')
      window.location.href = url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro desconhecido.')
      setLoadStep('idle')
    }
  }

  const summaryItems = [
    { label: 'Gênero',         value: summaryLabels[gender ?? ''] },
    { label: 'Faixa etária',   value: ageRange ? `${ageRange} anos` : '—' },
    { label: 'Cabelo',         value: [summaryLabels[hairLength ?? ''], summaryLabels[hairColor ?? '']].filter(Boolean).join(', ') },
    { label: 'Etnia',          value: summaryLabels[ethnicity ?? ''] },
    { label: 'Corpo',          value: summaryLabels[bodyType ?? ''] },
    { label: 'Óculos',         value: summaryLabels[glasses ?? ''] },
    { label: 'Selfies',        value: `${photos.length} foto${photos.length !== 1 ? 's' : ''}` },
    { label: 'Cenários',       value: `${backgrounds.length} selecionado${backgrounds.length !== 1 ? 's' : ''}` },
    { label: 'Looks',          value: `${outfits.length} estilo${outfits.length !== 1 ? 's' : ''}` },
  ]

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 11</p>
      <h2 className="text-2xl font-bold mb-1.5 tracking-tight">Confirme e escolha seu plano</h2>
      <p className="text-sm text-white/40 mb-8 leading-relaxed">
        Revise suas escolhas e selecione o pacote de fotos.
      </p>

      {/* Summary */}
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 mb-8">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Resumo</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
          {summaryItems.map((item, i) => (
            <div key={i}>
              <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium mb-0.5">{item.label}</p>
              <p className="text-sm text-white/70 font-medium capitalize">{item.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {(Object.entries(planDetails) as [keyof typeof planDetails, typeof planDetails[keyof typeof planDetails]][]).map(([key, d]) => {
          const isSelected = plan === key

          return (
            <button
              key={key}
              onClick={() => setPlan(key)}
              disabled={isLoading}
              className={cn(
                'relative flex flex-col items-start p-4 rounded-xl border transition-all duration-150',
                isSelected
                  ? 'border-[#FF7A1A]/60 bg-[#FF7A1A]/[0.07]'
                  : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14]',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {d.popular && <BorderBeam size={80} duration={6} />}
              {d.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#FF7A1A] text-[#0A0A0A] text-[9px] font-black tracking-wide whitespace-nowrap">
                  Mais popular
                </div>
              )}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#FF7A1A] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              )}
              <p className={cn('text-[11px] font-semibold mb-2 uppercase tracking-wider', isSelected ? 'text-[#FF7A1A]' : 'text-white/30')}>
                {d.name}
              </p>
              <p className={cn('text-2xl font-black tracking-tight mb-1', isSelected ? 'text-white' : 'text-white/70')}>
                R${d.price}
              </p>
              <p className="text-[11px] text-white/30">{d.photos} fotos</p>
              <p className="text-[11px] text-white/20 mt-0.5">{d.time}</p>
            </button>
          )
        })}
      </div>

      {/* Trust line */}
      <div className="flex flex-wrap gap-5 text-xs text-white/30 mb-8">
        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-500/60" /> Garantia de 7 dias</span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#FF7A1A]/60" />
          Pronto em {plan ? planDetails[plan].time : '8 min'}
        </span>
        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500/60" /> Pagamento único</span>
      </div>

      {/* CTA */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
          <Loader2 className="w-4 h-4 animate-spin text-[#FF7A1A]" />
          <span>{loadLabels[loadStep]}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!plan || isLoading}
        className={cn(
          'flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-150',
          !plan || isLoading
            ? 'bg-white/[0.04] text-white/20 cursor-not-allowed'
            : 'bg-[#FF7A1A] text-white hover:bg-[#FF8C36] active:scale-[0.98] shadow-[0_4px_20px_rgba(255,122,26,0.25)]'
        )}
      >
        {isLoading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> {loadLabels[loadStep]}</>
        ) : (
          <>
            <Camera className="w-4 h-4" />
            {plan ? `Gerar fotos — R$${planDetails[plan].price}` : 'Selecione um plano'}
            {plan && <ArrowRight className="w-4 h-4 ml-1" />}
          </>
        )}
      </button>

      <p className="text-[11px] text-white/20 mt-4">
        Pagamento seguro via Stripe. Pix, cartão ou boleto.
      </p>
    </div>
  )
}
