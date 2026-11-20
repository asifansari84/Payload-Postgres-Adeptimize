import type { LogoStripBlock } from '@/payload-types'
import { Highlight, MediaImage } from '../ui/helpers'
import styles from './LogoStrip.module.css'

export function LogoStrip({ block }: { block: LogoStripBlock }) {
  return (
    <section className={styles.section} aria-labelledby={`${block.id}-title`}>
      <div className="container">
        <h2 id={`${block.id}-title`} className={`${styles.title} reveal`}><Highlight text={block.heading} /></h2>
        {block.text && <p className={styles.text}>{block.text}</p>}
        {!!block.logos?.length && (
          <ul className={styles.logos} role="list">
            {block.logos.map((item) => (
              <li key={item.id} className="reveal">
                <MediaImage media={item.logo} alt={item.name} className={styles.logo} sizes="12rem" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
