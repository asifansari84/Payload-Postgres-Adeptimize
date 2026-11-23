'use client'

import { useAuth } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { DefaultCellComponentProps } from 'payload'

import type { Media, User } from '@/payload-types'

type AvatarValue = User['avatar'] | Record<string, unknown> | string | undefined

/** Resolves an avatar value (populated media doc or just its ID) to an image URL. */
export function useAvatarUrl(avatar: AvatarValue) {
  const id = avatar && typeof avatar !== 'object' ? String(avatar) : null
  const populated = avatar && typeof avatar === 'object' ? ((avatar as Media).thumbnailURL || (avatar as Media).url || null) : null
  const [fetched, setFetched] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return setFetched(null)
    let active = true
    fetch(`/api/media/${encodeURIComponent(id)}?depth=0`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc: Media | null) => active && setFetched(doc?.url ?? null))
      .catch(() => active && setFetched(null))
    return () => {
      active = false
    }
  }, [id])

  return populated ?? fetched
}

/** Payload's default person icon (same markup and classes as its DefaultAccountIcon, which isn't exported). */
function PlaceholderAvatar({ active = false, size = 25 }: { active?: boolean; size?: number }) {
  return (
    <svg
      className={['graphic-account', active && 'graphic-account--active'].filter(Boolean).join(' ')}
      height={size}
      viewBox="0 0 25 25"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className="graphic-account__bg" cx="12.5" cy="12.5" r="11.5" />
      <circle className="graphic-account__head" cx="12.5" cy="10.73" r="3.98" />
      <path
        className="graphic-account__body"
        d="M12.5,24a11.44,11.44,0,0,0,7.66-2.94c-.5-2.71-3.73-4.8-7.66-4.8s-7.16,2.09-7.66,4.8A11.44,11.44,0,0,0,12.5,24Z"
      />
    </svg>
  )
}

function Avatar({ avatar, alt, size = 25, active }: { avatar: AvatarValue; alt: string; size?: number; active?: boolean }) {
  const url = useAvatarUrl(avatar)
  if (!url) return <PlaceholderAvatar active={active} size={size} />
  return (
    <img
      alt={alt}
      height={size}
      src={url}
      style={{ borderRadius: '50%', objectFit: 'cover', display: 'block' }}
      width={size}
    />
  )
}

/** Admin account icon (top right): the user's avatar, or the placeholder when they haven't set one. */
const UserAvatar = () => {
  const { user } = useAuth<User>()
  const pathname = usePathname()
  return (
    <Avatar
      active={pathname?.endsWith('/account')}
      alt={user?.name ? `${user.name}'s avatar` : 'Account'}
      avatar={user?.avatar}
    />
  )
}

export default UserAvatar

/** Users list "Avatar" column: the picture, or the placeholder instead of "<No Avatar>". */
export function AvatarCell({ cellData, rowData, link, linkURL }: DefaultCellComponentProps) {
  const name = typeof rowData?.name === 'string' ? rowData.name : 'User'
  const avatar = <Avatar alt={`${name}'s avatar`} avatar={cellData as AvatarValue} size={32} />
  return link && linkURL ? (
    <Link aria-label={`Edit ${name}`} href={linkURL} style={{ display: 'inline-block' }}>
      {avatar}
    </Link>
  ) : (
    avatar
  )
}
