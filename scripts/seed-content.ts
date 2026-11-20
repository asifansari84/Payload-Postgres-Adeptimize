import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { importPosts } from './import-posts.js'

const payload = await getPayload({ config })

try {
  await importPosts(payload)

  const contactForm = await payload.find({
    collection: 'forms',
    where: { slug: { equals: 'contact' } },
    limit: 1,
    depth: 0,
  })

  if (!contactForm.docs.length) {
    await payload.create({
      collection: 'forms',
      draft: false,
      data: {
        title: 'Contact form',
        slug: 'contact',
        status: 'published',
        submitLabel: 'Submit',
        successMessage: 'Thanks. Your message has been sent.',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'message', label: 'Message', type: 'textarea', required: true },
        ],
      },
    })
    payload.logger.info('Created the contact form')
  }
} finally {
  await payload.destroy()
}

process.exit(0)
