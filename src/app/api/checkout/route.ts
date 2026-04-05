/**
 * POST /api/checkout
 * Creates a Stripe checkout session for the selected plan.
 * Stores the wizard data + uploaded photo URLs in a pending order.
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

const PRICES = {
  essential:    { amount: 4900,  label: 'FaceUp.AI Essencial — 40 fotos profissionais' },
  professional: { amount: 6900,  label: 'FaceUp.AI Profissional — 80 fotos profissionais' },
  premium:      { amount: 9900,  label: 'FaceUp.AI Premium — 120 fotos profissionais' },
} as const

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      plan,
      packKey,
      photoUrls,
      wizardData,
    } = body

    if (!plan || !PRICES[plan as keyof typeof PRICES]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    if (!photoUrls?.length) {
      return NextResponse.json({ error: 'No photo URLs provided' }, { status: 400 })
    }

    const stripe = getStripe()
    const supabase = createAdminClient()
    const priceInfo = PRICES[plan as keyof typeof PRICES]
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // 1 — Create pending order in DB
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        plan,
        pack_key: packKey || 'corporate-headshots',
        status: 'pending',
        photo_urls: photoUrls,
        wizard_data: wizardData || {},
        result_images: [],
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // 2 — Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: {
            name: priceInfo.label,
            images: [`${appUrl}/logo.svg`],
          },
          unit_amount: priceInfo.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${appUrl}/results/${order.id}?success=1`,
      cancel_url: `${appUrl}/wizard`,
      metadata: {
        order_id: order.id,
        plan,
        pack_key: packKey || 'corporate-headshots',
      },
      allow_promotion_codes: true,
    })

    // 3 — Store Stripe session ID in order
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    return NextResponse.json({ url: session.url, orderId: order.id })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
