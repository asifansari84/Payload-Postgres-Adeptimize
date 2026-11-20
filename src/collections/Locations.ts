import { imageField } from '../fields'
import { locationPath } from '../lib/routes'
import { listingCollection } from './listingCollection'
import { locationSections } from './listingSections'

export const Locations = listingCollection({
  slug: 'locations',
  singular: 'Location',
  plural: 'Locations',
  path: locationPath,
  sections: locationSections,
  cardFields: [
    {
      type: 'row',
      fields: [
        imageField({ name: 'slideImage', label: 'Slider background', admin: { width: '50%', description: 'Full-screen image in the slider on the Location page.' } }),
        imageField({ name: 'slideIcon', label: 'Slider icon', admin: { width: '50%', description: 'Small animated icon beside the title in the slider.' } }),
      ],
    },
    {
      name: 'slideIconAnimation',
      label: 'Icon animation',
      type: 'select',
      defaultValue: 'hang',
      options: [
        { label: 'Swing', value: 'hang' },
        { label: 'Pulse', value: 'pulse' },
        { label: 'Spin', value: 'spin' },
      ],
    },
  ],
  description: 'Each location gets its own page at /location-<slug>/ and is listed on the Location page.',
})
