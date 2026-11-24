'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

type Gsap = typeof import('gsap').gsap
type ScrollTriggerType = typeof import('gsap/ScrollTrigger').ScrollTrigger
type Plan = {
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  inner?: HTMLElement
  words?: HTMLElement[]
  outlines?: HTMLElement[]
}

/*
 * Scroll animation engine (GSAP + ScrollTrigger), mounted once in the root
 * layout. GSAP is loaded lazily after hydration, so it never delays first
 * paint or interactivity. It runs again after every client-side navigation
 * and fully cleans up the previous page's tweens and triggers.
 *
 * Markup hooks (all server-rendered, so content is in the HTML for SEO):
 *   .reveal              element reveals when it scrolls into view
 *     data-reveal        pop: logos pop in; clip / clip-x: images (slower fade, and a
 *                        framed photo settles from a slight zoom); anything else
 *                        (up, side, left, right, fade, scale): a soft fade
 *   .split               heading built with <SplitWords>; words rise out of masks
 *   [data-outline]       outlined (.outline-text) lettering draws in left to right
 *   [data-parallax=n]    desktop: drifts at a different speed while scrolling
 *   [data-drift=±1]      desktop: large type slides sideways while scrolling
 *   [data-scrub]         desktop: recede | drift | lift, scroll-scrubbed
 *   [data-stack]         desktop: list of sticky panels; each recedes as the next covers it
 *
 * Elements entering the viewport together are choreographed as one group in
 * document order: heading words first, then copy, images and cards in a
 * stagger. Everything reveals once. Reduced motion: nothing is hidden or moved.
 */
export function MotionEngine() {
  const pathname = usePathname()

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return
      gsap.registerPlugin(ScrollTrigger)
      cleanup = setup(gsap, ScrollTrigger)
      ;(window as Window & { __motionReady?: boolean }).__motionReady = true
    })
    return () => {
      disposed = true
      cleanup()
    }
  }, [pathname])

  return null
}

// True until the engine has run once for this document (a full page load).
let firstLoad = true

function setup(gsap: Gsap, ScrollTrigger: ScrollTriggerType) {
  const initial = firstLoad
  firstLoad = false
  const root = document.documentElement
  // Ignore the iOS/Android address bar showing and hiding (no jumpy refreshes).
  ScrollTrigger.config({ ignoreMobileResize: true })
  const mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', (context) => {
    // The boot script's failsafe already showed everything: leave it alone.
    if (!root.classList.contains('motion')) return
    return reveals(gsap, ScrollTrigger, context, initial)
  })
  mm.add('(min-width: 64rem) and (hover: hover) and (prefers-reduced-motion: no-preference)', () => scrubs(gsap))
  mm.add('(prefers-reduced-motion: no-preference)', () => stacks(gsap))

  // Lazy images and late fonts change the page height; re-measure (debounced).
  let timer = 0
  const refresh = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
  }
  const onLoad = (event: Event) => { if ((event.target as Element)?.tagName === 'IMG') refresh() }
  document.addEventListener('load', onLoad, true)
  document.fonts?.ready.then(refresh)

  return () => {
    window.clearTimeout(timer)
    document.removeEventListener('load', onLoad, true)
    mm.revert()
  }
}

/* ---------- Scroll reveals ---------- */

const CLEAR = 'opacity,visibility,transform,clipPath'

