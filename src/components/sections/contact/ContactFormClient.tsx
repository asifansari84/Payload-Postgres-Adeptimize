'use client'

import { useId } from 'react'
import type { FormDefinition } from '@/forms/definitions'
import { MAX_LENGTH } from '@/forms/validation'
import { useFormSubmission } from '@/forms/useFormSubmission'
import styles from './Contact.module.css'

const autoComplete = (name: string, type: string) =>
  type === 'email' ? 'email' : type === 'tel' ? 'tel' : name === 'name' ? 'name' : name === 'company' ? 'organization' : undefined

const readRedirect = (query: URLSearchParams) => (query.has('sent') ? 'sent' : query.has('error') ? 'error' : null)

export function ContactFormClient({ form }: { form: FormDefinition }) {
  const uid = useId()
  const action = `/api/forms/${encodeURIComponent(form.slug)}`
  const { state, message, errors, onSubmit, clearError, submitting } = useFormSubmission({
    action,
    fields: form.fields,
    successMessage: form.successMessage,
    readRedirect,
  })
  const statusId = `${uid}-status`

  return (
    <form
      className={styles.form}
      action={action}
      method="post"
      noValidate
      onSubmit={onSubmit}
      aria-label={form.title || 'Contact form'}
      aria-describedby={message ? statusId : undefined}
      aria-busy={submitting || undefined}
    >
      {form.fields.map((field) => {
        const id = `${uid}-${field.name}`
        const errorId = `${id}-error`
        const error = errors[field.name]
        const common = {
          id,
          name: field.name,
          required: field.required,
          maxLength: MAX_LENGTH[field.type],
          className: styles.input,
          disabled: submitting,
          'aria-invalid': error ? true : undefined,
          'aria-describedby': error ? errorId : undefined,
          onInput: () => clearError(field.name),
        }
        return (
          <div key={field.name} className={styles.field} data-wide={field.type === 'textarea' || undefined}>
            <label htmlFor={id}>
              {field.label}
              {field.required ? <span className={styles.required} aria-hidden="true"> *</span> : <span className={styles.optional}> (optional)</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea {...common} rows={5} />
            ) : (
              <input {...common} type={field.type} autoComplete={autoComplete(field.name, field.type)} inputMode={field.type === 'tel' ? 'tel' : undefined} />
            )}
            {error && <p id={errorId} className={styles.fieldError}>{error}</p>}
          </div>
        )
      })}

      {/* Spam trap: hidden from people, filled in by bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={`button ${styles.submit}`} disabled={submitting} data-loading={submitting || undefined}>
          {submitting && <span className={styles.spinner} aria-hidden="true" />}
          {submitting ? 'Sending…' : form.submitLabel || 'Send message'}
        </button>
        {/* Always in the page so screen readers announce changes to it. */}
        <p id={statusId} role="status" aria-live="polite" className={styles.notice} data-state={state}>
          {message}
        </p>
      </div>
    </form>
  )
}
