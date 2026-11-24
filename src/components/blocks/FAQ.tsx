import type { FAQBlock } from '@/payload-types'
import { pad } from '../ui/helpers'
import { SplitWords } from '../ui/SplitWords'
import styles from './FAQ.module.css'

export function FAQ({ block }: { block: FAQBlock }) {
  return (
    <section className={styles.section} aria-labelledby={`${block.id}-title`}>
      <div className="container">
        <h2 id={`${block.id}-title`} className={`${styles.title} split`}><SplitWords text={block.heading} /></h2>
        <div className={styles.list}>
          {block.items.map((item, index) => (
            <details key={item.id} name={`faq-${block.id}`} className={`${styles.item} reveal`} open={index === 0}>
              <summary className={styles.question}>
                <h3>{item.question}</h3>
                <span className={styles.number} aria-hidden="true">{pad(index)}</span>
              </summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