function reveals(gsap: Gsap, ScrollTrigger: ScrollTriggerType, context: gsap.Context, initial: boolean) {
  const small = innerWidth < 768
  const plans = new WeakMap<Element, Plan>()
  const targets = gsap.utils
    .toArray<HTMLElement>('.reveal, .split, [data-outline]')
    .filter((el) => !el.classList.contains('is-done') && !el.closest('[inert]'))

  const pending: HTMLElement[] = []
  for (const el of targets) {
    const rect = el.getBoundingClientRect()
    // Already scrolled past (Back-button scroll restore, anchor links, a fast
    // first scroll before GSAP loaded): just show it, no animation.
    if (rect.bottom < 0) {
      el.classList.add('is-in', 'is-done')
      continue
    }
    // On screen at a full page load: the CSS entrance in globals.css reveals it,
    // so the first paint (and LCP) never waits for JavaScript. Likewise if that
    // entrance has already begun. Client-side navigations are all GSAP.
    if (rect.top < innerHeight && (initial || fallbackStarted(el))) continue
    pending.push(el)
    // Take over from the CSS "before" state first, then set GSAP's own, so
    // GSAP never reads (and keeps) CSS translate/animation values.
    el.classList.add('is-in')
    const plan = prepare(el, small)
    plans.set(el, plan)
    if (plan.from) gsap.set(el, { x: 0, y: 0, ...plan.from })
    if (plan.inner) gsap.set(plan.inner, { scale: 1.08 })
    // y: 0 matters: GSAP folds the CSS `translate` "before" state into its own
    // transform when it first touches an element; this discards it.
    if (plan.words) gsap.set(plan.words, { y: 0, yPercent: 110, rotate: small ? 0 : 4 })
    if (plan.outlines) gsap.set(plan.outlines, { backgroundSize: '0% 100%' })
  }

  /** Shows an element in its final state at once (no animation). */
  const settle = (el: HTMLElement, plan: Plan) => {
    gsap.set(el, { clearProps: CLEAR })
    if (plan.inner) gsap.set(plan.inner, { clearProps: 'transform' })
    if (plan.words) gsap.set(plan.words, { clearProps: 'transform' })
    if (plan.outlines) gsap.set(plan.outlines, { clearProps: 'backgroundSize' })
    el.classList.add('is-done')
  }

  // One cascade shared by every batch, so elements arriving a moment apart
  // still reveal one after another in order rather than all at once.
  let cursor = 0

  // Runs inside the GSAP context, so tweens started later on scroll are also
  // reverted when the page changes.
  const play = (batch: Element[]) => context.add(() => {
    const now = gsap.ticker.time
    cursor = Math.max(cursor, now)
    const group = (batch as HTMLElement[]).sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    for (const el of group) {
      const plan = plans.get(el)
      if (!plan) continue
      // Skipped over by a fast scroll or jump: no point animating off screen,
      // and it must not hold up what the visitor is actually looking at.
      if (el.getBoundingClientRect().bottom < 0) {
        settle(el, plan)
        continue
      }
      const delay = Math.min(cursor - now, 0.9)
      const base = small ? 0.85 : 1.15
      if (plan.to) gsap.to(el, { ...plan.to, delay, clearProps: CLEAR, onComplete: () => el.classList.add('is-done') })
      if (plan.inner) gsap.to(plan.inner, { scale: 1, duration: base * 1.6, delay, ease: 'power2.out', clearProps: 'transform' })
      if (plan.words) {
        gsap.to(plan.words, {
          y: 0, yPercent: 0, rotate: 0, duration: base + 0.15, delay, ease: 'power4.out', stagger: small ? 0.04 : 0.065, clearProps: 'transform',
          onComplete: () => el.classList.add('is-done'),
        })
      }
      if (plan.outlines) {
        gsap.to(plan.outlines, { backgroundSize: '100% 100%', duration: 1.5, delay: delay + 0.25, ease: 'power2.inOut', clearProps: 'backgroundSize', onComplete: () => el.classList.add('is-done') })
      }
      // Headings lead; everything after follows in a gentle cascade.
      cursor = Math.min(cursor + (plan.words ? (small ? 0.2 : 0.3) : small ? 0.09 : 0.12), now + 0.9)
    }
  })

  ScrollTrigger.batch(pending, {
    // Reveal when the top passes 88% of the screen. Content in the last
    // screenful (which can never scroll that far) triggers at the very bottom;
    // content already on screen has a negative start and plays straight away.
    start: (self: ScrollTrigger) => {
      const top = (self.trigger as Element).getBoundingClientRect().top + scrollY
      return Math.min(top - innerHeight * 0.88, ScrollTrigger.maxScroll(window) - 2)
    },
    once: true,
    interval: 0.1,
    batchMax: 12,
    onEnter: play,
  })

  return () => {
    // Anything not revealed yet goes back to its CSS "before" state.
    for (const el of pending) if (!el.classList.contains('is-done')) el.classList.remove('is-in')
  }
}

/** Whether the CSS fallback entrance (globals.css) is already under way on this element. */
function fallbackStarted(el: HTMLElement) {
  const node = el.classList.contains('split')
    ? el.querySelector('.w')
    : !el.classList.contains('reveal') && el.hasAttribute('data-outline') && !el.classList.contains('outline-text')
      ? el.querySelector('.outline-text')
      : el
  return Boolean(node?.getAnimations().some((a) => /-fallback$/.test((a as CSSAnimation).animationName ?? '') && a.effect?.getComputedTiming().progress != null))
}

