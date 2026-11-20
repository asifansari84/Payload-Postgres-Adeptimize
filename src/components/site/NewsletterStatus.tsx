'use client'

import { useEffect, useState } from 'react'

export function NewsletterStatus() {
  const [message, setMessage] = useState('')
  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get('newsletter')
    if (result === 'sent') setMessage('Thanks. We received your signup.')
    if (result === 'error') setMessage('We couldn’t save your signup. Please try again.')
  }, [])
  return <p role="status" style={{ marginBlockStart: message ? '0.75rem' : 0, color: '#ccc' }}>{message}</p>
}
