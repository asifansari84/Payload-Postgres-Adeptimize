import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/** Must match CMS_TAG in lib/cms.ts (kept separate so Payload config doesn't import page helpers). */
const CMS_TAG = 'cms'

/**
 * Clears the cached CMS data so the site shows edits straight away. Outside a
 * Next.js server (seed scripts, migrations) there is no cache to clear, so the
 * call is skipped.
 */
function clearCache() {
  try {
    revalidateTag(CMS_TAG, { expire: 0 })
  } catch {
    // Not running inside Next.js.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  clearCache()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  clearCache()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  clearCache()
  return doc
}

/** Hooks to spread into a collection's `hooks`. */
export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}
