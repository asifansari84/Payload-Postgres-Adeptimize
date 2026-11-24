'use client'

import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import type { DefaultCellComponentProps } from 'payload'
import { Avatar, type AvatarValue } from '../UserAvatar'

const nameOf = (rowData: DefaultCellComponentProps['rowData']) => (typeof rowData?.name === 'string' && rowData.name) || 'User'

/** The user's edit page, for both the avatar and the name cell. */
function useEditURL(rowData: DefaultCellComponentProps['rowData'], linkURL?: string) {
  const { config } = useConfig()
  if (linkURL) return linkURL
  if (rowData?.id == null) return null
  const admin = config.routes.admin === '/' ? '' : config.routes.admin
  return `${admin}/collections/users/${encodeURIComponent(String(rowData.id))}`
}

/** Users list "Avatar" column: the picture (or placeholder instead of "<No Avatar>"), linking to the edit page. */
export function AvatarCell({ cellData, rowData, linkURL }: DefaultCellComponentProps) {
  const href = useEditURL(rowData, linkURL)
  const name = nameOf(rowData)
  const avatar = <Avatar alt="" avatar={cellData as AvatarValue} size={32} />
  return href ? (
    <Link className="adeptimize-user-cell" href={href} prefetch={false} aria-label={`Edit ${name}`}>
      {avatar}
    </Link>
  ) : (
    avatar
  )
}

/** Users list "Name" column: links to the edit page too. */
export function NameCell({ cellData, rowData, linkURL }: DefaultCellComponentProps) {
  const href = useEditURL(rowData, linkURL)
  const name = typeof cellData === 'string' && cellData ? cellData : nameOf(rowData)
  return href ? (
    <Link className="adeptimize-user-cell adeptimize-user-cell--name" href={href} prefetch={false}>
      {name}
    </Link>
  ) : (
    name
  )
}
