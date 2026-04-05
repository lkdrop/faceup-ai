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

// ─── Types ──────────────────────────────────────────────────────────────────
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

// ─── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
  sub?: string
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</span>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', color)}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-black tracking-tight">{value}</p>
      {sub && <p className="text-xs text-white/30">{sub}</p>}
    </div>
  )
}

// ─── Status Badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    pending:    { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pendente' },
    training:   { bg: 'bg-blue-500/10',   text: 'text-blue-400',   label: 'Treinando' },
    generating: { bg: 'bg-purple-500/10',  text: 'text-purple-400', label: 'Gerando' },
    done:       { bg: 'bg-green-500/10',   text: 'text-green-400',  label: 'Concluído' },
    failed:     { bg: 'bg-red-500/10',     text: 'text-red-400',    label: 'Falhou' },
  }
  const c = config[status] || { bg: 'bg-white/5', text: 'text-white/40', label: status }
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', c.bg, c.text)}>
      {c.label}
    </span>
  )
}

// ─── Plan Badge ─────────────────────────────────────────────────────────────
function PlanBadge({ plan }: { plan: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    essential:    { bg: 'bg-white/5',      text: 'text-white/60' },
    professional: { bg: 'bg-[#FF7A1A]/10', text: 'text-[#FF7A1A]' },
    premium:      { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  }
  const c = config[plan] || { bg: 'bg-white/5', text: 'text-white/40' }
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold capitalize', c.bg, c.text)}>
      {plan}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
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

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      if (data.stats) setStats(data.stats)
      if (data.recentOrders) setRecentOrders(data.recentOrders)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
    setLoading(false)
  }, [])

  // Fetch paginated orders
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(ordersPage),
        status: filterStatus,
        plan: filterPlan,
      })
      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      if (data.orders) setAllOrders(data.orders)
      if (data.totalPages) setOrdersTotalPages(data.totalPages)
      if (data.total !== undefined) setOrdersTotal(data.total)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
    setOrdersLoading(false)
  }, [ordersPage, filterStatus, filterPlan])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => {
    if (tab === 'orders') fetchOrders()
  }, [tab, fetchOrders])

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'orders',    label: 'Pedidos',   icon: ShoppingCart },
    { key: 'settings',  label: 'Config',    icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-white/60" />
            </Link>
            <div className="h-4 w-px bg-white/[0.08]" />
            <span className="text-sm font-semibold text-white/60">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchStats(); if (tab === 'orders') fetchOrders() }}
              className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] flex items-center justify-center transition-colors"
            >
              <RefreshCw className={cn('w-4 h-4 text-white/60', loading && 'animate-spin')} />
            </button>
            <Link href="/"><Logo size={28} dark /></Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 -mb-px overflow-x-auto scrollbar-none">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  tab === t.key
                    ? 'border-[#FF7A1A] text-white'
                    : 'border-transparent text-white/40 hover:text-white/60'
                )}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ─── Dashboard Tab ─── */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {loading && !stats ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-white/[0.03] border border-white/[0.07] animate-pulse" />
                ))}
              </div>
            ) : stats && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <StatCard label="Total Pedidos" value={stats.totalOrders} icon={ShoppingCart} color="bg-blue-500/20" />
                  <StatCard label="Concluídos" value={stats.completedOrders} icon={CheckCircle} color="bg-green-500/20" />
                  <StatCard label="Em Progresso" value={stats.trainingOrders} icon={Clock} color="bg-purple-500/20" />
                  <StatCard label="Falharam" value={stats.failedOrders} icon={AlertTriangle} color="bg-red-500/20" />
                  <StatCard label="Pendentes" value={stats.pendingOrders} icon={Users} color="bg-yellow-500/20" />
                  <StatCard
                    label="Receita Total"
                    value={`R$ ${stats.totalRevenue.toLocaleString('pt-BR')}`}
                    icon={DollarSign}
                    color="bg-[#FF7A1A]/20"
                    sub={`Ess: ${stats.planCounts.essential} | Pro: ${stats.planCounts.professional} | Prem: ${stats.planCounts.premium}`}
                  />
                </div>

                {/* Plan Distribution */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Distribuicao por Plano</h3>
                  <div className="flex gap-3">
                    {(['essential', 'professional', 'premium'] as const).map(plan => {
                      const count = stats.planCounts[plan]
                      const total = stats.totalOrders || 1
                      const pct = Math.round((count / total) * 100)
                      const colors = {
                        essential: 'bg-white/10',
                        professional: 'bg-[#FF7A1A]/30',
                        premium: 'bg-amber-500/30',
                      }
                      return (
                        <div key={plan} className="flex-1">
                          <div className="flex items-baseline justify-between mb-2">
                            <span className="text-sm font-semibold capitalize text-white/70">{plan}</span>
                            <span className="text-xs text-white/30">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                            <div className={cn('h-full rounded-full transition-all', colors[plan])} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">Pedidos Recentes</h3>
                    <button onClick={() => setTab('orders')} className="text-xs text-[#FF7A1A] hover:underline">Ver todos</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase">ID</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase">Plano</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase">Status</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase hidden sm:table-cell">Fotos</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase hidden md:table-cell">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.slice(0, 10).map(order => (
                          <tr key={order.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3 font-mono text-xs text-white/50">{order.id.slice(0, 8)}...</td>
                            <td className="px-5 py-3"><PlanBadge plan={order.plan} /></td>
                            <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                            <td className="px-5 py-3 text-white/40 hidden sm:table-cell">
                              <div className="flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5" />
                                {order.result_images?.length || 0}
                              </div>
                            </td>
                            <td className="px-5 py-3 text-white/30 text-xs hidden md:table-cell">
                              {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        ))}
                        {recentOrders.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-5 py-10 text-center text-white/20">
                              Nenhum pedido ainda.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── Orders Tab ─── */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filterStatus}
                onChange={e => { setFilterStatus(e.target.value); setOrdersPage(1) }}
                className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-[#FF7A1A]/40"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="training">Treinando</option>
                <option value="generating">Gerando</option>
                <option value="done">Concluído</option>
                <option value="failed">Falhou</option>
              </select>
              <select
                value={filterPlan}
                onChange={e => { setFilterPlan(e.target.value); setOrdersPage(1) }}
                className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-sm text-white/70 focus:outline-none focus:border-[#FF7A1A]/40"
              >
                <option value="all">Todos os planos</option>
                <option value="essential">Essential</option>
                <option value="professional">Professional</option>
                <option value="premium">Premium</option>
              </select>
              <span className="text-xs text-white/30 self-center ml-auto">{ordersTotal} pedidos</span>
            </div>

            {/* Orders Table */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
              {ordersLoading ? (
                <div className="p-10 text-center text-white/20 animate-pulse">Carregando pedidos...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase">ID</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase">Plano</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase hidden sm:table-cell">Fotos</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase hidden sm:table-cell">Stripe</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase hidden md:table-cell">Tune ID</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase">Data</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/30 uppercase hidden lg:table-cell">Resultado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrders.map(order => (
                        <tr key={order.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3 font-mono text-xs text-white/50">{order.id.slice(0, 8)}</td>
                          <td className="px-5 py-3"><PlanBadge plan={order.plan} /></td>
                          <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                          <td className="px-5 py-3 text-white/40 hidden sm:table-cell">
                            <div className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" />{order.result_images?.length || 0}</div>
                          </td>
                          <td className="px-5 py-3 hidden sm:table-cell">
                            {order.stripe_payment_intent ? (
                              <span className="text-green-400/70 text-xs font-mono">{order.stripe_payment_intent.slice(0, 12)}...</span>
                            ) : (
                              <span className="text-white/15 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-white/30 text-xs font-mono hidden md:table-cell">
                            {order.tune_id || '-'}
                          </td>
                          <td className="px-5 py-3 text-white/30 text-xs whitespace-nowrap">
                            {new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </td>
                          <td className="px-5 py-3 hidden lg:table-cell">
                            {order.status === 'done' && order.result_images?.length ? (
                              <Link href={`/results/${order.id}`} className="inline-flex items-center gap-1 text-xs text-[#FF7A1A] hover:underline">
                                Ver <ExternalLink className="w-3 h-3" />
                              </Link>
                            ) : (
                              <span className="text-white/15 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {allOrders.length === 0 && (
                        <tr>
                          <td colSpan={8} className="px-5 py-10 text-center text-white/20">
                            Nenhum pedido encontrado com esses filtros.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {ordersTotalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                  disabled={ordersPage <= 1}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] flex items-center justify-center transition-colors disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-white/40">
                  {ordersPage} / {ordersTotalPages}
                </span>
                <button
                  onClick={() => setOrdersPage(p => Math.min(ordersTotalPages, p + 1))}
                  disabled={ordersPage >= ordersTotalPages}
                  className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] flex items-center justify-center transition-colors disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Settings Tab ─── */}
        {tab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Precos dos Planos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { plan: 'Essential', price: 'R$ 49', photos: '40 fotos' },
                  { plan: 'Professional', price: 'R$ 69', photos: '80 fotos' },
                  { plan: 'Premium', price: 'R$ 99', photos: '120 fotos' },
                ].map(p => (
                  <div key={p.plan} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                    <p className="text-sm font-bold text-white/70">{p.plan}</p>
                    <p className="text-2xl font-black mt-1">{p.price}</p>
                    <p className="text-xs text-white/30 mt-1">{p.photos}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Informacoes Gerais</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                  <span className="text-white/40">Nome do Produto</span>
                  <span className="font-semibold">FaceUp.AI</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                  <span className="text-white/40">Moeda</span>
                  <span className="font-semibold">BRL (R$)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                  <span className="text-white/40">Gateway</span>
                  <span className="font-semibold">Stripe</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                  <span className="text-white/40">AI Provider</span>
                  <span className="font-semibold">Astria.ai</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                  <span className="text-white/40">Storage</span>
                  <span className="font-semibold">Supabase</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-white/40">Tempo de Entrega</span>
                  <span className="font-semibold text-[#FF7A1A]">~10 minutos</span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Links Rapidos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Stripe Dashboard', href: 'https://dashboard.stripe.com', icon: TrendingUp },
                  { label: 'Supabase Dashboard', href: 'https://supabase.com/dashboard', icon: Settings },
                  { label: 'Astria Dashboard', href: 'https://www.astria.ai/dashboard', icon: ImageIcon },
                  { label: 'Vercel Dashboard', href: 'https://vercel.com/dashboard', icon: ExternalLink },
                ].map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] rounded-xl p-4 transition-colors"
                  >
                    <link.icon className="w-5 h-5 text-white/30" />
                    <span className="text-sm font-medium text-white/60">{link.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/20 ml-auto" />
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
