'use client'

import { toast, useConfig } from '@payloadcms/ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { humanize, type FormDefinition, type FormFieldDef } from '@/forms/definitions'

export type LeadForm = FormDefinition & { total: number }

type Status = 'new' | 'in-progress' | 'resolved'

type Lead = {
  id: number | string
  formSlug: string
  name?: string | null
  email?: string | null
  company?: string | null
  phone?: string | null
  message?: string | null
  submissionData?: Record<string, unknown> | null
  sourceUrl?: string | null
  status: Status
  createdAt: string
}

type Page = { docs: Lead[]; totalDocs: number; totalPages: number; page: number }

const PAGE_SIZE = 20
/** Fields copied to their own database columns: these can be searched and sorted. */
const COLUMN_FIELDS = new Set(['name', 'email', 'company', 'phone', 'message'])
const MAX_TABLE_COLUMNS = 4

const STATUS_LABELS: Record<Status, string> = { new: 'New', 'in-progress': 'In progress', resolved: 'Resolved' }
const DATE_RANGES = [
  { value: '', label: 'Any time' },
  { value: '1', label: 'Last 24 hours' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '365', label: 'Last 12 months' },
]

const dateTime = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })
const formatDate = (iso: string) => {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateTime.format(date)
}

/** A link to the page a lead was submitted from: its path in the table (e.g. "/contact-us"), the full URL in the popup. */
function SourceLink({ url, full = false }: { url?: string | null; full?: boolean }) {
  if (!url) return <span className="adeptimize-leads__muted">—</span>
  let label = url
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) return <span>{url}</span>
    label = `${parsed.pathname}${parsed.search}` || '/'
  } catch {
    return <span>{url}</span>
  }
  return (
    <a className="adeptimize-leads__source" href={url} target="_blank" rel="noopener noreferrer" title={url} onClick={(e) => e.stopPropagation()}>
      {full ? url : label === '/' ? 'Home page (/)' : label}
    </a>
  )
}

/** Serializes nested objects as Payload's REST API expects: where[and][0][formSlug][equals]=… */
function toQuery(value: unknown, prefix = ''): string[] {
  if (value === undefined || value === null || value === '') return []
  if (typeof value !== 'object') return [`${prefix}=${encodeURIComponent(String(value))}`]
  return Object.entries(value as Record<string, unknown>).flatMap(([key, v]) => toQuery(v, prefix ? `${prefix}[${key}]` : key))
}

const valueOf = (lead: Lead, name: string): string => {
  const raw = lead.submissionData?.[name] ?? (lead as Record<string, unknown>)[name]
  return raw === undefined || raw === null ? '' : String(raw)
}

/** The form's fields first, then anything else that was submitted (e.g. a field since removed). */
function submittedEntries(lead: Lead, form: LeadForm | undefined) {
  const fields: FormFieldDef[] = form?.fields ?? []
  const known = new Set(fields.map((f) => f.name))
  const extra = Object.keys(lead.submissionData ?? {}).filter((key) => !known.has(key))
  return [
    ...fields.map((f) => ({ name: f.name, label: f.label, type: f.type, value: valueOf(lead, f.name) })),
    ...extra.map((key) => ({ name: key, label: humanize(key), type: 'text' as const, value: valueOf(lead, key) })),
  ].filter((entry) => entry.value)
}

