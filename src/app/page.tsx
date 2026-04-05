'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/logo'
import {
  ArrowRight, Check, Star, ChevronDown, Upload, Cpu, ImageIcon, Download,
  Sparkles, Users, Briefcase, X, Shield, Lock, ExternalLink, LogOut, User
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Marquee } from '@/components/ui/marquee'
import { createClient } from '@/lib/supabase-browser'
import type { User as SupaUser } from '@supabase/supabase-js'

/* ── PHOTOS — 100% local Astria results, zero external CDN ── */

// Pares reais — mesma pessoa no antes e depois (sequência: mulher, homem, jovem)
const beforePhotos = [
  '/gallery/pair1_before.png',
  '/gallery/pair2_before.png',
  '/gallery/pair3_before.png',
  '/gallery/pair1_before.png',
  '/gallery/pair2_before.png',
  '/gallery/pair3_before.png',
]

const afterPhotos = [
  '/gallery/pair1_after.png',
  '/gallery/pair2_after.png',
  '/gallery/pair3_after.png',
  '/gallery/pair1_after.png',
  '/gallery/pair2_after.png',
  '/gallery/pair3_after.png',
]

// Galeria — Astria AI-generated headshots (real results, high quality)
const galleryIndividuos = [
  '/gallery/astria-elegant-woman.jpg',
  '/gallery/astria-person.jpg',
  '/gallery/astria-elegant-man.jpg',
  '/gallery/astria-brand1.jpg',
  '/gallery/astria-styled1.jpg',
  '/gallery/astria-dating-woman.jpg',
  '/gallery/astria-brand2.jpg',
  '/gallery/astria-styled2.jpg',
  '/gallery/astria-dating-man.jpg',
  '/gallery/astria-winter1.jpg',
]

const galleryEquipes = [
  '/gallery/astria-elegant-woman.jpg',
  '/gallery/astria-brand1.jpg',
  '/gallery/astria-person.jpg',
  '/gallery/astria-styled1.jpg',
  '/gallery/astria-elegant-man.jpg',
  '/gallery/astria-brand2.jpg',
  '/gallery/astria-dating-woman.jpg',
  '/gallery/astria-winter2.jpg',
  '/gallery/astria-styled2.jpg',
  '/gallery/astria-dating1.jpg',
]

/* ── BRANDS ──────────────────────────────────────── */
const brands = [
  { name: 'Google',         color: '#4285F4' },
  { name: 'Apple',          color: '#555555' },
  { name: 'Amazon',         color: '#FF9900' },
  { name: 'Microsoft',      color: '#00A4EF' },
  { name: 'Meta',           color: '#0082FB' },
  { name: 'Netflix',        color: '#E50914' },
  { name: 'Spotify',        color: '#1DB954' },
  { name: 'Uber',           color: '#000000' },
  { name: 'Airbnb',         color: '#FF5A5F' },
  { name: 'Salesforce',     color: '#00A1E0' },
  { name: 'LinkedIn',       color: '#0A66C2' },
  { name: 'Shopify',        color: '#96BF48' },
  { name: 'Stripe',         color: '#635BFF' },
  { name: 'Slack',          color: '#4A154B' },
  { name: 'Zoom',           color: '#2D8CFF' },
]

/* ── PRESS ───────────────────────────────────────── */
const press = [
  { name: 'Forbes', quote: 'Indistinguível de fotos tiradas por fotógrafos profissionais com equipamentos de ponta.' },
  { name: 'TechCrunch', quote: 'Tecnologia que transforma qualquer selfie em foto de estúdio profissional. Resultado impressionante.' },
  { name: 'Business Insider', quote: 'Três quartos dos recrutadores preferem fotos com IA a fotos tradicionais, segundo novo estudo.' },
  { name: 'The Verge', quote: 'Torna a fotografia profissional acessível a qualquer pessoa, sem fotógrafo ou estúdio.' },
  { name: 'Wired', quote: 'A IA do FaceUp.AI fez a maior transformação nas fotos de perfil profissional do mercado.' },
  { name: 'Fast Company', quote: 'O serviço é extremamente fácil de usar e os resultados chegam em menos de 10 minutos.' },
]

