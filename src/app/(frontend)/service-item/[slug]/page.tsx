import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceDetail } from '@/components/sections/listing/ListingPage'
import { getPublishedSlugs, getService, pageMetadata } from '@/lib/cms'
import { servicePath } from '@/lib/routes'

type Props = { params: Promise<{ slug: string }> }

/** Prebuild every published service; new ones are built on first visit and cached. */
export async function generateStaticParams() {
  return (await getPublishedSlugs('services')).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return pageMetadata(await getService(slug), servicePath(slug))
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) notFound()

  return <ServiceDetail service={service} />
}
