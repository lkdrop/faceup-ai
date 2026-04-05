'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Download, Loader2, ArrowRight, ImageIcon, CheckCircle2, Share2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface OrderResult {
  id: string
  status: 'pending' | 'paid' | 'training' | 'generating' | 'done' | 'failed'
  plan: string
  resultImages: string[]
  createdAt: string
  tuneId: string | null
}

const POLL_INTERVAL = 15_000

const statusConfig: Record<string, {
  label: string
  description: string
  progress: number
}> = {
  pending:    { label: 'Processando pagamento',        description: 'Confirmando seu pagamento via Stripe.',                                      progress: 8  },
  paid:       { label: 'Pagamento confirmado',         description: 'Iniciando o treinamento do modelo de IA.',                                   progress: 15 },
  training:   { label: 'Treinando modelo',             description: 'A IA está aprendendo com suas fotos. Esse processo leva alguns minutos.',     progress: 45 },
  generating: { label: 'Gerando suas fotos',           description: 'Modelo treinado. Gerando suas fotos profissionais agora.',                    progress: 80 },
  done:       { label: 'Fotos prontas',                description: '',                                                                           progress: 100 },
  failed:     { label: 'Ocorreu um erro',              description: 'Entre em contato com o suporte. Seu pagamento será reembolsado.',             progress: 0  },
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<string | null>(null)

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/results?order_id=${params.id}`)
      if (!res.ok) throw new Error('Not found')
      setOrder(await res.json())
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  useEffect(() => {
    if (order?.status === 'done' || order?.status === 'failed') return
    const t = setInterval(fetchOrder, POLL_INTERVAL)
    return () => clearInterval(t)
  }, [order?.status, fetchOrder])

  const downloadOne = async (url: string, index: number) => {
    try {
      const blob = await (await fetch(url)).blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `faceup-ai-photo-${index + 1}.jpg`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch { toast.error('Falha no download.') }
  }

  const downloadAll = async () => {
    if (!order?.resultImages.length) return
    toast.info(`Baixando ${order.resultImages.length} fotos...`)
    for (let i = 0; i < order.resultImages.length; i++) {
      await downloadOne(order.resultImages[i], i)
      await new Promise(r => setTimeout(r, 150))
    }
    toast.success('Download concluído.')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-3 text-white">
        <p className="text-white/40 text-sm">Pedido não encontrado.</p>
        <Link href="/" className="text-[#FF7A1A] text-sm hover:underline">Voltar ao início</Link>
      </div>
    )
  }

  const config = statusConfig[order.status] ?? statusConfig.pending
  const isDone = order.status === 'done'
  const isFailed = order.status === 'failed'

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/"><Logo size={28} dark /></Link>
          <p className="text-xs text-white/25 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Status block */}
        {!isDone && (
          <div className="max-w-lg mx-auto mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.07] mb-6">
              {isFailed ? (
                <div className="w-2 h-2 rounded-full bg-red-500" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-[#FF7A1A] animate-pulse" />
              )}
              <span className="text-sm font-medium text-white/60">{config.label}</span>
            </div>

            <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto mb-8">
              {config.description}
            </p>

            {/* Progress bar */}
            {!isFailed && (
              <div className="max-w-xs mx-auto">
                <div className="flex justify-between text-[10px] text-white/25 mb-2">
                  <span>Progresso</span>
                  <span>{config.progress}%</span>
                </div>
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#FF7A1A] rounded-full"
                    animate={{ width: `${config.progress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-[11px] text-white/20 mt-3">
                  Você pode fechar esta aba — enviaremos um e-mail quando as fotos ficarem prontas.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Done header */}
        {isDone && order.resultImages.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <div>
                <p className="text-base font-semibold">
                  {order.resultImages.length} fotos prontas
                </p>
                <p className="text-sm text-white/35">Clique em qualquer foto para ampliar e baixar</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success('Link copiado.')
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
              <button
                onClick={downloadAll}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#FF7A1A] hover:bg-[#FF8C36] text-white text-sm font-semibold transition-colors shadow-[0_4px_20px_rgba(255,122,26,0.2)]"
              >
                <Download className="w-4 h-4" />
                Baixar todas
              </button>
            </div>
          </div>
        )}

        {/* Image grid */}
        {isDone && order.resultImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <AnimatePresence>
              {order.resultImages.map((url, i) => (
                <motion.div
                  key={url}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.06] cursor-pointer"
                  onClick={() => setLightbox(url)}
                >
                  <Image
                    src={url}
                    alt={`Foto ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                  <button
                    onClick={e => { e.stopPropagation(); downloadOne(url, i) }}
                    className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white text-[11px] font-semibold transition-all"
                  >
                    <Download className="w-3 h-3" />
                    Baixar
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : !isDone ? (
          /* Skeleton grid while waiting */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-white/[0.06]" />
              </div>
            ))}
          </div>
        ) : null}

        {/* CTA after done */}
        {isDone && (
          <div className="mt-12 pt-10 border-t border-white/[0.06] text-center">
            <p className="text-sm text-white/30 mb-4">Quer um novo pacote de fotos com outro estilo?</p>
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-sm font-semibold text-white/60 hover:text-white transition-colors"
            >
              Criar novo pacote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.18 }}
              className="relative max-w-sm w-full aspect-[3/4]"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={lightbox}
                alt="Foto"
                fill
                className="object-cover rounded-2xl"
                sizes="400px"
              />
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
                <button
                  onClick={() => downloadOne(lightbox, 0)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#FF8C36] text-white text-sm font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Baixar foto
                </button>
                <button
                  onClick={() => setLightbox(null)}
                  className="w-10 h-10 rounded-xl bg-black/60 hover:bg-black/80 text-white/60 hover:text-white flex items-center justify-center text-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
