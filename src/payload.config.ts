import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Services } from './collections/Services'
import { Locations } from './collections/Locations'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Forms } from './collections/Forms'
import { Footer, Header } from './globals/SiteChrome'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Supabase/Vercel URLs include `?sslmode=require`. node-postgres treats that as
 * `verify-full` and lets it override the `ssl` option below, which fails with
 * SELF_SIGNED_CERT_IN_CHAIN. Strip SSL params from the URL so `ssl` applies.
 */
const getConnectionString = () => {
  const raw = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
  if (!raw) return raw
  try {
    const url = new URL(raw)
    for (const key of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey', 'uselibpqcompat', 'pgbouncer', 'supa']) {
      url.searchParams.delete(key)
    }
    return url.toString()
  } catch {
    return raw
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · Adeptimize CMS' },
    components: {
      beforeDashboard: ['/components/admin/ContentDashboard'],
      providers: ['/components/admin/StripExtensionAttributes'],
      beforeNavLinks: ['/components/admin/NavDefaultOpen'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Pages, Services, Locations, Posts, Media, Forms, ContactSubmissions, Users],
  globals: [Header, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    migrationDir: path.resolve(dirname, 'migrations'),
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    pool: {
      connectionString: getConnectionString(),

      ssl: {
        rejectUnauthorized: false,
      },

      connectionTimeoutMillis: 10000,
      max: 10,
      idleTimeoutMillis: 10 * 60 * 1000,
      keepAlive: true,
    },
  }),
  sharp,
  plugins: [],
})
