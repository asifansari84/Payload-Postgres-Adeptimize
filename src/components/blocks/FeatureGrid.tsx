import type { FeatureGridBlock } from '@/payload-types'
import { Highlight, pad } from '../ui/helpers'
import styles from './FeatureGrid.module.css'

export function FeatureGrid({ block }: { block: FeatureGridBlock }) {
  const titleId = block.heading ? `${block.id}-title` : undefined

  return (
    <section className={styles.section} aria-labelledby={titleId} data-has-heading={Boolean(block.heading) || undefined}>
      <div className="container">
        {block.heading && (
          <h2 id={titleId} className={`${styles.title} reveal`}><Highlight text={block.heading} /></h2>
        )}
        <ol className={styles.grid} role="list">
          {block.items.map((item, index) => (
            <li key={item.id} className={`${styles.card} reveal`}>
              <h3 className={styles.cardTitle}>
                <span className={`${styles.number} outline-text`} aria-hidden="true">{pad(index)}.</span>
                {item.title}
              </h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
