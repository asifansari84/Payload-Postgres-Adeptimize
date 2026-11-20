import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogIndex } from '@/components/sections/blog/Blog'
import { PageHeader } from '@/components/sections/PageHeader'
import { SiteShell } from '@/components/site/SiteShell'
import { getPostPage, getPublishedPage, pageMetadata } from '@/lib/cms'

export const dynamic = 'force-dynamic'

const PER_PAGE = 12

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPublishedPage('blog'), '/blog/')
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const [page, query] = await Promise.all([getPublishedPage('blog'), searchParams])
  if (!page) notFound()

  const current = typeof query.page === 'string' && /^\d{1,5}$/.test(query.page) ? Math.max(1, Number(query.page)) : 1
  const posts = await getPostPage(current, PER_PAGE)
  if (!posts) notFound()
  if (current > Math.max(posts.totalPages, 1)) notFound()

  return (
    <SiteShell>
      <PageHeader data={page.blogHeader} fallback={page.title} />
      <BlogIndex posts={posts.docs} page={current} totalPages={posts.totalPages} />
    </SiteShell>
  )
}
