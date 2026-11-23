import type { GlobalConfig } from 'payload'
import { imageField, linkField } from '../fields'
import { revalidateGlobal } from '../hooks/revalidate'

const linkList = (name: string, label: string, description?: string) => ({
  name,
  label,
  type: 'array' as const,
  labels: { singular: 'Link', plural: 'Links' },
  admin: { description, initCollapsed: true, components: { RowLabel: '/components/admin/RowLabel#LinkRowLabel' } },
  fields: [linkField({ name: 'link', required: true })],
})

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header & menu',
  admin: { group: 'Site settings', description: 'Logo, header buttons and the full-screen menu shown on every page.' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            imageField({ name: 'logo', admin: { description: 'Shown on light backgrounds. SVG works best.' } }),
            { ...linkList('buttons', 'Header buttons', 'Outlined buttons beside the menu icon (hidden on small screens).'), maxRows: 3 },
          ],
        },
        {
          label: 'Menu links',
          description: 'The large links in the full-screen menu. Add sub-menu links to turn an item into a drop-down.',
          fields: [
            {
              name: 'menu',
              label: 'Menu links',
              type: 'array',
              labels: { singular: 'Link', plural: 'Links' },
              admin: { initCollapsed: true, components: { RowLabel: '/components/admin/RowLabel#LinkRowLabel' } },
              fields: [
                linkField({ name: 'link', required: true }),
                {
                  ...linkList('children', 'Sub-menu links', 'Optional. When added, the item opens a drop-down instead of linking directly.'),
                },
              ],
            },
          ],
        },
        {
          label: 'Menu panel',
          description: 'Contact details, images and social links on the full-screen menu.',
          fields: [
            imageField({ name: 'menuLogo', label: 'Menu logo', admin: { description: 'Shown on the dark menu. Use a light logo.' } }),
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', admin: { width: '50%' } },
                { name: 'email', type: 'email', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                imageField({ name: 'menuImage1', label: 'Image (left)', admin: { width: '50%' } }),
                imageField({ name: 'menuImage2', label: 'Image (right)', admin: { width: '50%' } }),
              ],
            },
            {
              name: 'chat',
              label: 'Chat link',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'title', type: 'text', defaultValue: 'We are much closer', admin: { width: '50%' } },
                    { name: 'text', type: 'text', defaultValue: 'Contact us via Telegram', admin: { width: '50%' } },
                  ],
                },
                { name: 'url', label: 'URL', type: 'text', admin: { placeholder: 'https://t.me/…', description: 'Opens in a new tab. Leave empty to show the text without a link.' } },
              ],
            },
            {
              name: 'social',
              label: 'Social profiles',
              type: 'array',
              labels: { singular: 'Profile', plural: 'Profiles' },
              admin: { initCollapsed: true, components: { RowLabel: '/components/admin/RowLabel#SocialRowLabel' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      admin: { width: '30%' },
                      options: ['facebook', 'linkedin', 'instagram', 'x', 'youtube', 'behance'].map((value) => ({
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
      ],
    },
  ],
}

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: { group: 'Site settings', description: 'The call to action, link columns and contact details at the bottom of every page.' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Call to action',
          fields: [
            imageField({ name: 'logo', admin: { description: 'Shown on the dark footer. Use a light logo.' } }),
            {
              type: 'row',
              fields: [
                { name: 'ctaEyebrow', label: 'Outlined line', type: 'text', defaultValue: 'Do You', admin: { width: '33%' } },
                { name: 'ctaTitle', label: 'Green line', type: 'text', defaultValue: 'Have', admin: { width: '33%' } },
                { name: 'ctaAside', label: 'Small line', type: 'text', defaultValue: 'A Project In Mind?', admin: { width: '33%' } },
              ],
            },
            { name: 'text', type: 'textarea' },
            {
              name: 'social',
              label: 'Social profiles',
              type: 'array',
              labels: { singular: 'Profile', plural: 'Profiles' },
              admin: { initCollapsed: true, components: { RowLabel: '/components/admin/RowLabel#SocialRowLabel' } },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      admin: { width: '30%' },
                      options: ['facebook', 'linkedin', 'instagram', 'x', 'youtube', 'behance'].map((value) => ({
                        value,
                        label: value === 'x' ? 'X (Twitter)' : value[0].toUpperCase() + value.slice(1),
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
          label: 'Link columns',
          fields: [
            {
              name: 'columns',
              type: 'array',
              labels: { singular: 'Column', plural: 'Columns' },
              admin: { components: { RowLabel: '/components/admin/RowLabel#TitleRowLabel' } },
              fields: [{ name: 'title', type: 'text', required: true }, linkList('links', 'Links')],
            },
          ],
        },
        {
          label: 'Contact & hours',
          fields: [
            { name: 'hoursTitle', type: 'text', defaultValue: 'Working Hours' },
            { name: 'hours', type: 'array', fields: [{ name: 'line', type: 'text', required: true }] },
            { name: 'contactTitle', type: 'text', defaultValue: 'Contact Us' },
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', admin: { width: '50%' } },
                { name: 'phone', type: 'text', admin: { width: '50%', placeholder: '+1 (512) 750-0778' } },
              ],
            },
          ],
        },
        {
          label: 'Newsletter & legal',
          fields: [
            { name: 'newsletterTitle', type: 'text', defaultValue: 'Newsletter' },
            { name: 'newsletterPlaceholder', type: 'text', defaultValue: 'Your e-mail' },
            { name: 'copyright', type: 'text', defaultValue: 'Copyright © {year}, All rights reserved.', admin: { description: '{year} is replaced with the current year.' } },
          ],
        },
      ],
    },
  ],
}
