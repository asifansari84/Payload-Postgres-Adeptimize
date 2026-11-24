import type { Page } from '@/payload-types'
import { CMSLink, Highlight, linkHref, MediaImage } from '../../ui/helpers'
import { SplitWords } from '../../ui/SplitWords'
import { CountUp } from './CountUp'
import styles from './Services.module.css'

type Section<K extends keyof Page> = NonNullable<Page[K]>

/** Full-width image with the page title centred on it. */
export function ImageBanner({ title, subtitle, image }: { title: string; subtitle?: string | null; image?: unknown }) {
  return (
    <header className={styles.banner}>
      {image ? <MediaImage media={image} alt="" className={styles.bannerImage} sizes="100vw" preload data-scrub="drift" /> : null}
      <div className={`container ${styles.bannerContent}`} data-scrub="lift">
        <h1 className={`${styles.bannerTitle} split-load`}><SplitWords text={title} /></h1>
        {subtitle && <p className={`${styles.bannerSubtitle} fade-load`}>{subtitle}</p>}
      </div>
    </header>
  )
}

/** Heading and text beside three animated counters, all in one row on desktop. */
export function ServicesIntro({ data }: { data: Section<'servicesIntro'> }) {
  return (
    <section className={styles.intro} aria-labelledby="services-intro-title">
      <div className={`container ${styles.introRow}`}>
        <div className={`${styles.introHead} reveal`} data-reveal="left">
          <h2 id="services-intro-title" className={styles.introTitle}><Highlight text={data.heading} /></h2>
          {data.text && <p className={styles.lead}>{data.text}</p>}
        </div>
        {data.counters?.map((counter) => (
          <div key={counter.id} className={`${styles.counter} reveal`}>
            <p className={styles.counterValue}>
              <span className="visually-hidden">{counter.value}{counter.suffix}</span>
              <span aria-hidden="true"><CountUp value={counter.value} />{counter.suffix && <span className={styles.suffix}>{counter.suffix}</span>}</span>
            </p>
            <h3 className={styles.counterLabel}>{counter.label}</h3>
            {counter.text && <p className={styles.counterText}>{counter.text}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

/** Rounded box: heading and rotating text badge beside an image. */
export function ServicesCta({ data }: { data: Section<'servicesCta'> }) {
  const text = data.badgeText?.trim()
  const badge = text ? (
    <span className={styles.badge}>
      <svg viewBox="0 0 200 200" className={styles.badgeRing} aria-hidden="true">
        <defs><path id="services-cta-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        <text><textPath href="#services-cta-circle" textLength="488">{`${text} * ${text} * `}</textPath></text>
      </svg>
      <svg viewBox="0 0 24 24" className={styles.badgeArrow} aria-hidden="true"><path d="M12 4v16M5 13l7 7 7-7" /></svg>
    </span>
  ) : null

  return (
    <section className={styles.cta} aria-labelledby="services-cta-title">
      <div className={`container ${styles.ctaLayout}`}>
        {data.image ? <MediaImage media={data.image} alt="" className={`${styles.ctaImage} reveal`} data-reveal="clip" sizes="(min-width: 64rem) 40rem, 100vw" /> : null}
        <div className={`${styles.ctaBox} reveal`} data-reveal="side">
          {data.background ? <MediaImage media={data.background} alt="" className={styles.ctaBackground} sizes="(min-width: 64rem) 40rem, 100vw" /> : null}
          <h2 id="services-cta-title" className={styles.ctaTitle}><Highlight text={data.heading} /></h2>
          {badge && (linkHref(data.link)
            ? <CMSLink link={data.link} className={styles.badgeLink} aria-label={text}>{badge}</CMSLink>
            : badge)}
        </div>
      </div>
    </section>
  )
}
