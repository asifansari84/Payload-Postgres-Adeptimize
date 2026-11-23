import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Differentiators } from '@/components/blocks/Differentiators'
import { FAQ } from '@/components/blocks/FAQ'
import { FeatureGrid } from '@/components/blocks/FeatureGrid'
import { Hero } from '@/components/blocks/Hero'
import { ImageAccordion } from '@/components/blocks/ImageAccordion'
import { LogoShowcase } from '@/components/blocks/LogoShowcase'
import { LogoStrip } from '@/components/blocks/LogoStrip'
import { Process } from '@/components/blocks/Process'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { ServiceCarousel } from '@/components/blocks/ServiceCarousel'
import { Testimonials } from '@/components/blocks/Testimonials'
import { SiteShell } from '@/components/site/SiteShell'
import { getPublishedPage } from '@/lib/cms'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPage('home')
  return {
    title: page?.seo?.title ? { absolute: page.seo.title } : undefined,
    description: page?.seo?.description || undefined,
    alternates: { canonical: '/' },
    robots: page?.seo?.noIndex ? { index: false, follow: true } : undefined,
  }
}

/* The section components expect block data; each homepage tab has the same fields. */
const as = <T,>(data: unknown, id: string, blockType: string) => ({ ...(data as object), id, blockType }) as T

export default async function HomePage() {
  const page = await getPublishedPage('home')
  if (!page) {
    return (
      <SiteShell>
        <p className="container" style={{ paddingBlock: '6rem', textAlign: 'center' }}>
          The homepage is not published yet. Publish it in the admin under Pages → Home.
        </p>
      </SiteShell>
    )
  }

  // Sections in page order. A section is shown once its main content is filled in.
  const sections: [string, boolean, ReactNode][] = [
    ['trust', Boolean(page.trust?.heading), <LogoShowcase key="trust" block={as(page.trust, 'home-trust', 'logoShowcase')} />],
    ['problems', Boolean(page.problems?.items?.length), <FeatureGrid key="problems" block={as(page.problems, 'home-problems', 'featureGrid')} />],
    ['framework', Boolean(page.framework?.heading && page.framework.steps?.length), <Process key="framework" block={as(page.framework, 'home-framework', 'process')} />],
    ['differentiators', Boolean(page.differentiators?.heading && page.differentiators.items?.length), <Differentiators key="differentiators" block={as(page.differentiators, 'home-differentiators', 'differentiators')} />],
    ['challenges', Boolean(page.challenges?.heading && page.challenges.images?.length), <ImageAccordion key="challenges" block={as(page.challenges, 'home-challenges', 'imageAccordion')} />],
    ['solutions', Boolean(page.solutions?.items?.length), <FeatureGrid key="solutions" block={as(page.solutions, 'home-solutions', 'featureGrid')} />],
    ['testimonials', Boolean(page.testimonials?.items?.length), <Testimonials key="testimonials" block={as(page.testimonials, 'home-testimonials', 'testimonials')} />],
    ['services', Boolean(page.services?.heading && page.services.services?.length), <ServiceCarousel key="services" block={as(page.services, 'home-services', 'serviceCarousel')} />],
    ['partners', Boolean(page.partners?.heading), <LogoStrip key="partners" block={as(page.partners, 'home-partners', 'logoStrip')} />],
    ['faq', Boolean(page.faq?.heading && page.faq.items?.length), <FAQ key="faq" block={as(page.faq, 'home-faq', 'faq')} />],
  ]
  const visible = sections.filter(([, show]) => show)
  const hero = page.hero?.headline ? page.hero : null

  return (
    <SiteShell>
      {hero && (
        <Hero
          block={{ ...hero, title: hero.headline!, id: 'home-hero' }}
          nextId={visible[0] ? `section-home-${visible[0][0]}` : undefined}
        />
      )}
      {visible.map(([name, , element]) => (
        <div key={name} id={`section-home-${name}`}>{element}</div>
      ))}
      {/* Sections added to the page builder before the homepage moved to tabs. */}
      {!!page.layout?.length && <RenderBlocks blocks={page.layout} />}
    </SiteShell>
  )
}
