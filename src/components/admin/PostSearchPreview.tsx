'use client'

import { useFormFields } from '@payloadcms/ui'

export default function PostSearchPreview({ legacySlugs }: { legacySlugs: string[] }) {
  const title = useFormFields(([fields]) => String(fields['seo.title']?.value || fields.title?.value || 'Post title'))
  const description = useFormFields(([fields]) => String(fields['seo.description']?.value || fields.excerpt?.value || 'Add an excerpt or search description.'))
  const canonical = useFormFields(([fields]) => String(fields['seo.canonicalURL']?.value || ''))
  const slug = useFormFields(([fields]) => String(fields.slug?.value || 'post-slug'))
  const route = canonical || `${legacySlugs.includes(slug) ? '' : '/blog'}/${encodeURIComponent(slug)}`
  const noIndex = useFormFields(([fields]) => Boolean(fields['seo.noIndex']?.value))

  return (
    <section className="adeptimize-search-preview" aria-label="Search result preview">
      <h2>Search result preview</h2>
      <span className="adeptimize-search-preview__url">{route}</span>
      <strong className="adeptimize-search-preview__title">{title}</strong>
      <p>{description}</p>
      <small>{noIndex ? 'Search indexing is disabled. ' : ''}Title {title.length}/60 · Description {description.length}/160</small>
    </section>
  )
}
