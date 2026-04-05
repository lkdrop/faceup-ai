'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import {
  Download, CheckCircle2, Loader2, Clock, Sparkles,
  Image as ImageIcon, ArrowRight, Share2
} from 'lucide-react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface OrderResult {
  id: string
  status: 'pending' | 'paid' | 'training' | 'generating' | 'done' | 'failed'
  plan: string
  resultImages: string[]
  createdAt: string
  tuneId: string | null
}

const statusMessages: Record<string, { title: string; desc: string; icon: React.ReactNode }> = {
  pending: {
    title: 'Processando pagamento…',
    desc: 'Aguarde enquanto confirmamos seu pagamento.',
    icon: <Clock className="w-8 h-8 text-white/40" />,
  },
  paid: {
    title: 'Pagamento confirmado!',
    desc: 'Iniciando o treinamento do modelo. Isso leva cerca de 20 minutos.',
    icon: <CheckCircle2 className="w-8 h-8 text-green-400" />,
  },
  training: {
    title: 'Treinando modelo de IA…',
    desc: 'Estamos personalizando o modelo com suas fotos. Fique à vontade para fechar esta aba — enviaremos um email quando as fotos ficarem prontas.',
    icon: <Loader2 className="w-8 h-8 text-[#FF7A1A] animate-spin" />,
  },
  generating: {
    title: 'Gerando suas fotos…',
    desc: 'O modelo já foi treinado! Agora estamos gerando suas fotos profissionais.',
    icon: <Sparkles className="w-8 h-8 text-[#FF7A1A] animate-pulse" />,
  },
  done: {
    title: 'Suas fotos estão prontas! 🎉',
    desc: 'Clique em qualquer foto para baixar em alta resolução.',
    icon: <CheckCircle2 className="w-8 h-8 text-green-400" />,
  },
  failed: {
    title: 'Ocorreu um erro',
    desc: 'Entre em contato com nosso suporte. Seu dinheiro será reembolsado integralmente.',
    icon: <Loader2 className="w-8 h-8 text-red-400" />,
  },
}

const POLL_INTERVAL = 15_000 // 15 seconds

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/results?order_id=${params.id}`)
      if (!res.ok) throw new Error('Order not found')
      const data = await res.json()
      setOrder(data)
    } catch {
      // silently ignore — will retry
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  // Poll while not done
  useEffect(() => {
    if (order?.status === 'done' || order?.status === 'failed') return
    const interval = setInterval(fetchOrder, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [order?.status, fetchOrder])

  const handleDownloadAll = async () => {
    if (!order?.resultImages.length) return
    toast.info('Iniciando download de todas as fotos…')

    for (let i = 0; i < order.resultImages.length; i++) {
      const url = order.resultImages[i]
      try {
        const res = await fetch(url)
        const blob = await res.blob()
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `faceup-ai-${i + 1}.jpg`
        a.click()
        URL.revokeObjectURL(a.href)
        // Small delay between downloads
        await new Promise(r => setTimeout(r, 200))
      } catch {
        // skip failed
      }
    }
    toast.success('Download concluído!')
  }

  const handleDownloadOne = async (url: string, index: number) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `faceup-ai-${index + 1}.jpg`
      a.click()
      URL.revokeObjectURL(a.href)
    } catch {
      toast.error('Falha ao baixar imagem.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF7A1A] animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-white/50">Pedido não encontrado.</p>
        <Link href="/" className="text-[#FF7A1A] hover:underline">Voltar ao início</Link>
      </div>
    )
  }

  const info = statusMessages[order.status] || statusMessages.pending

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link href="/"><Logo size={30} dark /></Link>
        <p className="text-xs text-white/30">Pedido #{order.id.slice(0, 8)}</p>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Status Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">{info.icon}</div>
          <h1 className="text-3xl font-black mb-3">{info.title}</h1>
          <p className="text-white/50 max-w-md mx-auto">{info.desc}</p>

          {/* Progress bar for training/generating */}
          {(order.status === 'training' || order.status === 'generating') && (
            <div className="mt-6 max-w-xs mx-auto">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FF7A1A] to-[#FFB340] rounded-full"
                  animate={{ width: order.status === 'generating' ? '80%' : '45%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </div>
              <p className="text-xs text-white/30 mt-2">
                {order.status === 'training'
                  ? 'Treinamento em andamento… (~20 min)'
                  : 'Gerando fotos… (~5 min)'}
              </p>
            </div>
          )}
        </div>

        {/* Images grid */}
        {order.status === 'done' && order.resultImages.length > 0 && (
          <>
            {/* Download all button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <p className="text-white/50 text-sm">
                {order.resultImages.length} fotos prontas para download
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/results/${order.id}`
                    navigator.clipboard.writeText(url)
                    toast.success('Link copiado!')
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </button>
                <ShimmerButton
                  onClick={handleDownloadAll}
                  className="text-sm font-bold px-6 py-2.5"
                  shimmerColor="#FFB340"
                  background="#FF7A1A"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar todas ({order.resultImages.length})
                </ShimmerButton>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <AnimatePresence>
                {order.resultImages.map((url, i) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 cursor-pointer"
                    onClick={() => setSelectedImage(url)}
                  >
                    <Image
                      src={url}
                      alt={`Foto profissional ${i + 1}`}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadOne(url, i)
                        }}
                        className="opacity-0 group-hover:opacity-100 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Baixar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* CTA for more */}
            <div className="text-center mt-12 p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-white/50 text-sm mb-4">
                Gostou das fotos? Compartilhe com seus amigos e ganhe fotos grátis.
              </p>
              <Link href="/">
                <ShimmerButton
                  className="text-sm font-bold px-8 py-3"
                  shimmerColor="#FFB340"
                  background="#FF7A1A"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Criar novo pacote de fotos
                </ShimmerButton>
              </Link>
            </div>
          </>
        )}

        {/* Waiting state with placeholder grid */}
        {order.status !== 'done' && order.status !== 'failed' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center"
              >
                <ImageIcon className="w-6 h-6 text-white/10" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-lg w-full aspect-[3/4]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Foto profissional"
                fill
                className="object-cover rounded-2xl"
                sizes="512px"
              />
              <button
                onClick={() => handleDownloadOne(selectedImage, 0)}
                className="absolute bottom-4 right-4 bg-[#FF7A1A] hover:bg-[#FF9944] text-white rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                Baixar
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition text-lg font-bold"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
