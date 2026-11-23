import type { ServerProps } from 'payload'

import { SidebarLogoClient } from './SidebarLogoClient'
import { resolveSidebarLogo } from './sidebarLogoData'

/** Logo at the top of the admin sidebar, linking to the website (Settings → Admin panel). */
export default async function SidebarLogo({ payload }: ServerProps) {
  const [settings, header] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
    payload.findGlobal({ slug: 'header', depth: 1 }).catch(() => null),
  ])
  return <SidebarLogoClient initial={resolveSidebarLogo(settings, header)} />
}
