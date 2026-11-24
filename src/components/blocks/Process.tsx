import type { ProcessBlock } from '@/payload-types'
import { MediaImage, pad } from '../ui/helpers'
import { SplitWords } from '../ui/SplitWords'
import styles from './Process.module.css'

type Step = ProcessBlock['steps'][number]

function Steps({ steps, offset, align }: { steps: Step[]; offset: number; align: 'start' | 'end' }) {
  return (
    <ol className={styles.steps} data-align={align} role="list">
      {steps.map((step, index) => (
        <li key={step.id} className={`${styles.step} reveal`} data-reveal={align === 'start' ? 'left' : 'right'} data-outline>
          <span className={`${styles.number} outline-text`} aria-hidden="true">{pad(offset + index)}</span>
          <div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function Process({ block }: { block: ProcessBlock }) {
  const half = Math.ceil(block.steps.length / 2)

  return (
    <section className={styles.section} aria-labelledby={block.heading ? `${block.id}-title` : undefined} aria-label={block.heading ? undefined : 'How we work'}>
      <div className="container">
        {block.heading && <h2 id={`${block.id}-title`} className={`${styles.title} split`}><SplitWords text={block.heading} /></h2>}
        <div className={styles.layout}>
          <Steps steps={block.steps.slice(0, half)} offset={0} align="start" />
          <figure className={`${styles.figure} reveal`} data-reveal="scale">
            <MediaImage media={block.image} className={styles.image} sizes="(min-width: 64rem) 22.5rem, 16rem" data-parallax="0.08" />
            {block.accentImage && (
              <span className={`${styles.accentWrap} reveal`} data-reveal="pop">
                <MediaImage media={block.accentImage} alt="" className={styles.accent} sizes="6.5rem" data-parallax="-0.25" />
              </span>
            )}
          </figure>
          <Steps steps={block.steps.slice(half)} offset={half} align="end" />
        </div>
      </div>
    </section>
  )
}