export function LeadsManager({
  forms: initialForms,
  initialForm,
  canDelete,
  canUpdate,
}: {
  forms: LeadForm[]
  initialForm: string
  canDelete: boolean
  canUpdate: boolean
}) {
  const { config } = useConfig()
  const api = `${config.serverURL ?? ''}${config.routes.api}/contact-submissions`

  const [forms, setForms] = useState(initialForms)
  const [slug, setSlug] = useState(initialForm)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [range, setRange] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewing, setViewing] = useState<Lead | null>(null)
  const [deleting, setDeleting] = useState<Lead | null>(null)
  const [reload, setReload] = useState(0)

  const form = forms.find((f) => f.slug === slug)

  // Table columns: the form's own fields (or, for an unknown form, the keys of the first lead).
  const columns = useMemo(() => {
    const fields = form?.fields.length
      ? form.fields
      : [...new Set((data?.docs ?? []).flatMap((lead) => Object.keys(lead.submissionData ?? {})))].map((name) => ({
          name, label: humanize(name), type: 'text' as const, required: false,
        }))
    return fields.slice(0, MAX_TABLE_COLUMNS)
  }, [form, data])

  const searchable = useMemo(() => {
    const names = (form?.fields ?? []).map((f) => f.name).filter((n) => COLUMN_FIELDS.has(n))
    return names.length ? names : ['email', 'name']
  }, [form])

  // Debounce typing in the search box.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Keep the selected form in the address bar so the view can be linked to.
  useEffect(() => {
    if (!slug) return
    const url = new URL(window.location.href)
    url.searchParams.set('form', slug)
    window.history.replaceState(window.history.state, '', url)
  }, [slug])

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }
    const controller = new AbortController()
    const and: unknown[] = [{ formSlug: { equals: slug } }]
    if (query) and.push({ or: searchable.map((name) => ({ [name]: { like: query } })) })
    if (status && form?.trackStatus) and.push({ status: { equals: status } })
    if (range) and.push({ createdAt: { greater_than_equal: new Date(Date.now() - Number(range) * 864e5).toISOString() } })

    const params = toQuery({ where: { and }, sort, page, limit: PAGE_SIZE, depth: 0 }).join('&')
    setLoading(true)
    setError('')
    fetch(`${api}?${params}`, { credentials: 'include', signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 403 ? 'You do not have access to leads.' : 'Could not load leads.')
        return (await res.json()) as Page
      })
      .then((result) => {
        // Deleting the last lead on a page: step back a page.
        if (!result.docs.length && result.page > 1 && result.totalPages > 0) setPage(result.totalPages)
        else setData(result)
      })
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError(err.message || 'Could not load leads.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [api, slug, query, status, range, sort, page, searchable, form?.trackStatus, reload])

  const selectForm = (next: string) => {
    if (next === slug) return
    setSlug(next)
    setSearch('')
    setQuery('')
    setStatus('')
    setRange('')
    setSort('-createdAt')
    setPage(1)
    setData(null)
  }

  const toggleSort = (field: string) => {
    setSort((current) => (current === field ? `-${field}` : current === `-${field}` ? field : field === 'createdAt' ? '-createdAt' : field))
    setPage(1)
  }

  const remove = useCallback(
    async (lead: Lead) => {
      const res = await fetch(`${api}/${lead.id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) {
        toast.error('The lead could not be deleted.')
        return false
      }
      toast.success('Lead deleted.')
      setForms((all) => all.map((f) => (f.slug === lead.formSlug ? { ...f, total: Math.max(0, f.total - 1) } : f)))
      setViewing((current) => (current?.id === lead.id ? null : current))
      setReload((n) => n + 1)
      return true
    },
    [api],
  )

  const updateStatus = useCallback(
    async (lead: Lead, next: Status) => {
      const res = await fetch(`${api}/${lead.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) {
        toast.error('The status could not be updated.')
        return
      }
      const updated = { ...lead, status: next }
      setViewing((current) => (current?.id === lead.id ? updated : current))
      setData((current) => current && { ...current, docs: current.docs.map((d) => (d.id === lead.id ? updated : d)) })
      toast.success(`Marked as ${STATUS_LABELS[next].toLowerCase()}.`)
    },
    [api],
  )

  const filtered = Boolean(query || status || range)
  const sortIcon = (field: string) => (sort === field ? '▲' : sort === `-${field}` ? '▼' : '')
  const ariaSort = (field: string) => (sort === field ? 'ascending' : sort === `-${field}` ? 'descending' : undefined)
  const sortHeader = (field: string, label: string) => (
    <th key={field} scope="col" aria-sort={ariaSort(field)}>
      <button type="button" className="adeptimize-leads__sort" onClick={() => toggleSort(field)}>
        {label} <span aria-hidden="true">{sortIcon(field)}</span>
      </button>
    </th>
  )

  return (
    <div className="adeptimize-leads">
      <header className="adeptimize-leads__header">
        <h1>Submissions</h1>
        <p>Leads from the website forms, kept separately for each form.</p>
      </header>

      {forms.length === 0 ? (
        <p className="adeptimize-leads__empty">No forms yet.</p>
      ) : (
        <>
          <div className="adeptimize-leads__tabs" role="tablist" aria-label="Forms">
            {forms.map((f) => (
              <button
                key={f.slug}
                type="button"
                role="tab"
                id={`leads-tab-${f.slug}`}
                aria-selected={f.slug === slug}
                aria-controls="leads-panel"
                className="adeptimize-leads__tab"
                onClick={() => selectForm(f.slug)}
              >
                <span>{f.title}</span>
                <span className="adeptimize-leads__count">{f.total}</span>
              </button>
            ))}
          </div>

          <section id="leads-panel" role="tabpanel" aria-labelledby={`leads-tab-${slug}`} className="adeptimize-leads__panel">
            <div className="adeptimize-leads__toolbar">
              <label className="adeptimize-leads__search">
                <span className="adeptimize-leads__sr">Search leads</span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${searchable.map((n) => humanize(n).toLowerCase()).join(', ')}`}
                />
              </label>
              {form?.trackStatus && (
                <label>
                  <span className="adeptimize-leads__sr">Status</span>
                  <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
                    <option value="">All statuses</option>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
              )}
              <label>
                <span className="adeptimize-leads__sr">Submitted</span>
                <select value={range} onChange={(e) => { setRange(e.target.value); setPage(1) }}>
                  {DATE_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </label>
            </div>

            <p className="adeptimize-leads__summary" role="status" aria-live="polite">
              {loading ? 'Loading…' : error ? '' : data ? `${data.totalDocs} ${data.totalDocs === 1 ? 'lead' : 'leads'}${filtered ? ' match' : ''}` : ''}
            </p>

            {error ? (
              <div className="adeptimize-leads__empty">
                <p>{error}</p>
                <button type="button" className="adeptimize-leads__button" onClick={() => setReload((n) => n + 1)}>Try again</button>
              </div>
            ) : data && data.docs.length === 0 && !loading ? (
              <p className="adeptimize-leads__empty">{filtered ? 'No leads match these filters.' : 'No leads for this form yet.'}</p>
            ) : (
              <div className="adeptimize-leads__table-wrap" data-loading={loading || undefined}>
                <table className="adeptimize-leads__table">
                  <thead>
                    <tr>
                      {columns.map((col) =>
                        COLUMN_FIELDS.has(col.name) && col.type !== 'textarea'
                          ? sortHeader(col.name, col.label)
                          : <th key={col.name} scope="col">{col.label}</th>,
                      )}
                      {form?.trackStatus && sortHeader('status', 'Status')}
                      {sortHeader('sourceUrl', 'Source page')}
                      {sortHeader('createdAt', 'Submitted')}
                      <th scope="col"><span className="adeptimize-leads__sr">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.docs.map((lead) => (
                      <tr key={lead.id} onClick={() => setViewing(lead)}>
                        {columns.map((col, i) => (
                          <td key={col.name} data-label={col.label}>
                            {i === 0 ? (
                              <button type="button" className="adeptimize-leads__open" onClick={(e) => { e.stopPropagation(); setViewing(lead) }}>
                                {valueOf(lead, col.name) || <span className="adeptimize-leads__muted">—</span>}
                              </button>
                            ) : (
                              <span className="adeptimize-leads__cell">{valueOf(lead, col.name) || <span className="adeptimize-leads__muted">—</span>}</span>
                            )}
                          </td>
                        ))}
                        {form?.trackStatus && (
                          <td data-label="Status"><span className={`adeptimize-leads__status adeptimize-leads__status--${lead.status}`}>{STATUS_LABELS[lead.status] ?? lead.status}</span></td>
                        )}
                        <td data-label="Source page"><SourceLink url={lead.sourceUrl} /></td>
                        <td data-label="Submitted" className="adeptimize-leads__date"><time dateTime={lead.createdAt}>{formatDate(lead.createdAt)}</time></td>
                        <td className="adeptimize-leads__actions" onClick={(e) => e.stopPropagation()}>
                          {columns.length === 0 && (
                            <button type="button" className="adeptimize-leads__button" onClick={() => setViewing(lead)}>View</button>
                          )}
                          {canDelete && (
                            <button type="button" className="adeptimize-leads__button adeptimize-leads__button--danger" onClick={() => setDeleting(lead)} aria-label={`Delete lead from ${formatDate(lead.createdAt)}`}>
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {data && data.totalPages > 1 && (
              <nav className="adeptimize-leads__pagination" aria-label="Pages">
                <button type="button" className="adeptimize-leads__button" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>Previous</button>
                <span>Page {data.page} of {data.totalPages}</span>
                <button type="button" className="adeptimize-leads__button" disabled={page >= data.totalPages || loading} onClick={() => setPage((p) => p + 1)}>Next</button>
              </nav>
            )}
          </section>
        </>
      )}

      {viewing && (
        <LeadDialog
          lead={viewing}
          form={forms.find((f) => f.slug === viewing.formSlug)}
          canUpdate={canUpdate}
          onClose={() => setViewing(null)}
          onStatus={(next) => updateStatus(viewing, next)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete this lead?"
          message={`The lead from ${formatDate(deleting.createdAt)} will be permanently deleted. This cannot be undone.`}
          confirmLabel="Delete"
          onCancel={() => setDeleting(null)}
          onConfirm={async () => {
            const ok = await remove(deleting)
            if (ok) setDeleting(null)
          }}
        />
      )}
    </div>
  )
}

/** A native modal <dialog>: focus is kept inside, Esc closes it, and focus returns on close. */
function useModal(onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const opener = document.activeElement as HTMLElement | null
    dialog.showModal()
    const onCancel = (e: Event) => {
      e.preventDefault()
      close.current()
    }
    dialog.addEventListener('cancel', onCancel)
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      if (dialog.open) dialog.close()
      opener?.focus?.()
    }
  }, [])
  // Clicking the backdrop (the dialog element itself, outside its content) closes it.
  const onClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) close.current()
  }
  return { ref, onClick }
}

function LeadDialog({
  lead, form, canUpdate, onClose, onStatus,
}: {
  lead: Lead
  form: LeadForm | undefined
  canUpdate: boolean
  onClose: () => void
  onStatus: (status: Status) => void
}) {
  const { ref, onClick } = useModal(onClose)
  const entries = submittedEntries(lead, form)
  const titleId = `lead-${lead.id}-title`

  return (
    <dialog ref={ref} className="adeptimize-lead-dialog" aria-labelledby={titleId} onClick={onClick}>
      <div className="adeptimize-lead-dialog__inner">
        <header className="adeptimize-lead-dialog__header">
          <div>
            <p className="adeptimize-lead-dialog__eyebrow">{form?.title ?? humanize(lead.formSlug)}</p>
            <h2 id={titleId}>Lead details</h2>
          </div>
          <button type="button" className="adeptimize-lead-dialog__close" onClick={onClose} aria-label="Close">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </header>

        <dl className="adeptimize-lead-dialog__fields">
          {entries.length ? entries.map((entry) => (
            <div key={entry.name} data-wide={entry.type === 'textarea' || entry.value.length > 60 || undefined}>
              <dt>{entry.label}</dt>
              <dd>
                {entry.type === 'email' ? <a href={`mailto:${entry.value}`}>{entry.value}</a>
                  : entry.type === 'tel' ? <a href={`tel:${entry.value.replace(/[^\d+]/g, '')}`}>{entry.value}</a>
                  : entry.value}
              </dd>
            </div>
          )) : (
            <div data-wide><dt>Submitted values</dt><dd>None</dd></div>
          )}
        </dl>

        <dl className="adeptimize-lead-dialog__meta">
          <div>
            <dt>Submitted</dt>
            <dd><time dateTime={lead.createdAt}>{formatDate(lead.createdAt)}</time></dd>
          </div>
          <div data-wide>
            <dt>Source page</dt>
            <dd><SourceLink url={lead.sourceUrl} full /></dd>
          </div>
          {form?.trackStatus !== false && (
            <div>
              <dt><label htmlFor={`${titleId}-status`}>Status</label></dt>
              <dd>
                {canUpdate ? (
                  <select id={`${titleId}-status`} value={lead.status} onChange={(e) => onStatus(e.target.value as Status)}>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                ) : STATUS_LABELS[lead.status]}
              </dd>
            </div>
          )}
        </dl>

        <footer className="adeptimize-lead-dialog__footer">
          <button type="button" className="adeptimize-leads__button adeptimize-leads__button--primary" onClick={onClose} autoFocus>Close</button>
        </footer>
      </div>
    </dialog>
  )
}

function ConfirmDialog({
  title, message, confirmLabel, onCancel, onConfirm,
}: {
  title: string
  message: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => Promise<void>
}) {
  const [busy, setBusy] = useState(false)
  const { ref, onClick } = useModal(() => !busy && onCancel())
  return (
    <dialog ref={ref} className="adeptimize-lead-dialog adeptimize-lead-dialog--confirm" role="alertdialog" aria-labelledby="leads-confirm-title" aria-describedby="leads-confirm-text" onClick={onClick}>
      <div className="adeptimize-lead-dialog__inner">
        <h2 id="leads-confirm-title">{title}</h2>
        <p id="leads-confirm-text">{message}</p>
        <footer className="adeptimize-lead-dialog__footer">
          <button type="button" className="adeptimize-leads__button" onClick={onCancel} disabled={busy} autoFocus>Cancel</button>
          <button
            type="button"
            className="adeptimize-leads__button adeptimize-leads__button--danger-solid"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              await onConfirm()
              setBusy(false)
            }}
          >
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </footer>
      </div>
    </dialog>
  )
}
