import type { Location, Service } from '@/payload-types'
import { FAQ } from '@/components/blocks/FAQ'
import { FeatureGrid } from '@/components/blocks/FeatureGrid'
import { Hero } from '@/components/blocks/Hero'
import { Process } from '@/components/blocks/Process'
import { ServiceCarousel } from '@/components/blocks/ServiceCarousel'
import { Testimonials } from '@/components/blocks/Testimonials'
import { AboutTestimonials } from '@/components/sections/about/About'
import { SiteShell } from '@/components/site/SiteShell'
import { getContactForm, getServiceCards } from '@/lib/cms'
import { servicePath } from '@/lib/routes'
import { BenefitsSection, IntroSection, OfferingsSection, ResultsSection, StrategySection } from './ListingSections'

/* Section components take block-shaped data; each tab has the same fields. */
const as = <T,>(data: unknown, id: string, blockType: string) => ({ ...(data as object), id, blockType }) as T

function Banner({ doc }: { doc: Service | Location }) {
  const title = doc.banner?.title || doc.title
  return <Hero block={{ title, subtitle: doc.banner?.intro, image: doc.banner?.image ?? undefined, id: `${doc.slug}-banner` }} />
}

async function MoreServices({ doc, exclude }: { doc: Service | Location; exclude?: string }) {
  if (doc.moreServices?.show === false) return null
  const services = (await getServiceCards()).filter((s) => s.slug !== exclude)
  if (!services.length) return null
  return (
    <ServiceCarousel
      block={as(
        {
          heading: doc.moreServices?.heading || 'Explore *More Services*',
          services: services.map((s) => ({ id: String(s.id), title: s.title, image: s.cardImage, link: { type: 'custom', url: servicePath(s.slug) } })),
        },
        `${doc.slug}-more`,
        'serviceCarousel',
      )}
    />
  )
}

async function Strategy({ doc }: { doc: Service | Location }) {
  if (doc.strategy?.show === false || !doc.strategy?.heading) return null
  return <StrategySection data={doc.strategy} form={await getContactForm()} id={doc.slug} />
}

export function ServiceDetail({ service }: { service: Service }) {
  const id = service.slug
  return (
    <SiteShell>
      <Banner doc={service} />
      {service.intro?.heading && <IntroSection data={service.intro} id={id} />}
      {!!service.highlights?.items?.length && <FeatureGrid block={as(service.highlights, `${id}-highlights`, 'featureGrid')} />}
      {!!service.spotlight?.items?.length && <AboutTestimonials data={service.spotlight} />}
      {service.benefits?.heading && <BenefitsSection data={service.benefits} id={id} />}
      {!!service.process?.steps?.length && service.process.image && <Process block={as(service.process, `${id}-process`, 'process')} />}
      {!!service.faq?.items?.length && <FAQ block={as(service.faq, `${id}-faq`, 'faq')} />}
      <MoreServices doc={service} exclude={service.slug} />
      <Strategy doc={service} />
    </SiteShell>
  )
}

export function LocationDetail({ location }: { location: Location }) {
  const id = `location-${location.slug}`
  return (
    <SiteShell>
      <Banner doc={location} />
      {location.intro?.heading && <IntroSection data={location.intro} id={id} />}
      {!!location.highlights?.items?.length && <FeatureGrid block={as(location.highlights, `${id}-highlights`, 'featureGrid')} />}
      {!!location.offerings?.items?.length && <OfferingsSection data={location.offerings} id={id} />}
      {location.results?.heading && <ResultsSection data={location.results} id={id} />}
      <MoreServices doc={location} />
      {!!location.testimonials?.items?.length && <Testimonials block={as(location.testimonials, `${id}-testimonials`, 'testimonials')} />}
      {!!location.faq?.items?.length && <FAQ block={as(location.faq, `${id}-faq`, 'faq')} />}
      <Strategy doc={location} />
    </SiteShell>
  )
}
