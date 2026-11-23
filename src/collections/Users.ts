import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Administration',
    useAsTitle: 'email',
  },
  auth: true,
  // When a user is attached to another document (e.g. a post's author), only expose their name.
  defaultPopulate: { name: true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
