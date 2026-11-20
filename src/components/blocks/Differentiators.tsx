import { RichText } from '@payloadcms/richtext-lexical/react'
import type { DifferentiatorsBlock } from '@/payload-types'
import { Highlight, MediaImage, pad } from '../ui/helpers'
import styles from './Differentiators.module.css'

export function Differentiators({ block }: { block: DifferentiatorsBlock }) {
  return (
    <section className={styles.section} aria-labelledby={`${block.id}-title`}>
      <div className="container">
        <h2 id={`${block.id}-title`} className={`${styles.title} reveal`}><Highlight text={block.heading} /></h2>
      </div>

      <ol className={styles.panels} role="list">
        {block.items.map((item, index) => (
          <li key={item.id} className={styles.panel}>
            <article className={styles.inner} aria-labelledby={`${item.id}-title`}>
              <div className={styles.copy}>
                <h3 id={`${item.id}-title`} className={styles.panelTitle}>{item.title}</h3>
                <RichText data={item.body} className={styles.body} />
                <span className={`${styles.number} outline-text`} aria-hidden="true">{pad(index)}</span>
              </div>

              <figure className={styles.figure}>
                <MediaImage media={item.image} className={styles.image} sizes="(min-width: 64rem) 31.625rem, calc(100vw - 3.5rem)" />
                {item.tag && <figcaption className={styles.tag}>{item.tag}</figcaption>}
              </figure>

              <div className={styles.aside}>
                {item.thumbnail && <MediaImage media={item.thumbnail} alt="" className={styles.thumb} sizes="10.5rem" />}
                {item.note && <p className={styles.note}>{item.note}</p>}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
