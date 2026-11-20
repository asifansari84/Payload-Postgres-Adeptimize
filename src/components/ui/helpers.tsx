import NextImage, { type ImageProps } from 'next/image'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import type { Media, Page } from '@/payload-types'

type LinkValue = {
  type?: ('page' | 'custom') | null
  newTab?: boolean | null
  label?: string | null
  page?: (number | null) | Page
  url?: string | null
} | null | undefined

export function linkHref(link: LinkValue): string | null {
  if (!link) return null
  if (link.type === 'custom') return link.url?.trim() || null
  const page = link.page
  if (page && typeof page === 'object') return page.slug === 'home' ? '/' : `/${page.slug}/`
  return null
}

/** Renders a CMS link, using client-side navigation for internal paths. */
export function CMSLink({
  link,
  children,
  ...props
}: { link: LinkValue; children?: ReactNode } & Omit<ComponentProps<'a'>, 'href'>) {
  const href = linkHref(link)
  if (!href) return null
  const content = children ?? link?.label
  const external = /^(https?:)?\/\//.test(href) || /^(mailto|tel):/.test(href)
  const target = link?.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  if (external) {
    return <a href={href} {...target} {...props}>{content}</a>
  }
  return <Link href={href} {...target} {...props}>{content}</Link>
}

export function isMedia(value: unknown): value is Media {
  return Boolean(value && typeof value === 'object' && 'url' in value && (value as Media).url)
}

/**
 * Responsive image for an uploaded media document. Width and height come from
 * the upload, which reserves space and prevents layout shift.
 */
export function MediaImage({
  media,
  alt,
  ...props
}: { media: unknown; alt?: string } & Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'>) {
  if (!isMedia(media)) return null
  const svg = media.mimeType === 'image/svg+xml'
  return (
    <NextImage
      src={media.url!}
      alt={alt ?? media.alt ?? ''}
      width={media.width ?? 800}
      height={media.height ?? 600}
      unoptimized={svg}
      {...props}
    />
  )
}

/**
 * Turns "The *Digital Marketing* Problems" into text with the starred words
 * wrapped in the outlined accent style.
 */
export function Highlight({ text, className = 'outline-text' }: { text?: string | null; className?: string }) {
  if (!text) return null
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).filter(Boolean).map((part, index) =>
        part.startsWith('*') && part.endsWith('*')
          ? <span key={index} className={className}>{part.slice(1, -1)}</span>
          : part,
      )}
    </>
  )
}

export const plainText = (text?: string | null) => text?.replaceAll('*', '') ?? ''

export const pad = (index: number) => String(index + 1).padStart(2, '0')
