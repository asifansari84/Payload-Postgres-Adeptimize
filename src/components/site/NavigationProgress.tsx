'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './NavigationProgress.module.css'

/**
 * Thin bar at the top of the window that starts the moment an internal link
 * is clicked and finishes when the new page arrives, so navigation always
 * feels responsive even while the server is rendering.
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const search = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => setLoading(false), [pathname, search])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element | null)?.closest?.('a')
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return
      const url = new URL(link.href, location.href)
      if (url.origin !== location.origin || url.pathname.startsWith('/admin') || url.pathname.startsWith('/api')) return
      const same = url.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '') && url.search === location.search
      if (!same) setLoading(true)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return <div className={styles.bar} data-loading={loading || undefined} role="progressbar" aria-hidden={!loading} aria-label="Loading page" />
}
