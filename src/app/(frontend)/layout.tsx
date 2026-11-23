import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Unbounded } from 'next/font/google'
import { Suspense, type ReactNode } from 'react'
import { NavigationProgress } from '@/components/site/NavigationProgress'
import { getSiteSettings } from '@/lib/cms'
import './globals.css'

const dmSans = localFont({
  src: [
    { path: '../../../public/fonts/dm-sans-latin.woff2', style: 'normal', weight: '100 1000' },
    { path: '../../../public/fonts/dm-sans-italic-latin.woff2', style: 'italic', weight: '100 1000' },
  ],
  variable: '--font-dm-sans',
  display: 'swap',
})

const unbounded = Unbounded({ subsets: ['latin'], variable: '--font-unbounded', display: 'swap' })

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null)
  const favicon = settings?.favicon && typeof settings.favicon === 'object' ? settings.favicon : null

  return {
    metadataBase: new URL(siteURL),
    title: { default: 'Adeptimize — Business Consulting', template: '%s · Adeptimize' },
    description: 'Adeptimize helps ambitious businesses grow with smart marketing strategy and execution.',
    icons: favicon?.url
      ? {
          icon: [{ url: favicon.url, type: favicon.mimeType || undefined }],
          apple: [{ url: favicon.url }],
        }
      : undefined,
    // Settings → General → Search engine visibility. Pages only override this to restrict further.
    ...(settings?.discourageSearchEngines ? { robots: { index: false, follow: false } } : {}),
  }
}

export const viewport: Viewport = { themeColor: '#e5f4fd' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${unbounded.variable}`} data-scroll-behavior="smooth">
      <body>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
