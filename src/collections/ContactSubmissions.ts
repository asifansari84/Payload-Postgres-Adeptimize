import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Contact submission',
    plural: 'Contact submissions',
  },
  admin: {
    group: 'Forms and submissions',
    useAsTitle: 'formSlug',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
    description: 'Contact messages and newsletter signups submitted through the website.',
  },
  access: {
    // Public submissions go through the validated Next.js forms endpoint.
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'formSlug', type: 'text', required: true, index: true },
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'company', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'message', type: 'textarea' },
    { name: 'submissionData', type: 'json', required: true },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
      ],
    },
  ],
  timestamps: true,
}
