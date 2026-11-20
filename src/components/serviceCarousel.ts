const autoplayDelay = 3000
const slideDuration = 850
const edgeSlides = 3

export function setupServiceCarousel(carousel: HTMLElement, track: HTMLElement, signal: AbortSignal) {
  const originals = Array.from(track.querySelectorAll<HTMLElement>(':scope > .swiper-slide'))
  if (originals.length <= edgeSlides) return

  const cloneSlide = (slide: HTMLElement) => {
    const clone = slide.cloneNode(true) as HTMLElement
    clone.setAttribute('aria-hidden', 'true')
    clone.querySelectorAll('a').forEach((link) => { link.tabIndex = -1 })
    return clone
  }
  const before = originals.slice(-edgeSlides).map(cloneSlide)
  const after = originals.slice(0, edgeSlides).map(cloneSlide)
  const slides = [...before, ...originals, ...after]
  const separators: HTMLElement[] = []
  const separate = (place: 'prepend' | 'append') => {
    const separator = document.createElement('div')
    separator.hidden = true
    track[place](separator)
    separators.push(separator)
  }

  // Keep the theme's alternating card layouts identical in the originals and loop copies.
  const leadingSeparator = (originals.length - edgeSlides) % 2
  if ((edgeSlides + leadingSeparator) % 2) separate('prepend')
  track.prepend(...before)
  if (leadingSeparator) separate('prepend')
  if (originals.length % 2) separate('append')
  track.append(...after)
  carousel.classList.add('adeptimize-service-carousel')

  const center = (slide: HTMLElement) => {
    const box = slide.getBoundingClientRect()
    return track.scrollLeft + box.left - track.getBoundingClientRect().left + (box.width - track.clientWidth) / 2
  }
  const closestIndex = () => {
    const left = track.scrollLeft
    const step = slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left
    if (step <= 0) return edgeSlides + 1
    return Math.max(0, Math.min(slides.length - 1, Math.round((left - center(slides[0])) / step)))
  }
  const originalIndex = (index: number) => edgeSlides + (index - edgeSlides + originals.length) % originals.length
  const scrollTo = (index: number, behavior: ScrollBehavior) => {
    track.scrollTo({ left: center(slides[index]), behavior })
  }

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const mouse = window.matchMedia('(hover: hover)')
  let currentIndex = edgeSlides + 1
  let scrolling = false
  let settleTimer: number | undefined
  let animationFrame: number | undefined

  const stopAnimation = () => {
    if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame)
    animationFrame = undefined
    track.classList.remove('adeptimize-service-sliding')
  }

  const move = (direction: -1 | 1) => {
    const index = closestIndex()
    const next = index + direction
    if (next < 0 || next >= slides.length) {
      const real = originalIndex(index)
      scrollTo(real, 'instant')
      scrollTo(real + direction, motion.matches ? 'instant' : 'smooth')
      return
    }
    scrollTo(next, motion.matches ? 'instant' : 'smooth')
  }

  track.addEventListener('keydown', (event) => {
    if (event.target !== track || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
    event.preventDefault()
    stopAnimation()
    move(event.key === 'ArrowLeft' ? -1 : 1)
  }, { signal })
  track.addEventListener('pointerdown', stopAnimation, { signal })
  motion.addEventListener('change', stopAnimation, { signal })

  const settle = () => {
    if (animationFrame !== undefined) return
    window.clearTimeout(settleTimer)
    scrolling = false
    const index = closestIndex()
    currentIndex = originalIndex(index)
    if (index !== currentIndex) scrollTo(currentIndex, 'instant')
  }
  track.addEventListener('scrollend', settle, { signal })
  track.addEventListener('scroll', () => {
    if (animationFrame !== undefined) return
    scrolling = true
    window.clearTimeout(settleTimer)
    settleTimer = window.setTimeout(settle, 100)
  }, { signal, passive: true })

  scrollTo(currentIndex, 'instant')
  let trackWidth = track.clientWidth
  const resize = new ResizeObserver(() => {
    if (!track.clientWidth || track.clientWidth === trackWidth) return
    trackWidth = track.clientWidth
    stopAnimation()
    scrollTo(currentIndex, 'instant')
  })
  resize.observe(track)

  const autoplay = window.setInterval(() => {
    if (motion.matches || document.hidden || scrolling || animationFrame !== undefined) return
    if (carousel.matches(':focus-within') || (mouse.matches && carousel.matches(':hover'))) return

    const { top, bottom } = track.getBoundingClientRect()
    if (top >= window.innerHeight || bottom <= 0) return

    const index = closestIndex()
    const real = originalIndex(index)
    if (real !== index) scrollTo(real, 'instant')
    const from = track.scrollLeft
    const to = center(slides[real + 1])
    let started: number | undefined
    track.classList.add('adeptimize-service-sliding')
    const glide = (time: number) => {
      started ??= time
      const progress = Math.min((time - started) / slideDuration, 1)
      const eased = progress * progress * (3 - 2 * progress)
      track.scrollTo({ left: from + (to - from) * eased, behavior: 'instant' })
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(glide)
      } else {
        animationFrame = undefined
        settle()
        stopAnimation()
      }
    }
    animationFrame = window.requestAnimationFrame(glide)
  }, autoplayDelay)

  signal.addEventListener('abort', () => {
    window.clearInterval(autoplay)
    window.clearTimeout(settleTimer)
    stopAnimation()
    resize.disconnect()
    for (const node of [...before, ...after, ...separators]) node.remove()
    carousel.classList.remove('adeptimize-service-carousel')
  })
}
