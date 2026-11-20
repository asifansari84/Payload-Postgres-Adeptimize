/**
 * Creates (or updates) every service and location page from the content
 * captured from the staging site in scripts/content/listing-content.json,
 * then points the menu and footer links at the new pages.
 *
 *   npm run seed:listings
 */
import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { revalidateSite } from './revalidate.js'
import { locationPath, servicePath } from '../src/lib/routes.js'

type Item = { title: string; text: string }
type Faq = { question: string; answer: string }
type ServiceContent = {
  slug: string; title: string
  intro: { heading: string; text: string }
  highlights: Item[]; quotes: { quote: string; name: string; role: string }[]
  benefits: Item[]; steps: Item[]; faq: Faq[]
}
type LocationContent = {
  slug: string; title: string
  intro: { heading: string; quote: string | null; paragraphs: string[] }
  highlights: Item[]; offerings: Item[]
  results: { heading: string; text: string; stats: { value: string; text: string }[] }
  testimonials: { photo: string; quote: string; name: string; role: string }[]
  faq: Faq[]
}

const payload = await getPayload({ config })
const assets = path.join(process.cwd(), 'public/adeptimize-assets')
const content = JSON.parse(await readFile(path.join(process.cwd(), 'scripts/content/listing-content.json'), 'utf8')) as {
  services: ServiceContent[]
  locations: LocationContent[]
}

const mediaCache = new Map<string, number>()
async function media(file: string, alt: string) {
  const filename = path.basename(file)
  const cached = mediaCache.get(filename)
  if (cached) return cached
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, depth: 0 })
  const id = existing.docs[0]?.id ?? (await payload.create({ collection: 'media', data: { alt }, filePath: path.join(assets, file) })).id
  mediaCache.set(filename, id)
  return id
}

const firstSentence = (text: string) => text.match(/^.*?[.!?](\s|$)/)?.[0].trim() ?? text

/** Card images for the “More services” slider, matching the homepage. */
const cardImages: Record<string, string> = {
  'marketing-strategy-positioning': 'portfolio-slider-1-r5sdm88gabp8ucmk00fhp0rbuwqut66sdnwv9ya150.webp',
  'digital-marketing-paid-media': 'portfolio-slider-3-r5sdm7am3hnyiqnx5i0v4izv9ivhlh321j9dsobfb8.webp',
  'brand-creative-strategy': 'portfolio-slider-7-r5sdm5exptldviqngh7lzjgy2r4r62vld9yeu4e7no.webp',
  'personal-branding': 'portfolio-slider-5-r5sdm6crwnmo74paazm8k18eo504drzbpelwbecthg.webp',
  web: 'portfolio-slider-4-r5sdm6crwnmo74paazm8k18eo504drzbpelwbecthg.webp',
  'conversion-retention-system': 'portfolio-slider-6-r5sdm5exptldviqngh7lzjgy2r4r62vld9yeu4e7no.webp',
  'ai-led-marketing-services': 'portfolio-slider-2-r5sdm88gabp8ucmk00fhp0rbuwqut66sdnwv9ya150.webp',
  'marketing-automation-crm': 'portfolio-slider-8-r5sdm3j9c5it8atdrgecujy0vze0qoo4p0nfvkh004.webp',
  'white-labeling-solutions': 'portfolio-slider-8-r5sdm3j9c5it8atdrgecujy0vze0qoo4p0nfvkh004.webp',
}

async function upsert(collection: 'services' | 'locations', slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  const doc = existing.docs[0]
  if (doc) await payload.update({ collection, id: doc.id, data: data as never })
  else await payload.create({ collection, data: { slug, ...data } as never })
  payload.logger.info(`Saved ${collection}: ${slug}`)
}

