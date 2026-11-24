'use client'

import { toast, useAuth, useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import type { Media, User } from '@/payload-types'
import { Avatar } from '../UserAvatar'
import { useModal } from '../useModal'
import { EDIT_USER_EVENT } from './UserCells'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const INTERACTIVE = 'a, button, input, label, select, textarea, [role="checkbox"], [role="button"]'

/**
 * Users list: clicking a user's name, avatar or row opens a popup to edit
 * their name and avatar. Username and email are shown but can't be changed
 * (the collection's field access enforces that on the server too).
 */
export default function UserEditDialog() {
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    const open = (e: Event) => setId((e as CustomEvent<{ id: string }>).detail.id)
    // A click anywhere else on a row (username, email, date) opens it too.
    const onRowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest(INTERACTIVE) || target.closest('dialog')) return
      const row = target.closest('table tbody tr')
      const userId = row?.querySelector<HTMLElement>('[data-user-id]')?.dataset.userId
      if (userId) setId(userId)
    }
    window.addEventListener(EDIT_USER_EVENT, open)
    document.addEventListener('click', onRowClick)
    return () => {
      window.removeEventListener(EDIT_USER_EVENT, open)
      document.removeEventListener('click', onRowClick)
    }
  }, [])

  return id ? <EditUser key={id} id={id} onClose={() => setId(null)} /> : null
}

