'use client'

import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Adds a back arrow before the title on every inner admin screen (editing or
 * creating a document, its versions, etc.). It leads one level up: from a
 * document to its list, from a version to the document.
 *
 * Payload has no slot beside the document title, so the arrow is placed into
 * the title row with a portal once that row is on the page.
 */
export default function BackToList({ children }: { children?: ReactNode }) {
  const pathname = usePathname()
  const {
    config: {
      routes: { admin: adminRoute },
    },
    getEntityConfig,
  } = useConfig()

  const prefix = `${adminRoute === '/' ? '' : adminRoute}/collections/`
  const segments = pathname.startsWith(prefix) ? pathname.slice(prefix.length).split('/').filter(Boolean) : []
  const isInner = segments.length >= 2
  const href = isInner ? prefix + segments.slice(0, -1).join('/') : null

  let label = 'Back'
  if (segments.length === 2) {
    const plural = getEntityConfig({ collectionSlug: segments[0] })?.labels?.plural
    label = `Back to ${typeof plural === 'string' ? plural : segments[0]}`
  }

  const [target, setTarget] = useState<HTMLElement | null>(null)

  // Wait for the title row to render, then put a slot at its start.
  useEffect(() => {
    if (!isInner) return
    let slot: HTMLElement | null = null
    const attach = () => {
      const row = document.querySelector<HTMLElement>('.doc-header__header')
      if (!row) return false
      slot = row.querySelector<HTMLElement>(':scope > .adeptimize-back-slot')
      if (!slot) {
        slot = document.createElement('div')
        slot.className = 'adeptimize-back-slot'
        row.prepend(slot)
      }
      setTarget(slot)
      return true
    }
    if (attach()) return () => slot?.remove()
    const observer = new MutationObserver(() => attach() && observer.disconnect())
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      slot?.remove()
      setTarget(null)
    }
  }, [isInner, pathname])

  return (
    <>
      {children}
      {href && target
        ? createPortal(
            <Link aria-label={label} className="adeptimize-back" href={href} prefetch={false} title={label}>
              <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </Link>,
            target,
          )
        : null}
    </>
  )
}
