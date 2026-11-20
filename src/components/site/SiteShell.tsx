import type { ReactNode } from 'react'
import { getSiteChrome } from '@/lib/cms'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export async function SiteShell({ children }: { children: ReactNode }) {
  const { header, footer } = await getSiteChrome()
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader header={header} />
      <main id="main">{children}</main>
      <SiteFooter footer={footer} />
    </>
  )
}
