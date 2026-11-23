import Link from 'next/link'
import { LinkJSXConverter, RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { Post } from '@/payload-types'
import { postAuthorName, postHref, postImage, postMetadata } from '@/lib/postMetadata'
import styles from './Blog.module.css'

const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
})

function PostDate({ date }: { date?: string | null }) {
  if (!date) return null
  return <time dateTime={date}>{dateFormat.format(new Date(date))}</time>
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const doc = linkNode.fields.doc
      if (typeof doc?.value !== 'object' || !doc.value || !('slug' in doc.value) || typeof doc.value.slug !== 'string') return '#'
      if (doc.relationTo === 'pages') return doc.value.slug === 'home' ? '/' : `/${doc.value.slug}/`
      return postHref(doc.value.slug)
    },
  }),
})

export function BlogArticle({ post }: { post: Post }) {
  const image = postImage(post.featuredImage)
  const author = postAuthorName(post.author) || 'Adeptimize'
  const metadata = postMetadata(post.slug, post)
  const graph = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: metadata.description,
    mainEntityOfPage: String(metadata.alternates?.canonical),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': author === 'Adeptimize' ? 'Organization' : 'Person', name: author },
    publisher: { '@type': 'Organization', name: 'Adeptimize' },
    image: image ? [image.url] : undefined,
  }

  return (
    <article className={styles.article}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }} />
      <div className="container">
        <header className={styles.articleHeader}>
          <Link className={styles.back} href="/blog/">
            <svg aria-hidden="true" viewBox="0 0 12 12" width="10" height="10"><path d="M10 6H2m3-3L2 6l3 3" /></svg>
            All blogs
          </Link>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <p className={styles.byline}><span>{author}</span><PostDate date={post.publishedAt} /></p>
          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
        </header>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element -- media sizes vary per post
          <img className={styles.featured} src={image.url} alt={image.alt ?? ''} width={image.width ?? undefined} height={image.height ?? undefined} fetchPriority="high" />
        )}
        {post.richContent && <RichText className={styles.prose} data={post.richContent} converters={converters} />}
      </div>
    </article>
  )
}

type BlogCardPost = Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'featuredImage' | 'publishedAt'>

export function BlogIndex({ posts, page, totalPages }: { posts: BlogCardPost[]; page: number; totalPages: number }) {
  return (
    <section className={styles.index} aria-label="Blog posts">
      <div className="container">
        {!posts.length && <p className={styles.empty}>No published posts yet.</p>}
        <ul className={styles.grid} role="list">
          {posts.map((post) => {
            const image = postImage(post.featuredImage)
            const url = postHref(post.slug)
            return (
              <li key={post.id} className={`${styles.card} reveal`}>
                {image && (
                  <Link href={url} tabIndex={-1} aria-hidden="true" className={styles.cardMedia}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- media sizes vary per post */}
                    <img loading="lazy" src={image.url} alt="" width={image.width ?? undefined} height={image.height ?? undefined} />
                  </Link>
                )}
                <div className={styles.cardBody}>
                  <PostDate date={post.publishedAt} />
                  <h2 className={styles.cardTitle}><Link href={url}>{post.title}</Link></h2>
                  {post.excerpt && <p>{post.excerpt}</p>}
                  <Link href={url} className={styles.more} aria-hidden="true" tabIndex={-1}>Read more</Link>
                </div>
              </li>
            )
          })}
        </ul>
        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Blog pages">
            {page > 1 ? <Link className="button" href={page === 2 ? '/blog/' : `/blog/page/${page - 1}/`}>Previous</Link> : <span />}
            <span>Page {page} of {totalPages}</span>
            {page < totalPages ? <Link className="button" href={`/blog/page/${page + 1}/`}>Next</Link> : <span />}
          </nav>
        )}
      </div>
    </section>
  )
}
