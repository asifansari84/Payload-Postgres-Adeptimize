import type { LogoStripBlock } from '@/payload-types'
import { MediaImage } from '../ui/helpers'
import { SplitWords } from '../ui/SplitWords'
import styles from './LogoStrip.module.css'

export function LogoStrip({ block }: { block: LogoStripBlock }) {
  return (
    <section className={styles.section} aria-labelledby={`${block.id}-title`}>
      <div className="container">
        <h2 id={`${block.id}-title`} className={`${styles.title} split`} data-outline><SplitWords text={block.heading} /></h2>
        {block.text && <p className={`${styles.text} reveal`} data-reveal="fade">{block.text}</p>}
        {!!block.logos?.length && (
          <ul className={styles.logos} role="list">
            {block.logos.map((item) => (
              <li key={item.id} className="reveal" data-reveal="pop">
                <MediaImage media={item.logo} alt={item.name} className={styles.logo} sizes="12rem" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
