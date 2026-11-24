'use client'

import { useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Header } from '@/payload-types'
import { socialIcons } from '../ui/socialIcons'
import { CMSLink, MediaImage } from '../ui/helpers'
import styles from './MenuDrawer.module.css'

type MenuItem = NonNullable<Header['menu']>[number]

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

const Chevron = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.chevron}><path d="m4 8 8 8 8-8" /></svg>
)

function MenuEntry({ item, open, onToggle, onNavigate }: { item: MenuItem; open: boolean; onToggle: () => void; onNavigate: () => void }) {
  const id = useId()
  const children = item.children ?? []

  if (!children.length) {
    return <CMSLink link={item.link} className={styles.link} onClick={onNavigate} />
  }

  return (
    <>
      <button type="button" className={styles.link} aria-expanded={open} aria-controls={id} onClick={onToggle}>
        {item.link?.label}
        <Chevron />
      </button>
      {/* Animates open by growing its grid row; inert keeps closed links out of the tab order. */}
      <div id={id} className={styles.submenuWrap} data-open={open || undefined} inert={!open}>
        <ul className={styles.submenu} role="list">
          {children.map((child, index) => (
            <li key={child.id} style={{ '--i': index } as CSSProperties}>
              <CMSLink link={child.link} onClick={onNavigate} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

/** Full-screen menu in a native <dialog>: focus trapping, Escape to close and an inert page come for free. */
export function MenuDrawer({ header, logo }: { header: Header | null; logo?: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [openItem, setOpenItem] = useState<string | null>(null)
  const close = () => {
    dialog.current?.close()
    setOpenItem(null)
  }
  const menu = header?.menu ?? []
  const chat = header?.chat
  const chatContent = chat?.title || chat?.text ? (
    <>
      <span className={styles.round} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="21" height="21"><path d="M21.5 3.5 2.8 10.7c-1 .4-1 1.8 0 2.1l4.6 1.5 1.8 5.6c.3.8 1.3 1 1.9.4l2.6-2.4 4.6 3.4c.7.5 1.7.1 1.9-.7l3.1-15c.2-1-.8-1.8-1.8-1.4ZM9.6 14.2l8.4-7.4-6.7 8.6-.3 3.1Z" /></svg>
      </span>
      <span className={styles.chatText}>
        {chat.title && <strong>{chat.title}</strong>}
        {chat.text && <span>{chat.text}</span>}
      </span>
    </>
  ) : null

  return (
    <>
      <button type="button" className={styles.toggle} aria-haspopup="dialog" aria-controls="site-menu" onClick={() => dialog.current?.showModal()}>
        <span className="visually-hidden">Open menu</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
      </button>

      <dialog id="site-menu" ref={dialog} className={styles.drawer} aria-label="Main menu" onClose={() => setOpenItem(null)}>
        <div className={styles.inner}>
          <div className={styles.top}>
            <span className={styles.logo}>{logo}</span>
            <button type="button" className={styles.close} onClick={close} aria-label="Close menu">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="30" height="30"><path d="M5 5l14 14M19 5 5 19" /></svg>
            </button>
          </div>

          <nav className={styles.nav} aria-label="Main">
            <ul className={styles.links} role="list">
              {menu.map((item, index) => (
                <li key={item.id} style={{ '--i': index } as CSSProperties}>
                  <MenuEntry
                    item={item}
                    open={openItem === item.id}
                    onToggle={() => setOpenItem(openItem === item.id ? null : (item.id ?? null))}
                    onNavigate={close}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <aside className={styles.panel} aria-label="Get in touch">
            <div className={styles.column}>
              {(header?.phone || header?.email) && (
                <div className={styles.contact}>
                  <p className={styles.contactText}>
                    {header.phone && <a className={styles.phone} href={telHref(header.phone)}>{header.phone}</a>}
                    {header.email && <a href={`mailto:${header.email}`}>{header.email}</a>}
                  </p>
                  {header.phone && (
                    <a className={styles.round} href={telHref(header.phone)} aria-label={`Call ${header.phone}`}>
                      <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1Z" /></svg>
                    </a>
                  )}
                </div>
              )}
              {header?.menuImage1 && <MediaImage media={header.menuImage1} alt="" className={`${styles.image} ${styles.imageLow}`} sizes="20.375rem" />}
            </div>
            <div className={styles.column}>
              {header?.menuImage2 && <MediaImage media={header.menuImage2} alt="" className={styles.image} sizes="20.375rem" />}
              {chatContent && (chat?.url
                ? <a className={styles.chat} href={chat.url} target="_blank" rel="noopener noreferrer">{chatContent}</a>
                : <p className={styles.chat}>{chatContent}</p>)}
            </div>
          </aside>

          {!!header?.social?.length && (
            <ul className={styles.social} role="list">
              {header.social.map((item) => (
                <li key={item.id}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.platform} (opens in a new tab)`}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22"><path d={socialIcons[item.platform]} /></svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  )
}
