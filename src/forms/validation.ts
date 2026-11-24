import type { FieldType, FormFieldDef } from './definitions'

/**
 * Cleans and checks submitted values against a form's fields. The same rules
 * run in the browser (instant feedback) and on the server (the real check).
 */

export const MAX_LENGTH: Record<FieldType, number> = {
  text: 200,
  email: 254,
  tel: 30,
  textarea: 5000,
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i
const PHONE = /^\+?[\d\s().-]{6,30}$/

// Control characters other than tab / newline, and zero-width / bidi marks.
// eslint-disable-next-line no-control-regex
const UNSAFE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩﻿]/g

export function sanitize(value: unknown, type: FieldType): string {
  if (typeof value !== 'string') return ''
  let clean = value.normalize('NFC').replace(UNSAFE, '').replace(/\r\n?/g, '\n')
  // Only long text keeps line breaks; everything else is a single line.
  clean = type === 'textarea' ? clean.replace(/\n{3,}/g, '\n\n') : clean.replace(/\s+/g, ' ')
  clean = clean.trim()
  return type === 'email' ? clean.toLowerCase() : clean
}

export function validateField(field: FormFieldDef, value: string): string | null {
  if (!value) return field.required ? (field.type === 'email' ? 'Enter your email address.' : 'This field is required.') : null
  if (value.length > MAX_LENGTH[field.type]) return `Keep this under ${MAX_LENGTH[field.type]} characters.`
  if (field.type === 'email' && !EMAIL.test(value)) return 'Enter a valid email address.'
  if (field.type === 'tel' && !PHONE.test(value)) return 'Enter a valid phone number.'
  return null
}

export type ValidationResult = {
  values: Record<string, string>
  errors: Record<string, string>
}

/** Reads only the form's own fields; anything else that was posted is ignored. */
export function validateSubmission(fields: FormFieldDef[], read: (name: string) => unknown): ValidationResult {
  const values: Record<string, string> = {}
  const errors: Record<string, string> = {}
  for (const field of fields) {
    const value = sanitize(read(field.name), field.type)
    const error = validateField(field, value)
    if (error) errors[field.name] = error
    if (value) values[field.name] = value
  }
  return { values, errors }
}
