import type { Field, Tab } from 'payload'
import { headingField, imageField, linkField } from '../fields'

/**
 * Section tabs for the fixed pages (About Us, Contact Us, Blog). Each tab is a
 * named group, so its data lives under e.g. `page.aboutIntro`. Top-level
 * fields stay optional because the tabs are hidden on every other page.
 */

const titleRowLabel = { components: { RowLabel: '/components/admin/RowLabel#TitleRowLabel' } }

const pageHeader = (name: string, defaults: { eyebrow?: string; title: string }): Tab => ({
  name,
  label: 'Page title',
  description: 'The large title at the top of the page.',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', label: 'Outlined word', type: 'text', defaultValue: defaults.eyebrow, admin: { width: '50%', description: 'Optional large outlined word behind the title.' } },
        { name: 'title', type: 'text', defaultValue: defaults.title, admin: { width: '50%', description: 'Shown as the page H1.' } },
      ],
    },
  ],
})

const numberedItems = (label: { singular: string; plural: string }): Field => ({
  name: 'items',
  type: 'array',
  labels: label,
  admin: { description: 'Numbered automatically.', ...titleRowLabel },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true },
  ],
})

export const aboutTabs: Tab[] = [
  pageHeader('aboutHeader', { eyebrow: 'Adeptimize', title: 'About Us' }),
  {
    name: 'aboutIntro',
    label: 'Intro',
    description: 'Headline, intro text and button, with three images and two statistics.',
    fields: [
      headingField(),
      { name: 'text', type: 'textarea' },
      linkField({ name: 'button', label: 'Button' }),
      imageField({ admin: { description: 'Large image on the left of the collage.' } }),
      {
        name: 'stats',
        type: 'array',
        labels: { singular: 'Statistic', plural: 'Statistics' },
        maxRows: 2,
        admin: { components: { RowLabel: '/components/admin/RowLabel#ValueRowLabel' } },
        fields: [
          {
            type: 'row',
            fields: [
              { name: 'value', type: 'text', required: true, admin: { width: '30%', placeholder: '98%' } },
              imageField({ admin: { width: '70%' } }),
            ],
          },
          { name: 'text', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    name: 'aboutValues',
    label: 'Who we are',
    description: 'Numbered points such as “Who We Are” and “What We Do”.',
    fields: [numberedItems({ singular: 'Point', plural: 'Points' })],
  },
  {
    name: 'aboutFounder',
    label: 'Founder',
    description: 'Photo and introduction of the founder.',
    fields: [
      headingField({ admin: { description: 'For example “Meet *Mohit*”. Wrap words in *asterisks* for the outlined style.' } }),
      { name: 'role', type: 'text' },
      imageField(),
      {
        name: 'social',
        label: 'Social profiles',
        type: 'array',
        labels: { singular: 'Profile', plural: 'Profiles' },
        fields: [
          {
            type: 'row',
            fields: [
              {
                name: 'platform',
                type: 'select',
                required: true,
                admin: { width: '30%' },
                options: ['linkedin', 'facebook', 'instagram', 'x', 'youtube', 'behance'].map((value) => ({
                  value,
                  label: value === 'x' ? 'X (Twitter)' : value === 'linkedin' ? 'LinkedIn' : value === 'youtube' ? 'YouTube' : value[0].toUpperCase() + value.slice(1),
                })),
              },
              { name: 'url', label: 'Profile URL', type: 'text', required: true, admin: { width: '70%' } },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'aboutHighlights',
    label: 'Highlights',
    description: 'Heading with icon cards, e.g. “Proven Track Record”.',
    fields: [
      headingField(),
      {
        name: 'items',
        type: 'array',
        labels: { singular: 'Highlight', plural: 'Highlights' },
        admin: titleRowLabel,
        fields: [
          {
            type: 'row',
            fields: [
              imageField({ name: 'icon', admin: { width: '30%' } }),
              { name: 'title', type: 'text', required: true, admin: { width: '70%' } },
            ],
          },
          { name: 'text', type: 'text' },
        ],
      },
    ],
  },
  {
    name: 'aboutTestimonials',
    label: 'Testimonials',
    description: 'Client quotes beside a photo, followed by a row of client logos.',
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
        labels: { singular: 'Testimonial', plural: 'Testimonials' },
        admin: { components: { RowLabel: '/components/admin/RowLabel#NameRowLabel' } },
        fields: [
          { name: 'quote', type: 'textarea', required: true },
          {
            type: 'row',
            fields: [
              { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
              { name: 'company', type: 'text', admin: { width: '50%' } },
            ],
          },
        ],
      },
      {
        name: 'logos',
        type: 'array',
        labels: { singular: 'Logo', plural: 'Logos' },
        admin: { initCollapsed: true },
        fields: [
          {
            type: 'row',
            fields: [
              imageField({ name: 'logo', required: true, admin: { width: '50%' } }),
              { name: 'url', label: 'Link (optional)', type: 'text', admin: { width: '50%', placeholder: 'https://', description: 'Opens in a new tab.' } },
            ],
          },
        ],
      },
    ],
  },
]

export const contactTabs: Tab[] = [
  pageHeader('contactHeader', { title: 'Contact Us' }),
  {
    name: 'contactIntro',
    label: 'Intro & form',
    description: 'Text beside the contact form. The form fields are managed under Forms → Contact.',
    fields: [
      headingField(),
      { name: 'subheading', type: 'text' },
      { name: 'text', type: 'textarea', admin: { rows: 8, description: 'Leave an empty line between paragraphs.' } },
      { name: 'form', type: 'relationship', relationTo: 'forms', admin: { description: 'Defaults to the “contact” form.' } },
    ],
  },
  {
    name: 'contactDetails',
    label: 'Contact details',
    description: 'Address, email, phone and opening hours.',
    fields: [
      headingField({ defaultValue: 'Contact Information' }),
      { name: 'address', type: 'textarea', admin: { rows: 3 } },
      {
        type: 'row',
        fields: [
          { name: 'email', type: 'email', admin: { width: '50%' } },
          { name: 'phone', type: 'text', admin: { width: '50%' } },
        ],
      },
      { name: 'hoursHeading', label: 'Hours heading', type: 'text', defaultValue: 'Business Hours' },
      { name: 'hours', type: 'textarea', admin: { rows: 3, description: 'One line per row.' } },
      { name: 'note', label: 'Closing line', type: 'text' },
      {
        type: 'row',
        fields: [
          { name: 'showMap', label: 'Show map', type: 'checkbox', defaultValue: true, admin: { width: '30%', style: { alignSelf: 'flex-end' } } },
          {
            name: 'mapLocation',
            label: 'Map location (optional)',
            type: 'text',
            admin: { width: '70%', description: 'Address or place name to pin. Leave empty to use the address above.', condition: (_, sibling) => sibling?.showMap !== false },
          },
        ],
      },
    ],
  },
  {
    name: 'contactExpect',
    label: 'What to expect',
    description: 'Heading with numbered steps.',
    fields: [headingField(), numberedItems({ singular: 'Step', plural: 'Steps' })],
  },
  {
    name: 'contactCta',
    label: 'Call to action',
    description: 'Image with a closing message. The phone and email from “Contact details” are added below the text.',
    fields: [headingField(), { name: 'text', type: 'textarea' }, imageField()],
  },
]

export const blogTabs: Tab[] = [
  {
    name: 'blogHeader',
    label: 'Page title',
    description: 'The title above the list of posts. Posts are managed under Posts.',
    fields: [
      ...pageHeader('blogHeader', { eyebrow: 'Insights', title: 'Blogs' }).fields,
      { name: 'intro', type: 'textarea', admin: { description: 'Optional line under the title.' } },
    ],
  },
]

export const servicesPageTabs: Tab[] = [
  {
    name: 'servicesHeader',
    label: 'Banner',
    description: 'Full-width image with the page title centred on it.',
    fields: [
      { name: 'title', type: 'text', defaultValue: 'Our Services', admin: { description: 'Shown as the page H1.' } },
      { name: 'intro', label: 'Sub title', type: 'text' },
      imageField(),
    ],
  },
  {
    name: 'servicesIntro',
    label: 'Intro & numbers',
    description: 'Heading and text with counters that count up when they scroll into view.',
    fields: [
      headingField(),
      { name: 'text', type: 'textarea' },
      {
        name: 'counters',
        type: 'array',
        labels: { singular: 'Counter', plural: 'Counters' },
        admin: { components: { RowLabel: '/components/admin/RowLabel#LabelRowLabel' } },
        fields: [
          {
            type: 'row',
            fields: [
              { name: 'value', type: 'number', required: true, admin: { width: '25%' } },
              { name: 'suffix', type: 'text', admin: { width: '15%', placeholder: '+ or %' } },
              { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
            ],
          },
          { name: 'text', type: 'textarea' },
        ],
      },
    ],
  },
  {
    name: 'servicesSlider',
    label: 'Services slider',
    description: 'A sliding row of every published service, in their chosen order. Card images are set on each service under Listing card.',
    fields: [headingField({ defaultValue: 'Explore *More Services*' })],
  },
  {
    name: 'servicesCta',
    label: 'Call to action',
    description: 'Rounded box with a heading, a rotating text badge and an image.',
    fields: [
      headingField(),
      {
        type: 'row',
        fields: [
          { name: 'badgeText', label: 'Rotating text', type: 'text', defaultValue: 'Get Started Now', admin: { width: '50%' } },
          linkField({ name: 'link', label: 'Badge link', withLabel: false }),
        ],
      },
      {
        type: 'row',
        fields: [
          imageField({ admin: { width: '50%' } }),
          imageField({ name: 'background', admin: { width: '50%', description: 'Optional background pattern for the box.' } }),
        ],
      },
    ],
  },
]

export const locationsPageTabs: Tab[] = [
  {
    name: 'locationsHeader',
    label: 'Page title',
    description: 'Used as the page heading for search engines and screen readers; the slider is the visible banner.',
    fields: [{ name: 'title', type: 'text', defaultValue: 'Locations We Serve' }],
  },
  {
    name: 'locationsSlider',
    label: 'Slider',
    description: 'Full-screen slider of every published location. Images and icons are set on each location under Listing card.',
    fields: [{ name: 'interval', label: 'Seconds per slide', type: 'number', defaultValue: 5, min: 2, max: 20 }],
  },
]
