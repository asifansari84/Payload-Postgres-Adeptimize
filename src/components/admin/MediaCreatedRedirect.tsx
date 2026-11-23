'use client'

import { toast, useConfig, useDocumentDrawerContext, useDocumentInfo } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import { useEffect, useRef } from 'react'

const CREATED_KEY = 'adeptimize:media-created'
/** Payload stores its own "created" toast here to show on the new document's page. */
const PAYLOAD_PENDING_TOAST_KEY = 'payload-pending-success-toast'

const storage = {
  get: (key: string) => { try { return window.sessionStorage.getItem(key) } catch { return null } },
  set: (key: string, value: string) => { try { window.sessionStorage.setItem(key, value) } catch { /* storage unavailable */ } },
  remove: (key: string) => { try { window.sessionStorage.removeItem(key) } catch { /* storage unavailable */ } },
}

/**
 * After uploading a new file, Payload opens that file's edit page. Editors expect
 * to land back in the media library instead, so send them there and confirm the
 * upload with a notification. Uploads made from a drawer (e.g. picking an image
 * inside a post) are left alone so the editor stays where they were.
 */
export default function MediaCreatedRedirect() {
  const { id, data } = useDocumentInfo()
  const { drawerSlug } = useDocumentDrawerContext()
  const { config } = useConfig()
  const router = useRouter()
  const openedAsCreate = useRef(!id)

  const savedID = data?.id
  const filename = typeof data?.filename === 'string' ? data.filename : ''

  // Create view: once the save succeeds Payload fills in the new document, then navigates to it.
  useEffect(() => {
    if (drawerSlug || id || !openedAsCreate.current || !savedID) return
    storage.set(CREATED_KEY, filename)
  }, [drawerSlug, id, savedID, filename])

  // The new document's page: go back to the library and confirm the upload there.
  useEffect(() => {
    if (drawerSlug || !id) return
    const uploadedName = storage.get(CREATED_KEY)
    if (uploadedName === null) return

    storage.remove(CREATED_KEY)
    storage.remove(PAYLOAD_PENDING_TOAST_KEY)
    toast.dismiss()
    router.replace(formatAdminURL({ adminRoute: config.routes.admin, path: '/collections/media' }))
    toast.success(uploadedName ? `“${uploadedName}” uploaded to the media library.` : 'File uploaded to the media library.')
  }, [drawerSlug, id, config.routes.admin, router])

  return null
}
