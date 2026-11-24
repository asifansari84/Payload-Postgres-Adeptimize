import type { CollectionConfig } from 'payload'

/**
 * Leads: every website form submission, kept apart by `formSlug`.
 * The slug and table name stay "contact-submissions" so existing data is kept.
 * The list is replaced by the Leads view (one tab per form, details in a popup).
 */
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Submission',
    plural: 'Submissions',
  },
  admin: {
    group: 'Forms and Submissions',
    useAsTitle: 'email',
    defaultColumns: ['formSlug', 'email', 'status', 'createdAt'],
    description: 'Leads from the website forms, grouped by form.',
    components: {
      views: { list: { Component: '/components/admin/leads/LeadsView' } },
    },
  },
  access: {
    // Public submissions go through the validated Next.js forms endpoint.
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'formSlug', label: 'Form', type: 'text', required: true, index: true, admin: { readOnly: true } },
    // Copies of common fields, kept so the Leads list can search them.
    { name: 'name', type: 'text', admin: { readOnly: true } },
    { name: 'email', type: 'email', admin: { readOnly: true } },
    { name: 'company', type: 'text', admin: { readOnly: true } },
    { name: 'phone', type: 'text', admin: { readOnly: true } },
    { name: 'message', type: 'textarea', admin: { readOnly: true } },
    { name: 'submissionData', label: 'Submitted values', type: 'json', required: true, admin: { readOnly: true } },
    {
      name: 'sourceUrl',
      label: 'Source page',
      type: 'text',
      admin: { readOnly: true, description: 'The page the form was submitted from. Captured automatically.' },
    },
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
