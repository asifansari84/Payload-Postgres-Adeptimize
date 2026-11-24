import type { CollectionConfig, FieldAccess } from 'payload'

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
    // Clicking a user opens a popup to edit their name and avatar.
    components: { beforeListTable: ['/components/admin/users/UserEditDialog'] },
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
  // Sign in with either a username or an email address.
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: true,
      requireUsername: true,
    },
  },
  // When a user is attached to another document (e.g. a post's author), only expose their name.
  defaultPopulate: { name: true },
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
  ],
}
