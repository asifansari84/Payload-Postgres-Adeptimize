import { RichText } from '@payloadcms/richtext-lexical/react'
import type { LogoShowcaseBlock } from '@/payload-types'
import { CMSLink, Highlight, isMedia, MediaImage } from '../ui/helpers'
import styles from './LogoShowcase.module.css'

export function LogoShowcase({ block }: { block: LogoShowcaseBlock }) {
  return (
    <section className={styles.section} aria-labelledby={`${block.id}-title`}>
      <div className={`container ${styles.layout}`}>
        <div className={`${styles.intro} reveal`} data-reveal="left">
          <h2 id={`${block.id}-title`} className={styles.title}><Highlight text={block.heading} /></h2>
          {block.body && <RichText data={block.body} className={styles.body} />}
          <CMSLink link={block.link} className={styles.more}>
            {block.link?.label}
            <svg aria-hidden="true" viewBox="0 0 12 12" width="10" height="10"><path d="M2 10 10 2M4 2h6v6" /></svg>
          </CMSLink>
        </div>

        {!!block.logos?.length && (
          <ul className={styles.logos} role="list" aria-label="Clients we work with">
            {block.logos.map((item: (typeof block.logos)[number] & { url?: string | null }) => {
              const alt = item.name ?? (isMedia(item.logo) ? item.logo.alt : undefined) ?? ''
              const image = <MediaImage media={item.logo} alt={alt} sizes="8rem" className={styles.logo} />
              const url = item.url?.trim()
              return (
                <li key={item.id} className="reveal" data-reveal="pop">
                  {url ? <a href={url} target="_blank" rel="noopener noreferrer" aria-label={alt ? `${alt} (opens in a new tab)` : undefined}>{image}</a> : image}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
