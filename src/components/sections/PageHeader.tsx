import { SplitWords } from '../ui/SplitWords'
import styles from './PageHeader.module.css'

type PageHeaderData = { eyebrow?: string | null; title?: string | null; intro?: string | null } | null | undefined

/** Large page title used at the top of About, Contact and Blog. */
export function PageHeader({ data, fallback }: { data: PageHeaderData; fallback: string }) {
  const title = data?.title || fallback
  return (
    <header className={styles.header}>
      <div className="container">
        {data?.eyebrow && <p className={`${styles.eyebrow} outline-text outline-load`} aria-hidden="true">{data.eyebrow}</p>}
        <h1 className={`${styles.title} split-load`}><SplitWords text={title} /></h1>
        {data?.intro && <p className={`${styles.intro} fade-load`}>{data.intro}</p>}
      </div>
    </header>
  )
}
