'use client'

import { useWizardStore } from '@/lib/wizard-store'
import { Check, Camera, Shield, Zap, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BorderBeam } from '@/components/ui/border-beam'
import { ShimmerButton } from '@/components/ui/shimmer-button'

const planDetails = {
  essential: { name: 'Essencial', price: 49, photos: 40, time: '45 min' },
  professional: { name: 'Profissional', price: 69, photos: 80, time: '30 min' },
  premium: { name: 'Premium', price: 99, photos: 120, time: '20 min' },
}

export default function StepConfirm() {
  const store = useWizardStore()
  const { plan, setPlan, photos, backgrounds, outfits, gender, ageRange, hairLength, hairColor, ethnicity, bodyType, glasses } = store

  const handleSubmit = async () => {
    if (!plan) return
    // TODO: Stripe checkout + upload photos + start training
    alert('Redirecionando para pagamento...')
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-2">Confirme e escolha seu plano</h2>
      <p className="text-sm text-white/40 mb-8">Revise suas escolhas e selecione o pacote de fotos.</p>

      {/* Summary */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-8">
        <h3 className="text-sm font-bold mb-4 text-white/60">📋 Resumo das suas escolhas</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {[
            { label: 'Gênero', value: gender === 'male' ? 'Masculino' : gender === 'female' ? 'Feminino' : 'Não-binário' },
            { label: 'Idade', value: ageRange },
            { label: 'Cabelo', value: `${hairLength} · ${hairColor}` },
            { label: 'Etnia', value: ethnicity },
            { label: 'Corpo', value: bodyType },
            { label: 'Óculos', value: glasses === 'none' ? 'Sem' : glasses === 'regular' ? 'De grau' : 'De sol' },
            { label: 'Selfies', value: `${photos.length} fotos` },
            { label: 'Cenários', value: `${backgrounds.length} selecionados` },
            { label: 'Roupas', value: `${outfits.length} estilos` },
          ].map((item, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[10px] text-white/30 uppercase tracking-wider">{item.label}</span>
              <span className="text-white/70 font-medium capitalize">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {(['essential', 'professional', 'premium'] as const).map((p, i) => {
          const d = planDetails[p]
          const isSelected = plan === p
          const isPopular = p === 'professional'

          return (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={cn(
                'relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all text-center',
                isSelected
                  ? 'border-[#FF7A1A] bg-[#FF7A1A]/10 shadow-lg shadow-orange-500/10'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
              )}
            >
              {isPopular && <BorderBeam size={100} duration={6} />}
              {isPopular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF7A1A] text-[#0A0A0A] whitespace-nowrap">
                  ⚡ Popular
                </div>
              )}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#FF7A1A] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#0A0A0A]" />
                </div>
              )}
              <span className="text-xs font-bold text-white/50 mb-1">{d.name}</span>
              <span className="text-2xl font-black mb-1">R${d.price}</span>
              <span className="text-[10px] text-white/30">{d.photos} fotos · {d.time}</span>
            </button>
          )
        })}
      </div>

      {/* Guarantees */}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-white/40 mb-8">
        <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-400" /> Garantia 7 dias</span>
        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#FF7A1A]" /> Pronto em {plan ? planDetails[plan].time : '30 min'}</span>
        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-400" /> Pagamento único</span>
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <ShimmerButton
          onClick={handleSubmit}
          disabled={!plan}
          className={cn(
            'text-base font-bold px-10 py-4',
            !plan && 'opacity-40 cursor-not-allowed'
          )}
          shimmerColor="#FFB340"
          background="#FF7A1A"
        >
          <Camera className="w-5 h-5 mr-2" />
          {plan ? `Gerar minhas fotos — R$${planDetails[plan].price}` : 'Selecione um plano'}
        </ShimmerButton>
      </div>

      <p className="text-center text-[11px] text-white/20 mt-4">
        💳 Pagamento seguro via Stripe · Pix, cartão ou boleto
      </p>
    </div>
  )
}
