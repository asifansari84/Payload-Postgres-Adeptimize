import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogArticle } from '@/components/sections/blog/Blog'
import { LocationDetail } from '@/components/sections/listing/ListingPage'
import { SiteShell } from '@/components/site/SiteShell'
import { getLocation, getPost, getPublishedSlugs, pageMetadata } from '@/lib/cms'
import { postHref, postMetadata } from '@/lib/postMetadata'
import { locationPath } from '@/lib/routes'

type RouteProps = { params: Promise<{ slug: string[] }> }

/** Prebuild every published post and location; new ones are built on first visit and cached. */
export async function generateStaticParams() {
  const [posts, locations] = await Promise.all([getPublishedSlugs('posts'), getPublishedSlugs('locations')])
  return [
    ...posts.map((slug) => ({ slug: postHref(slug).split('/').filter(Boolean).map(decodeURIComponent) })),
    ...locations.map((slug) => ({ slug: [`location-${slug}`] })),
  ]
}

/** Location pages live at /location-<slug>/. */
function locationSlug(slug: string[]) {
  return slug.length === 1 && slug[0].startsWith('location-') ? slug[0].slice('location-'.length) : null
}

/**
 * Location pages and blog posts. Older posts keep their original address (/post-slug) and
 * newer ones live under /blog/post-slug. Everything else is a 404, so the
 * site only serves what exists in the backend.
 */
function postSlug(slug: string[]) {
  if (slug.length === 1) return slug[0]
  if (slug.length === 2 && slug[0] === 'blog') return slug[1]
  return null
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const parts = (await params).slug
  const place = locationSlug(parts)
  const location = place ? await getLocation(place) : null
  if (location) return pageMetadata(location, locationPath(location.slug))
  const slug = postSlug(parts)
  const post = slug ? await getPost(slug) : null
  return post ? postMetadata(post.slug, post) : {}
}

export default async function ContentPage({ params }: RouteProps) {
  const parts = (await params).slug
  const place = locationSlug(parts)
  const location = place ? await getLocation(place) : null
  if (location) {
    return <LocationDetail location={location} />
  }

  const slug = postSlug(parts)
  const post = slug ? await getPost(slug) : null
  if (!post) notFound()

  return (
    <SiteShell>
      <BlogArticle post={post} />
    </SiteShell>
  )
}
