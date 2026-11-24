import type { Payload } from 'payload'
import { BUILT_IN_FORMS, CONTACT_SLUG, DEFAULT_CONTACT_FORM, NEWSLETTER_FORM, NEWSLETTER_SLUG, fromCMSForm, type FormDefinition } from './definitions'

/**
 * The definition a public submission is checked against: the newsletter is
 * fixed in code, other forms must be published in the Forms collection, and
 * "contact" falls back to the built-in default.
 */
export async function getPublicForm(payload: Payload, slug: string): Promise<FormDefinition | null> {
  if (slug === NEWSLETTER_SLUG) return NEWSLETTER_FORM
  const { docs } = await payload.find({
    collection: 'forms',
    where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
    limit: 1,
    depth: 0,
  })
  if (docs[0]?.fields?.length) return fromCMSForm(docs[0])
  return slug === CONTACT_SLUG ? DEFAULT_CONTACT_FORM : null
}

/** Every form an administrator can see leads for (drafts included, newest CMS fields win). */
export async function getAllForms(payload: Payload): Promise<FormDefinition[]> {
  const { docs } = await payload.find({ collection: 'forms', limit: 100, depth: 0, pagination: false, sort: 'title' })
  const bySlug = new Map(BUILT_IN_FORMS.map((form) => [form.slug, form]))
  for (const doc of docs) {
    if (doc.slug === NEWSLETTER_SLUG || !doc.fields?.length) continue
    bySlug.set(doc.slug, fromCMSForm(doc))
  }
  return [...bySlug.values()]
}