/* ── COMPARISON ──────────────────────────────────── */
const comparison = [
  { feature: 'Faça do conforto da sua casa', faceup: 'Sim', photo: 'Não, sessão presencial' },
  { feature: 'Tempo de entrega', faceup: 'Menos de 10 minutos', photo: '2–3 dias úteis' },
  { feature: 'Número de fotos', faceup: 'Até 100 fotos', photo: '5–10 por pessoa' },
  { feature: 'Roupas e estilos', faceup: 'Mais de 20 opções', photo: '1–2 roupas' },
  { feature: 'Fundos diferentes', faceup: 'Sua escolha', photo: '1 fundo fixo' },
  { feature: 'Consistência visual', faceup: 'Sim, padrões disponíveis', photo: 'Edições manuais necessárias' },
]

/* ── TESTIMONIALS ────────────────────────────────── */
const testimonials = [
  { name: 'Ana Lima', role: 'Diretora de Marketing', text: 'Usei o FaceUp.AI para renovar minha foto do LinkedIn. Em 10 minutos tinha 40 fotos incríveis. Recebi 3 propostas de emprego na semana seguinte!', stars: 5, photo: '/gallery/astria-elegant-woman.jpg' },
  { name: 'Carlos Mendes', role: 'CEO, TechStart', text: 'Contratei para minha equipe inteira de 12 pessoas. Economizamos mais de R$8.000 comparado ao fotógrafo. Resultado profissional de verdade.', stars: 5, photo: '/gallery/astria-elegant-man.jpg' },
  { name: 'Beatriz Costa', role: 'Consultora Financeira', text: 'Minhas fotos ficaram tão boas que minha chefe perguntou onde eu tinha feito o book. Quando falei que foi IA ela não acreditou!', stars: 5, photo: '/gallery/astria-dating-woman.jpg' },
  { name: 'Rafael Sousa', role: 'Engenheiro de Software', text: 'Processo super simples — enviei 15 selfies e em 10 minutos recebi 40 fotos profissionais. Vale cada centavo, melhor investimento do ano.', stars: 5, photo: '/gallery/astria-dating-man.jpg' },
  { name: 'Mariana Ferreira', role: 'Head de RH', text: 'Recomendo para todos os funcionários na integração. Ajuda a criar uma imagem profissional consistente para toda a empresa.', stars: 5, photo: '/gallery/astria-brand2.jpg' },
  { name: 'Pedro Oliveira', role: 'Gerente Comercial', text: 'Fechei um contrato de R$50k depois de atualizar minha foto com o FaceUp.AI. Primeira impressão conta muito!', stars: 5, photo: '/gallery/astria-brand1.jpg' },
]

/* ── FAQ ─────────────────────────────────────────── */
const faqs = [
  { q: 'Quanto tempo leva para receber minhas fotos?', a: 'Após enviar suas selfies, o processo de IA leva menos de 10 minutos. Você receberá um e-mail quando suas fotos estiverem prontas.' },
  { q: 'Quantas selfies preciso enviar?', a: 'Recomendamos entre 10 e 20 selfies em boa iluminação, diferentes ângulos e expressões. Quanto mais variedade, melhores os resultados.' },
  { q: 'As fotos ficam parecidas comigo?', a: 'Sim! Nossa IA é treinada especificamente com suas selfies, garantindo que as fotos geradas sejam fiéis à sua aparência real.' },
  { q: 'Posso usar as fotos comercialmente?', a: 'Sim. Você tem direitos totais sobre as fotos geradas. Use em LinkedIn, currículo, site, cartão de visita — sem restrições.' },
  { q: 'E se eu não gostar das fotos?', a: 'Oferecemos garantia de 7 dias. Se não ficar satisfeito, devolvemos 100% do valor sem perguntas.' },
  { q: 'Funciona para equipes?', a: 'Sim! Temos planos empresariais para times. Cada membro envia suas selfies e recebe suas fotos individuais. Ideal para padronizar a imagem da empresa.' },
]

