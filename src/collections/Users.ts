import type { CollectionConfig, FieldAccess, TextField } from 'payload'

/**
 * Optional social profile link. Must point to the platform's own site; a link
 * typed without "https://" gets it added. Empty means "don't show".
 */
const socialLink = (name: string, label: string, hosts: string[], example: string): TextField => ({
  name,
  label,
  type: 'text',
  admin: { placeholder: example, width: '50%' },
  hooks: {
    beforeValidate: [
      ({ value }) => {
        if (typeof value !== 'string') return value
        const trimmed = value.trim()
        if (!trimmed) return null
        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
      },
    ],
  },
  validate: (value: string | null | undefined) => {
    if (!value) return true
    try {
      const url = new URL(value)
      const host = url.hostname.toLowerCase().replace(/^(www|m)\./, '')
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return 'Enter a web address starting with https://'
      if (!hosts.includes(host)) return `Enter a ${label} link, e.g. ${example}`
      if (url.pathname.replace(/\/+$/, '') === '') return `Add the profile part of the link, e.g. ${example}`
      return value.length <= 300 || 'This link is too long.'
    } catch {
      return `Enter a ${label} link, e.g. ${example}`
    }
  },
})

/** Set once when the account is created; never changed afterwards (UI, popup or API). */
const fixedAfterCreate: { create: FieldAccess; update: FieldAccess } = {
  create: () => true,
  update: () => false,
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Administration',
    // Show people by name in the Users list and in pickers like a post's Author.
    useAsTitle: 'displayName',
    defaultColumns: ['avatar', 'name', 'username', 'email', 'updatedAt'],
  },
  hooks: {
    // Keep "Name (username)" in sync so pickers can tell people with the same name apart.
    beforeChange: [
      ({ data, originalDoc }) => {
        const name = (data.name ?? originalDoc?.name ?? '').trim()
        const username = (data.username ?? originalDoc?.username ?? '').trim()
        data.displayName = username ? `${name} (${username})` : name
        return data
      },
    ],
  },
  access: {
    // Hides the "Force Unlock" button. Accounts locked by too many failed
    // logins still unlock themselves after the lock time (10 minutes).
    unlock: () => false,
  },
  // Sign in with either a username or an email address.
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: true,
      requireUsername: true,
    },
  },
  // When a user is attached to another document (e.g. a post's author), only expose their name.
  // Social links are included so a post's author box can show them.
  defaultPopulate: { name: true, bio: true, social: true },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
      admin: { components: { Cell: '/components/admin/users/UserCells#NameCell' } },
      // A name made only of spaces is not a name.
      hooks: { beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim() : value)] },
    },
    // Merged into Payload's built-in login email field: it can't be edited after creation.
    {
      name: 'email',
      type: 'email',
      access: fixedAfterCreate,
      admin: { description: 'Cannot be changed after the account is created.' },
    },
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      access: fixedAfterCreate,
      admin: { description: 'Lowercase letters, numbers, dots, dashes and underscores (3–30 characters). Cannot be changed after the account is created.' },
      hooks: {
        beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value)],
      },
      validate: (value?: string | null) => {
        if (!value) return 'Enter a username.'
        return /^[a-z0-9._-]{3,30}$/.test(value) || 'Use 3–30 lowercase letters, numbers, dots, dashes or underscores.'
      },
    },
    {
      name: 'displayName',
      type: 'text',
      index: true,
      // Always rewritten by the beforeChange hook above, so it can't be set by hand.
      admin: { hidden: true, readOnly: true },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image/' } },
      admin: {
        description: 'Optional profile picture. A placeholder icon is shown when empty.',
        components: { Cell: '/components/admin/users/UserCells#AvatarCell' },
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 1000,
      admin: {
        rows: 5,
        placeholder: 'A short introduction: background, expertise, experience and what you write about.',
        description: 'Optional. Up to 1,000 characters (e.g. for the author box on posts).',
      },
      hooks: { beforeValidate: [({ value }) => (typeof value === 'string' ? value.trim() || null : value)] },
    },
    {
      name: 'social',
      label: 'Social media links',
      type: 'group',
      admin: {
        description: 'Optional. Only the links filled in here are shown (e.g. on posts by this author).',
      },
      fields: [
        {
          type: 'row',
          fields: [
            socialLink('facebook', 'Facebook', ['facebook.com', 'fb.com'], 'https://facebook.com/yourname'),
            socialLink('instagram', 'Instagram', ['instagram.com'], 'https://instagram.com/yourname'),
          ],
        },
        {
          type: 'row',
          fields: [
            socialLink('x', 'X (Twitter)', ['x.com', 'twitter.com'], 'https://x.com/yourname'),
            socialLink('linkedin', 'LinkedIn', ['linkedin.com'], 'https://linkedin.com/in/yourname'),
          ],
        },
        {
          type: 'row',
          fields: [socialLink('tiktok', 'TikTok', ['tiktok.com'], 'https://tiktok.com/@yourname')],
        },
      ],
    },
  ],
}
