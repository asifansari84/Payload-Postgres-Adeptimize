import type { Block } from 'payload'
import { headingField, imageField, linkField } from '../fields'

const preview = (slug: string) => `/admin-previews/${slug}.webp`

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  imageURL: preview('hero'),
  imageAltText: 'Large headline with two highlights and a wide image',
  fields: [
    headingField({ name: 'title', required: true, admin: { description: 'Main page headline (shown as the H1). Wrap words in *asterisks* for the outlined style.' } }),
    { name: 'subtitle', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'leftHighlight', type: 'text', admin: { width: '50%', placeholder: 'Since 1998' } },
        { name: 'rightHighlight', type: 'text', admin: { width: '50%', placeholder: 'A+ Rating' } },
      ],
    },
    imageField({ required: true }),
  ],
}

export const LogoShowcaseBlock: Block = {
  slug: 'logoShowcase',
  interfaceName: 'LogoShowcaseBlock',
  labels: { singular: 'Intro with client logos', plural: 'Intros with client logos' },
  imageURL: preview('logoShowcase'),
  imageAltText: 'Text on the left and a grid of client logos on the right',
  fields: [
    headingField({ required: true }),
    { name: 'body', type: 'richText' },
    linkField({ name: 'link', label: 'Button' }),
    {
      name: 'logos',
      type: 'array',
      labels: { singular: 'Logo', plural: 'Logos' },
      admin: { initCollapsed: true, components: { RowLabel: '/components/admin/RowLabel#NameRowLabel' } },
      fields: [
        { type: 'row', fields: [imageField({ name: 'logo', required: true, admin: { width: '50%' } }), { name: 'name', type: 'text', required: true, admin: { width: '50%', description: 'Company name, used as the image description.' } }] },
      ],
    },
  ],
}

export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: { singular: 'Numbered feature cards', plural: 'Numbered feature cards' },
  imageURL: preview('featureGrid'),
  imageAltText: 'Optional centred heading followed by three numbered columns',
  fields: [
    headingField({ admin: { description: 'Optional. Wrap words in *asterisks* for the outlined style.' } }),
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Card', plural: 'Cards' },
      admin: { description: 'Cards are numbered automatically.', components: { RowLabel: '/components/admin/RowLabel#TitleRowLabel' } },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
  ],
}

export const ProcessBlock: Block = {
  slug: 'process',
  interfaceName: 'ProcessBlock',
  labels: { singular: 'Process steps', plural: 'Process steps' },
  imageURL: preview('process'),
  imageAltText: 'Dark section with numbered steps either side of an arched image',
  fields: [
    headingField({ required: true }),
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 2,
      labels: { singular: 'Step', plural: 'Steps' },
      admin: { description: 'The first half of the steps sit left of the image, the rest on the right.', components: { RowLabel: '/components/admin/RowLabel#TitleRowLabel' } },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        imageField({ required: true, admin: { width: '50%' } }),
        imageField({ name: 'accentImage', admin: { width: '50%', description: 'Optional small image floating over the main one.' } }),
      ],
    },
  ],
}

export const DifferentiatorsBlock: Block = {
  slug: 'differentiators',
  interfaceName: 'DifferentiatorsBlock',
  labels: { singular: 'Stacked feature panels', plural: 'Stacked feature panels' },
  imageURL: preview('differentiators'),
  imageAltText: 'Heading followed by full-width panels that stack as you scroll',
  fields: [
    headingField({ required: true }),
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Panel', plural: 'Panels' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#TitleRowLabel' } },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText', required: true },
        {
          type: 'row',
          fields: [
            imageField({ required: true, admin: { width: '50%' } }),
            imageField({ name: 'thumbnail', admin: { width: '50%' } }),
          ],
        },
        { name: 'tag', type: 'text', admin: { description: 'Optional label on the corner of the main image.' } },
        { name: 'note', type: 'textarea', admin: { description: 'Short line shown under the thumbnail.' } },
      ],
    },
  ],
}

export const ImageAccordionBlock: Block = {
  slug: 'imageAccordion',
  interfaceName: 'ImageAccordionBlock',
  labels: { singular: 'Heading with image accordion', plural: 'Headings with image accordion' },
  imageURL: preview('imageAccordion'),
  imageAltText: 'Large heading beside image strips that expand on hover',
  fields: [
    headingField({ required: true }),
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 5,
      admin: { description: 'The last image starts open; the others expand on hover.' },
      fields: [imageField({ required: true })],
    },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  imageURL: preview('testimonials'),
  imageAltText: 'Three staggered client quote cards',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Success', admin: { width: '33%' } },
        { name: 'title', type: 'text', defaultValue: 'Stories', required: true, admin: { width: '33%' } },
        { name: 'aside', type: 'text', defaultValue: 'Clients Say!', admin: { width: '33%' } },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Testimonial', plural: 'Testimonials' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#NameRowLabel' } },
      fields: [
        imageField({ name: 'photo', admin: { description: 'Portrait of the client. A landscape crop around 4:3 works best.' } }),
        { name: 'quote', type: 'textarea', required: true },
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'company', type: 'text', admin: { width: '40%' } },
            { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5, admin: { width: '20%', step: 1 } },
          ],
        },
      ],
    },
  ],
}

export const ServiceCarouselBlock: Block = {
  slug: 'serviceCarousel',
  interfaceName: 'ServiceCarouselBlock',
  labels: { singular: 'Service carousel', plural: 'Service carousels' },
  imageURL: preview('serviceCarousel'),
  imageAltText: 'Sliding row of numbered service cards',
  fields: [
    headingField({ required: true }),
    {
      name: 'services',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Service', plural: 'Services' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#TitleRowLabel' } },
      fields: [
        { name: 'title', type: 'text', required: true },
        imageField(),
        linkField({ name: 'link', withLabel: false }),
      ],
    },
  ],
}

export const LogoStripBlock: Block = {
  slug: 'logoStrip',
  interfaceName: 'LogoStripBlock',
  labels: { singular: 'Partner logos', plural: 'Partner logos' },
  imageURL: preview('logoStrip'),
  imageAltText: 'Centred heading, intro and a row of partner logos',
  fields: [
    headingField({ required: true }),
    { name: 'text', type: 'textarea' },
    {
      name: 'logos',
      type: 'array',
      labels: { singular: 'Logo', plural: 'Logos' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#NameRowLabel' } },
      fields: [
        { type: 'row', fields: [imageField({ name: 'logo', required: true, admin: { width: '50%' } }), { name: 'name', type: 'text', required: true, admin: { width: '50%' } }] },
      ],
    },
  ],
}

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  imageURL: preview('faq'),
  imageAltText: 'Heading with numbered, expandable questions',
  fields: [
    headingField({ required: true }),
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Question', plural: 'Questions' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#QuestionRowLabel' } },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  LogoShowcaseBlock,
  FeatureGridBlock,
  ProcessBlock,
  DifferentiatorsBlock,
  ImageAccordionBlock,
  TestimonialsBlock,
  ServiceCarouselBlock,
  LogoStripBlock,
  FAQBlock,
]
