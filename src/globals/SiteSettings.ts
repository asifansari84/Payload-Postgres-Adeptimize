import type { GlobalConfig } from 'payload'
import { imageField } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'

/** Site-wide settings. New site-level options belong here rather than in a new global. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Settings',
  admin: { group: 'Site settings', description: 'General settings for the site and the admin panel.' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'siteName',
              label: 'Site name',
              type: 'text',
              defaultValue: 'Adeptimize',
              admin: { description: 'Used as the logo text and alt text when no logo is set.' },
            },
            imageField({
              name: 'favicon',
              label: 'Favicon',
              admin: {
                description:
                  'The small icon shown in browser tabs and bookmarks. A square PNG (at least 512×512px), SVG or ICO works best.',
              },
            }),
            {
              name: 'discourageSearchEngines',
              label: 'Discourage search engines from indexing this site',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'Search engine visibility. When ticked, every page asks search engines not to index it or follow its links. It is up to search engines to honor this request.',
              },
            },
          ],
        },
        {
          label: 'Admin panel',
          description: 'The logo at the top of the admin sidebar. Clicking it opens the website.',
          fields: [
            imageField({
              name: 'adminLogo',
              label: 'Logo',
              admin: {
                description:
                  'SVG, or a PNG with a transparent background at least 320×80px. Shown up to 160×40px. Falls back to the menu logo.',
              },
            }),
          ],
        },
      ],
    },
  ],
}
