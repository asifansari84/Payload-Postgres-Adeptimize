'use client'

import { useAuth, useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'

import type { Media, User } from '@/payload-types'

export type AvatarValue = User['avatar'] | Record<string, unknown> | string | undefined

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

export function Avatar({ avatar, alt, size = 25, active }: { avatar: AvatarValue; alt: string; size?: number; active?: boolean }) {
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

/** Admin account icon (top right): the user's avatar, or the placeholder when they haven't set one.
 *  Clicking it opens the account page (Payload's link around it); hovering shows a small menu. */
const UserAvatar = () => {
  const { user } = useAuth<User>()
  const pathname = usePathname()
  const ref = useRef<HTMLSpanElement>(null)
  return (
    <span ref={ref} className="adeptimize-account-avatar">
      {user?.name && (
        <span className="adeptimize-account-avatar__greeting">
          <span className="adeptimize-account-avatar__howdy">Howdy,{'\u00A0'}</span>
          <span className="adeptimize-account-avatar__name">{user.name}</span>
        </span>
      )}
      <Avatar
        active={pathname?.endsWith('/account')}
        alt={user?.name ? `${user.name}'s avatar` : 'Account'}
        avatar={user?.avatar}
      />
      {user && <AccountMenu anchorRef={ref} user={user} />}
    </span>
  )
}

export default UserAvatar

const CLOSE_DELAY = 150

/**
 * Dropdown with "Edit profile" and "Log out", shown while the pointer is over
 * the avatar or the menu (and while the avatar link has keyboard focus).
 * It is rendered at the end of <body>: links can't sit inside Payload's
 * account link, which wraps the avatar.
 */
function AccountMenu({ anchorRef, user }: { anchorRef: RefObject<HTMLSpanElement | null>; user: User }) {
  const { config } = useConfig()
  const admin = config.routes.admin === '/' ? '' : config.routes.admin
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, right: 0 })
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuId = useId()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const show = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    const link = anchorRef.current?.closest('a') ?? anchorRef.current
    if (!link) return
    const rect = link.getBoundingClientRect()
    setPosition({ top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) })
    setOpen(true)
  }, [anchorRef])

  const hide = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY)
  }, [])

  // Listen on Payload's link around the avatar, so its whole area counts.
  useEffect(() => {
    const link = anchorRef.current?.closest('a')
    if (!link) return
    link.setAttribute('aria-haspopup', 'menu')
    link.setAttribute('aria-controls', menuId)
    const onFocusOut = (e: FocusEvent) => {
      if (!(e.relatedTarget as HTMLElement | null)?.closest(`[id="${menuId}"]`)) hide()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    link.addEventListener('mouseenter', show)
    link.addEventListener('mouseleave', hide)
    link.addEventListener('focus', show)
    link.addEventListener('focusout', onFocusOut)
    link.addEventListener('keydown', onKey)
    return () => {
      link.removeEventListener('mouseenter', show)
      link.removeEventListener('mouseleave', hide)
      link.removeEventListener('focus', show)
      link.removeEventListener('focusout', onFocusOut)
      link.removeEventListener('keydown', onKey)
    }
  }, [anchorRef, hide, menuId, show])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      id={menuId}
      role="menu"
      aria-label="Account"
      className="adeptimize-account-menu"
      data-open={open || undefined}
      style={{ top: position.top, right: position.right }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && hide()}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <div className="adeptimize-account-menu__picture">
        <Avatar avatar={user.avatar} alt="" size={96} />
      </div>
      <div className="adeptimize-account-menu__details">
        <strong>{user.name}</strong>
        <span>{user.email}</span>
        <Link role="menuitem" href={`${admin}/account`} prefetch={false} className="adeptimize-account-menu__item" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
          Edit Profile
        </Link>
        <Link role="menuitem" href={`${admin}/logout`} prefetch={false} className="adeptimize-account-menu__item adeptimize-account-menu__item--logout" tabIndex={open ? 0 : -1}>
          Log Out
        </Link>
      </div>
    </div>,
    document.body,
  )
}
