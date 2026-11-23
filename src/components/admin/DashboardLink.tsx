'use client'

import { useConfig } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * "Dashboard" link under the sidebar logo. Uses Payload's own nav link classes
 * so it looks and highlights like the other sidebar links.
 */
export default function DashboardLink() {
  const pathname = usePathname()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const href = adminRoute || '/'
  const isActive = pathname === href || pathname === `${href}/`

  const label = (
    <>
      {isActive && <div className="nav__link-indicator" />}
      <span className="nav__link-label">Dashboard</span>
    </>
  )

  return (
    <div className="adeptimize-dashboard-link">
      {isActive ? (
        <div aria-current="page" className="nav__link" id="nav-dashboard">
          {label}
        </div>
      ) : (
        <Link className="nav__link" href={href} id="nav-dashboard" prefetch={false}>
          {label}
        </Link>
      )}
    </div>
  )
}
