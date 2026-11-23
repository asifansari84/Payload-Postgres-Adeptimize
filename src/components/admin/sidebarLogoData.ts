import type { Header, Media, SiteSetting } from '@/payload-types'

export type SidebarLogoData = { siteName: string; url: string | null }

const urlOf = (value: unknown) => (value && typeof value === 'object' ? (value as Media).url || null : null)

/** Settings logo first, then the (light) menu logo, then the (dark) header logo. */
export function resolveSidebarLogo(settings: Partial<SiteSetting> | null, header: Partial<Header> | null): SidebarLogoData {
  const siteName = settings?.siteName || 'Website'
  const own = urlOf(settings?.adminLogo)
  if (own) return { siteName, url: own }
  const menu = urlOf(header?.menuLogo)
  if (menu) return { siteName, url: menu }
  return { siteName, url: urlOf(header?.logo) }
}
