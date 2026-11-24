import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { NEWSLETTER_SLUG } from '@/forms/definitions'
import { getPublicForm } from '@/forms/server'
import { clientIp, rateLimit } from '@/forms/rateLimit'
import { validateSubmission } from '@/forms/validation'

/**
 * Receives every website form at /api/forms/<slug>.
 *
 * The site's forms submit with fetch and get JSON back. Without JavaScript the
 * browser posts normally and is redirected back with ?sent=1 / ?error=1.
 */

type Result = { ok: boolean; message: string; errors?: Record<string, string> }

const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/
/** A real person needs at least this long between page load and submit. */
const MIN_FILL_MS = 2000
const RATE = { limit: 8, windowMs: 10 * 60 * 1000 }
const MAX_BODY_BYTES = 64 * 1024

const GENERIC_ERROR = 'Sorry, we couldn’t send that. Please check the fields and try again.'

function respond(request: Request, slug: string, status: number, result: Result, headers?: HeadersInit) {
  if (request.headers.get('accept')?.includes('application/json')) {
    return NextResponse.json(result, { status, headers })
  }
  const outcome = result.ok ? 'sent' : 'error'
  const target = slug === NEWSLETTER_SLUG ? `/?newsletter=${outcome}#footer-newsletter` : `/contact-us?${outcome}=1#contact-form`
  return NextResponse.redirect(new URL(target, request.url), 303)
}

/** Rejects posts made from other websites. Browsers always send Origin on POST. */
function sameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === requestHost(request)
  } catch {
    return false
  }
}

const requestHost = (request: Request) => request.headers.get('x-forwarded-host') || request.headers.get('host')

/**
 * The page the form was sent from: the URL the site's script adds to the
 * submission, or the Referer header when the form was posted without
 * JavaScript. Only http(s) pages on this site are kept, without the #hash, so
 * the admin link is always a safe link back to this website.
 */
function sourceUrl(request: Request, submitted: FormDataEntryValue | null) {
  const candidates = [typeof submitted === 'string' ? submitted : '', request.headers.get('referer') || '']
  for (const candidate of candidates) {
    if (!candidate || candidate.length > 2000) continue
    try {
      const url = new URL(candidate)
      if (!['http:', 'https:'].includes(url.protocol) || url.host !== requestHost(request)) continue
      url.hash = ''
      return url.toString()
    } catch {
      // Not a URL: try the next candidate.
    }
  }
  return undefined
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const fail = (status: number, message = GENERIC_ERROR, errors?: Record<string, string>, headers?: HeadersInit) =>
    respond(request, slug, status, { ok: false, message, errors }, headers)

  if (!SLUG.test(slug)) return fail(404, 'This form does not exist.')
  if (!sameOrigin(request)) return fail(403)
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) return fail(413, 'That message is too long.')

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return fail(400)
  }

  try {
    const payload = await getPayload({ config })
    const form = await getPublicForm(payload, slug)
    if (!form) return fail(404, 'This form does not exist.')

    const success = (message?: string) =>
      respond(request, slug, 200, { ok: true, message: message || form.successMessage || 'Thanks. We received your submission.' })

    // Spam: the hidden "website" field is only filled in by bots, and people
    // take more than a moment to fill a form. Pretend it worked so bots move on.
    const startedAt = Number(formData.get('_ts'))
    if (String(formData.get('website') || '').trim()) return success()
    if (startedAt && Date.now() - startedAt < MIN_FILL_MS) return success()

    const limited = rateLimit(`${slug}:${clientIp(request)}`, RATE.limit, RATE.windowMs)
    if (!limited.ok) {
      return fail(429, 'Too many submissions. Please wait a few minutes and try again.', undefined, { 'Retry-After': String(limited.retryAfter) })
    }

    const { values, errors } = validateSubmission(form.fields, (name) => formData.get(name))
    if (Object.keys(errors).length) return fail(422, 'Please fix the highlighted fields.', errors)

    if (form.uniqueField === 'email' && values.email) {
      const existing = await payload.count({
        collection: 'contact-submissions',
        where: { and: [{ formSlug: { equals: slug } }, { email: { equals: values.email } }] },
      })
      if (existing.totalDocs > 0) return success('You’re already subscribed. Thanks!')
    }

    await payload.create({
      collection: 'contact-submissions',
      data: {
        formSlug: slug,
        // Common fields are copied to their own columns so the Leads list can search them.
        name: values.name || values.fullName || undefined,
        email: values.email || undefined,
        company: values.company || undefined,
        phone: values.phone || undefined,
        message: values.message || undefined,
        submissionData: values,
        sourceUrl: sourceUrl(request, formData.get('_source')),
        status: 'new',
      },
    })
    return success()
  } catch (error) {
    console.error(`Unable to save "${slug}" form submission`, error)
    return fail(500, 'Something went wrong on our side. Please try again later.')
  }
}
