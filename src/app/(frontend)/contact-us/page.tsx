import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContactCta, ContactDetails, ContactExpect, ContactIntro } from '@/components/sections/contact/Contact'
import { PageHeader } from '@/components/sections/PageHeader'
import { SiteShell } from '@/components/site/SiteShell'
import { getContactForm, getPublishedPage, pageMetadata } from '@/lib/cms'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPublishedPage('contact-us'), '/contact-us/')
}

export default async function ContactPage() {
  const page = await getPublishedPage('contact-us')
  if (!page) notFound()
  const form = await getContactForm(page.contactIntro?.form)

  return (
    <SiteShell>
      <PageHeader data={page.contactHeader} fallback={page.title} />
      <ContactIntro data={page.contactIntro ?? {}} form={form} />
      {page.contactDetails && (page.contactDetails.address || page.contactDetails.email || page.contactDetails.phone || page.contactDetails.mapLocation) && <ContactDetails data={page.contactDetails} />}
      {page.contactExpect?.heading && <ContactExpect data={page.contactExpect} />}
      {page.contactCta?.heading && <ContactCta data={page.contactCta} details={page.contactDetails} />}
    </SiteShell>
  )
}
