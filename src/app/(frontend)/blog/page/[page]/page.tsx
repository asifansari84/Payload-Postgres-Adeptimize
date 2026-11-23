import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { BLOG_PER_PAGE, BlogListing } from '@/components/sections/blog/BlogListing'
import { getPostPage, getPublishedPage, pageMetadata } from '@/lib/cms'

type Props = { params: Promise<{ page: string }> }

/** Prebuild pages 2 onwards; page 1 is /blog/. */
export async function generateStaticParams() {
  const posts = await getPostPage(1, BLOG_PER_PAGE)
  const total = posts?.totalPages ?? 1
  return Array.from({ length: Math.max(total - 1, 0) }, (_, i) => ({ page: String(i + 2) }))
}

function pageNumber(value: string) {
  return /^\d{1,5}$/.test(value) ? Number(value) : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = pageNumber((await params).page)
  if (!page) return {}
  const metadata = pageMetadata(await getPublishedPage('blog'), `/blog/page/${page}/`)
  return { ...metadata, title: typeof metadata.title === 'string' ? `${metadata.title} – Page ${page}` : metadata.title }
}

export default async function BlogPaginatedPage({ params }: Props) {
  const page = pageNumber((await params).page)
  if (!page) notFound()
  if (page === 1) permanentRedirect('/blog/')
  return <BlogListing page={page} />
}
