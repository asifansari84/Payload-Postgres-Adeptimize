import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
    // Files live in public/media, which Vercel serves from its CDN at /media/*.
    // Payload's /api/media/file/* route reads from disk and 500s on Vercel, so
    // point URLs at the static path instead.
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
      required: true,
    },
  ],
  upload: {
    staticDir: 'public/media',
  },
}
