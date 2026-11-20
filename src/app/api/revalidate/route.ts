import { revalidateTag } from 'next/cache'
import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'

/**
 * Clears the cached CMS data. Admin saves already do this through Payload
 * hooks; this endpoint is for scripts (seeds, imports) that write to the
 * database outside Next.js. Requires the PAYLOAD_SECRET in a header.
 */
export async function POST(request: Request) {
  const secret = process.env.PAYLOAD_SECRET ?? ''
  const given = request.headers.get('x-revalidate-secret') ?? ''
  const ok = secret.length > 0 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret))
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  revalidateTag('cms', { expire: 0 })
  return NextResponse.json({ revalidated: true })
}
