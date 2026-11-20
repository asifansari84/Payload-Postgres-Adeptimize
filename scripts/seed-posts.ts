import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { importPosts } from './import-posts.js'

const payload = await getPayload({ config })
try {
  await importPosts(payload)
} finally {
  await payload.destroy()
}

process.exit(0)
