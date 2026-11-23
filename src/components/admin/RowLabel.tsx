'use client'

import { useRowLabel } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

function useLabel(field: string, fallback: string) {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()
  const value = data?.[field]
  const number = String((rowNumber ?? 0) + 1).padStart(2, '0')
  return `${number} · ${typeof value === 'string' && value.trim() ? value : fallback}`
}

export function TitleRowLabel() {
  return <span>{useLabel('title', 'Untitled')}</span>
}

export function NameRowLabel() {
  return <span>{useLabel('name', 'Unnamed')}</span>
}

export function QuestionRowLabel() {
  return <span>{useLabel('question', 'New question')}</span>
}

type LinkValue = { type?: string; label?: string; page?: number | string | { title?: string } | null; url?: string }

// Page titles fetched for link rows, shared so each page is only looked up once.
const pageTitles = new Map<string, Promise<string | null>>()
function fetchPageTitle(id: string) {
  if (!pageTitles.has(id)) {
    pageTitles.set(
      id,
      fetch(`/api/pages/${encodeURIComponent(id)}?depth=0&select[title]=true`, { credentials: 'include' })
        .then((res) => (res.ok ? res.json() : null))
        .then((doc) => (typeof doc?.title === 'string' ? doc.title : null))
        .catch(() => null),
    )
  }
  return pageTitles.get(id)!
}

function usePageTitle(page: LinkValue['page']) {
  const id = page && typeof page !== 'object' ? String(page) : null
  const [title, setTitle] = useState<string | null>(null)
  useEffect(() => {
    if (!id) return setTitle(null)
    let active = true
    fetchPageTitle(id).then((value) => active && setTitle(value))
    return () => {
      active = false
    }
  }, [id])
  return page && typeof page === 'object' ? page.title ?? null : title
}

/** "01 · Book a Call → Contact Us · 3 sub-links" for header and footer link rows. */
export function LinkRowLabel() {
  const { data, rowNumber } = useRowLabel<{ link?: LinkValue; children?: unknown[] }>()
  const link = data?.link ?? {}
  const pageTitle = usePageTitle(link.type === 'custom' ? null : link.page)
  const number = String((rowNumber ?? 0) + 1).padStart(2, '0')
  const label = link.label?.trim() || 'New link'
  const target = link.type === 'custom' ? link.url?.trim() : pageTitle
  const subLinks = Array.isArray(data?.children) ? data.children.length : 0

  return (
    <span>
      {number} · <strong>{label}</strong>
      {target && <span style={{ opacity: 0.6 }}> → {target}</span>}
      {subLinks > 0 && <span style={{ opacity: 0.6 }}> · {subLinks} sub-link{subLinks === 1 ? '' : 's'}</span>}
    </span>
  )
}

const platformNames: Record<string, string> = { x: 'X (Twitter)', linkedin: 'LinkedIn', youtube: 'YouTube' }

/** "01 · LinkedIn → linkedin.com/company/…" for social profile rows. */
export function SocialRowLabel() {
  const { data, rowNumber } = useRowLabel<{ platform?: string; url?: string }>()
  const number = String((rowNumber ?? 0) + 1).padStart(2, '0')
  const platform = data?.platform
  const name = platform ? platformNames[platform] ?? platform[0].toUpperCase() + platform.slice(1) : 'New profile'
  const url = data?.url?.trim().replace(/^https?:\/\/(www\.)?/, '')
  return (
    <span>
      {number} · <strong>{name}</strong>
      {url && <span style={{ opacity: 0.6 }}> → {url}</span>}
    </span>
  )
}

export function ValueRowLabel() {
  return <span>{useLabel('value', 'New statistic')}</span>
}

export function LabelRowLabel() {
  return <span>{useLabel('label', 'New counter')}</span>
}
