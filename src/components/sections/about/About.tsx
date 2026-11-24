import type { Page } from '@/payload-types'
import { socialIcons } from '../../ui/socialIcons'
import { CMSLink, Highlight, isMedia, MediaImage, pad, plainText } from '../../ui/helpers'
import { AnimatedValue } from '@/components/motion/AnimatedValue'
import { SplitWords } from '../../ui/SplitWords'
import styles from './About.module.css'

type Section<K extends keyof Page> = NonNullable<Page[K]>

export function AboutIntro({ data }: { data: Section<'aboutIntro'> }) {
  const stats = data.stats ?? []
  return (
    <section className={styles.intro} aria-labelledby="about-intro-title">
      <div className={`container ${styles.introLayout}`}>
        <div className={`${styles.introText} reveal`} data-reveal="left">
          <h2 id="about-intro-title" className={styles.display}><Highlight text={data.heading} /></h2>
          {data.text && <p className={styles.lead}>{data.text}</p>}
          {data.button?.label && (
            <CMSLink link={data.button} className="button">
              {data.button.label}
              <svg aria-hidden="true" viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10 10 2M4 2h6v6" /></svg>
            </CMSLink>
          )}
        </div>

        <div className={styles.collage}>
          {data.image && <MediaImage media={data.image} className={`${styles.collageMain} reveal`} data-reveal="clip" sizes="(min-width: 64rem) 30rem, 100vw" loading="eager" />}
          {stats.map((stat, index) => (
            <figure key={stat.id} className={`${styles.stat} reveal`}>
              {stat.image && <MediaImage media={stat.image} className={styles.statImage} sizes="(min-width: 64rem) 20rem, 100vw" loading={index === 0 ? 'eager' : undefined} />}
              <figcaption>
                <strong className={styles.statValue}><AnimatedValue value={stat.value} /></strong>
                <span>{stat.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AboutValues({ data }: { data: Section<'aboutValues'> }) {
  if (!data.items?.length) return null
  return (
    <section className={styles.values} aria-label="Who we are">
      <ol className={`container ${styles.valuesGrid}`} role="list">
        {data.items.map((item, index) => (
          <li key={item.id} className={`${styles.value} reveal`} data-outline>
            <h3 className={styles.valueTitle}>
              <span className={`${styles.valueNumber} outline-text`}>{pad(index)}.</span> {item.title}
            </h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function AboutFounder({ data }: { data: Section<'aboutFounder'> }) {
  return (
    <section className={styles.founder} aria-labelledby="about-founder-title">
      <div className={`container ${styles.founderLayout}`}>
        {data.image && <MediaImage media={data.image} alt={plainText(data.heading)} className={`${styles.founderImage} reveal`} data-reveal="clip-x" sizes="(min-width: 64rem) 32rem, 100vw" />}
        <div className="reveal" data-reveal="right">
          <h2 id="about-founder-title" className={styles.display}><Highlight text={data.heading} /></h2>
          {data.role && <p className={styles.role}>{data.role}</p>}
          {!!data.social?.length && (
            <ul className={styles.social} role="list">
              {data.social.map((item) => (
                <li key={item.id}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.platform} (opens in a new tab)`}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d={socialIcons[item.platform]} /></svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export function AboutHighlights({ data }: { data: Section<'aboutHighlights'> }) {
  return (
    <section className={styles.highlights} aria-labelledby="about-highlights-title">
      <div className="container">
        <h2 id="about-highlights-title" className={`${styles.display} ${styles.center} split`}><SplitWords text={data.heading} /></h2>
        {!!data.items?.length && (
          <ul className={styles.highlightGrid} role="list">
            {data.items.map((item) => (
              <li key={item.id} className={`${styles.highlight} reveal`} data-reveal="scale">
                {item.icon && <MediaImage media={item.icon} alt="" className={styles.highlightIcon} sizes="5rem" />}
                <h3>{item.title}</h3>
                {item.text && <p>{item.text}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

type Spotlight = {
  image?: Section<'aboutTestimonials'>['image']
  badge?: Section<'aboutTestimonials'>['badge']
  items?: { id?: string | null; quote: string; name: string; company?: string | null }[] | null
  logos?: Section<'aboutTestimonials'>['logos']
}

/** Photo with a badge beside client quotes; also used on service pages. */
export function AboutTestimonials({ data }: { data: Spotlight }) {
  return (
    <section className={styles.testimonials} aria-label="What our clients say">
      <div className={`container ${styles.testimonialLayout}`}>
        {data.image && (
          <div className={`${styles.testimonialMedia} reveal`} data-reveal="clip">
            <MediaImage media={data.image} alt="" className={styles.testimonialImage} sizes="(min-width: 64rem) 34rem, 100vw" />
            {data.badge && <MediaImage media={data.badge} alt="" className={styles.badge} sizes="7rem" />}
          </div>
        )}
        {!!data.items?.length && (
          <ul className={styles.quotes} role="list">
            {data.items.map((item) => (
              <li key={item.id} className="reveal" data-reveal="right">
                <figure>
                  <blockquote><p>{item.quote}</p></blockquote>
                  <figcaption>
                    <strong>{item.name}</strong>
                    {item.company && <span>{item.company}</span>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!!data.logos?.length && (
        <ul className={`container ${styles.logos}`} role="list" aria-label="Clients we work with">
          {data.logos.map((item) => {
            const alt = isMedia(item.logo) ? item.logo.alt ?? '' : ''
            const image = <MediaImage media={item.logo} alt={alt} className={styles.logo} sizes="10rem" />
            const url = item.url?.trim()
            return (
              <li key={item.id} className="reveal" data-reveal="pop">
                {url ? <a href={url} target="_blank" rel="noopener noreferrer">{image}</a> : image}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
