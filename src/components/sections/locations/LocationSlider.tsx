'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import styles from './LocationSlider.module.css'

export type Slide = {
  id: string | number
  title: string
  href: string
  image: ReactNode
  icon?: ReactNode
  animation?: 'hang' | 'pulse' | 'spin' | null
}

/**
 * Full-screen slider: autoplays in a loop, pauses on hover, focus or the
 * pause button, and stays still for visitors who prefer reduced motion.
 *
 * Slides are stacked: the incoming slide wipes in over the outgoing one in the
 * direction of travel, so looping from the last slide back to the first is as
 * smooth as any other step.
 */
export function LocationSlider({ slides, interval = 5 }: { slides: Slide[]; interval?: number }) {
  const [index, setIndex] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [reduced, setReduced] = useState(false)
  const touch = useRef<number | null>(null)
  const count = slides.length

  const go = useCallback(
    (next: number, dir: 'next' | 'prev' = next > index ? 'next' : 'prev') => {
      const target = ((next % count) + count) % count
      if (target === index) return
      setDirection(dir)
      setPrevious(index)
      setIndex(target)
    },
    [count, index],
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const playing = !paused && !hovered && !reduced && count > 1
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => go(index + 1, 'next'), interval * 1000)
    return () => window.clearTimeout(timer)
  }, [playing, index, interval, go])

  if (!count) return null

  return (
    <section
      className={styles.slider}
      aria-roledescription="carousel"
      aria-label="Locations"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false) }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(index + 1, 'next')
        if (event.key === 'ArrowLeft') go(index - 1, 'prev')
      }}
      onTouchStart={(event) => { touch.current = event.touches[0].clientX }}
      onTouchEnd={(event) => {
        if (touch.current === null) return
        const delta = event.changedTouches[0].clientX - touch.current
        if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1), delta < 0 ? 'next' : 'prev')
        touch.current = null
      }}
    >
      <div className={styles.track} data-direction={direction} aria-live={playing ? 'off' : 'polite'}>
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${slide.title}`}
            aria-hidden={i !== index}
            inert={i !== index}
            data-state={i === index ? 'active' : i === previous ? 'leaving' : undefined}
          >
            <div className={styles.media} aria-hidden="true">{slide.image}</div>
            <div className={`container ${styles.content}`}>
              <h2 className={styles.title}>
                <Link href={slide.href} aria-label={slide.title}>
                  {slide.title.split(/\s+/).map((word, w) => (
                    <span key={w} className={styles.word} aria-hidden="true">
                      <span style={{ '--i': w } as CSSProperties}>{word}</span>
                    </span>
                  ))}
                </Link>
                {slide.icon && <span className={styles.icon} data-animation={slide.animation ?? 'hang'} aria-hidden="true">{slide.icon}</span>}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className={`container ${styles.controls}`}>
          <button type="button" className={styles.nav} onClick={() => go(index - 1, 'prev')}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d="M15 5l-7 7 7 7" /></svg>
            Prev
          </button>
          <div className={styles.dots}>
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                className={styles.dot}
                aria-label={`Show ${slide.title}`}
                aria-current={i === index || undefined}
                onClick={() => go(i, i > index ? 'next' : 'prev')}
              />
            ))}
            {!reduced && (
              <button type="button" className={styles.pause} onClick={() => setPaused(!paused)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14">
                  {paused ? <path d="M7 4l13 8-13 8z" /> : <path d="M7 4h4v16H7zM13 4h4v16h-4z" />}
                </svg>
              </button>
            )}
          </div>
          <button type="button" className={styles.nav} onClick={() => go(index + 1, 'next')}>
            Next
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </section>
  )
}
