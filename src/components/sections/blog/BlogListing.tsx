import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/sections/PageHeader'
import { SiteShell } from '@/components/site/SiteShell'
import { getPostPage, getPublishedPage } from '@/lib/cms'
import { BlogIndex } from './Blog'

export const BLOG_PER_PAGE = 12

/** One page of the blog listing: /blog/ is page 1, /blog/page/2/ onwards the rest. */
export async function BlogListing({ page }: { page: number }) {
  const [blog, posts] = await Promise.all([getPublishedPage('blog'), getPostPage(page, BLOG_PER_PAGE)])
  if (!blog || !posts) notFound()
  if (page > Math.max(posts.totalPages, 1)) notFound()

  return (
    <SiteShell>
      <PageHeader data={blog.blogHeader} fallback={blog.title} />
      <BlogIndex posts={posts.docs} page={page} totalPages={posts.totalPages} />
    </SiteShell>
  )
}
