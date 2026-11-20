import type { HeroBlock, Page } from '@/payload-types'
import { Highlight, MediaImage } from '../ui/helpers'
import styles from './Hero.module.css'

type HomeHero = NonNullable<Page['hero']>
export type HeroData = Omit<Partial<HeroBlock>, 'image'> & Omit<Partial<HomeHero>, 'headline'> & { title: string }

export function Hero({ block, nextId }: { block: HeroData; nextId?: string }) {
  return (
    <section className={styles.hero} aria-labelledby={`${block.id}-title`}>
      <div className="container">
        <hgroup className={styles.heading}>
          <h1 id={`${block.id}-title`} className={styles.title}>
            <Highlight text={block.title.includes('*') ? block.title : `*${block.title}*`} />
          </h1>
          {block.subtitle && <p className={styles.subtitle}>{block.subtitle}</p>}
        </hgroup>

        <div className={styles.highlights}>
          {block.leftHighlight && <p className={styles.highlight}>{block.leftHighlight}</p>}
          {nextId && (
            <a className={styles.scroll} href={`#${nextId}`} aria-label="Scroll to the next section">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 4v15m-6-6 6 6 6-6" />
              </svg>
            </a>
          )}
          {block.rightHighlight && <p className={styles.highlight}>{block.rightHighlight}</p>}
        </div>

        {block.image && <MediaImage
          media={block.image}
          className={styles.image}
          sizes="(min-width: 1440px) 1400px, calc(100vw - 2.5rem)"
          priority
        />}
      </div>
    </section>
  )
}
