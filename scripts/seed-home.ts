/**
 * Builds the homepage from page-builder sections and fills the Header and
 * Footer globals. Safe to re-run: images are reused by filename and the
 * homepage sections are replaced, while the imported legacy markup is kept.
 *
 *   npm run seed:home
 */
import 'dotenv/config'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { revalidateSite } from './revalidate.js'

const payload = await getPayload({ config })
const assets = path.join(process.cwd(), 'public/adeptimize-assets')

/**
 * Full-screen menu. Pages that don't exist yet (services, industries,
 * locations) link to "#" until they are built.
 */
async function headerMenu(pageLink: (slug: string, label?: string) => Promise<object>) {
  const soon = (label: string) => ({ link: { type: 'custom' as const, url: '#', label } })
  const group = (label: string, children: string[]) => ({ link: { type: 'custom' as const, url: '#', label }, children: children.map(soon) })
  return [
    { link: await pageLink('home', 'Home') },
    { link: await pageLink('about-us', 'About Us') },
    group('Services', [
      'Our Services', 'Marketing Strategy & Positioning', 'Digital Marketing & Paid Media', 'Brand & Creative Strategy',
      'Personal Branding', 'Website Design & Development', 'Conversion & Retention System', 'AI Led Marketing Services',
      'Marketing Automation & CRM', 'White Labeling Solutions',
    ]),
    group('Industry We Serve', ['Home & Construction Services']),
    group('Location', ['South Florida', 'DFW', 'Denver', 'San Antonio', 'Austin', 'Houston']),
    { link: await pageLink('blog', 'Blog') },
    { link: await pageLink('contact-us', 'Contact Us') },
  ]
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

async function pageLink(slug: string, label?: string) {
  const result = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  const page = result.docs[0]
  return page
    ? { type: 'page' as const, page: page.id, label }
    : { type: 'custom' as const, url: slug === 'home' ? '/' : `/${slug}/`, label }
}

type TextNode = { type: 'text'; text: string; format: number; version: 1; detail: 0; mode: 'normal'; style: '' }
const text = (value: string, bold = false): TextNode => ({ type: 'text', text: value, format: bold ? 1 : 0, version: 1, detail: 0, mode: 'normal', style: '' })
/** Paragraph from a string where **double asterisks** mark bold text. */
const paragraph = (value: string) => ({
  type: 'paragraph', version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, textFormat: 0,
  children: value.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((part) => part.startsWith('**') ? text(part.slice(2, -2), true) : text(part)),
})
const list = (items: string[]) => ({
  type: 'list', listType: 'bullet', tag: 'ul', start: 1, version: 1, direction: 'ltr' as const, format: '' as const, indent: 0,
  children: items.map((item, index) => ({ type: 'listitem', value: index + 1, version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, children: [text(item)] })),
})
const richText = (...children: object[]) => ({
  root: { type: 'root', version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, children },
})

try {
  // ---------- Header ----------
  const contact = await pageLink('contact-us')
  await payload.updateGlobal({
    slug: 'header',
    data: {
      logo: await media('2025/05/adeptimize-logo-blue-1.svg', 'Adeptimize'),
      buttons: [
        { link: { ...contact, label: 'Book a Call' } },
        { link: { ...contact, label: 'Free audits' } },
      ],
      menu: await headerMenu(pageLink),
      menuLogo: await media('2025/05/Adeptimize-white-logo.svg', 'Adeptimize'),
      phone: '+1 (512) 750-0778',
      email: 'info@adeptimize.com',
      menuImage1: await media('2024/11/fs-menu-1.webp', 'Two friends leaning on a wall'),
      menuImage2: await media('2024/11/fs-menu-2.webp', 'Bright creative studio office'),
      chat: { title: 'We are much closer', text: 'Contact us via Telegram' },
      social: [
        { platform: 'facebook', url: 'https://www.facebook.com/' },
        { platform: 'linkedin', url: 'https://www.linkedin.com/' },
        { platform: 'instagram', url: 'https://www.instagram.com/' },
      ],
    },
  })

  // ---------- Footer ----------
  const services: [string, string, string][] = [
    ['service-item/marketing-strategy-positioning', 'Marketing Strategy & Positioning', 'portfolio-slider-1-r5sdm88gabp8ucmk00fhp0rbuwqut66sdnwv9ya150.webp'],
    ['service-item/digital-marketing-paid-media', 'Digital Marketing & Paid Media', 'portfolio-slider-3-r5sdm7am3hnyiqnx5i0v4izv9ivhlh321j9dsobfb8.webp'],
    ['service-item/brand-creative-strategy', 'Brand & Creative Strategy', 'portfolio-slider-7-r5sdm5exptldviqngh7lzjgy2r4r62vld9yeu4e7no.webp'],
    ['service-item/personal-branding', 'Personal Branding', 'portfolio-slider-5-r5sdm6crwnmo74paazm8k18eo504drzbpelwbecthg.webp'],
    ['service-item/web', 'Website Design & Development', 'portfolio-slider-4-r5sdm6crwnmo74paazm8k18eo504drzbpelwbecthg.webp'],
    ['service-item/conversion-retention-system', 'Conversion & Retention System', 'portfolio-slider-6-r5sdm5exptldviqngh7lzjgy2r4r62vld9yeu4e7no.webp'],
    ['service-item/ai-led-marketing-services', 'AI Led Marketing Services', 'portfolio-slider-2-r5sdm88gabp8ucmk00fhp0rbuwqut66sdnwv9ya150.webp'],
    ['service-item/marketing-automation-crm', 'Marketing Automation & CRM', 'portfolio-slider-8-r5sdm3j9c5it8atdrgecujy0vze0qoo4p0nfvkh004.webp'],
    ['service-item/white-labeling-solutions', 'White Labeling Solutions', 'portfolio-slider-8-r5sdm3j9c5it8atdrgecujy0vze0qoo4p0nfvkh004.webp'],
  ]
  const links = (items: [string, string][]) => Promise.all(items.map(async ([slug, label]) => ({ link: await pageLink(slug, label) })))

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      logo: await media('2025/05/Adeptimize-white-logo.svg', 'Adeptimize'),
      ctaEyebrow: 'Do You',
      ctaTitle: 'Have',
      ctaAside: 'A Project In Mind?',
      text: 'Maximize your brand’s potential with our marketing consultancy services. Our team of experts will guide you towards strategic solutions and innovative ideas to drive business growth and success.',
      social: [
        { platform: 'facebook', url: 'https://www.facebook.com/' },
        { platform: 'linkedin', url: 'https://www.linkedin.com/' },
        { platform: 'behance', url: 'https://www.behance.net/' },
      ],
      columns: [
        { title: 'Quick Link', links: await links([['home', 'Home'], ['about-us', 'About Us'], ['blog', 'Blog'], ['contact-us', 'Contact Us']]) },
        { title: 'Our Location', links: await links([['location-south-florida', 'South Florida'], ['location-dfw', 'DFW'], ['location-austin', 'Austin'], ['location-denver', 'Denver'], ['location-houston', 'Houston'], ['location-san-antonio', 'San Antonio']]) },
        { title: 'Services', links: await links(services.map(([slug, label]) => [slug, label])) },
      ],
      hoursTitle: 'Working Hours',
      hours: [{ line: 'Mon to Fri: 9:30 am - 6:30 pm' }, { line: 'Sat: 9:30 am - 4:30 pm' }, { line: 'Sun: 9:30 am - 12:30 pm' }],
      contactTitle: 'Contact Us',
      email: 'info@adeptimize.com',
      phone: '+1 (512) 750-0778',
      newsletterTitle: 'Newsletter',
      newsletterPlaceholder: 'Your e-mail',
      copyright: 'Copyright © {year}, All rights reserved.',
    },
  })

  // ---------- Homepage sections ----------
  const clientLogos: [string, string][] = [
    ['ppaac', 'Providence Partners'], ['altcmo', 'alt.cmo'], ['depth', 'Depth Builder'], ['solution', 'Solutions Contracting'],
    ['ulrich', 'Ulrich Lifestyle'], ['dlv', 'DLV Roofing'], ['star-sqare', 'Star Square Deal Motors'], ['isr', 'ISR Energy'],
    ['excel', 'Excel Construction Group'], ['VET', 'VetRamp'], ['prius', 'Prius Intelli'], ['shae-marcus', 'Shae Marcus Consulting'], ['shamrock', 'Shamrock'],
  ]

  const differentiators = [
    ['Industry-Specific Expertise', [paragraph('We take time to really understand how your customers think and make buying decisions. This deep knowledge helps us create marketing messages that connect with people on an emotional level.')], 'With our industry knowledge, you’ll effortlessly tackle market challenges and meet customer expectations.', 'Web design / 2025'],
    ['Strategic Digital Channel Mastery', [paragraph('We make sure your business shows up everywhere your customers spend time online. When people see your brand consistently across different platforms, they start to trust and remember you better.')], 'Boost trust with consistent brand visibility across all digital platforms.', 'Web design / 2024'],
    ['Practical AI Implementation', [paragraph('We bring artificial intelligence into your daily business operations in ways that actually make sense. These AI tools help you answer customer questions faster and deliver the right information automatically without losing the personal human touch.')], 'AI tools help improve your customer service, streamline costs, and increase lead conversion rates.', 'Web design / 2024'],
    ['Proven Leadership Experience', [paragraph('Adeptimize CEO Mohit brings over ten years of experience, and our team adds another decade of combined expertise. This deep knowledge means we can spot potential problems early and fix them before they impact your business.')], 'Leverage strategies backed by over 20 years of hands-on leadership and industry expertise.', 'Web design / 2024'],
    ['Comprehensive Digital Ecosystem', [
      paragraph('We don’t just build websites or run ads - we create fully integrated digital ecosystems that work together in harmony. Your:'),
      list(['Website', 'Social media platforms', 'Paid advertising campaigns', 'Email marketing', 'CRM systems']),
      paragraph('…all function as one unified strategy, creating a seamless customer journey that turns visitors into loyal, repeat clients.'),
    ], 'Your website, ads, and CRM all work together to create a smooth customer journey.', 'Web design / 2025'],
  ] as const

  const hero = {
    headline: 'Industry Experts Delivering Marketing Excellence',
    subtitle: 'Helping Businesses Grow with Smart Marketing Strategies',
    leftHighlight: 'Since 1998',
    rightHighlight: 'A+ Rating',
    image: await media('2024/11/home2-welcome.webp', 'Colourful mural on a sunny street'),
  }

  const trust = {
      heading: 'What Makes Industry Leaders Trust Adeptimize',
      body: richText(paragraph('We create custom digital solutions for construction, **home improvement, financial services, healthcare, manufacturing, hospitality, education, legal and professional services**. Our expertise spans industries because we understand the unique challenges each business faces and we’ve already solved them.')),
      link: await pageLink('about-us', 'Read More'),
      logos: await Promise.all(clientLogos.map(async ([file, name]) => ({ logo: await media(`2025/10/${file}.png`, `${name} logo`) }))),
    }

  const problems = {
      heading: 'The *Digital Marketing* Problems We *Solve*',
      items: [
        { title: 'Traffic Generation Challenges', text: 'We understand how frustrating low website traffic can be for growing businesses. Our proven strategies help you attract the right visitors who actually convert into customers.' },
        { title: 'Lead Conversion Struggles', text: 'Are you struggling to turn visitors into qualified leads? We optimize your site to ensure you’re not just getting traffic, but building a real customer pipeline.' },
        { title: 'Brand Visibility Issues', text: "We know it's tough when your competitors dominate search results and social feeds. Our tailored strategies ensure your brand stands out, reaching the right audience every time." },
      ],
    }

  const layout = [
    {
      blockType: 'process',
      heading: '*Our Success Framework:* How We Deliver Real Results',
      steps: [
        { title: 'Evidence-Based Strategy Development', text: 'We analyze your digital performance, competitors, and market opportunities. This helps us set realistic growth targets and create tailored plans.' },
        { title: 'Ongoing Optimization Process', text: 'What if your campaigns are wasting budget every day? Our team optimizes them weekly, using real-time data to drive consistent growth.' },
        { title: 'Industry-Specialized Implementation', text: 'We develop strategies tailored to your industry. Our solutions address your unique challenges and help you achieve business goals effectively.' },
        { title: 'Clear, Actionable Reporting', text: "Our reports are clear and easy to understand. We highlight what's working, areas for improvement, and the direct impact on business goals." },
      ],
      image: await media('2024/11/home1-cube.webp', 'Abstract still life of glossy vases and flowers'),
      accentImage: await media('2024/11/home1-cube2.webp', 'Decorative shape'),
    },
    {
      blockType: 'differentiators',
      heading: '*What Sets Us Apart* Our Key Differentiators',
      items: await Promise.all(differentiators.map(async ([title, body, note, tag], index) => ({
        title,
        body: richText(...body),
        note,
        tag,
        image: await media(`2024/11/fullwidth-${index + 1}${index + 1}.webp`, title),
        thumbnail: await media(`2024/11/fullwidth-${index + 1}.webp`, `${title} detail`),
      }))),
    },
    {
      blockType: 'imageAccordion',
      heading: "*Today's Market Challenges* & Our Solutions",
      images: await Promise.all([3, 2, 1].map(async (n) => ({ image: await media(`market-challenges/img-accordion-${n}.webp`, 'Creative studio detail') }))),
    },
    {
      blockType: 'featureGrid',
      items: [
        { title: 'Unsustainable Acquisition Costs', text: 'Digital advertising costs increased 15-25% across most platforms in the past year. Our industry-specific targeting models have helped clients maintain or reduce acquisition costs despite these market trends.' },
        { title: 'Standing Out in a Crowded Digital World', text: 'The average consumer sees thousands of brand messages daily. Our sector-specific positioning strategies, ensure your message reaches the right audience at exactly the right time, cutting through the noise with precision and personalization.' },
        { title: 'Seamless Technology Integration', text: 'Most businesses struggle to connect their website, CRM, advertising, and operations systems effectively. Our pre-built integration frameworks eliminate these technical barriers without requiring enterprise-level budgets.' },
      ],
    },
    {
      blockType: 'testimonials',
      eyebrow: 'Success',
      title: 'Stories',
      aside: 'Clients Say!',
      items: [
        { photo: await media('2025/08/pf-single-testimonial.webp', 'Joel Holst'), name: 'Joel Holst', company: 'Providence Partners', rating: 5, quote: 'Working with Adeptimize transformed how we connect with both clients and candidates online. Their SEO strategy got us ranking on the first page for key technical recruiting terms, and their LinkedIn marketing campaigns doubled our qualified leads from 15 to 30 per month. The team really understood our specialized niche in AI and engineering talent, making our digital presence much more professional and effective.' },
        { photo: await media('2025/08/testimonial-1.webp', 'James Chamber'), name: 'James Chamber', company: 'Excel Construction Group', rating: 5, quote: 'Adeptimize helped us dominate local search results across all our Texas and Colorado markets. Their Google Ads campaigns brought in quality leads for roofing, remodeling, and solar projects, while their website optimization made it easier for customers to request free inspections. Our online reviews and reputation management strategy has made a huge difference in winning new commercial contracts, increasing our close rate by 40%.' },
        { photo: await media('2025/08/testimonial-3.webp', 'Roland Brickey'), name: 'Roland Brickey', company: 'Ulrich Lifestyle', rating: 5, quote: 'The digital transformation Adeptimize provided exceeded our expectations for reaching homeowners interested in custom sheds, cabins, and garages. Their content marketing strategy showcased our craftsmanship beautifully, and their targeted Facebook campaigns brought families to our design centers, increasing showroom visits by 65%. The analytics and performance tracking they set up helps us understand exactly which campaigns drive the most showroom visits and sales.' },
      ],
    },
    {
      blockType: 'serviceCarousel',
      heading: 'Explore More *Services*',
      services: await Promise.all(services.map(async ([slug, title, file]) => ({
        title: title.replace('Personal Branding', 'Personal Branding Services').replace('AI Led Marketing Services', 'AI-Led Marketing').replace('White Labeling Solutions', 'White Labeling').replace('Retention System', 'Retention Systems'),
        image: await media(`services/${file}`, title),
        link: await pageLink(slug),
      }))),
    },
    {
      blockType: 'logoStrip',
      heading: 'Certifications & Partnerships',
      text: 'We are proud to be certified by and partnered with industry-leading platforms that empower us to deliver exceptional results for our clients.',
      logos: [
        { name: 'HubSpot', logo: await media('2025/08/HubSpot_Logo-1024x1024.png', 'HubSpot') },
        { name: 'Meta Business Partner', logo: await media('2025/08/meta-01-1024x630.png', 'Meta') },
        { name: 'Google Partner', logo: await media('2025/08/goglr-01-1024x516.png', 'Google') },
        { name: 'StoryBrand Certified Guide', logo: await media('2025/08/storybrand-1024x1024.png', 'StoryBrand') },
      ],
    },
    {
      blockType: 'faq',
      heading: 'Frequently Asked *Questions*',
      items: [
        { question: 'Why should I choose your agency over competitors?', answer: 'Unlike most digital agencies that offer generic solutions, we specialize in industry-specific strategies that address the unique challenges and opportunities in your market. Our approach combines deep market knowledge with practical implementation expertise, ensuring you get solutions that actually work for your business type - not theoretical concepts that sound good but fail to deliver results.' },
        { question: 'How does your 20+ years of experience benefit my business?', answer: "Our founder and CEO Mohit brings over a decade of hands-on experience in digital marketing and business transformation. This experience means we've already encountered and solved the challenges you're facing. We don't experiment with your budget-we apply proven approaches that have already succeeded for businesses similar to yours." },
        { question: 'What makes your approach more effective than other agencies?', answer: 'We follow a systematic methodology that prioritizes measurable outcomes over flashy tactics. Instead of chasing marketing trends, we focus on building sustainable digital systems that continue generating results long-term. Our unique combination of industry specialization, practical AI implementation, and integrated marketing ecosystems creates a foundation for lasting business growth.' },
        { question: 'What types of projects do you typically handle?', answer: 'We specialize in comprehensive digital transformations including website development, CRM implementation, paid advertising campaigns, content marketing systems, and AI-powered customer engagement tools. Our projects typically involve multiple integrated components rather than isolated services, ensuring all aspects of your digital presence work together cohesively.' },
        { question: 'How do you stay current with the latest digital marketing tools and techniques?', answer: 'We maintain active testing environments where we continuously evaluate new tools, platforms, and techniques before implementing them for clients. Our team completes ongoing education and certification programs to stay at the forefront of digital innovation. This commitment ensures you benefit from cutting-edge approaches without the risks of untested technologies.' },
      ],
    },
  ]

  /** Each homepage section has its own tab in the admin; map the section list onto them. */
  function homeTabs(blocks: { blockType: string }[]) {
    const tabs: Record<string, string> = {
      process: 'framework', differentiators: 'differentiators', imageAccordion: 'challenges', featureGrid: 'solutions',
      testimonials: 'testimonials', serviceCarousel: 'services', logoStrip: 'partners', faq: 'faq',
    }
    const data: Record<string, unknown> = {}
    for (const { blockType, ...fields } of blocks) if (tabs[blockType] && !(tabs[blockType] in data)) data[tabs[blockType]] = fields
    return data as Record<string, never>
  }

  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
  const data = {
    title: 'Home',
    slug: 'home',
    status: 'published' as const,
    hero,
    trust: trust as never,
    problems,
    ...homeTabs(layout),
    layout: [],
    seo: {
      title: 'Adeptimize — Business Consulting',
      description: 'Adeptimize helps ambitious businesses grow with smart marketing strategy and execution.',
    },
  }
  if (existing.docs[0]) await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
  else await payload.create({ collection: 'pages', data })
  payload.logger.info('Homepage, header and footer are ready.')
} finally {
  await payload.destroy()
}

await revalidateSite()

process.exit(0)
