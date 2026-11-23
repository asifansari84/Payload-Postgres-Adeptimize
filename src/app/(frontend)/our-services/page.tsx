import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceCarousel } from '@/components/blocks/ServiceCarousel'
import { ImageBanner, ServicesCta, ServicesIntro } from '@/components/sections/services/Services'
import { SiteShell } from '@/components/site/SiteShell'
import type { ServiceCarouselBlock } from '@/payload-types'
import { getPublishedPage, getServiceCards, pageMetadata } from '@/lib/cms'
import { servicePath } from '@/lib/routes'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPublishedPage('our-services'), '/our-services/')
}

export default async function ServicesPage() {
  const [page, services] = await Promise.all([getPublishedPage('our-services'), getServiceCards()])
  if (!page) notFound()

  const slider = {
    id: 'our-services-slider',
    blockType: 'serviceCarousel',
    heading: page.servicesSlider?.heading || '*Explore* More Services',
    services: services.map((s) => ({ id: String(s.id), title: s.title, image: s.cardImage, link: { type: 'custom', url: servicePath(s.slug) } })),
  } as ServiceCarouselBlock

  return (
    <SiteShell>
      <ImageBanner title={page.servicesHeader?.title || page.title} subtitle={page.servicesHeader?.intro} image={page.servicesHeader?.image} />
      {page.servicesIntro?.heading && <ServicesIntro data={page.servicesIntro} />}
      {!!services.length && <ServiceCarousel block={slider} stacked />}
      {page.servicesCta?.heading && <ServicesCta data={page.servicesCta} />}
    </SiteShell>
  )
}
