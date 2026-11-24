'use client'

import { useEffect, useRef } from 'react'

/**
 * Renders a statistic such as "250+", "$1.2M" or "98%" and counts its number
 * up from zero the first time it scrolls into view.
 *
 * The final value is server-rendered (good for SEO and no-JS visitors). The
 * count writes straight to the text node, so React never re-renders, and the
 * box keeps the final width while counting so nothing around it shifts.
 * Values already on screen at load, values without a number, and visitors
 * who prefer reduced motion all just see the final value.
 */
export function AnimatedValue({ value, duration = 1600 }: { value: string | number; duration?: number }) {
  const text = String(value)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const node = el?.firstChild
    const match = text.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)([\s\S]*)$/)
    if (!el || !node || !match || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    if (rect.top < innerHeight && rect.bottom > 0) return

    const [, prefix, digits, suffix] = match
    const target = parseFloat(digits.replace(/,/g, ''))
    const decimals = digits.split('.')[1]?.length ?? 0
    const format = new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: digits.includes(',') })
    const set = (n: number) => { node.nodeValue = prefix + format.format(n) + suffix }

    el.style.display = 'inline-block'
    el.style.minInlineSize = `${rect.width}px`
    set(0)

    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration)
        if (progress < 1) {
          set(target * (1 - (1 - progress) ** 3))
          frame = requestAnimationFrame(tick)
        } else {
          node.nodeValue = text
        }
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      node.nodeValue = text
    }
  }, [text, duration])

  return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>{text}</span>
}
