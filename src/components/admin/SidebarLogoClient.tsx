'use client'

import { useConfig, useDocumentEvents } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

import styles from './SidebarLogo.module.css'
import { resolveSidebarLogo, type SidebarLogoData } from './sidebarLogoData'

/**
 * Renders the sidebar logo. Payload renders the sidebar once, so this
 * re-fetches the logo whenever Settings or the header is saved.
 */
export function SidebarLogoClient({ initial }: { initial: SidebarLogoData }) {
  const [logo, setLogo] = useState(initial)
  const { mostRecentUpdate } = useDocumentEvents()
  const {
    config: {
      routes: { api },
    },
  } = useConfig()

  const updatedSlug = mostRecentUpdate?.entitySlug
  const updatedAt = mostRecentUpdate?.updatedAt

  useEffect(() => {
    if (updatedSlug !== 'site-settings' && updatedSlug !== 'header') return
    let active = true
    const get = (slug: string) =>
      fetch(`${api}/globals/${slug}?depth=1`, { credentials: 'include' }).then((res) => (res.ok ? res.json() : null))
    Promise.all([get('site-settings'), get('header')])
      .then(([settings, header]) => active && setLogo(resolveSidebarLogo(settings, header)))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [api, updatedSlug, updatedAt])

  return (
    <a
      aria-label={`${logo.siteName} – view website (opens in a new tab)`}
      className={styles.logo}
      href="/"
      rel="noopener"
      target="_blank"
    >
      {logo.url ? (
        <img alt="" src={logo.url} />
      ) : (
        <span className={styles.text}>{logo.siteName}</span>
      )}
    </a>
  )
}
