import { servicePath } from '../lib/routes'
import { listingCollection } from './listingCollection'
import { serviceSections } from './listingSections'

export const Services = listingCollection({
  slug: 'services',
  singular: 'Service',
  plural: 'Services',
  path: servicePath,
  sections: serviceSections,
  description: 'Each service gets its own page at /service-item/<slug>/ and is listed on the Our Services page.',
})
