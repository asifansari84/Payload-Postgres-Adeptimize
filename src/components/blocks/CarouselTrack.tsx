'use client'

import { type ReactNode, useEffect, useRef } from 'react'

/** Scroll-snap track that advances one card every few seconds. */
export function CarouselTrack({ className, label, children }: { className: string; label: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const track = ref.current
    if (!track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let paused = false
    const pause = () => { paused = true }
    const resume = () => { paused = false }
    const events: [string, () => void][] = [['pointerenter', pause], ['pointerleave', resume], ['focusin', pause], ['focusout', resume], ['touchstart', pause]]
    events.forEach(([name, handler]) => track.addEventListener(name, handler, { passive: true }))

    const timer = window.setInterval(() => {
      if (paused || document.hidden) return
      const card = track.firstElementChild as HTMLElement | null
      if (!card) return
      const step = card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || '0')
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step, behavior: 'smooth' })
    }, 3000)

    return () => {
      window.clearInterval(timer)
      events.forEach(([name, handler]) => track.removeEventListener(name, handler))
    }
  }, [])

  return (
    <ul ref={ref} className={className} role="list" aria-label={label} tabIndex={0}>
      {children}
    </ul>
  )
}
