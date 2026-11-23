import type { Form, Page } from '@/payload-types'
import { Highlight, MediaImage, pad } from '../../ui/helpers'
import styles from './Contact.module.css'
import { ContactFormStatus } from './ContactFormStatus'

type Section<K extends keyof Page> = NonNullable<Page[K]>
type Details = Page['contactDetails']

const paragraphs = (text?: string | null) => text?.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) ?? []
const lines = (text?: string | null) => text?.split('\n').map((l) => l.trim()).filter(Boolean) ?? []
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

const fallbackFields: Form['fields'] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'message', label: 'Message', type: 'textarea', required: true },
]

export function ContactForm({ form }: { form: Form | null }) {
  const fields = form?.fields?.length ? form.fields : fallbackFields
  const slug = form?.slug ?? 'contact'
  return (
    <form className={styles.form} action={`/api/forms/${encodeURIComponent(slug)}`} method="post" aria-label="Contact form">
      <ContactFormStatus className={styles.notice} successMessage={form?.successMessage} />
      {fields.map((field) => {
        const id = `contact-${field.name}`
        const common = { id, name: field.name, required: Boolean(field.required), className: styles.input }
        return (
          <div key={field.id ?? field.name} className={styles.field} data-wide={field.type === 'textarea' || undefined}>
            <label htmlFor={id}>
              {field.label}
              {field.required && <span aria-hidden="true"> *</span>}
            </label>
            {field.type === 'textarea'
              ? <textarea {...common} rows={5} />
              : <input {...common} type={field.type} autoComplete={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : field.name === 'name' ? 'name' : undefined} />}
          </div>
        )
      })}
      {/* Spam trap: hidden from people, filled in by bots. */}
      <label className={styles.honeypot} aria-hidden="true">
        Website <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" className="button">{form?.submitLabel || 'Send message'}</button>
    </form>
  )
}

export function ContactIntro({ data, form }: { data: Section<'contactIntro'>; form: Form | null }) {
  return (
    <section className={styles.intro} aria-labelledby="contact-intro-title">
      <div className={`container ${styles.introLayout}`}>
        <div className={`${styles.introText} reveal`}>
          <h2 id="contact-intro-title" className={styles.display}><Highlight text={data.heading} /></h2>
          {data.subheading && <p className={styles.subheading}>{data.subheading}</p>}
          {paragraphs(data.text).map((text, index) => <p key={index}>{text}</p>)}
        </div>
        <div id="contact-form" className={`${styles.formCard} reveal`}>
          <ContactForm form={form} />
        </div>
      </div>
    </section>
  )
}

export function ContactDetails({ data }: { data: NonNullable<Details> }) {
  const mapQuery = data.showMap !== false ? (data.mapLocation?.trim() || lines(data.address).join(', ')) : ''
  return (
    <section className={styles.details} aria-labelledby="contact-details-title">
      <div className="container">
        <h2 id="contact-details-title" className={`${styles.display} ${styles.light} reveal`}><Highlight text={data.heading} /></h2>
        <dl className={styles.detailGrid}>
          {data.address && (
            <div className="reveal">
              <dt>Address</dt>
              <dd>{lines(data.address).map((line, i) => <span key={i}>{line}</span>)}</dd>
            </div>
          )}
          {data.email && (
            <div className="reveal">
              <dt>Email</dt>
              <dd><a href={`mailto:${data.email}`}>{data.email}</a></dd>
            </div>
          )}
          {data.phone && (
            <div className="reveal">
              <dt>Phone</dt>
              <dd><a href={telHref(data.phone)}>{data.phone}</a></dd>
            </div>
          )}
          {data.hours && (
            <div className="reveal">
              <dt>{data.hoursHeading || 'Business Hours'}</dt>
              <dd>{lines(data.hours).map((line, i) => <span key={i}>{line}</span>)}</dd>
            </div>
          )}
        </dl>
        {data.note && <p className={`${styles.note} reveal`}>{data.note}</p>}
        {mapQuery && (
          <iframe
            className={`${styles.map} reveal`}
            title={`Map showing ${mapQuery}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>
    </section>
  )
}

export function ContactExpect({ data }: { data: Section<'contactExpect'> }) {
  return (
    <section className={styles.expect} aria-labelledby="contact-expect-title">
      <div className="container">
        <h2 id="contact-expect-title" className={`${styles.display} ${styles.center} reveal`}><Highlight text={data.heading} /></h2>
        {!!data.items?.length && (
          <ol className={styles.steps} role="list">
            {data.items.map((item, index) => (
              <li key={item.id} className={`${styles.step} reveal`}>
                <span className={`${styles.stepNumber} outline-text`} aria-hidden="true">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

export function ContactCta({ data, details }: { data: Section<'contactCta'>; details: Details }) {
  return (
    <section className={styles.cta} aria-labelledby="contact-cta-title">
      <div className={`container ${styles.ctaLayout}`}>
        {data.image && <MediaImage media={data.image} alt="" className={`${styles.ctaImage} reveal`} sizes="(min-width: 64rem) 34rem, 100vw" />}
        <div className={`${styles.ctaText} reveal`}>
          <h2 id="contact-cta-title" className={styles.display}><Highlight text={data.heading} /></h2>
          {data.text && <p>{data.text}</p>}
          {(details?.phone || details?.email) && (
            <p>
              {details.phone && <>Call us at <a href={telHref(details.phone)}>{details.phone}</a></>}
              {details.phone && details.email && ' or '}
              {details.email && <>email <a href={`mailto:${details.email}`}>{details.email}</a></>}
              {' '}to get started.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
