/**
 * Tiny boot script, inlined into <head> by the root layout so it runs before
 * first paint. It adds `motion` to <html>, which lets globals.css hold
 * scroll-revealed content in its "before" state until the GSAP engine
 * (MotionEngine) takes over after hydration, so there is no flash.
 *
 * Safety nets: nothing is hidden for visitors who prefer reduced motion, and
 * if the engine has not started within four seconds (slow network, script
 * error, blocked JS) the class is removed and everything simply shows.
 */
const boot = () => {
  const root = document.documentElement
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  root.classList.add('motion')
  setTimeout(() => {
    if (!(window as Window & { __motionReady?: boolean }).__motionReady) root.classList.remove('motion')
  }, 4000)
}

export const motionScript = `(${boot.toString()})()`
