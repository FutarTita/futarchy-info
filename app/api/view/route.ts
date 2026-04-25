// app/api/view/route.ts (add try-catch)
import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export async function POST(request: Request) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await kv.incr(`views:${id}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in /api/view:', error)
    return NextResponse.json({ success: false, error: 'Failed to process view' }, { status: 500 })
  }
}