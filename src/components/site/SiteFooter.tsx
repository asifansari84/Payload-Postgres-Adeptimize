import type { Footer } from '@/payload-types'
import { CMSLink, MediaImage } from '../ui/helpers'
import { NewsletterStatus } from './NewsletterStatus'
import { socialIcons as icons } from '../ui/socialIcons'
import styles from './SiteFooter.module.css'


export function SiteFooter({ footer }: { footer: Footer | null }) {
  if (!footer) return null
  const year = String(new Date().getFullYear())

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <section className={styles.cta} aria-label="Start a project">
          {footer.logo && <MediaImage media={footer.logo} alt="Adeptimize" className={styles.logo} sizes="20.75rem" />}
          <p className={styles.headline}>
            <span className={`${styles.eyebrow} outline-text`}>{footer.ctaEyebrow}</span>
            <span className={styles.row}>
              <span className={styles.big}>{footer.ctaTitle}</span>
              <span className={styles.aside}>{footer.ctaAside}</span>
            </span>
          </p>
          {footer.text && <p className={styles.text}>{footer.text}</p>}
          {!!footer.social?.length && (
            <ul className={styles.social} role="list">
              {footer.social.map((item) => (
                <li key={item.id}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.platform}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d={icons[item.platform]} /></svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className={styles.columns}>
          {footer.columns?.map((column) => (
            <nav key={column.id} aria-label={column.title}>
              <h2 className={styles.heading}>{column.title}</h2>
              <ul role="list">
                {column.links?.map((item) => (
                  <li key={item.id}><CMSLink link={item.link} className={styles.link} /></li>
                ))}
              </ul>
            </nav>
          ))}

          <div className={styles.contact}>
            {!!footer.hours?.length && (
              <>
                <h2 className={styles.heading}>{footer.hoursTitle}</h2>
                <ul role="list" className={styles.hours}>
                  {footer.hours.map((item) => <li key={item.id}>{item.line}</li>)}
                </ul>
              </>
            )}
            {(footer.email || footer.phone) && (
              <address>
                <h2 className={styles.heading}>{footer.contactTitle}</h2>
                {footer.email && <a className={styles.link} href={`mailto:${footer.email}`}>{footer.email}</a>}
                {footer.phone && <a className={styles.link} href={`tel:${footer.phone.replace(/[^\d+]/g, '')}`}>{footer.phone}</a>}
              </address>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <h2 className={styles.heading} id="newsletter-title">{footer.newsletterTitle}</h2>
          <form id="footer-newsletter" className={styles.newsletter} action="/api/forms/newsletter" method="post" aria-labelledby="newsletter-title">
            <label className="visually-hidden" htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" type="email" name="email" required maxLength={254} autoComplete="email" placeholder={footer.newsletterPlaceholder ?? 'Your e-mail'} />
            <input className="visually-hidden" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button type="submit" aria-label="Sign up for the newsletter">
              <svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12"><path d="M3 13 13 3M5 3h8v8" /></svg>
            </button>
          </form>
          <NewsletterStatus />
          {footer.copyright && <p className={styles.copyright}>{footer.copyright.replace('{year}', year)}</p>}
        </div>
      </div>
    </footer>
  )
}
