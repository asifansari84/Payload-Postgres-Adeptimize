import type { CollectionConfig, Field, Tab } from 'payload'
import {
  DifferentiatorsBlock,
  FAQBlock,
  FeatureGridBlock,
  ImageAccordionBlock,
  LogoStripBlock,
  pageBlocks,
  ProcessBlock,
  ServiceCarouselBlock,
  TestimonialsBlock,
} from '../blocks/config'
import { headingField, imageField, linkField } from '../fields'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { aboutTabs, blogTabs, contactTabs, locationsPageTabs, servicesPageTabs } from './pageSections'

type SlugData = Partial<{ slug?: string | null }> | undefined
const isHome = (data: SlugData) => data?.slug === 'home'
/** Pages with a fixed set of section tabs; every other page uses the page builder. */
const FIXED_PAGES = ['home', 'about-us', 'contact-us', 'blog', 'our-services', 'location']
const isSlug = (slug: string) => (data: SlugData) => data?.slug === slug

/** Deep copy that keeps functions, so tabs never share field objects with the blocks. */
const clone = <T,>(value: T): T =>
  Array.isArray(value)
    ? (value.map(clone) as T)
    : value && typeof value === 'object'
      ? (Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clone(v)])) as T)
      : value

/** Top-level fields of a homepage tab are optional, so other pages never fail validation on hidden tabs. */
const optional = (fields: Field[]): Field[] =>
  fields.map((field) => {
    if (field.type === 'row') return { ...field, fields: optional(field.fields) }
    const { required: _r, minRows: _m, ...rest } = field as Field & { required?: boolean; minRows?: number }
    return rest as Field
  })

const homeTab = (name: string, label: string, description: string, fields: Field[]): Tab => ({
  name,
  label,
  description,
  fields: optional(clone(fields)),
})

export const pagePath = (slug?: string | null) => (!slug || slug === 'home' ? '/' : `/${slug}/`)

export const Pages: CollectionConfig = {
  slug: 'pages',
  defaultSort: 'title',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    listSearchableFields: ['title', 'slug'],
    description: 'Home, About Us, Our Services, Location, Blog and Contact Us. Each page has its sections in their own tabs.',
    preview: (doc) => (doc?.status === 'published' && typeof doc.slug === 'string' ? pagePath(doc.slug) : null),
    components: { beforeListTable: ['/components/admin/StatusTabs'] },
  },
  // Delete moves to Trash (restore or delete permanently from the Trash tab).
  trash: true,
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: 'published' } }),
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sections',
          fields: [
            {
              type: 'tabs',
              admin: { condition: (data) => isHome(data) },
              tabs: [
                {
                  name: 'hero',
                  label: 'Hero',
                  description: 'The top section of the homepage. Change any field and save; only what you edit is updated.',
                  fields: [
                    { name: 'subtitle', label: 'Sub title', type: 'text' },
                    headingField({ name: 'headline', label: 'Headline', admin: { description: 'Main homepage headline (shown as the H1). Wrap words in *asterisks* for the outlined style.' } }),
                    {
                      type: 'row',
                      fields: [
                        { name: 'leftHighlight', type: 'text', admin: { width: '50%', placeholder: 'Since 1998' } },
                        { name: 'rightHighlight', type: 'text', admin: { width: '50%', placeholder: 'A+ Rating' } },
                      ],
                    },
                    imageField(),
                  ],
                },
                {
                  name: 'trust',
                  label: 'Industry leaders',
                  description: 'Text with a button and a grid of client logos, shown below the hero.',
                  fields: [
                    headingField(),
                    { name: 'body', type: 'richText' },
                    linkField({ name: 'link', label: 'Button' }),
                    {
                      name: 'logos',
                      type: 'array',
                      labels: { singular: 'Logo', plural: 'Logos' },
                      admin: { initCollapsed: true },
                      fields: [
                        {
                          type: 'row',
                          fields: [
                            imageField({ name: 'logo', required: true, admin: { width: '50%' } }),
                            {
                              name: 'url',
                              label: 'Link (optional)',
                              type: 'text',
                              admin: { width: '50%', placeholder: 'https://', description: 'Opens in a new tab.' },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'problems',
                  label: 'Problems we solve',
                  description: 'A heading with numbered cards. Cards are numbered automatically.',
                  fields: [
                    headingField(),
                    {
                      name: 'items',
                      type: 'array',
                      labels: { singular: 'Card', plural: 'Cards' },
                      admin: { components: { RowLabel: '/components/admin/RowLabel#TitleRowLabel' } },
                      fields: [
                        { name: 'title', type: 'text', required: true },
                        { name: 'text', type: 'textarea', required: true },
                      ],
                    },
                  ],
                },
                homeTab('framework', 'Success framework', 'Dark section with numbered steps either side of an image.', ProcessBlock.fields),
                homeTab('differentiators', 'Differentiators', 'Full-width panels that stack as you scroll.', DifferentiatorsBlock.fields),
                homeTab('challenges', 'Market challenges', 'Heading beside image strips that expand on hover.', ImageAccordionBlock.fields),
                homeTab('solutions', 'Solution cards', 'Numbered cards shown under the market challenges.', FeatureGridBlock.fields),
                homeTab('testimonials', 'Testimonials', 'Client quote cards.', TestimonialsBlock.fields),
                homeTab('services', 'Services', 'Sliding row of service cards.', ServiceCarouselBlock.fields),
                homeTab('partners', 'Certifications & partners', 'Heading, intro and a row of partner logos.', LogoStripBlock.fields),
                homeTab('faq', 'FAQ', 'Numbered, expandable questions.', FAQBlock.fields),
              ],
            },
            { type: 'tabs', admin: { condition: isSlug('about-us') }, tabs: aboutTabs },
            { type: 'tabs', admin: { condition: isSlug('contact-us') }, tabs: contactTabs },
            { type: 'tabs', admin: { condition: isSlug('blog') }, tabs: blogTabs },
            { type: 'tabs', admin: { condition: isSlug('our-services') }, tabs: servicesPageTabs },
            { type: 'tabs', admin: { condition: isSlug('location') }, tabs: locationsPageTabs },
            {
              name: 'layout',
              label: 'Sections',
              type: 'blocks',
              blocks: pageBlocks,
              labels: { singular: 'Section', plural: 'Sections' },
              admin: {
                initCollapsed: true,
                description: 'Add, reorder and edit the sections of this page. Drag sections to change their order.',
                condition: (data) => !FIXED_PAGES.includes(data?.slug ?? ''),
              },
            },
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
                { name: 'title', label: 'Search title', type: 'text', admin: { description: 'Aim for about 60 characters. Defaults to the page title.' } },
                { name: 'description', label: 'Search description', type: 'textarea', admin: { description: 'Aim for about 160 characters.' } },
                { name: 'noIndex', type: 'checkbox', label: 'Hide from search engines' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'The page address, e.g. "about-us" or "contact-us". Use "home" for the homepage.',
      },
      validate: (value?: string | null) =>
        !value || /^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(value) || 'Use lowercase letters, numbers and dashes, with "/" between levels.',
    },
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
  ],
  timestamps: true,
}
