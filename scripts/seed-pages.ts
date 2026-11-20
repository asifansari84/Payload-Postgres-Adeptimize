/**
 * Fills the About Us, Contact Us and Blog pages with the content from the
 * staging site. Safe to re-run: images are reused by filename and each page is
 * updated in place.
 *
 *   npm run seed:pages
 */
import 'dotenv/config'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { revalidateSite } from './revalidate.js'

const payload = await getPayload({ config })
const assets = path.join(process.cwd(), 'public/adeptimize-assets')

async function media(file: string, alt: string) {
  const filename = path.basename(file)
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, depth: 0 })
  return existing.docs[0]?.id ?? (await payload.create({ collection: 'media', data: { alt }, filePath: path.join(assets, file) })).id
}

async function upsertPage(slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  const doc = existing.docs[0]
  if (doc) await payload.update({ collection: 'pages', id: doc.id, data: data as never })
  else await payload.create({ collection: 'pages', draft: false, data: { slug, status: 'published', ...data } as never })
  payload.logger.info(`Saved page: ${slug}`)
}

const contactPage = (await payload.find({ collection: 'pages', where: { slug: { equals: 'contact-us' } }, limit: 1, depth: 0 })).docs[0]

try {
  await upsertPage('about-us', {
    title: 'About Us',
    status: 'published',
    aboutHeader: { eyebrow: 'Adeptimize', title: 'About Us' },
    aboutIntro: {
      heading: 'Fueling *Digital Growth* with Smart, *Bold* Moves',
      text: 'Welcome to Adeptimize, your growth partner in a fast-changing digital world. We blend creativity with strategy to launch campaigns that convert. From sharp insights to real-time results, we help brands scale smarter, faster, and bolder.',
      button: contactPage
        ? { type: 'page', page: contactPage.id, label: "Let's Start" }
        : { type: 'custom', url: '/contact-us/', label: "Let's Start" },
      image: await media('2024/11/about-1.webp', 'Adeptimize team collaborating'),
      stats: [
        { value: '98%', image: await media('2024/11/about-2.webp', 'Marketing campaign planning'), text: 'We create custom marketing campaigns that help clients build stronger brands with a 98% success rate in improvements.' },
        { value: '50+', image: await media('2024/11/about-3.webp', 'Team reviewing growth results'), text: 'We’ve helped over 50 companies grow faster by staying ahead of trends and making smart marketing decisions consistently.' },
      ],
    },
    aboutValues: {
      items: [
        { title: 'Who We Are', text: "Since 1998, Adeptimize has been a team of marketing professionals who genuinely care about helping businesses grow and succeed in today's competitive digital world." },
        { title: 'What We Do', text: 'We handle all aspects of digital marketing including website design, search optimization, social media management, and advertising campaigns that generate real leads.' },
        { title: 'How We Innovate', text: 'We use the latest marketing technology and data analysis tools - constantly tested, refined, and updated to stay ahead of changes in the digital landscape and customer behaviors.' },
        { title: 'Why Brands Trust Us', text: 'Business owners choose us because we focus on delivering measurable results that directly impact their revenue and growth goals through transparent partnerships.' },
      ],
    },
    aboutFounder: {
      heading: 'Meet *Mohit*',
      role: 'Entrepreneur, Strategist, and CEO of Adeptimize',
      image: await media('2025/08/mohit1.png', 'Mohit, CEO of Adeptimize'),
      social: [
        { platform: 'youtube', url: 'https://www.youtube.com/' },
        { platform: 'linkedin', url: 'https://www.linkedin.com/' },
        { platform: 'facebook', url: 'https://www.facebook.com/' },
        { platform: 'behance', url: 'https://www.behance.net/' },
      ],
    },
    aboutHighlights: {
      heading: 'Real-Time Decisions, *Superior* Monetization Outcomes',
      items: [
        { icon: await media('2024/11/award-1.webp', 'Award badge'), title: 'Proven Track Record', text: 'Over 200 successful projects delivered' },
        { icon: await media('2024/11/award-2.webp', 'Award badge'), title: 'Industry Expertise', text: '20+ years of combined team experience' },
        { icon: await media('2024/11/award-4.webp', 'Award badge'), title: 'Technology-First', text: 'Leveraging cutting-edge AI and automation' },
        { icon: await media('2024/11/award-5.webp', 'Award badge'), title: 'Results-Oriented', text: 'Average ROI improvement of 180%' },
      ],
    },
    aboutTestimonials: {
      image: await media('2024/11/home-testimonial.webp', 'Happy client'),
      badge: await media('2024/11/smile.webp', 'Smiley badge'),
      items: [
        { name: 'Joel Holst', company: 'Providence Partners', quote: 'Working with Adeptimize transformed how we connect with both clients and candidates online. Their SEO strategy got us ranking on the first page for key technical recruiting terms, and their LinkedIn marketing campaigns doubled our qualified leads from 15 to 30 per month. The team really understood our specialized niche in AI and engineering talent, making our digital presence much more professional and effective.' },
        { name: 'James Chamber', company: 'Excel Construction Group', quote: 'Adeptimize helped us dominate local search results across all our Texas and Colorado markets. Their Google Ads campaigns brought in quality leads for roofing, remodeling, and solar projects, while their website optimization made it easier for customers to request free inspections. Our online reviews and reputation management strategy has made a huge difference in winning new commercial contracts, increasing our close rate by 40%.' },
        { name: 'Roland Brickey', company: 'Ulrich Lifestyle', quote: 'The digital transformation Adeptimize provided exceeded our expectations for reaching homeowners interested in custom sheds, cabins, and garages. Their content marketing strategy showcased our craftsmanship beautifully, and their targeted Facebook campaigns brought families to our design centers, increasing showroom visits by 65%. The analytics and performance tracking they set up helps us understand exactly which campaigns drive the most showroom visits and sales.' },
      ],
      logos: await Promise.all(['logo-1', 'logo-2', 'logo-4', 'logo-5', 'logo-7', 'logo-8', 'logo-11', 'logo-12'].map(async (name) => ({
        logo: await media(`2024/11/${name}.webp`, 'Client logo'),
      }))),
    },
  })

  await upsertPage('contact-us', {
    title: 'Contact Us',
    status: 'published',
    contactHeader: { title: 'Contact Us' },
    contactIntro: {
      heading: 'Get In Touch With *Adeptimize*',
      subheading: 'Start Your Marketing Success Journey Today',
      text: [
        'Your business deserves marketing strategies that deliver results, not empty promises. At Adeptimize, we understand every company has unique challenges and goals that require personalized attention.',
        'Our team of digital marketing experts specializes in creating comprehensive solutions that drive real growth. From SEO and paid media to website development and marketing automation, we handle every aspect of your online presence.',
        'Whether you’re struggling with low website traffic, poor conversion rates, or ineffective social media campaigns, we have the expertise and proven strategies to turn things around. Let’s discuss how our data-driven approach can transform your marketing performance and accelerate your business success.',
      ].join('\n\n'),
    },
    contactDetails: {
      heading: 'Contact *Information*',
      address: '3101 West 6th Street\nFort Worth, TX 76107\nUnited States',
      email: 'info@adeptimize.com',
      phone: '+1 (512) 750-0778',
      hoursHeading: 'Business Hours',
      hours: 'Monday - Friday: 8:00 AM - 6:00 PM CST\nSaturday - Sunday: Closed',
      note: 'Reach Out to Our Marketing Experts',
    },
    contactExpect: {
      heading: 'What to Expect When You *Contact Us*',
      items: [
        { title: 'Initial Consultation', text: 'Our team schedules a complimentary 30-minute strategy session to understand your current marketing challenges and growth objectives.' },
        { title: 'Custom Proposal', text: 'Within 24 hours, we deliver a tailored proposal outlining specific solutions for your business needs and budget requirements.' },
        { title: 'Quick Response Guarantee', text: 'We respond to all inquiries within 4 business hours during normal operating times.' },
      ],
    },
    contactCta: {
      heading: 'Schedule Your Free *Marketing Assessment*',
      text: 'Discover how strategic digital marketing can multiply your revenue. Contact Adeptimize today and let’s build a marketing system that delivers measurable results for your business.',
      image: await media('2024/11/pf-single-testimonial.webp', 'Marketing strategy session'),
    },
  })

  await upsertPage('our-services', {
    title: 'Our Services',
    status: 'published',
    servicesHeader: { title: 'Our Services', image: await media('2025/08/home1-welcome.webp', 'Colourful mural on a sunny street') },
    servicesIntro: {
      heading: 'What We Deliver *Every Day*',
      text: 'Execution-first digital services designed for performance, clarity, and business growth.',
      counters: [
        { value: 20, suffix: '+', label: 'Marketing Channels Managed', text: 'We offer specialized services across SEO, Google Ads, Meta, LinkedIn, email automation, and more; tailored to each brand’s needs.' },
        { value: 270, suffix: '+', label: 'Web & Campaign Projects', text: 'From responsive websites to ad creatives and landing pages, we’ve built and deployed over 120 unique digital assets for clients.' },
        { value: 99, suffix: '%', label: 'Client Retention Rate', text: 'We don’t chase long-term contracts – we earn long-term clients by being transparent, responsive, and relentlessly focused on their success.' },
      ],
    },
    servicesSlider: { heading: '*Explore* More Services' },
    servicesCta: {
      heading: "Let's Get Started Today.",
      badgeText: 'Get Started Now',
      link: contactPage ? { type: 'page', page: contactPage.id } : { type: 'custom', url: '/contact-us/' },
      image: await media('2024/11/home3-1.webp', 'Team planning a marketing strategy'),
      background: await media('2024/11/home3-curve-bg.webp', 'Decorative curves'),
    },
  })

  await upsertPage('location', {
    title: 'Location',
    status: 'published',
    locationsHeader: { eyebrow: 'Adeptimize', title: 'Location' },
  })

  // One service and one location to start with; more are added in the admin.
  for (const [collection, data] of [
    ['services', { title: 'Marketing Strategy & Positioning', slug: 'marketing-strategy-positioning', summary: 'Clear positioning and a practical plan that turns your strengths into growth.', banner: { eyebrow: 'Service', title: 'Marketing Strategy & Positioning' } }],
    ['locations', { title: 'South Florida', slug: 'south-florida', summary: 'Digital marketing for growing businesses across South Florida.', banner: { eyebrow: 'Location', title: 'South Florida' } }],
  ] as const) {
    const existing = await payload.find({ collection, where: { slug: { equals: data.slug } }, limit: 1, depth: 0 })
    if (!existing.docs[0]) await payload.create({ collection, data: { ...data, status: 'published', order: 1 } })
    payload.logger.info(`Saved ${collection}: ${data.slug}`)
  }

  // Point the menu and footer at the pages that now exist.
  const header = await payload.findGlobal({ slug: 'header', depth: 0 })
  const live: Record<string, string> = {
    'Our Services': '/our-services/',
    'Marketing Strategy & Positioning': '/service-item/marketing-strategy-positioning/',
    'All Locations': '/location/',
    'South Florida': '/location-south-florida/',
  }
  const relink = <T extends { link?: { type?: string | null; url?: string | null; label?: string | null } | null }>(item: T): T =>
    item.link?.label && live[item.link.label] ? { ...item, link: { ...item.link, type: 'custom', url: live[item.link.label] } } : item
  await payload.updateGlobal({
    slug: 'header',
    data: {
      menu: header.menu?.map((item) => {
        const children = item.children ?? []
        const isLocation = item.link?.label === 'Location' && !children.some((c) => c.link?.label === 'All Locations')
        return {
          ...item,
          children: (isLocation ? [{ link: { type: 'custom' as const, url: '/location/', label: 'All Locations' } }, ...children] : children).map(relink),
        }
      }),
    } as never,
  })
  const footer = await payload.findGlobal({ slug: 'footer', depth: 0 })
  await payload.updateGlobal({
    slug: 'footer',
    data: { columns: footer.columns?.map((column) => ({ ...column, links: column.links?.map(relink) })) } as never,
  })

  await upsertPage('blog', {
    title: 'Blog',
    status: 'published',
    blogHeader: { eyebrow: 'Insights', title: 'Blogs' },
  })
} finally {
  await payload.destroy()
}

await revalidateSite()

process.exit(0)
