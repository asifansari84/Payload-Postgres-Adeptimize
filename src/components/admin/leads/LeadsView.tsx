import type { ListViewServerProps } from 'payload'
import { humanize, type FormDefinition } from '@/forms/definitions'
import { getAllForms } from '@/forms/server'
import { LeadsManager, type LeadForm } from './LeadsManager'

const COLLECTION = 'contact-submissions'

/**
 * Replaces the Leads list: one tab per form with its submission count, and a
 * table whose columns are that form's own fields.
 */
export default async function LeadsView({ payload, user, permissions, searchParams }: ListViewServerProps) {
  if (!user) return null

  const definitions = await getAllForms(payload).catch(() => [] as FormDefinition[])

  // Leads can outlive their form (e.g. a form that was deleted). Show those too,
  // with columns taken from the submitted values.
  const stored = await payload
    .findDistinct({ collection: COLLECTION, field: 'formSlug', limit: 100, user, overrideAccess: false })
    .then((r) => r.values.map((v) => v.formSlug).filter((slug): slug is string => typeof slug === 'string'))
    .catch(() => [] as string[])
  const known = new Set(definitions.map((d) => d.slug))
  const orphans: FormDefinition[] = stored
    .filter((slug) => !known.has(slug))
    .map((slug) => ({ slug, title: humanize(slug), fields: [], trackStatus: true }))

  const forms: LeadForm[] = await Promise.all(
    [...definitions, ...orphans].map(async (form) => ({
      ...form,
      total: await payload
        .count({ collection: COLLECTION, where: { formSlug: { equals: form.slug } }, user, overrideAccess: false })
        .then((r) => r.totalDocs)
        .catch(() => 0),
    })),
  )

  const requested = typeof searchParams?.form === 'string' ? searchParams.form : undefined
  const initial = forms.find((f) => f.slug === requested) ?? forms.find((f) => f.total > 0) ?? forms[0]

  return (
    <LeadsManager
      forms={forms}
      initialForm={initial?.slug ?? ''}
      canDelete={Boolean(permissions?.collections?.[COLLECTION]?.delete)}
      canUpdate={Boolean(permissions?.collections?.[COLLECTION]?.update)}
    />
  )
}
