import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AboutFounder, AboutHighlights, AboutIntro, AboutTestimonials, AboutValues } from '@/components/sections/about/About'
import { PageHeader } from '@/components/sections/PageHeader'
import { SiteShell } from '@/components/site/SiteShell'
import { getPublishedPage, pageMetadata } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPublishedPage('about-us'), '/about-us/')
}

export default async function AboutPage() {
  const page = await getPublishedPage('about-us')
  if (!page) notFound()

  return (
    <SiteShell>
      <PageHeader data={page.aboutHeader} fallback={page.title} />
      {page.aboutIntro?.heading && <AboutIntro data={page.aboutIntro} />}
      {!!page.aboutValues?.items?.length && <AboutValues data={page.aboutValues} />}
      {page.aboutFounder?.heading && <AboutFounder data={page.aboutFounder} />}
      {page.aboutHighlights?.heading && <AboutHighlights data={page.aboutHighlights} />}
      {(page.aboutTestimonials?.items?.length || page.aboutTestimonials?.logos?.length) ? <AboutTestimonials data={page.aboutTestimonials} /> : null}
    </SiteShell>
  )
}
