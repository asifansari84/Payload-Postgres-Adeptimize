import type { ServiceCarouselBlock } from '@/payload-types'
import { CMSLink, Highlight, linkHref, MediaImage, pad, plainText } from '../ui/helpers'
import { CarouselTrack } from './CarouselTrack'
import styles from './ServiceCarousel.module.css'

/**
 * `stacked` puts the *starred* words on their own outlined line above the rest
 * of the heading, left-aligned (as on the Our Services page).
 */
export function ServiceCarousel({ block, stacked = false }: { block: ServiceCarouselBlock; stacked?: boolean }) {
  return (
    <section className={styles.section} aria-labelledby={`${block.id}-title`}>
      <div className="container">
        {stacked ? (
          <h2 id={`${block.id}-title`} className={`${styles.stackedTitle} reveal`}>
            <span className={`${styles.stackedOutline} outline-text`}>{block.heading.match(/\*([^*]+)\*/)?.[1]}</span>
            <span className={styles.stackedSolid}>{block.heading.replace(/\*[^*]+\*/, '').trim()}</span>
          </h2>
        ) : (
          <h2 id={`${block.id}-title`} className={`${styles.title} reveal`}><Highlight text={block.heading} /></h2>
        )}
      </div>
      <CarouselTrack className={styles.track} label={plainText(block.heading)}>
        {block.services.map((service, index) => (
          <li key={service.id} className={styles.card}>
            <span className={styles.number} aria-hidden="true">{pad(index)}</span>
            <h3 className={styles.cardTitle}>
              {linkHref(service.link)
                ? <CMSLink link={service.link} className={styles.link}>{service.title}</CMSLink>
                : service.title}
            </h3>
            <MediaImage media={service.image} alt="" className={styles.image} sizes="17.5rem" />
          </li>
        ))}
      </CarouselTrack>
    </section>
  )
}
