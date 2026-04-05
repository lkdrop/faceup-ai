/**
 * GET /api/results?order_id=xxx
 * Returns the current status and result images for an order.
 * Polled by the results page every 15 seconds.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { getTune, generateImages, getPackPrompts, imagesPerPrompt, type PackKey } from '@/lib/astria'

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('order_id')

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // If training, check Astria for tune status
  if (order.status === 'training' && order.tune_id) {
    try {
      const tune = await getTune(order.tune_id)

      if (tune.trained_at && order.status !== 'generating' && order.status !== 'done') {
        // Training done → start generation
        const packKey = (order.pack_key || 'corporate-headshots') as PackKey
        const gender = order.wizard_data?.gender || 'male'
        const plan = order.plan as 'essential' | 'professional' | 'premium'
        const prompts = getPackPrompts(packKey, gender)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://faceup.ai'
        const callbackUrl = `${appUrl}/api/webhook?astria=1&order_id=${orderId}&is_images=1`
        const numImg = imagesPerPrompt(plan, prompts.length)

        await supabase
          .from('orders')
          .update({ status: 'generating' })
          .eq('id', orderId)

        await generateImages({
          tuneId: order.tune_id,
          prompts,
          numImages: numImg,
          callbackUrl,
        })

        order.status = 'generating'
      }

      // If prompts exist with images, collect them
      if (tune.prompts?.length) {
        const allImages: string[] = []
        for (const prompt of tune.prompts) {
          for (const img of prompt.images || []) {
            allImages.push(img.url)
          }
        }

        if (allImages.length > 0 && order.status !== 'done') {
          await supabase
            .from('orders')
            .update({ result_images: allImages, status: 'done' })
            .eq('id', orderId)

          order.result_images = allImages
          order.status = 'done'
        }
      }
    } catch (err) {
      console.error('Astria poll error:', err)
    }
  }

  // If generating, check if tune has images now
  if (order.status === 'generating' && order.tune_id && !order.result_images?.length) {
    try {
      const tune = await getTune(order.tune_id)
      const allImages: string[] = []

      for (const prompt of tune.prompts || []) {
        for (const img of prompt.images || []) {
          allImages.push(img.url)
        }
      }

      if (allImages.length > 0) {
        await supabase
          .from('orders')
          .update({ result_images: allImages, status: 'done' })
          .eq('id', orderId)

        order.result_images = allImages
        order.status = 'done'
      }
    } catch (err) {
      console.error('Astria generation poll error:', err)
    }
  }

  return NextResponse.json({
    id: order.id,
    status: order.status,
    plan: order.plan,
    resultImages: order.result_images || [],
    createdAt: order.created_at,
    tuneId: order.tune_id,
  })
}
