import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const newsletter = slug === 'newsletter'
  const formData = await request.formData()
  const website = String(formData.get('website') || '').trim()
  const redirect = (result: 'sent' | 'error') =>
    NextResponse.redirect(new URL(newsletter ? `/?newsletter=${result}#footer-newsletter` : `/contact-us/?${result}=1`, request.url), 303)

  if (website) return redirect('sent')

  if (newsletter) {
    const email = String(formData.get('email') || '').trim()
    if (email.length > 254 || !emailPattern.test(email)) return redirect('error')
  }

  try {
    const payload = await getPayload({ config })
    const result = newsletter ? null : await payload.find({
      collection: 'forms',
      where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
      limit: 1,
      depth: 0,
    })
    const form = result?.docs[0]
    if (!form && !newsletter && slug !== 'contact') return redirect('error')

    const fields = newsletter ? [{ name: 'email', type: 'email', required: true }] : form?.fields ?? [
      { name: 'name', label: 'Your name', type: 'text' as const, required: true },
      { name: 'email', label: 'Work email', type: 'email' as const, required: true },
      { name: 'company', label: 'Company', type: 'text' as const, required: false },
      { name: 'phone', label: 'Phone', type: 'tel' as const, required: false },
      { name: 'message', label: 'How can we help?', type: 'textarea' as const, required: true },
    ]

    const values: Record<string, string> = {}
    for (const field of fields) {
      const value = String(formData.get(field.name) || '').trim()
      if (field.required && !value) return redirect('error')
      if (field.type === 'email' && value && !emailPattern.test(value)) return redirect('error')
      values[field.name] = value
    }

    await payload.create({
      collection: 'contact-submissions',
      draft: false,
      data: {
        formSlug: form?.slug ?? slug,
        name: values.name || values.fullName || undefined,
        email: values.email || undefined,
        company: values.company || undefined,
        phone: values.phone || undefined,
        message: values.message || undefined,
        submissionData: values,
        status: 'new',
      },
    })
    return redirect('sent')
  } catch (error) {
    console.error('Unable to save form submission', error)
    return redirect('error')
  }
}