/* ── PRICING ─────────────────────────────────────── */
const plans = {
  individual: [
    { name: 'Básico', price: 'R$47', oldPrice: 'R$94', photos: '40 fotos', time: '10 min', outfits: '1 estilo', bg: '1 fundo', res: 'Resolução padrão', cta: 'Selecionar', highlight: false },
    { name: 'Padrão', price: 'R$87', oldPrice: 'R$174', photos: '60 fotos', time: '8 min', outfits: '2 estilos', bg: '2 fundos', res: 'Resolução padrão', cta: 'Selecionar', highlight: true, badge: '83% escolhem este' },
    { name: 'Executivo', price: 'R$147', oldPrice: 'R$294', photos: '100 fotos', time: '5 min', outfits: 'Todos os estilos', bg: 'Todos os fundos', res: 'Resolução aprimorada', cta: 'Selecionar', highlight: false, badge: 'Melhor valor' },
  ],
  equipes: [
    { name: 'Equipe Pequena', price: 'R$67', oldPrice: 'R$134', photos: '40 fotos/pessoa', time: '10 min', outfits: '2 estilos', bg: '2 fundos', res: 'Resolução padrão', cta: 'Selecionar', highlight: false },
    { name: 'Equipe Média', price: 'R$57', oldPrice: 'R$114', photos: '60 fotos/pessoa', time: '8 min', outfits: '5 estilos', bg: '5 fundos', res: 'Resolução padrão', cta: 'Selecionar', highlight: true, badge: 'Mais pedido' },
    { name: 'Corporativo', price: 'R$47', oldPrice: 'R$94', photos: '100 fotos/pessoa', time: '5 min', outfits: 'Todos os estilos', bg: 'Todos os fundos', res: 'Resolução aprimorada + logo', cta: 'Falar com vendas', highlight: false, badge: 'Melhor valor' },
  ],
}

/* ── COMPONENTS ──────────────────────────────────── */

