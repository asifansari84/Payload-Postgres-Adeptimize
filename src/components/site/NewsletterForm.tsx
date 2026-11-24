'use client'

import { NEWSLETTER_FORM } from '@/forms/definitions'
import { MAX_LENGTH } from '@/forms/validation'
import { useFormSubmission } from '@/forms/useFormSubmission'
import styles from './SiteFooter.module.css'

const action = `/api/forms/${NEWSLETTER_FORM.slug}`
const readRedirect = (query: URLSearchParams) => {
  const result = query.get('newsletter')
  return result === 'sent' || result === 'error' ? result : null
}

export function NewsletterForm({ placeholder, labelledBy }: { placeholder?: string | null; labelledBy: string }) {
  const { state, message, errors, onSubmit, clearError, submitting } = useFormSubmission({
    action,
    fields: NEWSLETTER_FORM.fields,
    successMessage: NEWSLETTER_FORM.successMessage,
    readRedirect,
  })
  const error = errors.email

  return (
    <div className={styles.newsletterWrap}>
      <form
        id="footer-newsletter"
        className={styles.newsletter}
        action={action}
        method="post"
        noValidate
        onSubmit={onSubmit}
        aria-labelledby={labelledBy}
        aria-busy={submitting || undefined}
      >
        <label className="visually-hidden" htmlFor="newsletter-email">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          maxLength={MAX_LENGTH.email}
          autoComplete="email"
          inputMode="email"
          placeholder={placeholder ?? 'Your e-mail'}
          disabled={submitting}
          aria-invalid={error ? true : undefined}
          aria-describedby="newsletter-status"
          onInput={() => clearError('email')}
        />
        <div className="visually-hidden" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <button type="submit" aria-label="Sign up for the newsletter" disabled={submitting} data-loading={submitting || undefined}>
          {submitting ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : (
            <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12"><path d="M3 13 13 3M5 3h8v8" /></svg>
          )}
        </button>
      </form>
      <p id="newsletter-status" role="status" aria-live="polite" className={styles.newsletterStatus} data-state={state}>
        {error || message}
      </p>
    </div>
  )
}
