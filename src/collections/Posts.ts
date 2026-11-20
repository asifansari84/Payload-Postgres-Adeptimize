import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { hasText } from '@payloadcms/richtext-lexical/shared'
import { slugField, ValidationError, type CollectionConfig } from 'payload'
import archive from '../content/adeptimize-post-manifest.json'
import { postHref } from '../lib/postMetadata'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

const imagesOnly = { mimeType: { contains: 'image/' } }

export const Posts: CollectionConfig = {
  slug: 'posts',
  defaultSort: '-updatedAt',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'featuredImage', 'publishedAt', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'excerpt'],
    description: 'Write and publish blog posts, and control how they appear in search and social shares.',
    preview: (post) => post?.status === 'published' && typeof post.slug === 'string' ? postHref(post.slug) : null,
  },
  access: {
    read: ({ req }) => req.user ? true : { status: { equals: 'published' } },
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
    beforeValidate: [
      ({ data, originalDoc }) => {
        if (data?.status === 'published' && !data.publishedAt && !originalDoc?.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        const post = { ...originalDoc, ...data }
        if (post.status === 'published' && !hasText(post.richContent) && !post.content?.trim() && !post.sourceHtml?.trim()) {
          throw new ValidationError({ errors: [{ path: 'richContent', message: 'Add an article body before publishing.' }] })
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            { name: 'title', type: 'text', required: true },
            slugField(),
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              admin: { description: 'Short summary for the blog listing and the default search description.' },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              filterOptions: imagesOnly,
              admin: { description: 'Shown on the article, blog listing, and social previews by default.' },
            },
            {
              name: 'richContent',
              label: 'Article body',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
              }),
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'searchPreview',
              type: 'ui',
              admin: { components: { Field: {
                path: '/components/admin/PostSearchPreview',
                clientProps: { legacySlugs: archive.map(({ slug }) => slug) },
              } } },
            },
            {
              name: 'seo',
              type: 'group',
              label: false,
              fields: [
                { name: 'title', label: 'Search title', type: 'text', admin: { description: 'Aim for about 60 characters. Defaults to the post title.' } },
                { name: 'description', label: 'Search description', type: 'textarea', admin: { description: 'Aim for about 160 characters. Defaults to the excerpt.' } },
                {
                  name: 'canonicalURL',
                  label: 'Canonical URL',
                  type: 'text',
                  admin: { description: 'Use an absolute URL only when a different page should be treated as the original.' },
                  validate: (value?: string | null) => {
                    if (!value) return true
                    try {
                      return ['http:', 'https:'].includes(new URL(value).protocol) || 'Enter a valid HTTP or HTTPS URL.'
                    } catch {
                      return 'Enter a valid HTTP or HTTPS URL.'
                    }
                  },
                },
                { name: 'noIndex', type: 'checkbox', label: 'Hide from search engines' },
                { name: 'noFollow', type: 'checkbox', label: 'Ask search engines not to follow links on this page' },
                { name: 'socialTitle', type: 'text', admin: { description: 'Optional override for the search title when shared.' } },
                { name: 'socialDescription', type: 'textarea', admin: { description: 'Optional override for the search description when shared.' } },
                { name: 'socialImage', type: 'upload', relationTo: 'media', filterOptions: imagesOnly, admin: { description: 'Defaults to the featured image. An image around 1200 × 630 px works well.' } },
              ],
            },
          ],
        },
        {
          label: 'Legacy content',
          fields: [
            { name: 'content', type: 'textarea', label: 'Legacy article body', admin: { description: 'Text used by older posts without a rich article body.' } },
            {
              name: 'sourceHtml',
              type: 'textarea',
              maxLength: 2_000_000,
              admin: { description: 'Older imported markup. Rich article content takes precedence when present.', rows: 8 },
            },
          ],
        },
      ],
    },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }],
    },
    { name: 'author', type: 'text', admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
  ],
  timestamps: true,
}
