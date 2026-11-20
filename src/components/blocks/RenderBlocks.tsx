import type { Page } from '@/payload-types'
import { Differentiators } from './Differentiators'
import { FAQ } from './FAQ'
import { FeatureGrid } from './FeatureGrid'
import { Hero } from './Hero'
import { ImageAccordion } from './ImageAccordion'
import { LogoShowcase } from './LogoShowcase'
import { LogoStrip } from './LogoStrip'
import { Process } from './Process'
import { ServiceCarousel } from './ServiceCarousel'
import { Testimonials } from './Testimonials'

type Block = NonNullable<Page['layout']>[number]

function renderBlock(block: Block, nextId?: string) {
  switch (block.blockType) {
    case 'hero': return <Hero block={block} nextId={nextId} />
    case 'logoShowcase': return <LogoShowcase block={block} />
    case 'featureGrid': return <FeatureGrid block={block} />
    case 'process': return <Process block={block} />
    case 'differentiators': return <Differentiators block={block} />
    case 'imageAccordion': return <ImageAccordion block={block} />
    case 'testimonials': return <Testimonials block={block} />
    case 'serviceCarousel': return <ServiceCarousel block={block} />
    case 'logoStrip': return <LogoStrip block={block} />
    case 'faq': return <FAQ block={block} />
    default: return null
  }
}

export function RenderBlocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((block, index) => {
    const next = blocks[index + 1]
    return (
      <div key={block.id ?? index} id={block.id ? `section-${block.id}` : undefined}>
        {renderBlock(block, next?.id ? `section-${next.id}` : undefined)}
      </div>
    )
  })
}
