// app/api/counts/route.ts (add try-catch for error handling)
import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { resources } from '@/lib/resources-data'

export async function GET() {
  try {
    const viewKeys = resources.map(r => `views:${r.id}`)
    const scoreKeys = resources.map(r => `scores:${r.id}`)

    const rawViews: (string | null)[] = await kv.mget(...viewKeys)
    const rawScores: (string | null)[] = await kv.mget(...scoreKeys)

    const views: { [id: string]: number } = {}
    const scores: { [id: string]: number } = {}

    resources.forEach((r, index) => {
      views[r.id] = parseInt(rawViews[index] ?? '0', 10) || 0
      scores[r.id] = parseInt(rawScores[index] ?? '0', 10) || 0
    })

    return NextResponse.json({ views, scores })
  } catch (error) {
    console.error('Error in /api/counts:', error)
    return NextResponse.json({ views: {}, scores: {}, error: 'Failed to fetch counts' }, { status: 500 })
  }
}