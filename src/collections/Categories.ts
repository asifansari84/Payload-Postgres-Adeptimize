import { slugField, type CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Group blog posts by topic. Assign categories from the post editor.',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true, unique: true },
    slugField(),
    {
      name: 'posts',
      type: 'join',
      collection: 'posts',
      on: 'categories',
      admin: { description: 'Posts in this category.', defaultColumns: ['title', 'status', 'publishedAt'] },
    },
  ],
  timestamps: true,
}
