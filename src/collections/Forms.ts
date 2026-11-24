import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'
import { FIELD_NAME_PATTERN, NEWSLETTER_SLUG, RESERVED_FIELD_NAMES } from '../forms/definitions'

const validateSlug = (value: unknown) => {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(value)) return 'Use lowercase letters, numbers and dashes only.'
  if (value === NEWSLETTER_SLUG) return 'The newsletter form is built in and cannot be edited here.'
  return true
}

const validateFieldName = (value: unknown, { data }: { data?: { fields?: { name?: string }[] | null } }) => {
  if (typeof value !== 'string' || !FIELD_NAME_PATTERN.test(value)) return 'Start with a letter; use letters, numbers and underscores only.'
  if (RESERVED_FIELD_NAMES.includes(value)) return `"${value}" is reserved. Choose another name.`
  if ((data?.fields?.filter((field) => field.name === value).length ?? 0) > 1) return 'Each field needs a different name.'
  return true
}

export const Forms: CollectionConfig = {
  slug: 'forms',
  labels: {
    singular: 'Contact form',
    plural: 'Contact form',
  },
  admin: {
    group: 'Forms and Submissions',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    description: 'Manage the fields and confirmation text for website forms. The footer newsletter signup is built in.',
  },
  access: {
    read: ({ req }) => req.user ? true : { status: { equals: 'published' } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, validate: validateSlug, admin: { description: 'Unique form ID, used in the form address. "contact" is the main contact form.' } },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'fields', type: 'array', required: true, minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true, validate: validateFieldName, admin: { description: 'Used as the submitted field key, e.g. "email" or "company".' } },
        { name: 'label', type: 'text', required: true },
        {
          name: 'type', type: 'select', required: true, defaultValue: 'text',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'tel' },
            { label: 'Long text', value: 'textarea' },
          ],
        },
        { name: 'required', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'submitLabel', type: 'text', defaultValue: 'Send message' },
    { name: 'successMessage', type: 'textarea', defaultValue: 'Thanks. Your message has been sent.' },
  ],
  timestamps: true,
}
