import type { Field, Tab } from 'payload'
import { headingField, imageField, linkField } from '../fields'

/**
 * Section tabs for service and location pages. Each tab is a named group so
 * its data lives under e.g. `service.intro`. Fields are optional so a page can
 * be saved while it is still being written; empty sections are not shown.
 */

const titleRowLabel = { components: { RowLabel: '/components/admin/RowLabel#TitleRowLabel' } }

const titledItems = (labels: { singular: string; plural: string }, extra: Field[] = []): Field => ({
  name: 'items',
  type: 'array',
  labels,
  admin: { description: 'Numbered automatically.', ...titleRowLabel },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true },
    ...extra,
  ],
})

export const bannerTab: Tab = {
  name: 'banner',
  label: 'Banner',
  description: 'The large title and image at the top of the page.',
  fields: [
    { name: 'title', type: 'text', admin: { description: 'Shown as the page H1. Defaults to the name above.' } },
    { name: 'intro', label: 'Sub title', type: 'text' },
    imageField({ admin: { description: 'Wide image under the title.' } }),
  ],
}

export const introTab: Tab = {
  name: 'intro',
  label: 'Intro',
  description: 'Heading and text beside a row of images that expand on hover.',
  fields: [
    headingField(),
    { name: 'quote', type: 'text', admin: { description: 'Optional tagline shown in bold above the text.' } },
    {
      name: 'text',
      type: 'textarea',
      admin: { rows: 8, description: 'Leave an empty line between paragraphs. Only the first paragraph shows until “Read more” is clicked.' },
    },
    linkField({ name: 'button', label: 'Button' }),
    {
      name: 'images',
      type: 'array',
      labels: { singular: 'Image', plural: 'Images' },
      maxRows: 5,
      admin: { description: 'The last image starts open; the others expand on hover.' },
      fields: [imageField({ required: true })],
    },
  ],
}

export const highlightsTab: Tab = {
  name: 'highlights',
  label: 'Highlights',
  description: 'Numbered points such as “01. Precision Ad Targeting”.',
  fields: [headingField({ admin: { description: 'Optional.' } }), titledItems({ singular: 'Point', plural: 'Points' })],
}

export const spotlightTab: Tab = {
  name: 'spotlight',
  label: 'Client quotes',
  description: 'A photo with a badge beside short client quotes.',
  fields: [
    {
      type: 'row',
      fields: [
        imageField({ admin: { width: '50%' } }),
        imageField({ name: 'badge', admin: { width: '50%', description: 'Small round image over the photo.' } }),
      ],
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Quote', plural: 'Quotes' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#NameRowLabel' } },
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'company', label: 'Role or company', type: 'text', admin: { width: '50%' } },
          ],
        },
      ],
    },
  ],
}

export const benefitsTab: Tab = {
  name: 'benefits',
  label: 'Key benefits',
  description: 'Heading and button beside three image cards.',
  fields: [
    headingField({ admin: { description: 'For example “Our Key *Benefits*”.' } }),
    linkField({ name: 'button', label: 'Button' }),
    titledItems({ singular: 'Benefit', plural: 'Benefits' }, [imageField()]),
  ],
}

export const processTab: Tab = {
  name: 'process',
  label: 'Process',
  description: 'Numbered steps either side of an image.',
  fields: [
    headingField({ admin: { description: 'Optional.' } }),
    {
      name: 'steps',
      type: 'array',
      labels: { singular: 'Step', plural: 'Steps' },
      admin: { description: 'The first half of the steps sit left of the image, the rest on the right.', ...titleRowLabel },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        imageField({ admin: { width: '50%' } }),
        imageField({ name: 'accentImage', admin: { width: '50%', description: 'Optional small image floating over the main one.' } }),
      ],
    },
  ],
}

export const offeringsTab: Tab = {
  name: 'offerings',
  label: 'Services offered',
  description: 'Numbered rows, each with a title, text and image.',
  fields: [headingField({ admin: { description: 'Optional.' } }), titledItems({ singular: 'Service', plural: 'Services' }, [imageField()])],
}

export const resultsTab: Tab = {
  name: 'results',
  label: 'Results',
  description: 'Heading and text with highlighted statistics.',
  fields: [
    headingField(),
    { name: 'text', type: 'textarea' },
    {
      name: 'stats',
      type: 'array',
      labels: { singular: 'Statistic', plural: 'Statistics' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#ValueRowLabel' } },
      fields: [
        { name: 'value', type: 'text', required: true, admin: { placeholder: '87%' } },
        { name: 'text', type: 'textarea', required: true },
      ],
    },
  ],
}

export const testimonialsTab: Tab = {
  name: 'testimonials',
  label: 'Testimonials',
  description: 'Client quote cards with photos.',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Success', admin: { width: '33%' } },
        { name: 'title', type: 'text', defaultValue: 'Stories', admin: { width: '33%' } },
        { name: 'aside', type: 'text', defaultValue: 'Clients Say!', admin: { width: '33%' } },
      ],
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Testimonial', plural: 'Testimonials' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#NameRowLabel' } },
      fields: [
        imageField({ name: 'photo' }),
        { name: 'quote', type: 'textarea', required: true },
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'company', label: 'Role or company', type: 'text', admin: { width: '40%' } },
            { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5, admin: { width: '20%', step: 1 } },
          ],
        },
      ],
    },
  ],
}

export const faqTab: Tab = {
  name: 'faq',
  label: 'FAQ',
  description: 'Numbered, expandable questions.',
  fields: [
    headingField({ defaultValue: 'Frequently Asked Questions' }),
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Question', plural: 'Questions' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#QuestionRowLabel' } },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

export const moreServicesTab: Tab = {
  name: 'moreServices',
  label: 'More services',
  description: 'A sliding row of the other published services, filled in automatically.',
  fields: [
    { name: 'show', label: 'Show this section', type: 'checkbox', defaultValue: true },
    headingField({ defaultValue: 'Explore *More Services*', admin: { condition: (_, sibling) => sibling?.show !== false } }),
  ],
}

export const strategyTab: Tab = {
  name: 'strategy',
  label: 'Strategy form',
  description: 'Closing section with the contact form. Form fields are managed under Forms → Contact.',
  fields: [
    { name: 'show', label: 'Show this section', type: 'checkbox', defaultValue: true },
    headingField({ defaultValue: 'Build Your Market *Strategy*' }),
    { name: 'text', type: 'textarea' },
    imageField(),
  ],
}

export const serviceSections: Tab[] = [
  bannerTab, introTab, highlightsTab, spotlightTab, benefitsTab, processTab, faqTab, moreServicesTab, strategyTab,
]

export const locationSections: Tab[] = [
  bannerTab, introTab, highlightsTab, offeringsTab, resultsTab, moreServicesTab, testimonialsTab, faqTab, strategyTab,
]
