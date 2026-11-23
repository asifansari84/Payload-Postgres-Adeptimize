import Link from 'next/link'
import type { AdminViewServerProps, CollectionSlug, Where } from 'payload'

type Stat = {
  slug: CollectionSlug
  label: string
  /** Second line under the number, e.g. "2 drafts". */
  detail?: { where: Where; text: (n: number) => string }
  /** Count only these documents (and link to the list filtered the same way). */
  where?: Where
  query?: string
  /** Highlight the box when the count is above zero. */
  attention?: boolean
}

const drafts = { where: { status: { equals: 'draft' } }, text: (n: number) => (n === 1 ? '1 draft' : `${n} drafts`) }

const STATS: Stat[] = [
  { slug: 'posts', label: 'Posts', detail: drafts },
  { slug: 'pages', label: 'Pages', detail: drafts },
  { slug: 'services', label: 'Services', detail: drafts },
  { slug: 'locations', label: 'Locations', detail: drafts },
  {
    slug: 'contact-submissions',
    label: 'New messages',
    where: { status: { equals: 'new' } },
    query: '?where[status][equals]=new',
    attention: true,
  },
]

export default async function ContentDashboard({
  payload,
  permissions,
  user,
}: Pick<AdminViewServerProps, 'payload' | 'permissions' | 'user'>) {
  const admin = payload.config.routes.admin === '/' ? '' : payload.config.routes.admin
  const visible = STATS.filter((stat) => user && permissions?.collections?.[stat.slug]?.read)

  const count = (slug: CollectionSlug, where?: Where) =>
    payload
      .count({ collection: slug, where, user, overrideAccess: false })
      .then((r) => r.totalDocs)
      .catch(() => null)

  const results = await Promise.all(
    visible.map(async (stat) => ({
      stat,
      total: await count(stat.slug, stat.where),
      detail: stat.detail ? await count(stat.slug, stat.detail.where) : null,
    })),
  )

  return (
    <section className="adeptimize-content-dashboard" aria-label="Site overview">
      <div className="adeptimize-content-dashboard__header">
        <h1>Content workspace</h1>
        {permissions?.collections?.posts?.create && (
          <Link className="adeptimize-content-dashboard__action" href={`${admin}/collections/posts/create`}>
            New post
          </Link>
        )}
      </div>

      <ul className="adeptimize-content-dashboard__stats">
        {results.map(({ stat, total, detail }) => {
          const highlight = stat.attention && (total ?? 0) > 0
          return (
            <li key={stat.slug}>
              <Link
                className={`adeptimize-stat${highlight ? ' adeptimize-stat--attention' : ''}`}
                href={`${admin}/collections/${stat.slug}${stat.query ?? ''}`}
              >
                <span className="adeptimize-stat__label">{stat.label}</span>
                <span className="adeptimize-stat__value">{total ?? '–'}</span>
                <span className="adeptimize-stat__detail">
                  {stat.detail && detail ? stat.detail.text(detail) : stat.attention ? (highlight ? 'Waiting for a reply' : 'All caught up') : ' '}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
