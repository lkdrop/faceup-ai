/**
 * POST /api/webhook
 * Handles Stripe webhooks.
 * On payment_intent.succeeded → start Astria fine-tuning.
 * On Astria tune completion → trigger image generation.
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase'
import { createTune, generateImages, getPackPrompts, imagesPerPrompt, PACKS, type PackKey } from '@/lib/astria'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  // ─── Astria Callback ─────────────────────────────────────────────────────
  // Astria sends a POST with tune or prompt data when training/generation finishes
  const isAstria = req.headers.get('content-type')?.includes('application/json') && !sig

  if (isAstria) {
    return handleAstriaCallback(body)
  }

  // ─── Stripe Webhook ───────────────────────────────────────────────────────
  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  const stripe = getStripe()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    await handlePaymentSuccess(session)
  }

  return NextResponse.json({ received: true })
}

// ─── Payment Success → Start Astria Training ──────────────────────────────
async function handlePaymentSuccess(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id
  const plan = session.metadata?.plan as 'essential' | 'professional' | 'premium'
  const packKey = (session.metadata?.pack_key || 'corporate-headshots') as PackKey

  if (!orderId) {
    console.error('No order_id in Stripe metadata')
    return
  }

  const supabase = createAdminClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://faceup.ai'

  // Get order
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !order) {
    console.error('Order not found:', orderId)
    return
  }

  // Mark as paid
  await supabase
    .from('orders')
    .update({
      status: 'training',
      stripe_payment_intent: session.payment_intent as string,
    })
    .eq('id', orderId)

  try {
    const pack = PACKS[packKey]
    const callbackUrl = `${appUrl}/api/webhook?astria=1&order_id=${orderId}&plan=${plan}&pack_key=${packKey}`

    // Create Astria fine-tune
    const tune = await createTune({
      title: `FaceUp-${orderId.slice(0, 8)}`,
      packId: pack.id,
      imageUrls: order.photo_urls || [],
      callbackUrl,
    })

    await supabase
      .from('orders')
      .update({ tune_id: String(tune.id), status: 'training' })
      .eq('id', orderId)

    console.log(`✅ Astria tune created: ${tune.id} for order ${orderId}`)
  } catch (err) {
    console.error('Astria tune creation failed:', err)
    await supabase
      .from('orders')
      .update({ status: 'failed' })
      .eq('id', orderId)
  }
}

// ─── Astria Callback → Generate Prompts (or collect images) ──────────────
async function handleAstriaCallback(body: string) {
  try {
    const data = JSON.parse(body)
    const req2 = new URL('https://x.com' + (data.callback || ''))
    const orderId = req2.searchParams.get('order_id')
    const plan = req2.searchParams.get('plan') as 'essential' | 'professional' | 'premium'
    const packKey = (req2.searchParams.get('pack_key') || 'corporate-headshots') as PackKey

    if (!orderId) return NextResponse.json({ ok: true })

    const supabase = createAdminClient()

    // Tune completed → generate images
    if (data.trained_at && !data.images) {
      const { data: order } = await supabase
        .from('orders')
        .select('wizard_data, tune_id')
        .eq('id', orderId)
        .single()

      if (!order?.tune_id) return NextResponse.json({ ok: true })

      const gender = order.wizard_data?.gender || 'male'
      const prompts = getPackPrompts(packKey, gender)
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://faceup.ai'
      const imgCallbackUrl = `${appUrl}/api/webhook?astria=1&order_id=${orderId}&is_images=1`
      const numImg = imagesPerPrompt(plan, prompts.length)

      await supabase
        .from('orders')
        .update({ status: 'generating' })
        .eq('id', orderId)

      await generateImages({
        tuneId: order.tune_id,
        prompts,
        numImages: numImg,
        callbackUrl: imgCallbackUrl,
      })

      console.log(`✅ Prompts queued for order ${orderId}`)
    }

    // Prompt images received
    if (data.images && Array.isArray(data.images)) {
      const newUrls = data.images.map((img: { url: string }) => img.url)

      const { data: order } = await supabase
        .from('orders')
        .select('result_images')
        .eq('id', orderId)
        .single()

      const existing = order?.result_images || []
      const merged = [...existing, ...newUrls]

      await supabase
        .from('orders')
        .update({
          result_images: merged,
          status: 'done',
        })
        .eq('id', orderId)

      console.log(`✅ ${newUrls.length} images stored for order ${orderId}`)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Astria callback error:', err)
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 })
  }
}
