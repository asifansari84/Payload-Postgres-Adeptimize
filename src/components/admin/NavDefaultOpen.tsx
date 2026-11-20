'use client'

import { useNav, usePreferences } from '@payloadcms/ui'
import { useEffect } from 'react'

/**
 * Payload starts the sidebar closed on screens up to 1440px wide. Open it by
 * default on anything wider than a tablet (where it sits beside the content,
 * not over it), unless the editor has closed it themselves — Payload stores
 * that choice in the "nav" preference.
 */
export default function NavDefaultOpen() {
  const { setNavOpen } = useNav()
  const { getPreference } = usePreferences()

  useEffect(() => {
    let cancelled = false
    // Wait a tick so this runs after Payload's own breakpoint handling.
    const timer = window.setTimeout(async () => {
      if (window.innerWidth <= 1024) return
      const preference = (await getPreference<{ open?: boolean }>('nav').catch(() => null)) ?? null
      if (!cancelled && preference?.open !== false) setNavOpen(true)
    }, 60)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [getPreference, setNavOpen])

  return null
}
