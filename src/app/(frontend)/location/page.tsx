import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocationSlider } from '@/components/sections/locations/LocationSlider'
import { SiteShell } from '@/components/site/SiteShell'
import { MediaImage } from '@/components/ui/helpers'
import { getLocationCards, getPublishedPage, pageMetadata } from '@/lib/cms'
import { locationPath } from '@/lib/routes'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPublishedPage('location'), '/location/')
}

export default async function LocationsPage() {
  const [page, locations] = await Promise.all([getPublishedPage('location'), getLocationCards()])
  if (!page) notFound()

  const slides = locations
    .filter((l) => l.slideImage)
    .map((l) => ({
      id: l.id,
      title: l.title,
      href: locationPath(l.slug),
      image: <MediaImage media={l.slideImage} alt="" sizes="100vw" />,
      icon: l.slideIcon ? <MediaImage media={l.slideIcon} alt="" sizes="6rem" /> : undefined,
      animation: l.slideIconAnimation,
    }))

  return (
    <SiteShell>
      <h1 className="visually-hidden">{page.locationsHeader?.title || page.title}</h1>
      <LocationSlider slides={slides} interval={page.locationsSlider?.interval ?? 5} />
    </SiteShell>
  )
}
