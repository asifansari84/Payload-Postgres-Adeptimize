/**
 * Runs in the browser before React hydrates (Next.js `instrumentation-client`).
 *
 * Some browser extensions (e.g. ColorZilla, Grammarly) inject attributes onto
 * <html>/<body> before hydration, which causes hydration-mismatch errors —
 * Payload's RootLayout renders <body> without `suppressHydrationWarning`.
 * Stripping them here is reliable because this runs before any app code.
 */
const EXTENSION_ATTRIBUTES = [
  'cz-shortcut-listen',
  'data-new-gr-c-s-check-loaded',
  'data-gr-ext-installed',
]

for (const el of [document.documentElement, document.body]) {
  if (!el) continue
  for (const attr of EXTENSION_ATTRIBUTES) el.removeAttribute(attr)
}
