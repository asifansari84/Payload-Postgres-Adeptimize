import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Media file', plural: 'Media' },
  admin: {
    group: 'Content',
    components: { edit: { beforeDocumentControls: ['/components/admin/MediaCreatedRedirect'] } },
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],

    afterRead: [
      ({ doc }) => {
        if (doc?.filename) doc.url = `/media/${encodeURIComponent(doc.filename)}`
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Describes the image for screen readers and search engines. Leave empty for decorative images.' },
    },
  ],
  upload: {
    staticDir: 'public/media',
  },
}