try {
  const contactPage = (await payload.find({ collection: 'pages', where: { slug: { equals: 'contact-us' } }, limit: 1, depth: 0 })).docs[0]
  const letsStart = contactPage
    ? { type: 'page' as const, page: contactPage.id, label: "Let's Start" }
    : { type: 'custom' as const, url: '/contact-us/', label: "Let's Start" }

  const shared = {
    bannerImage: await media('2025/08/home1-welcome.webp', 'Colourful mural on a sunny street'),
    accordion: await Promise.all([3, 2, 1].map(async (n) => ({ image: await media(`market-challenges/img-accordion-${n}.webp`, 'Creative studio detail') }))),
    strategy: {
      show: true,
      heading: 'Build Your Market *Strategy*',
      text: 'Tell us about your goals and we will map out the right next steps for your business.',
      image: await media('2024/11/home3-1.webp', 'Team planning a marketing strategy'),
    },
  }

  for (const [index, s] of content.services.entries()) {
    await upsert('services', s.slug, {
      title: s.title,
      status: 'published',
      order: index + 1,
      summary: firstSentence(s.intro.text),
      cardImage: await media(`services/${cardImages[s.slug]}`, s.title),
      banner: { title: s.title, intro: null, image: shared.bannerImage },
      intro: { heading: s.intro.heading, quote: null, text: s.intro.text, button: letsStart, images: shared.accordion },
      highlights: { heading: null, items: s.highlights },
      spotlight: {
        image: await media('2024/11/home-testimonial.webp', 'Happy client'),
        badge: await media('2024/11/smile.webp', 'Smiley badge'),
        items: s.quotes.map((q) => ({ quote: q.quote, name: q.name, company: q.role })),
      },
      benefits: {
        heading: 'Our Key *Benefits*',
        button: letsStart,
        items: await Promise.all(s.benefits.map(async (b, i) => ({ ...b, image: await media(`2024/11/service-box-${i + 1}.webp`, b.title) }))),
      },
      process: {
        heading: null,
        steps: s.steps,
        image: await media('2024/11/home1-cube.webp', 'Abstract still life of glossy vases and flowers'),
        accentImage: await media('2024/11/home1-cube2.webp', 'Decorative shape'),
      },
      faq: { heading: 'Frequently Asked *Questions*', items: s.faq },
      moreServices: { show: true, heading: 'Explore *More Services*' },
      strategy: shared.strategy,
    })
  }

  const stack = await media('2024/11/home2-stack-3.webp', 'Marketing team at work')
  for (const [index, l] of content.locations.entries()) {
    await upsert('locations', l.slug, {
      title: l.title,
      status: 'published',
      order: index + 1,
      summary: firstSentence(l.intro.paragraphs[0] ?? ''),
      banner: { title: l.title, intro: null, image: shared.bannerImage },
      intro: { heading: l.intro.heading, quote: l.intro.quote, text: l.intro.paragraphs.join('\n\n'), button: letsStart, images: shared.accordion },
      highlights: { heading: null, items: l.highlights },
      offerings: { heading: null, items: l.offerings.map((o) => ({ ...o, image: stack })) },
      results: l.results,
      moreServices: { show: true, heading: 'Explore *More Services*' },
      testimonials: {
        eyebrow: 'Success',
        title: 'Stories',
        aside: 'Clients Say!',
        items: await Promise.all(l.testimonials.map(async (t) => ({
          photo: await media(t.photo, t.name), quote: t.quote, name: t.name, company: t.role, rating: 5,
        }))),
      },
      faq: { heading: 'Frequently Asked *Questions*', items: l.faq },
      strategy: shared.strategy,
    })
  }

  // Location page: the full-screen slider (images and icons per location).
  const locationVisuals: Record<string, { card: string; slide: string; icon: string; animation: 'hang' | 'pulse' | 'spin' }> = {
    'south-florida': { card: 'blog-8.webp', slide: 'full-screen-8.webp', icon: 'icon3.webp', animation: 'pulse' },
    'san-antonio': { card: 'blog-7.webp', slide: 'full-screen-1.webp', icon: 'icon1.webp', animation: 'hang' },
    houston: { card: 'blog-3.webp', slide: 'full-screen-10.webp', icon: 'icon4.webp', animation: 'spin' },
    dfw: { card: 'award-2.webp', slide: 'full-screen-10.webp', icon: 'icon4.webp', animation: 'spin' },
    denver: { card: 'home3-accordion-1.webp', slide: 'full-screen-8.webp', icon: 'icon3.webp', animation: 'pulse' },
    austin: { card: 'aboutme-1.webp', slide: 'full-screen-1.webp', icon: 'icon1.webp', animation: 'hang' },
  }
  for (const l of content.locations) {
    const v = locationVisuals[l.slug]
    if (!v) continue
    const doc = (await payload.find({ collection: 'locations', where: { slug: { equals: l.slug } }, limit: 1, depth: 0 })).docs[0]
    if (!doc) continue
    await payload.update({
      collection: 'locations',
      id: doc.id,
      data: {
        cardImage: await media(`2024/11/${v.card}`, l.title),
        slideImage: await media(`2024/11/${v.slide}`, l.title),
        slideIcon: await media(`2024/11/${v.icon}`, 'Decorative icon'),
        slideIconAnimation: v.animation,
      },
    })
  }
  const locationPage = (await payload.find({ collection: 'pages', where: { slug: { equals: 'location' } }, limit: 1, depth: 0 })).docs[0]
  if (locationPage) {
    await payload.update({
      collection: 'pages',
      id: locationPage.id,
      data: {
        locationsHeader: { title: 'Locations We Serve' },
        locationsSlider: { interval: 5 },
      } as never,
    })
    payload.logger.info('Updated the Location page')
  }

  // Point menu and footer links at the pages that now exist, matched by label.
  const live: Record<string, string> = { 'Our Services': '/our-services/', 'All Locations': '/location/' }
  for (const s of content.services) live[s.title] = servicePath(s.slug)
  for (const l of content.locations) live[l.title] = locationPath(l.slug)
  const relink = <T extends { link?: { type?: string | null; url?: string | null; label?: string | null } | null }>(item: T): T =>
    item.link?.label && live[item.link.label] ? { ...item, link: { ...item.link, type: 'custom', url: live[item.link.label] } } : item

  const header = await payload.findGlobal({ slug: 'header', depth: 0 })
  await payload.updateGlobal({
    slug: 'header',
    data: { menu: header.menu?.map((item) => ({ ...item, children: item.children?.map(relink) })) } as never,
  })
  const footer = await payload.findGlobal({ slug: 'footer', depth: 0 })
  await payload.updateGlobal({
    slug: 'footer',
    data: { columns: footer.columns?.map((column) => ({ ...column, links: column.links?.map(relink) })) } as never,
  })
  payload.logger.info('Updated menu and footer links')
} finally {
  await payload.destroy()
}

await revalidateSite()

process.exit(0)
