/**
 * POST /api/upload
 * Uploads selfies to Supabase Storage and returns public URLs.
 * Called from the wizard before checkout so we have URLs to pass to Astria.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export const runtime = 'nodejs'

const BUCKET = 'uploads'
const MAX_SIZE_MB = 15

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('photos') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    if (files.length > 20) {
      return NextResponse.json({ error: 'Too many files (max 20)' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Ensure bucket exists
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_SIZE_MB * 1024 * 1024,
    }).catch(() => {/* bucket already exists */})

    const uploadedUrls: string[] = []

    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const allowed = ['jpg', 'jpeg', 'png', 'webp', 'heic']
      if (!allowed.includes(ext)) continue

      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path = `selfies/${filename}`

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: false,
        })

      if (error) {
        console.error('Upload error:', error)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path)

      uploadedUrls.push(publicUrl)
    }

    if (!uploadedUrls.length) {
      return NextResponse.json({ error: 'All uploads failed' }, { status: 500 })
    }

    return NextResponse.json({ urls: uploadedUrls })
  } catch (err) {
    console.error('Upload route error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
