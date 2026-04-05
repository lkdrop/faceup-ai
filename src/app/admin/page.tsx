'use client'

import { useState, useEffect, useCallback } from 'react'
import { Logo } from '@/components/logo'
import Link from 'next/link'
import {
  BarChart3, ShoppingCart, Settings, ArrowLeft, RefreshCw,
  TrendingUp, Users, CheckCircle, Clock, AlertTriangle, DollarSign,
  ChevronLeft, ChevronRight, ExternalLink, Image as ImageIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Stats {
  totalOrders: number
  completedOrders: number
  trainingOrders: number
  failedOrders: number
  pendingOrders: number
  totalRevenue: number
  planCounts: { essential: number; professional: number; premium: number }
}

interface Order {
  id: string
  plan: string
  status: string
  created_at: string
  stripe_payment_intent: string | null
  tune_id: string | null
  result_images: string[] | null
  wizard_data: Record<string, unknown> | null
}

type Tab = 'dashboard' | 'orders' | 'settings'

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{label}</span>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', color)}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">{value}</p>
      {sub && <p className="text-xs text-neutral-400">{sub}</p>}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    pending:    { bg: 'bg-amber-50',   text: 'text-amber-600',  label: 'Pendente' },
    training:   { bg: 'bg-blue-50',    text: 'text-blue-600',   label: 'Treinando' },
    generating: { bg: 'bg-purple-50',  text: 'text-purple-600', label: 'Gerando' },
    done:       { bg: 'bg-green-50',   text: 'text-green-600',  label: 'Concluído' },
    failed:     { bg: 'bg-red-50',     text: 'text-red-600',    label: 'Falhou' },
  }
  const c = config[status] || { bg: 'bg-neutral-100', text: 'text-neutral-500', label: status }
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', c.bg, c.text)}>
      {c.label}
    </span>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    essential:    { bg: 'bg-neutral-100',    text: 'text-neutral-600' },
    professional: { bg: 'bg-[#FF7A1A]/10',  text: 'text-[#FF7A1A]' },
    premium:      { bg: 'bg-amber-50',      text: 'text-amber-600' },
  }
  const c = config[plan] || { bg: 'bg-neutral-100', text: 'text-neutral-500' }
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold capitalize', c.bg, c.text)}>
      {plan}
    </span>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [ordersPage, setOrdersPage] = useState(1)
  const [ordersTotalPages, setOrdersTotalPages] = useState(1)
  const [ordersTotal, setOrdersTotal] = useState(0)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPlan, setFilterPlan] = useState('all')
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data.stats) setStats(data.stats)
      if (data.recentOrders) setRecentOrders(data.recentOrders)
    } catch (err) { console.error('Failed to fetch stats:', err) }
    setLoading(false)
  }, [])

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    try {
      const params = new URLSearchParams({ page: String(ordersPage), status: filterStatus, plan: filterPlan })
      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      if (data.orders) setAllOrders(data.orders)
      if (data.totalPages) setOrdersTotalPages(data.totalPages)
      if (data.total !== undefined) setOrdersTotal(data.total)
    } catch (err) { console.error('Failed to fetch orders:', err) }
    setOrdersLoading(false)
  }, [ordersPage, filterStatus, filterPlan])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { if (tab === 'orders') fetchOrders() }, [tab, fetchOrders])

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'orders',    label: 'Pedidos',   icon: ShoppingCart },
    { key: 'settings',  label: 'Config',    icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#111111]">

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-neutral-500" />
            </Link>
            <div className="h-4 w-px bg-neutral-200" />
            <span className="text-sm font-semibold text-neutral-500">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchStats(); if (tab === 'orders') fetchOrders() }}
              className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
            >
              <RefreshCw className={cn('w-4 h-4 text-neutral-500', loading && 'animate-spin')} />
            </button>
            <Link href="/"><Logo size={28} /></Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-none">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  tab === t.key
                    ? 'border-[#FF7A1A] text-[#111111]'
                    : 'border-transparent text-neutral-400 hover:text-neutral-600'
                )}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {tab === 'dashboard' && (
          <div className="space-y-6">
            {loading && !stats ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-white border border-neutral-200 animate-pulse" />
                ))}
              </div>
            ) : stats && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <StatCard label="Total Pedidos" value={stats.totalOrders} icon={ShoppingCart} color="bg-blue-500" />
                  <StatCard label="Concluídos" value={stats.completedOrders} icon={CheckCircle} color="bg-green-500" />
                  <StatCard label="Em Progresso" value={stats.trainingOrders} icon={Clock} color="bg-purple-500" />
                  <StatCard label="Falharam" value={stats.failedOrders} icon={AlertTriangle} color="bg-red-500" />
                  <StatCard label="Pendentes" value={stats.pendingOrders} icon={Users} color="bg-amber-500" />
                  <StatCard
                    label="Receita Total"
                    value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`}
                    icon={DollarSign}
                    color="bg-[#FF7A1A]"
                    sub={`Ess: ${stats.planCounts.essential} | Pro: ${stats.planCounts.professional} | Prem: ${stats.planCounts.premium}`}
                  />
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Distribuicao por Plano</h3>
                  <div className="flex gap-3">
                    {(['essential', 'professional', 'premium'] as const).map(plan => {
                      const count = stats.planCounts[plan]
                      const total = stats.totalOrders || 1
                      const pct = Math.round((count / total) * 100)
                      const colors = { essential: 'bg-neutral-300', professional: 'bg-[#FF7A1A]', premium: 'bg-amber-500' }
                      return (
                        <div key={plan} className="flex-1">
                          <div className="flex items-baseline justify-between mb-2">
                            <span className="text-sm font-semibold capitalize text-neutral-700">{plan}</span>
                            <span className="text-xs text-neutral-400">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                            <div className={cn('h-full rounded-full transition-all', colors[plan])} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Pedidos Recentes</h3>
                    <button onClick={() => setTab('orders')} className="text-xs text-[#FF7A1A] hover:underline font-semibold">Ver todos</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-100">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase">ID</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase">Plano</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase">Status</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase hidden sm:table-cell">Fotos</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase hidden md:table-cell">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.slice(0, 10).map(order => (
                          <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                            <td className="px-5 py-3 font-mono text-xs text-neutral-400">{order.id.slice(0, 8)}...</td>
                            <td className="px-5 py-3"><PlanBadge plan={order.plan} /></td>
                            <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                            <td className="px-5 py-3 text-neutral-400 hidden sm:table-cell">
                              <div className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" />{order.result_images?.length || 0}</div>
                            </td>
                            <td className="px-5 py-3 text-neutral-400 text-xs hidden md:table-cell">
                              {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        ))}
                        {recentOrders.length === 0 && (
                          <tr><td colSpan={5} className="px-5 py-10 text-center text-neutral-300">Nenhum pedido ainda.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setOrdersPage(1) }}
                className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-600 focus:outline-none focus:border-[#FF7A1A]">
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="training">Treinando</option>
                <option value="generating">Gerando</option>
                <option value="done">Concluído</option>
                <option value="failed">Falhou</option>
              </select>
              <select value={filterPlan} onChange={e => { setFilterPlan(e.target.value); setOrdersPage(1) }}
                className="bg-white border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-600 focus:outline-none focus:border-[#FF7A1A]">
                <option value="all">Todos os planos</option>
                <option value="essential">Essential</option>
                <option value="professional">Professional</option>
                <option value="premium">Premium</option>
              </select>
              <span className="text-xs text-neutral-400 self-center ml-auto">{ordersTotal} pedidos</span>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
              {ordersLoading ? (
                <div className="p-10 text-center text-neutral-300 animate-pulse">Carregando pedidos...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-100">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase">ID</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase">Plano</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase hidden sm:table-cell">Fotos</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase hidden sm:table-cell">Stripe</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase">Data</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-neutral-400 uppercase hidden lg:table-cell">Resultado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrders.map(order => (
                        <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs text-neutral-400">{order.id.slice(0, 8)}</td>
                          <td className="px-5 py-3"><PlanBadge plan={order.plan} /></td>
                          <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                          <td className="px-5 py-3 text-neutral-400 hidden sm:table-cell">
                            <div className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" />{order.result_images?.length || 0}</div>
                          </td>
                          <td className="px-5 py-3 hidden sm:table-cell">
                            {order.stripe_payment_intent
                              ? <span className="text-green-600 text-xs font-mono">{order.stripe_payment_intent.slice(0, 12)}...</span>
                              : <span className="text-neutral-300 text-xs">-</span>}
                          </td>
                          <td className="px-5 py-3 text-neutral-400 text-xs whitespace-nowrap">
                            {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </td>
                          <td className="px-5 py-3 hidden lg:table-cell">
                            {order.status === 'done' && order.result_images?.length ? (
                              <Link href={`/results/${order.id}`} className="inline-flex items-center gap-1 text-xs text-[#FF7A1A] hover:underline font-semibold">
                                Ver <ExternalLink className="w-3 h-3" />
                              </Link>
                            ) : <span className="text-neutral-300 text-xs">-</span>}
                          </td>
                        </tr>
                      ))}
                      {allOrders.length === 0 && (
                        <tr><td colSpan={7} className="px-5 py-10 text-center text-neutral-300">Nenhum pedido encontrado.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {ordersTotalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setOrdersPage(p => Math.max(1, p - 1))} disabled={ordersPage <= 1}
                  className="w-8 h-8 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center transition-colors disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-neutral-400">{ordersPage} / {ordersTotalPages}</span>
                <button onClick={() => setOrdersPage(p => Math.min(ordersTotalPages, p + 1))} disabled={ordersPage >= ordersTotalPages}
                  className="w-8 h-8 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center transition-colors disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[#111111] mb-4">Precos dos Planos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { plan: 'Essential', price: 'R$ 49', photos: '40 fotos' },
                  { plan: 'Professional', price: 'R$ 69', photos: '80 fotos' },
                  { plan: 'Premium', price: 'R$ 99', photos: '120 fotos' },
                ].map(p => (
                  <div key={p.plan} className="bg-[#FDF8F3] border border-neutral-200 rounded-xl p-4">
                    <p className="text-sm font-bold text-neutral-600">{p.plan}</p>
                    <p className="text-2xl font-black text-[#111111] mt-1">{p.price}</p>
                    <p className="text-xs text-neutral-400 mt-1">{p.photos}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[#111111] mb-4">Informacoes Gerais</h3>
              <div className="space-y-3 text-sm">
                {[
                  ['Nome do Produto', 'FaceUp.AI'],
                  ['Moeda', 'BRL (R$)'],
                  ['Gateway', 'Stripe'],
                  ['AI Provider', 'Astria.ai'],
                  ['Storage', 'Supabase'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-neutral-100">
                    <span className="text-neutral-400">{label}</span>
                    <span className="font-semibold text-[#111111]">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-400">Tempo de Entrega</span>
                  <span className="font-semibold text-[#FF7A1A]">~10 minutos</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-[#111111] mb-4">Links Rapidos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Stripe Dashboard', href: 'https://dashboard.stripe.com', icon: TrendingUp },
                  { label: 'Supabase Dashboard', href: 'https://supabase.com/dashboard', icon: Settings },
                  { label: 'Astria Dashboard', href: 'https://www.astria.ai/dashboard', icon: ImageIcon },
                  { label: 'Vercel Dashboard', href: 'https://vercel.com/dashboard', icon: ExternalLink },
                ].map(link => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#FDF8F3] border border-neutral-200 hover:border-[#FF7A1A]/30 rounded-xl p-4 transition-colors">
                    <link.icon className="w-5 h-5 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-600">{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-300 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
