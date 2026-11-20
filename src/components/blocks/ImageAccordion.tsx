import type { ImageAccordionBlock } from '@/payload-types'
import { Highlight, MediaImage } from '../ui/helpers'
import styles from './ImageAccordion.module.css'

export function ImageAccordion({ block }: { block: ImageAccordionBlock }) {
  return (
    <section className={styles.section} aria-labelledby={`${block.id}-title`}>
      <div className={`container ${styles.layout}`}>
        <h2 id={`${block.id}-title`} className={`${styles.title} reveal`}><Highlight text={block.heading} /></h2>
        <ul className={`${styles.list} reveal`} role="list">
          {block.images.map((item) => (
            <li key={item.id} className={styles.item}>
              <MediaImage media={item.image} alt="" className={styles.image} sizes="(min-width: 64rem) 23rem, 60vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