function EditUser({ id, onClose }: { id: string; onClose: () => void }) {
  const { config } = useConfig()
  const { user: me, fetchFullUser } = useAuth<User>()
  const router = useRouter()
  const api = `${config.serverURL ?? ''}${config.routes.api}`
  const adminRoute = config.routes.admin === '/' ? '' : config.routes.admin
  const { ref, onClick } = useModal(onClose)
  const uid = useId()
  const fileInput = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<User | null>(null)
  const [loadError, setLoadError] = useState('')
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [avatar, setAvatar] = useState<User['avatar']>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${api}/users/${encodeURIComponent(id)}?depth=1`, { credentials: 'include', signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 403 ? 'You do not have access to this user.' : 'Could not load this user.')
        const doc = (await res.json()) as User
        setUser(doc)
        setName(doc.name ?? '')
        setAvatar(doc.avatar ?? null)
      })
      .catch((err: Error) => err.name !== 'AbortError' && setLoadError(err.message))
    return () => controller.abort()
  }, [api, id])

  // Preview of a newly chosen image.
  useEffect(() => {
    if (!file) return setPreview(null)
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const chooseFile = (chosen?: File) => {
    if (!chosen) return
    if (!chosen.type.startsWith('image/')) return toast.error('Choose an image file.')
    if (chosen.size > MAX_IMAGE_BYTES) return toast.error('Choose an image smaller than 5 MB.')
    setFile(chosen)
  }

  const removeAvatar = () => {
    setFile(null)
    setAvatar(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  const errorMessage = async (res: Response, fallback: string) => {
    const body = (await res.json().catch(() => null)) as { errors?: { message?: string; data?: { errors?: { message?: string }[] } }[] } | null
    const first = body?.errors?.[0]
    return first?.data?.errors?.[0]?.message || first?.message || fallback
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setNameError('Enter a name.')
    if (trimmed.length > 100) return setNameError('Keep the name under 100 characters.')
    setNameError('')
    setSaving(true)
    try {
      let avatarId: number | null = avatar && typeof avatar === 'object' ? avatar.id : (avatar ?? null)
      if (file) {
        const upload = new FormData()
        upload.append('file', file)
        upload.append('_payload', JSON.stringify({ alt: `${trimmed}'s avatar` }))
        const res = await fetch(`${api}/media`, { method: 'POST', credentials: 'include', body: upload })
        if (!res.ok) throw new Error(await errorMessage(res, 'The image could not be uploaded.'))
        avatarId = ((await res.json()) as { doc: Media }).doc.id
      }
      // Only name and avatar are sent: username and email are never changed here.
      const res = await fetch(`${api}/users/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, avatar: avatarId }),
      })
      if (!res.ok) throw new Error(await errorMessage(res, 'The changes could not be saved.'))
      toast.success('Profile updated.')
      if (me && String(me.id) === id) await fetchFullUser()
      router.refresh()
      onClose()
    } catch (err) {
      toast.error((err as Error).message)
      setSaving(false)
    }
  }

  const titleId = `${uid}-title`
  const shownAvatar = preview ? null : avatar

  const hasAvatar = Boolean(preview || avatar)
  const lock = (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14"><path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
  )

  return (
    <dialog ref={ref} className="adeptimize-lead-dialog adeptimize-user-dialog" aria-labelledby={titleId} onClick={onClick}>
      <form className="adeptimize-user-dialog__form" onSubmit={save} noValidate>
        <header className="adeptimize-user-dialog__header">
          <div>
            <h2 id={titleId}>Edit profile</h2>
            <p>Update the name and profile picture.</p>
          </div>
          <button type="button" className="adeptimize-user-dialog__close" onClick={onClose} aria-label="Close">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </header>

        <div className="adeptimize-user-dialog__body">
          {loadError ? (
            <p className="adeptimize-user-dialog__error">{loadError}</p>
          ) : !user ? (
            <p className="adeptimize-user-dialog__loading">Loading…</p>
          ) : (
            <>
              <section className="adeptimize-user-dialog__profile" aria-label="Profile picture">
                <div className="adeptimize-user-dialog__picture">
                  {preview
                    ? <img src={preview} alt="New profile picture preview" width={80} height={80} />
                    : <Avatar avatar={shownAvatar} alt={`${user.name}'s profile picture`} size={80} />}
                </div>
                <div className="adeptimize-user-dialog__profile-text">
                  <strong>{name.trim() || user.name}</strong>
                  <span>{user.email}</span>
                  <div className="adeptimize-user-dialog__avatar-actions">
                    <input
                      ref={fileInput}
                      id={`${uid}-file`}
                      type="file"
                      accept="image/*"
                      className="adeptimize-leads__sr"
                      onChange={(e) => chooseFile(e.target.files?.[0])}
                      disabled={saving}
                    />
                    <label htmlFor={`${uid}-file`} className="adeptimize-leads__button" aria-disabled={saving || undefined}>
                      {hasAvatar ? 'Change picture' : 'Upload picture'}
                    </label>
                    {hasAvatar && (
                      <button type="button" className="adeptimize-user-dialog__remove" onClick={removeAvatar} disabled={saving}>
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="adeptimize-user-dialog__hint">JPG, PNG, WebP or GIF, up to 5 MB.{preview && ' Saved when you click “Save changes”.'}</p>
                </div>
              </section>

              <div className="adeptimize-user-dialog__fields">
                <div className="adeptimize-user-dialog__field" data-wide>
                  <label htmlFor={`${uid}-name`}>Name <span aria-hidden="true">*</span></label>
                  <input
                    id={`${uid}-name`}
                    value={name}
                    onChange={(e) => { setName(e.target.value); setNameError('') }}
                    maxLength={100}
                    required
                    autoComplete="name"
                    disabled={saving}
                    aria-invalid={nameError ? true : undefined}
                    aria-describedby={nameError ? `${uid}-name-error` : undefined}
                    autoFocus
                  />
                  {nameError && <p id={`${uid}-name-error`} className="adeptimize-user-dialog__error">{nameError}</p>}
                </div>
                <div className="adeptimize-user-dialog__field">
                  <label htmlFor={`${uid}-username`}>Username {lock}</label>
                  <input id={`${uid}-username`} value={user.username ?? ''} readOnly aria-readonly="true" aria-describedby={`${uid}-locked`} />
                </div>
                <div className="adeptimize-user-dialog__field">
                  <label htmlFor={`${uid}-email`}>Email {lock}</label>
                  <input id={`${uid}-email`} value={user.email ?? ''} readOnly aria-readonly="true" aria-describedby={`${uid}-locked`} />
                </div>
                <p id={`${uid}-locked`} className="adeptimize-user-dialog__hint" data-wide>Username and email can&rsquo;t be changed.</p>
              </div>
            </>
          )}
        </div>

        <footer className="adeptimize-user-dialog__footer">
          {/* Password and other account settings stay on the full page. */}
          <Link className="adeptimize-user-dialog__more" href={`${adminRoute}/collections/users/${encodeURIComponent(id)}`} prefetch={false}>
            Password &amp; more settings
          </Link>
          <div className="adeptimize-user-dialog__buttons">
            <button type="button" className="adeptimize-leads__button" onClick={onClose} disabled={saving}>Cancel</button>
            {user && (
              <button type="submit" className="adeptimize-leads__button adeptimize-leads__button--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            )}
          </div>
        </footer>
      </form>
    </dialog>
  )
}
