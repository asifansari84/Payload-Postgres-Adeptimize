import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import type { Post } from '@/payload-types'

export default async function ContentDashboard({
  payload, permissions, user,
}: Pick<AdminViewServerProps, 'payload' | 'permissions' | 'user'>) {
  const admin = payload.config.routes.admin
  const posts = `${admin}/collections/posts`
  let recentPosts: Pick<Post, 'id' | 'title' | 'status'>[] = []
  if (user && permissions?.collections?.posts?.read) {
    try {
      const result = await payload.find({
        collection: 'posts', sort: '-updatedAt', limit: 5, depth: 0, user, overrideAccess: false,
        select: { title: true, status: true },
      })
      recentPosts = result.docs
    } catch {
      // Keep the navigation available when the database cannot serve the recent list.
    }
  }

  return (
    <section className="adeptimize-content-dashboard" aria-label="Content workspace">
      <div className="adeptimize-content-dashboard__header">
        <h1>Content workspace</h1>
        {permissions?.collections?.posts?.create && <Link className="adeptimize-content-dashboard__action" href={`${posts}/create`}>New post</Link>}
      </div>
      {recentPosts.length > 0 && (
        <section className="adeptimize-content-dashboard__recent">
          <h2>Recently edited posts</h2>
          <ul>
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link href={`${posts}/${post.id}`}>{post.title}</Link>
                <span>{post.status === 'published' ? 'Published' : 'Draft'}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
