import type { TestimonialsBlock } from '@/payload-types'
import { MediaImage } from '../ui/helpers'
import styles from './Testimonials.module.css'

const Star = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" className={className}><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1z" /></svg>
)

const QuoteMark = ({ className }: { className: string }) => (
  <svg aria-hidden="true" viewBox="0 0 32 24" width="34" height="26" className={className}>
    <path d="M0 24V14.4C0 5.9 4.6 1.1 12 0l1.5 3C9.2 4.2 7.2 6.8 7 10.4h6V24H0Zm18 0V14.4C18 5.9 22.6 1.1 30 0l1.5 3c-4.3 1.2-6.3 3.8-6.5 7.4h6V24H18Z" />
  </svg>
)

export function Testimonials({ block }: { block: TestimonialsBlock }) {
  return (
    <section className={styles.section} aria-labelledby={`${block.id}-title`}>
      <div className="container">
        <h2 id={`${block.id}-title`} className={styles.heading} data-outline>
          {block.eyebrow && <span className={`${styles.eyebrow} outline-text`} data-drift="1">{block.eyebrow}</span>}
          <span className={`${styles.row} reveal`}>
            <span className={styles.title}>{block.title}</span>
            {block.aside && <span className={styles.aside}>{block.aside}</span>}
          </span>
        </h2>

        <ul className={styles.grid} role="list">
          {block.items.map((item) => {
            const rating = Math.min(5, Math.max(0, item.rating ?? 5))
            return (
              <li key={item.id} className={`${styles.card} reveal`} data-photo={item.photo ? '' : undefined}>
                <figure>
                  {item.photo && (
                    <div className={styles.media}>
                      <MediaImage media={item.photo} alt={item.name} className={`${styles.photo} reveal`} data-reveal="clip" sizes="(min-width: 64rem) 24rem, calc(100vw - 7.5rem)" />
                    </div>
                  )}
                  <div className={styles.meta}>
                    <div className={styles.stars} role="img" aria-label={`Rated ${rating} out of 5`}>
                      {Array.from({ length: 5 }, (_, i) => <Star key={i} className={i < rating ? undefined : styles.empty} />)}
                    </div>
                    <QuoteMark className={styles.mark} />
                  </div>
                  <blockquote className={styles.quote}><p>{item.quote}</p></blockquote>
                  <figcaption className={styles.author}>
                    <strong>{item.name}</strong>
                    {item.company && <span>{item.company}</span>}
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
