import { Fragment, type CSSProperties, type ReactNode } from 'react'

/**
 * Like <Highlight>, but wraps every word in a mask so headings can rise in
 * word by word. Starred words keep the outlined accent style. The text stays
 * real text in the HTML (for SEO and screen readers); only presentation changes.
 *
 * Put it inside an element with the `split` class (animates when scrolled
 * into view) or `split-load` (animates once on page load, CSS only).
 */
export function SplitWords({ text }: { text?: string | null }) {
  if (!text) return null
  const nodes: ReactNode[] = []
  let index = 0

  text.split(/(\*[^*]+\*)/g).filter(Boolean).forEach((part, p) => {
    const accent = part.length > 2 && part.startsWith('*') && part.endsWith('*')
    const content = accent ? part.slice(1, -1) : part
    content.split(/(\s+)/).forEach((token, t) => {
      if (!token) return
      if (/^\s+$/.test(token)) {
        nodes.push(<Fragment key={`${p}-${t}`}> </Fragment>)
        return
      }
      nodes.push(
        <span key={`${p}-${t}`} className="word">
          <span className={accent ? 'w outline-text' : 'w'} style={{ '--i': index++ } as CSSProperties}>{token}</span>
        </span>,
      )
    })
  })

  return <>{nodes}</>
}
