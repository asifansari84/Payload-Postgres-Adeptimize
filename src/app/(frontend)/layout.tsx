import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Unbounded } from 'next/font/google'
import { Suspense, type ReactNode } from 'react'
import { MotionEngine } from '@/components/motion/MotionEngine'
import { motionScript } from '@/components/motion/motionScript'
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
    // suppressHydrationWarning: the motion script adds a class to <html> before React hydrates.
    <html lang="en" className={`${dmSans.variable} ${unbounded.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Runs before first paint so scroll-revealed content starts hidden, without a flash. */}
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
        <MotionEngine />
      </body>
    </html>
  )
}
