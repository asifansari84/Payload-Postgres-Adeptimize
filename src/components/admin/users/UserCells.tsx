'use client'

import type { DefaultCellComponentProps } from 'payload'
import { Avatar, type AvatarValue } from '../UserAvatar'

/** Fired by a Users list cell; UserEditDialog listens and opens the popup. */
export const EDIT_USER_EVENT = 'adeptimize:edit-user'

export const openUserEditor = (id: number | string) =>
  window.dispatchEvent(new CustomEvent(EDIT_USER_EVENT, { detail: { id: String(id) } }))

const nameOf = (rowData: DefaultCellComponentProps['rowData']) => (typeof rowData?.name === 'string' && rowData.name) || 'User'

/** Users list "Avatar" column: the picture (or placeholder); opens the edit popup. */
export function AvatarCell({ cellData, rowData }: DefaultCellComponentProps) {
  const name = nameOf(rowData)
  return (
    <button
      type="button"
      className="adeptimize-user-cell"
      data-user-id={rowData?.id}
      aria-label={`Edit ${name}`}
      onClick={() => rowData?.id != null && openUserEditor(rowData.id)}
    >
      <Avatar alt="" avatar={cellData as AvatarValue} size={32} />
    </button>
  )
}

/** Users list "Name" column: opens the edit popup instead of the full edit page. */
export function NameCell({ cellData, rowData }: DefaultCellComponentProps) {
  return (
    <button
      type="button"
      className="adeptimize-user-cell adeptimize-user-cell--name"
      data-user-id={rowData?.id}
      onClick={() => rowData?.id != null && openUserEditor(rowData.id)}
    >
      {typeof cellData === 'string' && cellData ? cellData : nameOf(rowData)}
    </button>
  )
}
