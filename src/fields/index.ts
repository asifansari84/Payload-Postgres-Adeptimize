import type { Field, GroupField, TextField, UploadField } from 'payload'

const imagesOnly = { mimeType: { contains: 'image/' } }

/**
 * A heading where editors can wrap words in *asterisks* to show them in the
 * green outline style, e.g. "The *Digital Marketing* Problems We *Solve*".
 */
export function headingField(overrides: Partial<TextField> = {}): TextField {
  return {
    name: 'heading',
    type: 'text',
    ...overrides,
    admin: {
      description: 'Wrap words in *asterisks* to show them in the outlined accent style.',
      ...overrides.admin,
    },
  } as TextField
}

export function imageField(overrides: Partial<UploadField> & { name?: string } = {}): UploadField {
  return {
    name: 'image',
    type: 'upload',
    relationTo: 'media',
    filterOptions: imagesOnly,
    ...overrides,
  } as UploadField
}

/**
 * A link that points either at a page on this site (kept in sync if the page
 * slug changes) or at any custom URL.
 */
export function linkField({
  name = 'link',
  label,
  withLabel = true,
  required = false,
}: { name?: string; label?: string; withLabel?: boolean; required?: boolean } = {}): GroupField {
  const fields: Field[] = [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'page',
          options: [
            { label: 'Page on this site', value: 'page' },
            { label: 'Custom URL', value: 'custom' },
          ],
          admin: { layout: 'horizontal', width: '50%' },
        },
        {
          name: 'newTab',
          label: 'Open in a new tab',
          type: 'checkbox',
          admin: { width: '50%', style: { alignSelf: 'flex-end' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        ...(withLabel ? [{ name: 'label', type: 'text', required, admin: { width: '50%' } } as Field] : []),
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: { width: '50%', condition: (_, siblingData) => siblingData?.type !== 'custom' },
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          admin: {
            width: '50%',
            placeholder: 'https:// or /path or mailto:',
            condition: (_, siblingData) => siblingData?.type === 'custom',
          },
        },
      ],
    },
  ]

  return { name, label, type: 'group', fields, admin: { hideGutter: true } }
}