function PhotoCard({ src, label }: { src: string; label?: string }) {
  return (
    <div className="relative w-[130px] shrink-0 mx-1.5 aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
      <Image src={src} alt={label || ''} fill className="object-cover" quality={90} sizes="260px" />
      {label && (
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-0.5 rounded-full text-white text-[9px] font-bold tracking-widest ${label === 'ANTES' ? 'bg-black/60 backdrop-blur-sm' : 'bg-[#FF7A1A]'}`}>
            {label}
          </span>
        </div>
      )}
    </div>
  )
}

function StarRow({ n = 5 }: { n?: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
      ))}
    </span>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-neutral-200 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left text-[#111111]"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-base pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-neutral-500 text-sm pb-5 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── PAGE ────────────────────────────────────────── */
export default function Home() {
  const [galleryTab, setGalleryTab] = useState<'individuos' | 'equipes'>('individuos')
  const [pricingTab, setPricingTab] = useState<'individual' | 'equipes'>('individual')
  const [user, setUser] = useState<SupaUser | null>(null)

  useEffect(() => {
    const supabase = createClient()
    if (supabase) {
      supabase.auth.getUser().then((res: { data: { user: SupaUser | null } }) => setUser(res.data.user)).catch(() => {})
    }
  }, [])
  const galleryPhotos = galleryTab === 'individuos' ? galleryIndividuos : galleryEquipes
  const currentPlans = plans[pricingTab]

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── TOP BAR ── */}
      <div className="bg-[#111111] text-white text-center text-sm py-2.5 px-4">
        <strong>Promoção de lançamento:</strong> 50% OFF nos primeiros 3 dias —{' '}
        <Link href="/wizard" className="underline underline-offset-2 hover:no-underline">
          Aproveitar agora →
        </Link>
      </div>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/"><Logo size={34} /></Link>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <Link href="#como-funciona" className="hover:text-[#111111] transition-colors">Como funciona</Link>
            <Link href="#galeria" className="hover:text-[#111111] transition-colors">Galeria</Link>
            <Link href="#precos" className="hover:text-[#111111] transition-colors">Preços</Link>
            <Link href="#faq" className="hover:text-[#111111] transition-colors">FAQ</Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/wizard" className="hidden md:flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#111111] transition-colors">
                  <User className="w-4 h-4" />
                  {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                </Link>
                <Link href="/wizard" className="bg-[#FF7A1A] hover:bg-[#e86c10] text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
                  Criar fotos
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hidden md:block text-sm font-medium text-neutral-600 hover:text-[#111111] transition-colors">
                  Entrar
                </Link>
                <Link href="/auth/register" className="bg-[#FF7A1A] hover:bg-[#e86c10] text-white text-sm font-bold px-4 py-2 rounded-full transition-colors">
                  Começar grátis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-[#FDF8F3] pt-16 pb-8 text-center px-5">
        <div className="inline-flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-4 py-1.5 text-sm text-neutral-600 shadow-sm mb-6">
          <span>Mais de <strong className="text-[#111111]">2.462.000</strong> fotos geradas</span>
        </div>
        <h1 className="text-[2.8rem] md:text-[4rem] leading-[1.08] font-black text-[#111111] max-w-3xl mx-auto mb-5">
          Obtenha suas fotos de retrato em <span className="text-[#FF7A1A] italic">minutos</span>, não em dias.
        </h1>
        <p className="text-lg md:text-xl text-neutral-500 max-w-xl mx-auto mb-8 leading-relaxed">
          Envie algumas selfies e receba até 100 fotos profissionais
          em diferentes estilos e fundos. Entrega em menos de 10 minutos.
        </p>
        <Link href="/wizard" className="inline-flex items-center gap-2.5 bg-[#FF7A1A] hover:bg-[#e86c10] text-white font-black text-lg px-8 py-4 rounded-full shadow-lg shadow-orange-200 transition-all hover:scale-[1.02] active:scale-[0.99]">
          Criar minhas fotos agora
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Lock className="w-3.5 h-3.5 text-[#FF7A1A]" /> Suas fotos permanecem privadas
          </span>
          <span className="text-neutral-300 text-xs hidden md:block">·</span>
          <span className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Shield className="w-3.5 h-3.5 text-[#FF7A1A]" /> Nunca compartilhamos seus dados
          </span>
          <span className="text-neutral-300 text-xs hidden md:block">·</span>
          <span className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Check className="w-3.5 h-3.5 text-[#FF7A1A]" /> Garantia de satisfação de 7 dias
          </span>
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <StarRow />
            <span className="text-sm font-semibold text-neutral-700">4.9</span>
            <span className="text-sm text-neutral-400">(2.341 avaliações)</span>
          </div>
          <div className="w-px h-5 bg-neutral-200 hidden md:block" />
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00B67A"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            <span className="text-sm font-semibold text-neutral-700">Excelente</span>
            <StarRow />
            <span className="text-sm text-neutral-400">Trustpilot</span>
          </div>
        </div>
      </section>

      {/* ── SPLIT BEFORE / AFTER STRIP ── */}
      <section className="relative w-full overflow-hidden" style={{ height: 320 }}>
        <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[10px] font-black tracking-widest">ANTES</span>
          </div>
          <Marquee pauseOnHover className="h-full [--duration:40s]" repeat={4}>
            {beforePhotos.map((src, i) => <PhotoCard key={i} src={src} />)}
          </Marquee>
        </div>
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] bg-white z-20 shadow-[0_0_12px_4px_rgba(255,255,255,0.9)]" />
        <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
            <span className="px-3 py-1 rounded-full bg-[#FF7A1A] text-white text-[10px] font-black tracking-widest shadow-lg">DEPOIS</span>
          </div>
          <Marquee pauseOnHover reverse className="h-full [--duration:40s]" repeat={4}>
            {afterPhotos.map((src, i) => <PhotoCard key={i} src={src} />)}
          </Marquee>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-[#FDF8F3] py-8 overflow-hidden border-y border-neutral-100">
        <p className="text-center text-sm text-neutral-500 font-semibold mb-4 tracking-wide uppercase">
          Confiado por profissionais das maiores empresas do mundo
        </p>
        <Marquee pauseOnHover className="[--duration:30s]" repeat={4}>
          {brands.map(({ name, color }) => (
            <span key={name} className="mx-8 font-black text-sm tracking-widest uppercase shrink-0" style={{ color }}>
              {name}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="como-funciona" className="bg-white py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-sm font-black uppercase tracking-widest text-[#FF7A1A] mb-3">Como funciona</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#111111] mb-2">
              Do upload às suas fotos profissionais em{' '}
              <span className="text-[#FF7A1A]">menos de 10 minutos</span>.
            </h2>
            <p className="text-neutral-500 text-lg">Envie selfies, escolha o estilo e nossa IA faz o resto.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {/* Step 1 — Selecionar estilo */}
            <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100">
              <div className="p-4 bg-white border-b border-neutral-100">
                <div className="flex gap-2">
                  {[
                    { src: '/gallery/astria-elegant-woman.jpg', label: 'Profissional' },
                    { src: '/gallery/astria-brand1.jpg', label: 'Business' },
                    { src: '/gallery/astria-styled1.jpg', label: 'Smart Casual' },
                  ].map(({ src, label }, i) => (
                    <div key={i} className={`relative flex-1 aspect-[3/4] rounded-xl overflow-hidden bg-neutral-200 ${i === 1 ? 'ring-2 ring-[#FF7A1A]' : ''}`}>
                      <Image src={src} alt={label} fill className="object-cover" sizes="80px" quality={90} />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-1.5 text-center">
                        <span className="text-white text-[8px] font-bold">{label}</span>
                        <span className="text-[#FF7A1A] text-[8px] ml-1">✓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-[#FF7A1A] text-white text-xs font-black flex items-center justify-center">1</span>
                  <span className="font-bold text-sm text-[#111111]">Selecionar vestuário e fundos</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">Escolha a partir da nossa seleção de roupas e fundos escolhidos.</p>
              </div>
            </div>

            {/* Step 2 — Upload */}
            <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100">
              <div className="p-4 bg-white border-b border-neutral-100">
                <div className="grid grid-cols-3 gap-1.5">
                  {['/gallery/pair1_before.png', '/gallery/pair2_before.png', '/gallery/pair3_before.png',
                    '/gallery/pair2_before.png', '/gallery/pair1_before.png', '/gallery/pair3_before.png'].map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-200">
                      <Image src={src} alt="upload" fill className="object-cover" sizes="60px" quality={80} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-[#FF7A1A] text-white text-xs font-black flex items-center justify-center">2</span>
                  <span className="font-bold text-sm text-[#111111]">Carregue algumas fotos suas</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">As selfies funcionam muito bem. Seis carregamentos são tudo que você precisa.</p>
              </div>
            </div>

            {/* Step 3 — AI processing */}
            <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100">
              <div className="p-4 bg-white border-b border-neutral-100">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-200 max-w-[140px] mx-auto">
                  <Image src="/gallery/astria-person.jpg" alt="gerando" fill className="object-cover" sizes="140px" quality={95} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-3">
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A1A] animate-pulse" />
                      <span className="text-white text-[9px] font-bold">Gerando IA...</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-[#FF7A1A] text-white text-xs font-black flex items-center justify-center">3</span>
                  <span className="font-bold text-sm text-[#111111]">Criamos um modelo de IA personalizado</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">Nossa IA começa a trabalhar. Aguarde o e-mail quando estiver pronto!</p>
              </div>
            </div>

            {/* Step 4 — Results */}
            <div className="bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100">
              <div className="p-4 bg-white border-b border-neutral-100">
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    '/gallery/astria-elegant-woman.jpg',
                    '/gallery/astria-brand1.jpg',
                    '/gallery/astria-styled1.jpg',
                    '/gallery/astria-elegant-man.jpg',
                    '/gallery/astria-dating-woman.jpg',
                    '/gallery/astria-brand2.jpg',
                  ].map((src, i) => (
                    <div key={i} className={`relative aspect-square rounded-lg overflow-hidden bg-neutral-200 ${i === 2 ? 'ring-2 ring-[#FF7A1A]' : ''}`}>
                      <Image src={src} alt="resultado" fill className="object-cover" sizes="60px" quality={80} />
                      {i === 2 && <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-[#FF7A1A] rounded-full flex items-center justify-center"><Check className="w-2 h-2 text-white" /></div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-[#FF7A1A] text-white text-xs font-black flex items-center justify-center">4</span>
                  <span className="font-bold text-sm text-[#111111]">Veja, edite e transfira seus favoritos!</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">Você receberá até 100 fotos de alta qualidade para usar como quiser.</p>
              </div>
            </div>

          </div>

          <div className="text-center mt-10">
            <Link href="/wizard" className="inline-flex items-center gap-2 bg-[#FF7A1A] hover:bg-[#e86c10] text-white font-black px-7 py-3.5 rounded-full transition-all hover:scale-[1.02]">
              Criar minhas fotos agora <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="galeria" className="bg-[#FDF8F3] py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-[#111111]">
                Fazemos sessões fotográficas de IA tanto para{' '}
                <span className="text-[#FF7A1A]">indivíduos</span>{' '}
                como para{' '}
                <span className="text-[#FF7A1A]">equipes</span>.
              </h2>
              <p className="text-neutral-500 mt-2">Fotos reais geradas para nossos clientes reais. Veja os resultados por si mesmo.</p>
            </div>
            <Link href="/wizard" className="shrink-0 inline-flex items-center gap-2 bg-[#FF7A1A] hover:bg-[#e86c10] text-white font-bold px-5 py-2.5 rounded-full text-sm transition-colors">
              Crie suas fotos agora <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-2 mb-8">
            <button onClick={() => setGalleryTab('individuos')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${galleryTab === 'individuos' ? 'border-[#111111] text-[#111111] bg-white' : 'border-neutral-200 text-neutral-400 hover:text-neutral-600'}`}>
              <Users className="w-4 h-4" /> Pessoas físicas
            </button>
            <button onClick={() => setGalleryTab('equipes')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all ${galleryTab === 'equipes' ? 'border-[#111111] text-[#111111] bg-white' : 'border-neutral-200 text-neutral-400 hover:text-neutral-600'}`}>
              <Briefcase className="w-4 h-4" /> Equipes
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {galleryPhotos.map((src, i) => (
              <motion.div key={`${galleryTab}-${i}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.04 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 shadow-sm hover:scale-[1.02] transition-transform group">
                <Image src={src} alt="Foto profissional" fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw" quality={95} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                  <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FF7A1A]" /> FaceUp.AI
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white py-16 px-5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '2.462.000+', label: 'Fotos geradas' },
            { n: '98%', label: 'Satisfação' },
            { n: '< 10 min', label: 'Entrega' },
            { n: '100+', label: 'Fotos por pedido' },
          ].map(({ n, label }) => (
            <div key={label}>
              <p className="text-4xl md:text-5xl font-black text-[#111111]">{n}</p>
              <p className="text-sm text-neutral-400 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#FDF8F3] py-20 px-5 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-[#FF7A1A] uppercase tracking-widest mb-3">Depoimentos</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#111111]">Clientes que transformaram seu perfil</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, text, stars, photo }) => (
              <div key={name} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                    <Image src={photo} alt={name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#111111]">{name}</p>
                    <p className="text-xs text-neutral-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="precos" className="bg-[#111111] py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Fotografias de nível profissional por uma <span className="text-[#FF7A1A]">fração do custo</span>
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto">
              Sessões com fotógrafo profissional custam em média R$500–R$2.000. Economize tempo e dinheiro com nossa solução de alta tecnologia.
            </p>
          </div>

          {/* Pricing toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white/10 rounded-full p-1 gap-1">
              <button onClick={() => setPricingTab('individual')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${pricingTab === 'individual' ? 'bg-white text-[#111111]' : 'text-white/60 hover:text-white'}`}>
                Preços individuais
              </button>
              <button onClick={() => setPricingTab('equipes')} className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${pricingTab === 'equipes' ? 'bg-white text-[#111111]' : 'text-white/60 hover:text-white'}`}>
                Preços das equipes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentPlans.map(({ name, price, oldPrice, photos, time, outfits, bg, res, cta, highlight, badge }) => (
              <div key={name} className={`relative rounded-2xl p-7 flex flex-col ${highlight ? 'bg-[#FF7A1A] text-white shadow-xl shadow-orange-900/30 scale-[1.02]' : 'bg-white/5 border border-white/10 text-white'}`}>
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`text-xs font-black px-3 py-1 rounded-full shadow ${highlight ? 'bg-white text-[#FF7A1A]' : 'bg-[#FF7A1A] text-white'}`}>{badge}</span>
                  </div>
                )}
                <p className={`text-sm font-bold uppercase tracking-widest mb-3 ${highlight ? 'text-white/80' : 'text-neutral-400'}`}>{name}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-4xl font-black">{price}</p>
                  <p className={`text-sm line-through ${highlight ? 'text-white/50' : 'text-neutral-500'}`}>{oldPrice}</p>
                </div>
                <p className={`text-sm font-bold mb-5 ${highlight ? 'text-white' : 'text-neutral-200'}`}>{photos}</p>
                <ul className="flex flex-col gap-2.5 mb-8 flex-1 text-sm">
                  {[time, outfits, bg, res].map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className={`w-4 h-4 shrink-0 ${highlight ? 'text-white' : 'text-[#FF7A1A]'}`} />
                      <span className={highlight ? 'text-white/90' : 'text-neutral-300'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/wizard" className={`w-full text-center py-3 rounded-full font-black text-sm transition-all ${highlight ? 'bg-white text-[#FF7A1A] hover:bg-orange-50' : 'bg-[#FF7A1A] text-white hover:bg-[#e86c10]'}`}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-neutral-500 text-sm mt-8">Pagamento seguro · Garantia de 7 dias · Suporte em português</p>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="bg-[#0A0A0A] py-16 px-5">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10">
              <p className="text-white/70 text-sm font-semibold">Compare o FaceUp.AI com a contratação de um fotógrafo corporativo</p>
            </div>
            <div className="divide-y divide-white/5">
              <div className="grid grid-cols-3 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/40">
                <span></span>
                <span className="text-center text-[#FF7A1A]">Com FaceUp.AI</span>
                <span className="text-center">Fotógrafo</span>
              </div>
              {comparison.map(({ feature, faceup, photo }) => (
                <div key={feature} className="grid grid-cols-3 px-6 py-4 items-center">
                  <span className="text-[#FF7A1A] text-sm">{feature}</span>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-white text-sm">{faceup}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <X className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-white/50 text-sm">{photo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRESS ── */}
      <section className="bg-white py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-8">Temos estado nos noticiários:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {press.map(({ name, quote }) => (
              <div key={name} className="border border-neutral-200 rounded-2xl p-5 hover:border-[#FF7A1A]/30 hover:shadow-sm transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-black text-sm text-[#111111]">{name}</p>
                  <ExternalLink className="w-3.5 h-3.5 text-[#FF7A1A] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed">{quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY ── */}
      <section className="bg-neutral-50 py-16 px-5 border-y border-neutral-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-[#111111] mb-3">
              Mantemos os seus <span className="text-[#FF7A1A]">dados seguros.</span>
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed mb-6">
              No FaceUp.AI, a segurança e privacidade não são meras reflexões. Os seus dados merecem a melhor proteção. Utilizamos encriptação AES-256 para garantir que as suas fotos estejam seguras conosco.
            </p>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Nossa equipe vem de:</p>
            <div className="flex items-center gap-5 flex-wrap">
              {['Google', 'Meta', 'Microsoft', 'USP', 'FAPESP'].map((org) => (
                <span key={org} className="font-black text-neutral-400 text-sm">{org}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
              <Shield className="w-8 h-8 text-[#FF7A1A] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#111111] mb-1">Estamos em conformidade com os mais altos padrões.</p>
                <p className="text-xs text-neutral-400">Criptografia de ponta a ponta, servidores globais, conformidade com GDPR e LGPD.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
              <Lock className="w-8 h-8 text-[#FF7A1A] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#111111] mb-1">Você está no controle.</p>
                <p className="text-xs text-neutral-400">Como produto pago, o FaceUp.AI nunca usará suas fotos para treinar nenhum modelo de IA sem sua permissão.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
              <Check className="w-8 h-8 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#111111] mb-1">Segurança criada para empresas Fortune 500.</p>
                <p className="text-xs text-neutral-400">Infraestrutura usada por grandes corporações globais com 99.9% de uptime garantido.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-white py-20 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-[#FF7A1A] uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#111111]">Perguntas frequentes</h2>
          </div>
          <div className="divide-y divide-neutral-100">
            {faqs.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[#FF7A1A] py-20 px-5 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white max-w-2xl mx-auto mb-4">
          Sua foto profissional está a 10 minutos de distância
        </h2>
        <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
          Junte-se a mais de 2 milhões de profissionais que já transformaram seu perfil com FaceUp.AI
        </p>
        <Link href="/wizard" className="inline-flex items-center gap-2.5 bg-white text-[#FF7A1A] font-black text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.99] transition-all">
          Criar minhas fotos agora
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-white/60 text-sm mt-4">Sem assinatura · Pagamento único · Garantia de 7 dias</p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#111111] py-12 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-10">
            <div>
              <Link href="/"><Logo size={36} dark /></Link>
              <p className="text-neutral-400 text-sm mt-2 max-w-xs leading-relaxed">
                Fotos profissionais com Inteligência Artificial. Sem fotógrafo, sem estúdio, sem sair de casa.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-2 text-sm">
              <div className="flex flex-col gap-2">
                <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest mb-1">Produto</p>
                <Link href="#como-funciona" className="text-neutral-400 hover:text-white transition-colors">Como funciona</Link>
                <Link href="#galeria" className="text-neutral-400 hover:text-white transition-colors">Galeria</Link>
                <Link href="#precos" className="text-neutral-400 hover:text-white transition-colors">Preços</Link>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest mb-1">Legal</p>
                <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors">Privacidade</Link>
                <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors">Termos de uso</Link>
                <Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">Contato</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-neutral-500 text-sm">© 2024 FaceUp.AI — Todos os direitos reservados</p>
            <p className="text-neutral-600 text-xs">© FaceUp.AI — Tecnologia de IA para retratos profissionais</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
