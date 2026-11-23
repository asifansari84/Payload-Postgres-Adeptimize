const namedEntities: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
}

/** Decode HTML entities (e.g. `&hellip;`, `&#8217;`) left in plain text imported from WordPress. */
export function decodeEntities(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] !== '#') return namedEntities[code.toLowerCase()] ?? match
    const point = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
    return Number.isFinite(point) ? String.fromCodePoint(point) : match
  })
}

/** Plain-text summary: decoded entities and WordPress's `[…]` read-more marker shown as a plain ellipsis. */
export function cleanSummary<T extends string | null | undefined>(text: T): T {
  if (typeof text !== 'string') return text
  return decodeEntities(text).replace(/\s*\[…\]\s*$/, '…') as T
}
