/**
 * GET /api/admin/orders
 * Returns all orders with filters for the admin panel.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    // Dev mode without Supabase → return empty data
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ orders: [], total: 0, page: 1, totalPages: 1 })
    }

    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const plan = searchParams.get('plan')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20
    const offset = (page - 1) * limit

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    if (plan && plan !== 'all') {
      query = query.eq('plan', plan)
    }

    const { data, count, error } = await query

    if (error) {
      console.error('Admin orders error:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json({
      orders: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (err) {
    console.error('Admin orders error:', err)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
