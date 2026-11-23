import type { Metadata } from 'next'
import { BlogListing } from '@/components/sections/blog/BlogListing'
import { getPublishedPage, pageMetadata } from '@/lib/cms'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPublishedPage('blog'), '/blog/')
}

export default function BlogPage() {
  return <BlogListing page={1} />
}