function prepare(el: HTMLElement, small: boolean): Plan {
  const plan: Plan = {}

  const words = el.classList.contains('split') ? Array.from(el.querySelectorAll<HTMLElement>('.w')) : []
  if (words.length) plan.words = words
  if (el.hasAttribute('data-outline')) {
    const outlines = el.classList.contains('outline-text') ? [el] : Array.from(el.querySelectorAll<HTMLElement>('.outline-text'))
    if (outlines.length) plan.outlines = outlines
  }
  if (!el.classList.contains('reveal')) return plan

  // Reveals are fades: content and images appear in place, without sliding
  // or wiping. Framed photos also settle from a slight zoom inside their frame.
  const duration = small ? 0.9 : 1.2
  const fade = { autoAlpha: 1, duration, ease: 'power2.out' }

  switch (el.dataset.reveal) {
    case 'pop':
      // Logos: a gentle pop.
      plan.from = { autoAlpha: 0, scale: 0.85 }
      plan.to = { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }
      break
    case 'clip':
    case 'clip-x': {
      // Images: a slower fade.
      plan.from = { autoAlpha: 0 }
      plan.to = { ...fade, duration: duration * 1.25 }
      // Zoom only inside a frame that clips, so the photo never spills past it.
      const img = el.tagName === 'IMG' ? null : el.querySelector<HTMLElement>('img')
      if (img && /hidden|clip/.test(getComputedStyle(el).overflow)) plan.inner = img
      break
    }
    default:
      // Text, cards and everything else (up, side, left, right, fade, scale).
      plan.from = { autoAlpha: 0 }
      plan.to = fade
  }
  return plan
}

/* ---------- Desktop scroll-scrubbed effects ---------- */

function scrubs(gsap: Gsap) {
  const scrub = 0.6

  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.1')
    gsap.fromTo(el, { y: () => innerHeight * speed * 0.5 }, {
      y: () => -innerHeight * speed * 0.5,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub, invalidateOnRefresh: true },
    })
  })

  gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
    const dir = Number(el.dataset.drift) || 1
    gsap.fromTo(el, { xPercent: -4 * dir }, {
      xPercent: 4 * dir,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    })
  })

  gsap.utils.toArray<HTMLElement>('[data-scrub]').forEach((el) => {
    const trigger = el.closest('section, header') ?? el
    const st = { trigger, start: 'top top', end: 'bottom top', scrub }
    switch (el.dataset.scrub) {
      case 'recede':
        gsap.to(el, { scale: 0.9, opacity: 0.55, transformOrigin: '50% 0%', ease: 'none', scrollTrigger: { ...st, trigger: el, start: 'top 35%' } })
        break
      case 'drift':
        gsap.to(el, { yPercent: 20, ease: 'none', scrollTrigger: st })
        break
      case 'lift':
        gsap.to(el, { yPercent: -35, opacity: 0, ease: 'none', scrollTrigger: st })
        break
    }
  })
}

/*
 * Sticky stacked panels (all screen sizes): as the next panel slides over,
 * the one beneath shrinks back and dims. Each panel's height is measured for
 * the CSS (see Differentiators.module.css) so tall panels stick by their
 * bottom edge, and kept current as content or the viewport resizes.
 */
function stacks(gsap: Gsap) {
  const cleanups: (() => void)[] = []
  const small = innerWidth < 768

  gsap.utils.toArray<HTMLElement>('[data-stack]').forEach((list) => {
    const panels = Array.from(list.children) as HTMLElement[]
    const measure = () => panels.forEach((panel) => panel.style.setProperty('--panel-h', `${panel.offsetHeight}px`))
    measure()
    list.setAttribute('data-stack-ready', '')
    const observer = new ResizeObserver(measure)
    panels.forEach((panel) => observer.observe(panel))
    cleanups.push(() => {
      observer.disconnect()
      list.removeAttribute('data-stack-ready')
      panels.forEach((panel) => panel.style.removeProperty('--panel-h'))
    })

    panels.slice(0, -1).forEach((panel, i) => {
      const content = panel.firstElementChild as HTMLElement | null
      if (!content) return
      gsap.to(content, {
        scale: small ? 0.92 : 0.9,
        opacity: small ? 0.4 : 0.35,
        // Shrink around the part of the panel that is on screen while it is stuck.
        transformOrigin: () => (panel.offsetHeight > innerHeight ? `50% ${panel.offsetHeight - innerHeight / 2}px` : '50% 0%'),
        ease: 'none',
        scrollTrigger: { trigger: panels[i + 1], start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true },
      })
    })
  })

  return () => cleanups.forEach((cleanup) => cleanup())
}
