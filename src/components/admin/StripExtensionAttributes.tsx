'use client'

import type { ReactNode } from 'react'

/**
 * Some browser extensions (e.g. ColorZilla) inject attributes onto <html>/<body>
 * before React hydrates, causing a hydration mismatch in the Payload admin.
 * Payload's RootLayout renders <body> without `suppressHydrationWarning`, so we
 * strip those attributes at module evaluation time — which runs before hydration.
 */
const EXTENSION_ATTRIBUTES = ['cz-shortcut-listen', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed']

if (typeof document !== 'undefined') {
  for (const el of [document.documentElement, document.body]) {
    if (!el) continue
    for (const attr of EXTENSION_ATTRIBUTES) el.removeAttribute(attr)
  }
}

const StripExtensionAttributes = ({ children }: { children?: ReactNode }) => <>{children}</>

export default StripExtensionAttributes
