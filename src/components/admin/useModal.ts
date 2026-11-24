'use client'

import { useEffect, useRef, type MouseEvent } from 'react'

/**
 * Opens a native modal <dialog> on mount: focus stays inside it, Esc and a
 * click on the backdrop close it, and focus returns to the opener afterwards.
 */
export function useModal(onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null)
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const opener = document.activeElement as HTMLElement | null
    dialog.showModal()
    const onCancel = (e: Event) => {
      e.preventDefault()
      close.current()
    }
    dialog.addEventListener('cancel', onCancel)
    return () => {
      dialog.removeEventListener('cancel', onCancel)
      if (dialog.open) dialog.close()
      // Give focus back without drawing a focus ring on the item that opened it.
      opener?.focus?.({ preventScroll: true, focusVisible: false } as FocusOptions)
    }
  }, [])

  // A click on the dialog element itself (not its content) is a click on the backdrop.
  const onClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) close.current()
  }
  return { ref, onClick }
}
