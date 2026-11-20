import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: {
    group: 'Forms and submissions',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    description: 'Manage the fields and confirmation text for website forms.',
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
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
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
        { name: 'name', type: 'text', required: true, admin: { description: 'Used as the submitted field key.' } },
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
