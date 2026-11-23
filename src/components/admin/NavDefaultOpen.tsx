'use client'

import { useConfig, useNav } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const STORAGE_KEY = 'adeptimize:nav-open'
/** At this width and below the sidebar overlays the content, so Payload's own behaviour is kept. */
const OVERLAY_MAX_WIDTH = 1024
/** Editing one of these closes the sidebar so the editor gets the full width. */
const FOCUS_COLLECTIONS = ['pages', 'posts', 'services', 'locations']

const readWantsOpen = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

const writeWantsOpen = (open: boolean) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(open))
  } catch {
    // Storage unavailable (private mode etc.): the sidebar simply stays open.
  }
}

/**
 * Controls when the admin sidebar is open:
 * - Editing a page, post, service or location: closed, so the editor has the
 *   full width. The arrow still opens it.
 * - Everywhere else: open until the editor closes it with the arrow. Payload
 *   closes it by itself on screens up to 1440px wide and doesn't remember the
 *   arrow there, so the editor's choice is remembered here instead.
 */
export default function NavDefaultOpen() {
  const { navOpen, setNavOpen } = useNav()
  const pathname = usePathname()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const prefix = `${adminRoute === '/' ? '' : adminRoute}/collections/`
  const [collection, docId] = pathname.startsWith(prefix) ? pathname.slice(prefix.length).split('/') : []
  const isEditing = Boolean(docId) && FOCUS_COLLECTIONS.includes(collection)

  const navOpenRef = useRef(navOpen)
  navOpenRef.current = navOpen
  const isEditingRef = useRef(isEditing)
  isEditingRef.current = isEditing

  // Remember the editor's choice when they click a sidebar arrow outside the
  // edit screens (capture runs before Payload's own handler toggles the state).
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isEditingRef.current) return
      if ((event.target as Element | null)?.closest?.('.nav-toggler')) writeWantsOpen(!navOpenRef.current)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  // Opening an edit screen closes the sidebar; leaving it restores the editor's choice.
  // Runs after a tick so it comes after Payload's own effects.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (window.innerWidth <= OVERLAY_MAX_WIDTH) return
      setNavOpen(isEditing ? false : readWantsOpen())
    }, 50)
    return () => window.clearTimeout(timer)
  }, [isEditing, setNavOpen])

  // Outside the edit screens, undo any automatic close by Payload (on load and on resize).
  useEffect(() => {
    if (isEditing) return
    let timer: number | undefined
    const check = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (!navOpenRef.current && window.innerWidth > OVERLAY_MAX_WIDTH && readWantsOpen()) setNavOpen(true)
      }, 50)
    }
    check()
    window.addEventListener('resize', check)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', check)
    }
  }, [isEditing, navOpen, setNavOpen])

  return null
}
