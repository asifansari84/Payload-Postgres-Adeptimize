'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import type { FormFieldDef } from './definitions'
import { validateSubmission } from './validation'

export type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

type Options = {
  action: string
  fields: FormFieldDef[]
  successMessage?: string
  /**
   * Reads the result of a no-JavaScript submission, which comes back as a
   * redirect with the outcome in the query string.
   */
  readRedirect?: (query: URLSearchParams) => 'sent' | 'error' | null
}

const NETWORK_ERROR = 'We couldn’t reach the server. Check your connection and try again.'

/**
 * Submits a form with fetch (no page reload), with the same validation the
 * server runs, field-level errors, and a loading state.
 */
export function useFormSubmission({ action, fields, successMessage, readRedirect }: Options) {
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const startedAt = useRef(0)

  useEffect(() => {
    startedAt.current = Date.now()
    const outcome = readRedirect?.(new URLSearchParams(window.location.search))
    if (outcome === 'sent') {
      setState('success')
      setMessage(successMessage || 'Thanks. We received your submission.')
    } else if (outcome === 'error') {
      setState('error')
      setMessage('Sorry, we couldn’t send that. Please check the fields and try again.')
    }
    // Only on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const focusFirstError = (form: HTMLFormElement, names: string[]) => {
    const first = fields.find((f) => names.includes(f.name))
    if (first) form.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus()
  }

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (state === 'submitting') return
      const form = event.currentTarget
      const data = new FormData(form)

      const check = validateSubmission(fields, (name) => data.get(name))
      setErrors(check.errors)
      if (Object.keys(check.errors).length) {
        setState('error')
        setMessage('Please fix the highlighted fields.')
        focusFirstError(form, Object.keys(check.errors))
        return
      }

      data.set('_ts', String(startedAt.current))
      // The page the visitor is on, so each lead records where it came from.
      data.set('_source', window.location.href)
      setState('submitting')
      setMessage('')
      try {
        const response = await fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; errors?: Record<string, string> } | null
        if (response.ok && result?.ok) {
          setState('success')
          setMessage(result.message || successMessage || 'Thanks. We received your submission.')
          setErrors({})
          form.reset()
          startedAt.current = Date.now()
        } else {
          setState('error')
          setMessage(result?.message || 'Sorry, we couldn’t send that. Please try again.')
          setErrors(result?.errors ?? {})
          if (result?.errors) focusFirstError(form, Object.keys(result.errors))
        }
      } catch {
        setState('error')
        setMessage(NETWORK_ERROR)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [action, fields, state, successMessage],
  )

  /** Clears a field's error as soon as the visitor edits it. */
  const clearError = useCallback((name: string) => {
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }, [])

  return { state, message, errors, onSubmit, clearError, submitting: state === 'submitting' }
}
