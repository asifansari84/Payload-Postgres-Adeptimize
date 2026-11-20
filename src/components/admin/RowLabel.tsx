'use client'

import { useRowLabel } from '@payloadcms/ui'

function useLabel(field: string, fallback: string) {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()
  const value = data?.[field]
  const number = String((rowNumber ?? 0) + 1).padStart(2, '0')
  return `${number} · ${typeof value === 'string' && value.trim() ? value : fallback}`
}

export function TitleRowLabel() {
  return <span>{useLabel('title', 'Untitled')}</span>
}

export function NameRowLabel() {
  return <span>{useLabel('name', 'Unnamed')}</span>
}

export function QuestionRowLabel() {
  return <span>{useLabel('question', 'New question')}</span>
}

export function LinkRowLabel() {
  return <span>{useLabel('label', 'New link')}</span>
}

export function ValueRowLabel() {
  return <span>{useLabel('value', 'New statistic')}</span>
}

export function LabelRowLabel() {
  return <span>{useLabel('label', 'New counter')}</span>
}
