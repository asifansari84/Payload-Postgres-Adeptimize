import type { Footer } from '@/payload-types'
import { CMSLink, MediaImage } from '../ui/helpers'
import { NewsletterForm } from './NewsletterForm'
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
          <p className={styles.headline} data-outline>
            <span className={`${styles.eyebrow} outline-text`} data-drift="-1">{footer.ctaEyebrow}</span>
            <span className={`${styles.row} reveal`}>
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
            <nav key={column.id} aria-label={column.title} className="reveal">
              <h2 className={styles.heading}>{column.title}</h2>
              <ul role="list">
                {column.links?.map((item) => (
                  <li key={item.id}><CMSLink link={item.link} className={styles.link} /></li>
                ))}
              </ul>
            </nav>
          ))}

          <div className={`${styles.contact} reveal`}>
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
          <NewsletterForm labelledBy="newsletter-title" placeholder={footer.newsletterPlaceholder} />
          {footer.copyright && <p className={styles.copyright}>{footer.copyright.replace('{year}', year)}</p>}
        </div>
      </div>
    </footer>
  )
}
