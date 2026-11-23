'use client'

import Link from 'next/link'
import type { DefaultCellComponentProps } from 'payload'

import { useAvatarUrl } from './UserAvatar'

/** List-view cell for upload fields: shows only the image thumbnail, without the filename. */
export function MediaThumbnailCell({ cellData, link, linkURL }: DefaultCellComponentProps) {
  const url = useAvatarUrl(cellData as Parameters<typeof useAvatarUrl>[0])
  if (!url) return <span style={{ opacity: 0.5 }}>—</span>

  const img = (
    <img
      alt=""
      height={40}
      src={url}
      style={{ borderRadius: 4, objectFit: 'cover', display: 'block', width: 64, height: 40 }}
      width={64}
    />
  )
  return link && linkURL ? (
    <Link href={linkURL} style={{ display: 'inline-block' }}>
      {img}
    </Link>
  ) : (
    img
  )
}
