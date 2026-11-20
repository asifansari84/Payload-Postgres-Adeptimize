import type { TestimonialsBlock } from '@/payload-types'
import { MediaImage } from '../ui/helpers'
import styles from './Testimonials.module.css'

const Star = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1z" /></svg>
)

export function Testimonials({ block }: { block: TestimonialsBlock }) {
  return (
    <section className={styles.section} aria-labelledby={`${block.id}-title`}>
      <div className="container">
        <h2 id={`${block.id}-title`} className={`${styles.heading} reveal`}>
          {block.eyebrow && <span className={`${styles.eyebrow} outline-text`}>{block.eyebrow}</span>}
          <span className={styles.row}>
            <span className={styles.title}>{block.title}</span>
            {block.aside && <span className={styles.aside}>{block.aside}</span>}
          </span>
        </h2>

        <ul className={styles.grid} role="list">
          {block.items.map((item) => (
            <li key={item.id} className={`${styles.card} reveal`} data-photo={item.photo ? '' : undefined}>
              <figure>
                <div className={styles.media}>
                  {item.photo && (
                    <MediaImage media={item.photo} alt={item.name} className={styles.photo} sizes="(min-width: 64rem) 24rem, calc(100vw - 7.5rem)" />
                  )}
                  <div className={styles.stars} role="img" aria-label={`Rated ${item.rating ?? 5} out of 5`}>
                    {Array.from({ length: item.rating ?? 5 }, (_, i) => <Star key={i} />)}
                  </div>
                </div>
                <blockquote className={styles.quote}><p>{item.quote}</p></blockquote>
                <figcaption className={styles.author}>
                  <strong>{item.name}</strong>
                  {item.company && <span>{item.company}</span>}
                </figcaption>
                <span className={styles.badge} aria-hidden="true">“</span>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
