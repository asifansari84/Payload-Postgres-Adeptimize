import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { hasText } from '@payloadcms/richtext-lexical/shared'
import { JSDOM, VirtualConsole } from 'jsdom'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Payload } from 'payload'
import postManifest from '../src/content/adeptimize-post-manifest.json'

/** Internal links in imported posts that still point at a live page. */
const localRoutes = new Set(['', 'about-us', 'contact-us', 'blog', ...postManifest.map(({ slug }) => slug)])

function searchDescription(excerpt: string) {
  const text = excerpt.trim().replace(/\s+/g, ' ')
  if (text.length <= 160) return text
  return text.slice(0, 157).replace(/\s+\S*$/, '') + '…'
}

function useNumericUploadIDs(node: { type: string; [key: string]: unknown }) {
  if (node.type === 'upload' && typeof node.value === 'string') node.value = Number(node.value)
  if (Array.isArray(node.children)) node.children.forEach(useNumericUploadIDs)
}

export async function importPosts(payload: Payload) {
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const root = process.cwd()

  const importImage = async (publicPath: string, alt: string) => {
    const filename = path.basename(publicPath)
    const existing = await payload.find({
      collection: 'media', where: { filename: { equals: filename } }, limit: 1, depth: 0,
    })
    if (existing.docs[0]) return existing.docs[0].id

    const image = await payload.create({
      collection: 'media',
      filePath: path.join(root, 'public', publicPath),
      data: { alt },
    })
    return image.id
  }

  for (const source of postManifest) {
    const existing = (await payload.find({
      collection: 'posts', where: { slug: { equals: source.slug } }, limit: 1, depth: 0,
    })).docs[0]
    if (existing?.featuredImage && hasText(existing.richContent)) continue

    const featuredImage = existing?.featuredImage ?? await importImage(source.featuredImage.path, source.featuredImage.alt)
    let richContent = existing?.richContent
    if (!hasText(richContent)) {
      // Use any article markup already saved by an editor before falling back to the export.
      const editedText = !existing?.sourceHtml && existing?.content && existing.content !== source.content ? existing.content : null
      const html = existing?.sourceHtml || (editedText
        ? ''
        : await readFile(path.join(root, 'src/content/adeptimize-posts', `${source.slug}.html`), 'utf8'))

      const dom = new JSDOM(html, { virtualConsole: new VirtualConsole() })
      try {
        const document = dom.window.document
        if (editedText) {
          const paragraph = document.createElement('p')
          paragraph.textContent = editedText
          document.body.append(paragraph)
        }
        document.querySelectorAll('script,style').forEach((element) => element.remove())
        document.querySelectorAll('h1').forEach((heading) => {
          const replacement = document.createElement('h2')
          replacement.append(...heading.childNodes)
          heading.replaceWith(replacement)
        })

        for (const link of document.querySelectorAll('a[href]')) {
          const href = link.getAttribute('href') ?? ''
          if (/^(https?:\/\/)?(?:www\.)?adeptimize\.com\//i.test(href)) {
            const url = new URL(href, 'https://adeptimize.com')
            const route = url.pathname.replace(/^\/|\/$/g, '')
            if (localRoutes.has(route)) link.setAttribute('href', url.pathname + url.search + url.hash)
          }
        }

        for (const image of document.querySelectorAll('img')) {
          const src = image.getAttribute('src') ?? ''
          const exportedImage = /^(?:https?:\/\/(?:www\.)?adeptimize\.com\/wp-content\/uploads\/|\/adeptimize-assets\/)/.test(src)
          if (!exportedImage) {
            // The reference exports only use WordPress uploads. Keep unusual legacy images as links.
            const link = document.createElement('a')
            link.textContent = image.alt || 'View image'
            if (/^https?:\/\//i.test(src)) link.href = src
            image.replaceWith(link)
            continue
          }
          const publicPath = src.startsWith('/') ? src : `/adeptimize-assets/blog-import/${path.basename(src)}`
          const media = await importImage(publicPath, image.alt.trim() || source.title)
          image.setAttribute('data-lexical-upload-relation-to', 'media')
          image.setAttribute('data-lexical-upload-id', String(media))
        }

        richContent = convertHTMLToLexical({ editorConfig, html: document.body.innerHTML, JSDOM })
        useNumericUploadIDs(richContent.root)
      } finally {
        dom.window.close()
      }
      if (!hasText(richContent)) throw new Error(`Post has no editable content: ${source.slug}`)
    }

    if (existing) {
      await payload.update({
        collection: 'posts', id: existing.id,
        data: { featuredImage, richContent },
      })
      payload.logger.info(`Completed imported media/content: ${source.slug}`)
      continue
    }
    await payload.create({
      collection: 'posts',
      data: {
        title: source.title,
        slug: source.slug,
        generateSlug: false,
        excerpt: source.excerpt || source.title,
        publishedAt: source.publishedAt || undefined,
        status: 'published',
        featuredImage,
        richContent,
        seo: { description: searchDescription(source.excerpt || source.title) },
      },
    })
    payload.logger.info(`Created post: ${source.slug}`)
  }
}
