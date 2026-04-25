import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { id, type } = await request.json()
    if (!id || !['like', 'dislike'].includes(type)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

    const voteKey = `vote:${id}:${ipHash}`
    const lastVote = await kv.get<number>(voteKey)

    const now = Date.now()
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000

    if (lastVote && now - lastVote < oneWeekMs) {
      const remainingMs = oneWeekMs - (now - lastVote)
      const nextVoteDate = new Date(now + remainingMs).toLocaleString()
      return NextResponse.json({ 
        error: 'You can only vote once per week',
        nextVoteDate 
      }, { status: 429 })
    }

    const increment = type === 'like' ? 1 : -1
    const newScore = await kv.incrby(`scores:${id}`, increment)

    await kv.set(voteKey, now, { ex: oneWeekMs / 1000 })

    const nextVoteDate = new Date(now + oneWeekMs).toLocaleString()

    return NextResponse.json({ 
      success: true,
      newScore,
      nextVoteDate
    })
  } catch (error) {
    console.error('Error in /api/vote:', error)
    return NextResponse.json({ success: false, error: 'Failed to process vote' }, { status: 500 })
  }
}