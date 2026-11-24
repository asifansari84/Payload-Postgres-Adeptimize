import Link from 'next/link'
import type { Header } from '@/payload-types'
import { CMSLink, MediaImage } from '../ui/helpers'
import { HeaderFrame } from './HeaderFrame'
import { MenuDrawer } from './MenuDrawer'
import styles from './SiteHeader.module.css'

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14"><path d="M2 8h11M9 4l4 4-4 4" /></svg>
)

export function SiteHeader({ header }: { header: Header | null }) {
  return (
    <HeaderFrame className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.logo} aria-label="Adeptimize home">
          {header?.logo ? <MediaImage media={header.logo} alt="" preload sizes="9.25rem" /> : 'Adeptimize'}
        </Link>
        <div className={styles.actions}>
          {header?.buttons?.map((item) => (
            <CMSLink key={item.id} link={item.link} className={styles.button}>
              {item.link.label}<Arrow />
            </CMSLink>
          ))}
          <MenuDrawer
            header={header}
            logo={header?.menuLogo ? <MediaImage media={header.menuLogo} alt="Adeptimize" sizes="13rem" /> : <span>Adeptimize</span>}
          />
        </div>
      </div>
    </HeaderFrame>
  )
}
