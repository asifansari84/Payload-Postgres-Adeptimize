import Link from 'next/link'
import type { CollectionSlug, ListViewServerProps } from 'payload'

type Tab = { key: 'all' | 'draft' | 'trash'; label: string; count: number; href: string }

/** True when the list is currently filtered to drafts (raw or parsed search params). */
function isDraftFilter(searchParams: ListViewServerProps['searchParams']) {
  const raw = searchParams?.['where[status][equals]']
  if (raw === 'draft') return true
  const where = searchParams?.where as { status?: { equals?: unknown } } | undefined
  return where?.status?.equals === 'draft'
}

/**
 * WordPress-style "All (n) | Drafts (n) | Trash (n)" links above a collection
 * list. "All" is always shown; Drafts and Trash only when they have documents
 * (or are the current view).
 */
export default async function StatusTabs({ collectionConfig, params, payload, searchParams, user }: ListViewServerProps) {
  if (!user) return null
  const slug = collectionConfig.slug as CollectionSlug
  const admin = payload.config.routes.admin === '/' ? '' : payload.config.routes.admin
  const base = `${admin}/collections/${slug}`

  const segments = (params?.segments as string[] | undefined) ?? []
  const active: Tab['key'] = segments.at(-1) === 'trash' ? 'trash' : isDraftFilter(searchParams) ? 'draft' : 'all'

  const count = (options: Parameters<typeof payload.count>[0]) =>
    payload
      .count({ ...options, user, overrideAccess: false })
      .then((r) => r.totalDocs)
      .catch(() => 0)

  const [all, drafts, trashed] = await Promise.all([
    count({ collection: slug }),
    count({ collection: slug, where: { status: { equals: 'draft' } } }),
    collectionConfig.trash ? count({ collection: slug, trash: true, where: { deletedAt: { exists: true } } }) : 0,
  ])

  const tabs: Tab[] = [
    { key: 'all', label: 'All', count: all, href: base },
    { key: 'draft', label: 'Drafts', count: drafts, href: `${base}?where[status][equals]=draft` },
    { key: 'trash', label: 'Trash', count: trashed, href: `${base}/trash` },
  ]
  const visible = tabs.filter((tab) => tab.key === 'all' || tab.count > 0 || tab.key === active)

  return (
    <nav aria-label="Filter by status" className="adeptimize-status-tabs">
      {visible.map((tab, i) => (
        <span key={tab.key}>
          {i > 0 && <span aria-hidden="true" className="adeptimize-status-tabs__sep">|</span>}
          {tab.key === active ? (
            <span aria-current="page" className="adeptimize-status-tabs__tab adeptimize-status-tabs__tab--active">
              {tab.label} <span className="adeptimize-status-tabs__count">({tab.count})</span>
            </span>
          ) : (
            <Link className="adeptimize-status-tabs__tab" href={tab.href} prefetch={false}>
              {tab.label} <span className="adeptimize-status-tabs__count">({tab.count})</span>
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
