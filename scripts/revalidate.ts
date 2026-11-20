/**
 * Asks the running site to clear its cached CMS data, so content written by a
 * script shows up straight away. Safe to call when the site isn't running.
 *
 *   npm run revalidate
 */
import 'dotenv/config'

export async function revalidateSite() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  try {
    const response = await fetch(new URL('/api/revalidate', base), {
      method: 'POST',
      headers: { 'x-revalidate-secret': process.env.PAYLOAD_SECRET ?? '' },
    })
    console.log(response.ok ? `Cleared the site cache at ${base}` : `Could not clear the site cache (${response.status})`)
  } catch {
    console.log(`Site not reachable at ${base}; its cache will refresh on its own.`)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await revalidateSite()
