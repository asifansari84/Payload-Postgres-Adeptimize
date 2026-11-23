'use client'

import { useEffect, useState } from 'react'

/**
 * The form posts to /api/forms/<slug>, which redirects back with ?sent=1 or
 * ?error=1. The page itself is static, so the result is read in the browser.
 */
export function ContactFormStatus({ className, successMessage }: { className?: string; successMessage?: string | null }) {
  const [state, setState] = useState<'sent' | 'error' | null>(null)

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    setState(query.has('sent') ? 'sent' : query.has('error') ? 'error' : null)
  }, [])

  if (!state) return null
  return (
    <p role="status" className={className} data-state={state}>
      {state === 'sent'
        ? successMessage || 'Thanks. Your message has been sent.'
        : 'Sorry, your message could not be sent. Please check the fields and try again.'}
    </p>
  )
}
