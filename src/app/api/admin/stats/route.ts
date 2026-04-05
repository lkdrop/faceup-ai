/**
 * GET /api/admin/stats
 * Returns dashboard statistics for the admin panel.
 */
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  try {
    // Dev mode without Supabase → return mock data
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({
        stats: {
          totalOrders: 0, completedOrders: 0, trainingOrders: 0,
          failedOrders: 0, pendingOrders: 0, totalRevenue: 0,
          planCounts: { essential: 0, professional: 0, premium: 0 },
        },
        recentOrders: [],
      })
    }

    const supabase = createAdminClient()

    // Total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })

    // Completed orders
    const { count: completedOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'done')

    // Training orders
    const { count: trainingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['training', 'generating'])

    // Failed orders
    const { count: failedOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed')

    // Pending orders
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Revenue calculation (from completed stripe payments)
    const { data: revenueData } = await supabase
      .from('orders')
      .select('plan')
      .not('stripe_payment_intent', 'is', null)

    const PRICES = { essential: 49, professional: 69, premium: 99 }
    const totalRevenue = (revenueData || []).reduce((sum, order) => {
      return sum + (PRICES[order.plan as keyof typeof PRICES] || 0)
    }, 0)

    // Recent orders
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    // Orders by plan
    const planCounts = { essential: 0, professional: 0, premium: 0 }
    for (const o of revenueData || []) {
      const p = o.plan as keyof typeof planCounts
      if (planCounts[p] !== undefined) planCounts[p]++
    }

    return NextResponse.json({
      stats: {
        totalOrders: totalOrders || 0,
        completedOrders: completedOrders || 0,
        trainingOrders: trainingOrders || 0,
        failedOrders: failedOrders || 0,
        pendingOrders: pendingOrders || 0,
        totalRevenue,
        planCounts,
      },
      recentOrders: recentOrders || [],
    })
  } catch (err) {
    console.error('Admin stats error:', err)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
