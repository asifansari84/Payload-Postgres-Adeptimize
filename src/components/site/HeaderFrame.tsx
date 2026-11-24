'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * The sticky <header> element. Tracks scrolling (passive listener, at most
 * once per frame) and sets two attributes for CSS: `data-scrolled` once the
 * page has moved, and `data-hidden` while scrolling down past the first
 * screen, so the header slides away to give content room and returns as soon
 * as the visitor scrolls up. Writes go straight to the DOM; no re-renders.
 */
export function HeaderFrame({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = ref.current
    if (!header) return
    let lastY = Math.max(0, scrollY)
    let frame = 0

    const update = () => {
      frame = 0
      const y = Math.max(0, scrollY)
      header.toggleAttribute('data-scrolled', y > 8)
      if (Math.abs(y - lastY) < 6) return
      const down = y > lastY
      const menuOpen = Boolean(document.querySelector('dialog[open]'))
      header.toggleAttribute('data-hidden', down && y > Math.max(header.offsetHeight * 4, 320) && !menuOpen)
      lastY = y
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }

    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <header ref={ref} className={className}>{children}</header>
}
