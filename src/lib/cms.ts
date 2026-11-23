import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'
import type { Form } from '@/payload-types'
import config from '@/payload.config'

/**
 * All CMS reads go through here. The database is remote, so every query costs
 * a network round trip; results are cached under one tag and that tag is
 * cleared by Payload hooks whenever content is saved (see hooks/revalidate.ts).
 *
 * Loaders log and rethrow on failure so an error is never cached: pages are
 * statically generated, and a failed regeneration keeps serving the last good
 * version (a failed build stops the deploy) instead of caching an empty page.
 * React's cache() dedupes calls within a request.
 */
export const CMS_TAG = 'cms'

export const getCMS = cache(() => getPayload({ config }))

/** Bump when the shape of cached data changes (e.g. media URLs) so old entries are skipped. */
const CACHE_VERSION = 'v3'

const cached = <Args extends unknown[], Result>(key: string, load: (...args: Args) => Promise<Result>) =>
  unstable_cache(load, [CACHE_VERSION, key], { tags: [CMS_TAG], revalidate: 3600 })

/* The fallback argument only types the result; it is not returned on errors (see above). */
const safe = <Args extends unknown[], Result, Fallback>(label: string, load: (...args: Args) => Promise<Result>, _fallback: Fallback) =>
  cache(async (...args: Args): Promise<Result | Fallback> => {
    try {
      return await load(...args)
    } catch (error) {
      console.error(`${label} could not be loaded`, error)
      throw error
    }
  })

const published: Where = { status: { equals: 'published' } }

/* ---------- Site chrome ---------- */

export const getSiteChrome = safe(
  'Site header/footer',
  cached('site-chrome', async () => {
    const payload = await getCMS()
    const [header, footer] = await Promise.all([
      payload.findGlobal({ slug: 'header', depth: 1 }),
      payload.findGlobal({ slug: 'footer', depth: 1 }),
    ])
    return { header, footer }
  }),
  { header: null, footer: null },
)

/* ---------- Pages ---------- */

export const getPublishedPage = safe(
  'Page',
  cached('page', async (slug: string) => {
    const payload = await getCMS()
    const { docs } = await payload.find({
      collection: 'pages',
      where: { and: [{ slug: { equals: slug } }, published] },
      limit: 1,
      depth: 2,
    })
    return docs[0] ?? null
  }),
  null,
)

/** Search metadata for a page from its SEO tab, falling back to the page title. */
export function pageMetadata(page: { title?: string | null; seo?: { title?: string | null; description?: string | null; noIndex?: boolean | null } | null } | null, path: string): Metadata {
  if (!page) return {}
  return {
    title: page.seo?.title ? { absolute: page.seo.title } : page.title,
    description: page.seo?.description || undefined,
    alternates: { canonical: path },
    robots: page.seo?.noIndex ? { index: false, follow: true } : undefined,
  }
}

/* ---------- Services and locations ---------- */

/** Published services or locations for the listing pages, in their chosen order. */
export const getListing = safe(
  'Listing',
  cached('listing', async (collection: 'services' | 'locations') => {
    const payload = await getCMS()
    const { docs } = await payload.find({
      collection,
      where: published,
      sort: ['order', 'title'],
      limit: 200,
      depth: 1,
      select: { title: true, slug: true, summary: true, cardImage: true },
    })
    return docs
  }),
  [],
)

/** Published locations with their slider images, for the Location page. */
export const getLocationCards = safe(
  'Locations',
  cached('location-cards', async () => {
    const payload = await getCMS()
    const { docs } = await payload.find({
      collection: 'locations',
      where: published,
      sort: ['order', 'title'],
      limit: 100,
      depth: 1,
      select: { title: true, slug: true, summary: true, cardImage: true, slideImage: true, slideIcon: true, slideIconAnimation: true },
    })
    return docs
  }),
  [],
)

export const getService = safe(
  'Service',
  cached('service', async (slug: string) => {
    const payload = await getCMS()
    const { docs } = await payload.find({ collection: 'services', where: { and: [{ slug: { equals: slug } }, published] }, limit: 1, depth: 1 })
    return docs[0] ?? null
  }),
  null,
)

export const getLocation = safe(
  'Location',
  cached('location', async (slug: string) => {
    const payload = await getCMS()
    const { docs } = await payload.find({ collection: 'locations', where: { and: [{ slug: { equals: slug } }, published] }, limit: 1, depth: 1 })
    return docs[0] ?? null
  }),
  null,
)

/** Published services for the “More services” slider, with their card images. */
export const getServiceCards = safe(
  'Service cards',
  cached('service-cards', async () => {
    const payload = await getCMS()
    const { docs } = await payload.find({
      collection: 'services',
      where: published,
      sort: ['order', 'title'],
      limit: 50,
      depth: 1,
      select: { title: true, slug: true, cardImage: true },
    })
    return docs
  }),
  [],
)

/* ---------- Blog ---------- */

export const getPost = safe(
  'Post',
  cached('post', async (slug: string) => {
    const payload = await getCMS()
    const { docs } = await payload.find({ collection: 'posts', where: { and: [{ slug: { equals: slug } }, published] }, limit: 1, depth: 2 })
    return docs[0] ?? null
  }),
  null,
)

export const getPostPage = safe(
  'Posts',
  cached('posts', async (page: number, limit: number) => {
    const payload = await getCMS()
    return payload.find({
      collection: 'posts',
      where: published,
      sort: '-publishedAt',
      page,
      limit,
      depth: 1,
      select: { title: true, slug: true, excerpt: true, featuredImage: true, publishedAt: true },
    })
  }),
  null,
)

/* ---------- Forms ---------- */

const loadForm = cached('form', async (id: number | null) => {
  const payload = await getCMS()
  const { docs } = await payload.find({
    collection: 'forms',
    where: { and: [id ? { id: { equals: id } } : { slug: { equals: 'contact' } }, published] },
    limit: 1,
    depth: 0,
  })
  return docs[0] ?? null
})

/** The published contact form: the one given, or the form with slug "contact". */
export async function getContactForm(selected?: number | Form | null): Promise<Form | null> {
  if (selected && typeof selected === 'object') return selected.status === 'published' ? selected : null
  try {
    return await loadForm(selected ?? null)
  } catch {
    return null
  }
}

/* ---------- Static generation ---------- */

/** Slugs of every published document, used to prebuild their pages at deploy time. */
export async function getPublishedSlugs(collection: 'posts' | 'services' | 'locations') {
  const payload = await getCMS()
  const { docs } = await payload.find({ collection, where: published, limit: 1000, depth: 0, pagination: false, select: { slug: true } })
  return docs.map((doc) => doc.slug).filter((slug): slug is string => typeof slug === 'string' && slug.length > 0)
}
