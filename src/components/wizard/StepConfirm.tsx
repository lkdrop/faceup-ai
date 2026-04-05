'use client'

import { useState } from 'react'
import { useWizardStore } from '@/lib/wizard-store'
import { PACKS } from '@/lib/astria'
import { Check, Camera, Shield, Zap, Clock, Loader2, ArrowRight, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BorderBeam } from '@/components/ui/border-beam'
import { toast } from 'sonner'

const planDetails = {
  essential:    { name: 'Essencial',    price: 49,  photos: 40,  time: '~10 min', popular: false },
  professional: { name: 'Profissional', price: 69,  photos: 80,  time: '~8 min',  popular: true  },
  premium:      { name: 'Premium',      price: 99,  photos: 120, time: '~5 min',  popular: false },
}

type LoadStep = 'idle' | 'uploading' | 'creating-checkout' | 'redirecting'

const loadLabels: Record<LoadStep, string> = {
  idle: '',
  uploading: 'Enviando suas fotos...',
  'creating-checkout': 'Preparando pagamento...',
  redirecting: 'Redirecionando para o Stripe...',
}

export default function StepConfirm() {
  const { plan, setPlan, photos, gender, packKey } = useWizardStore()
  const [loadStep, setLoadStep] = useState<LoadStep>('idle')
  const isLoading = loadStep !== 'idle'

  const packLabel = packKey ? PACKS[packKey].label : 'Fotos Corporativas'
  const genderLabel = gender === 'male' ? 'Masculino' : gender === 'female' ? 'Feminino' : 'Neutro'

  const handleSubmit = async () => {
    if (!plan || !packKey || isLoading) return
    if (photos.length < 5) {
      toast.error('Envie pelo menos 6 selfies para continuar.')
      return
    }

    try {
      // 1. Upload photos to Supabase
      setLoadStep('uploading')
      const formData = new FormData()
      photos.forEach(photo => formData.append('photos', photo))

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Falha no upload das fotos.')

      const { urls: photoUrls } = await uploadRes.json()
      if (!photoUrls?.length) throw new Error('Nenhuma foto enviada com sucesso.')

      // 2. Create Stripe checkout session
      setLoadStep('creating-checkout')
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          packKey,
          photoUrls,
          wizardData: { gender, packKey },
        }),
      })

      if (!checkoutRes.ok) throw new Error('Falha ao criar sessão de pagamento.')
      const { url } = await checkoutRes.json()
      if (!url) throw new Error('URL de pagamento inválida.')

      // 3. Redirect to Stripe
      setLoadStep('redirecting')
      window.location.href = url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro desconhecido. Tente novamente.')
      setLoadStep('idle')
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Passo 4 de 4</p>
      <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Escolha seu plano</h2>
      <p className="text-sm sm:text-base text-white/40 mb-6 sm:mb-8 leading-relaxed">
        Selecione quantas fotos quer receber. Todas geradas com IA em alta qualidade.
      </p>

      {/* Summary bar */}
      <div className="flex flex-wrap gap-4 mb-6 sm:mb-8 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
        <div>
          <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium mb-0.5">Estilo</p>
          <p className="text-sm text-white/70 font-medium">{packLabel}</p>
        </div>
        <div className="w-px bg-white/[0.08]" />
        <div>
          <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium mb-0.5">Genero</p>
          <p className="text-sm text-white/70 font-medium">{genderLabel}</p>
        </div>
        <div className="w-px bg-white/[0.08]" />
        <div>
          <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium mb-0.5">Selfies</p>
          <p className="text-sm text-white/70 font-medium flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" /> {photos.length} fotos
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 sm:mb-8">
        {(Object.entries(planDetails) as [keyof typeof planDetails, typeof planDetails[keyof typeof planDetails]][]).map(([key, d]) => {
          const isSelected = plan === key

          return (
            <button
              key={key}
              onClick={() => setPlan(key)}
              disabled={isLoading}
              className={cn(
                'relative flex flex-col items-center p-6 rounded-2xl border transition-all duration-150',
                isSelected
                  ? 'border-[#FF7A1A]/60 bg-[#FF7A1A]/[0.07]'
                  : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14]',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {d.popular && <BorderBeam size={80} duration={6} />}
              {d.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FF7A1A] text-[#0A0A0A] text-[10px] font-black tracking-wide whitespace-nowrap">
                  Mais popular
                </div>
              )}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              )}
              <p className={cn('text-xs font-semibold mb-3 uppercase tracking-wider', isSelected ? 'text-[#FF7A1A]' : 'text-white/30')}>
                {d.name}
              </p>
              <p className={cn('text-3xl font-black tracking-tight mb-1', isSelected ? 'text-white' : 'text-white/70')}>
                R${d.price}
              </p>
              <p className="text-sm text-white/40 font-medium">{d.photos} fotos</p>
              <p className="text-xs text-white/20 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Pronto em {d.time}
              </p>
            </button>
          )
        })}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-5 text-xs text-white/30 mb-6 sm:mb-8">
        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-500/60" /> Garantia de 7 dias</span>
        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500/60" /> Pagamento único</span>
        <span className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5 text-[#FF7A1A]/60" /> IA de última geração</span>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
          <Loader2 className="w-4 h-4 animate-spin text-[#FF7A1A]" />
          <span>{loadLabels[loadStep]}</span>
        </div>
      )}

      {/* CTA */}
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
            {plan ? `Gerar minhas fotos — R$${planDetails[plan].price}` : 'Selecione um plano'}
            {plan && <ArrowRight className="w-4 h-4 ml-1" />}
          </>
        )}
      </button>

      <p className="text-[11px] text-white/20 mt-4">
        Pagamento seguro via Stripe. Cartão de crédito, Pix ou boleto. Suas fotos permanecem privadas.
      </p>
    </div>
  )
}
