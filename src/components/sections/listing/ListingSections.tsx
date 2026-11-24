import type { Form, Location, Service } from '@/payload-types'
import { ContactForm } from '../contact/Contact'
import { CMSLink, Highlight, MediaImage, pad } from '../../ui/helpers'
import { AnimatedValue } from '@/components/motion/AnimatedValue'
import { SplitWords } from '../../ui/SplitWords'
import styles from './ListingSections.module.css'

type Intro = NonNullable<Service['intro']>
type Benefits = NonNullable<Service['benefits']>
type Offerings = NonNullable<Location['offerings']>
type Results = NonNullable<Location['results']>
type Strategy = NonNullable<Service['strategy']>

const paragraphs = (text?: string | null) => text?.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) ?? []

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 12 12" width="10" height="10"><path d="M2 10 10 2M4 2h6v6" /></svg>
)

/** Heading, tagline and text (extra paragraphs behind “Read more”) beside expanding images. */
export function IntroSection({ data, id }: { data: Intro; id: string }) {
  const [first, ...rest] = paragraphs(data.text)
  const images = data.images ?? []
  return (
    <section className={styles.intro} aria-labelledby={`${id}-intro`}>
      <div className={`container ${styles.introLayout}`}>
        <div className={`${styles.introText} reveal`} data-reveal="side">
          <h2 id={`${id}-intro`} className={styles.display}><Highlight text={data.heading} /></h2>
          {data.quote && <p className={styles.quote}>“{data.quote}”</p>}
          {first && <p>{first}</p>}
          {!!rest.length && (
            <details className={styles.more}>
              <summary>
                <span className={styles.moreOpen}>Read more</span>
                <span className={styles.moreClose}>Read less</span>
              </summary>
              {rest.map((text, index) => <p key={index}>{text}</p>)}
            </details>
          )}
          {data.button?.label && (
            <CMSLink link={data.button} className="button">{data.button.label}<Arrow /></CMSLink>
          )}
        </div>
        {!!images.length && (
          <ul className={styles.accordion} role="list">
            {images.map((item) => (
              <li key={item.id} className={`${styles.accordionItem} reveal`} data-reveal="clip">
                <MediaImage media={item.image} alt="" className={styles.accordionImage} sizes="(min-width: 64rem) 26rem, 60vw" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/** Heading and button beside image cards numbered [01], [02]… */
export function BenefitsSection({ data, id }: { data: Benefits; id: string }) {
  return (
    <section className={styles.benefits} aria-labelledby={`${id}-benefits`}>
      <div className={`container ${styles.benefitsLayout}`}>
        <div className={`${styles.benefitsIntro} reveal`} data-reveal="side">
          <h2 id={`${id}-benefits`} className={styles.display}><Highlight text={data.heading} /></h2>
          {data.button?.label && (
            <CMSLink link={data.button} className={`button ${styles.lightButton}`}>{data.button.label}<Arrow /></CMSLink>
          )}
        </div>
        <ol className={styles.benefitGrid} role="list">
          {data.items?.map((item, index) => (
            <li key={item.id} className={`${styles.benefit} reveal`}>
              {item.image && (
                <div className={styles.benefitMedia}>
                  <MediaImage media={item.image} alt="" className={styles.benefitImage} sizes="(min-width: 64rem) 22rem, 100vw" />
                </div>
              )}
              <span className={styles.benefitNumber} aria-hidden="true">[{pad(index)}]</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Alternating rows: number, title and text beside an image. */
export function OfferingsSection({ data, id }: { data: Offerings; id: string }) {
  return (
    <section className={styles.offerings} aria-labelledby={data.heading ? `${id}-offerings` : undefined} aria-label={data.heading ? undefined : 'Services'}>
      <div className="container">
        {data.heading && <h2 id={`${id}-offerings`} className={`${styles.display} ${styles.center} split`}><SplitWords text={data.heading} /></h2>}
        <ol className={styles.rows} role="list">
          {data.items?.map((item, index) => (
            <li key={item.id} className={styles.row}>
              <div className={`${styles.rowText} reveal`} data-reveal="side" data-outline>
                <span className={`${styles.rowNumber} outline-text`} aria-hidden="true">{pad(index)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              {item.image && <MediaImage media={item.image} alt="" className={`${styles.rowImage} reveal`} data-reveal="clip-x" sizes="(min-width: 64rem) 30rem, 100vw" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Heading and text with large statistics. */
export function ResultsSection({ data, id }: { data: Results; id: string }) {
  return (
    <section className={styles.results} aria-labelledby={`${id}-results`}>
      <div className={`container ${styles.resultsLayout}`}>
        <div className={`${styles.resultsIntro} reveal`} data-reveal="side">
          <h2 id={`${id}-results`} className={styles.display}><Highlight text={data.heading} /></h2>
          {data.text && <p>{data.text}</p>}
        </div>
        <dl className={styles.stats}>
          {data.stats?.map((stat) => (
            <div key={stat.id} className={`${styles.stat} reveal`}>
              <dt className="outline-text"><AnimatedValue value={stat.value} /></dt>
              <dd>{stat.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/** Closing section: image beside the contact form. */
export function StrategySection({ data, form, id }: { data: Strategy; form: Form | null; id: string }) {
  return (
    <section className={styles.strategy} aria-labelledby={`${id}-strategy`}>
      <div className={`container ${styles.strategyLayout}`}>
        {data.image && <MediaImage media={data.image} alt="" className={`${styles.strategyImage} reveal`} data-reveal="clip" sizes="(min-width: 64rem) 36rem, 100vw" />}
        <div className={`${styles.strategyCard} reveal`} data-reveal="side">
          <h2 id={`${id}-strategy`} className={styles.display}><Highlight text={data.heading} /></h2>
          {data.text && <p className={styles.strategyText}>{data.text}</p>}
          <ContactForm form={form} />
        </div>
      </div>
    </section>
  )
}
