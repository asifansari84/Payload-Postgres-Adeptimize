import type { Metadata } from 'next'
import type { Post } from '@/payload-types'
import archive from '@/content/adeptimize-post-manifest.json'

const siteURL = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://adeptimize.com')

export function postHref(slug: string) {
  return `${archivedPost(slug) ? '' : '/blog'}/${encodeURIComponent(slug)}`
}

/** The author's display name, or null when no user (or only an unpopulated ID) is attached. */
export function postAuthorName(author: Post['author']) {
  return typeof author === 'object' && author?.name ? author.name : null
}

export function archivedPost(slug: string) {
  return archive.find((post) => post.slug === slug)
}

export function postImage(image: Post['featuredImage']) {
  if (typeof image !== 'object' || !image?.url || !image.mimeType?.startsWith('image/')) return null
  return { url: image.url, alt: image.alt, width: image.width, height: image.height }
}

export function postMetadata(slug: string, post?: Post | null): Metadata {
  const fallback = archivedPost(slug)
  const title = post?.seo?.title?.trim() || post?.title || fallback?.title
  const description = post?.seo?.description?.trim() || post?.excerpt || fallback?.excerpt
  if (!title) return {}

  const canonical = new URL(post?.seo?.canonicalURL?.trim() || postHref(slug), siteURL).href
  const image = postImage(post?.seo?.socialImage) ?? postImage(post?.featuredImage)
  const imageURL = image?.url ?? (!post ? fallback?.featuredImage.path : undefined)
  const images = imageURL ? [{ url: new URL(imageURL, siteURL), alt: image?.alt ?? fallback?.featuredImage.alt ?? title }] : undefined
  const socialTitle = post?.seo?.socialTitle?.trim() || title
  const socialDescription = post?.seo?.socialDescription?.trim() || description

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: !post?.seo?.noIndex, follow: !post?.seo?.noFollow },
    openGraph: {
      type: 'article',
      siteName: 'Adeptimize',
      url: canonical,
      title: socialTitle,
      description: socialDescription,
      publishedTime: post?.publishedAt ?? (fallback?.publishedAt || undefined),
      modifiedTime: post?.updatedAt,
      authors: post && postAuthorName(post.author) ? [postAuthorName(post.author)!] : undefined,
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title: socialTitle,
      description: socialDescription,
      images,
    },
  }
}
