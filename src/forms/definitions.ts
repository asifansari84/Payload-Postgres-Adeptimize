/**
 * Form definitions shared by the website, the submission endpoint and the
 * admin Leads view. Safe to import in the browser (no server dependencies).
 *
 * Every form is identified by its slug. Submissions are stored in the
 * `contact-submissions` collection with that slug in `formSlug`, so each form's
 * leads stay separate. To add a form: create it in the Forms collection (its
 * fields are read from there), or add a built-in definition below.
 */

export type FieldType = 'text' | 'email' | 'tel' | 'textarea'

export type FormFieldDef = {
  name: string
  label: string
  type: FieldType
  required: boolean
}

export type FormDefinition = {
  slug: string
  title: string
  fields: FormFieldDef[]
  /** Each email address may only be submitted once (e.g. a newsletter signup). */
  uniqueField?: 'email'
  /** Show and edit the New / In progress / Resolved status for its leads. */
  trackStatus: boolean
  submitLabel?: string
  successMessage?: string
}

export const NEWSLETTER_SLUG = 'newsletter'
export const CONTACT_SLUG = 'contact'

/** Names used by the endpoint itself; a form field may not use them. */
export const RESERVED_FIELD_NAMES = ['website', '_ts', '_source']
export const FIELD_NAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]{0,39}$/

/** Fixed in code: the footer signup is one email field and cannot be edited in the CMS. */
export const NEWSLETTER_FORM: FormDefinition = {
  slug: NEWSLETTER_SLUG,
  title: 'Newsletter',
  fields: [{ name: 'email', label: 'Email', type: 'email', required: true }],
  uniqueField: 'email',
  trackStatus: false,
  successMessage: 'Thanks for subscribing.',
}

/** Used when no published "contact" form exists in the CMS. */
export const DEFAULT_CONTACT_FORM: FormDefinition = {
  slug: CONTACT_SLUG,
  title: 'Contact form',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
  ],
  trackStatus: true,
  submitLabel: 'Send message',
  successMessage: 'Thanks. Your message has been sent.',
}

/** Forms that exist in code, whether or not the CMS has a document for them. */
export const BUILT_IN_FORMS: FormDefinition[] = [DEFAULT_CONTACT_FORM, NEWSLETTER_FORM]

type CMSForm = {
  slug: string
  title: string
  fields?: { name: string; label: string; type: FieldType; required?: boolean | null }[] | null
  submitLabel?: string | null
  successMessage?: string | null
}

/** Turns a Forms collection document into a definition. */
export function fromCMSForm(form: CMSForm): FormDefinition {
  return {
    slug: form.slug,
    title: form.title,
    fields: (form.fields ?? []).map((f) => ({ name: f.name, label: f.label, type: f.type, required: Boolean(f.required) })),
    trackStatus: true,
    submitLabel: form.submitLabel || undefined,
    successMessage: form.successMessage || undefined,
  }
}

/** "companyName" / "company_name" -> "Company name", for fields no longer in a form. */
export function humanize(key: string) {
  const words = key.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim().toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}
