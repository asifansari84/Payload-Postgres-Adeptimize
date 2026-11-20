import { slugField, type CollectionConfig, type Field, type Tab } from 'payload'
import { imageField } from '../fields'
import { revalidateHooks } from '../hooks/revalidate'

/**
 * Shared shape for Services and Locations: a name, an address, the page
 * sections (each in its own tab), a listing card and search settings.
 */
export function listingCollection({
  slug,
  singular,
  plural,
  path,
  description,
  sections,
  cardFields = [],
}: {
  slug: string
  singular: string
  plural: string
  path: (slug: string) => string
  description: string
  sections: Tab[]
  cardFields?: Field[]
}): CollectionConfig {
  return {
    slug,
    labels: { singular, plural },
    defaultSort: 'order',
    admin: {
      group: 'Content',
      useAsTitle: 'title',
      defaultColumns: ['title', 'slug', 'status', 'order', 'updatedAt'],
      listSearchableFields: ['title', 'slug'],
      description,
      preview: (doc) => (doc?.status === 'published' && typeof doc.slug === 'string' ? path(doc.slug) : null),
    },
    hooks: revalidateHooks,
    access: {
      read: ({ req }) => (req.user ? true : { status: { equals: 'published' } }),
    },
    fields: [
      { name: 'title', type: 'text', required: true },
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Sections',
            description: 'Each section of the page has its own tab. Empty sections are hidden.',
            fields: [{ type: 'tabs', tabs: sections }],
          },
          {
            label: 'Listing card',
            description: `How this ${singular.toLowerCase()} appears on the ${plural} page.`,
            fields: [
              { name: 'summary', type: 'textarea', admin: { description: 'A sentence or two shown on the card.' } },
              imageField({ name: 'cardImage', label: 'Card image' }),
              ...cardFields,
            ],
          },
          {
            label: 'SEO',
            fields: [
              {
                name: 'seo',
                type: 'group',
                label: false,
                fields: [
                  { name: 'title', label: 'Search title', type: 'text', admin: { description: 'Aim for about 60 characters. Defaults to the name.' } },
                  { name: 'description', label: 'Search description', type: 'textarea', admin: { description: 'Aim for about 160 characters.' } },
                  { name: 'noIndex', type: 'checkbox', label: 'Hide from search engines' },
                ],
              },
            ],
          },
        ],
      },
      slugField(),
      {
        name: 'status',
        type: 'select',
        required: true,
        defaultValue: 'draft',
        admin: { position: 'sidebar' },
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Published', value: 'published' },
        ],
      },
      { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar', description: 'Lower numbers are listed first.' } },
    ],
    timestamps: true,
  }
}
