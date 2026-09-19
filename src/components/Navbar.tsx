import {
  useEffect,
  useRef,
  useState,
} from 'react'
import styles from './Navbar.module.css'

type AppRoute = 'home' | 'resume'

interface NavbarProps {
  onNavigate?: (route: AppRoute) => void
}

interface SectionLink {
  id: string
  label: string
  number: string
}

const sectionLinks: SectionLink[] = [
  { id: 'projects', label: 'PROJECTS', number: '01' },
  { id: 'education', label: 'EDUCATION', number: '02' },
  { id: 'skills', label: 'SKILLS', number: '03' },
  { id: 'recognition', label: 'RECOGNITION', number: '04' },
  { id: 'contact', label: 'CONTACT', number: '05' },
]

const socialLinks = [
  {
    label: 'GITHUB',
    href: 'https://github.com/Abhivocopedia',
    icon: 'GH',
  },
  {
    label: 'LINKEDIN',
    href: 'https://linkedin.com/in/abhinandana-bhatta',
    icon: 'in',
  },
  {
    label: 'X',
    href: 'https://x.com/Abhinandan43024',
    icon: '𝕏',
  },
]

export function Navbar({
  onNavigate,
}: NavbarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const media = window.matchMedia(
      '(max-width: 760px)',
    )

    const syncMobile = () => {
      setIsMobile(media.matches)
    }

    syncMobile()
    media.addEventListener?.('change', syncMobile)

    return () => {
      media.removeEventListener?.(
        'change',
        syncMobile,
      )
    }
  }, [])

  useEffect(() => {
    const update = () => {
      setCollapsed(window.scrollY > 96)
    }

    update()

    let frame: number | null = null

    const onScroll = () => {
      if (frame !== null) return

      frame = window.requestAnimationFrame(() => {
        frame = null
        setCollapsed(window.scrollY > 96)
      })
    }

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', onScroll)

      if (frame !== null) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        window.setTimeout(() => {
          menuButtonRef.current?.focus()
        }, 0)
      }
    }

    const previousOverflow =
      document.body.style.overflow
    document.body.style.overflow = 'hidden'

    document.addEventListener(
      'keydown',
      onKeyDown,
    )

    return () => {
      document.body.style.overflow =
        previousOverflow
      document.removeEventListener(
        'keydown',
        onKeyDown,
      )
    }
  }, [menuOpen])

  const scrollToSection = (id: string) => {
    const element =
      document.getElementById(id)

    if (!element) return

    const targetTop =
      element.getBoundingClientRect().top +
      window.scrollY -
      86

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    })

    window.history.replaceState(
      null,
      '',
      `#${id}`,
    )

    setMenuOpen(false)
  }

  const handleSectionClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault()
    scrollToSection(id)
  }

  const handleHomeClick = (
    event?: React.MouseEvent,
  ) => {
    event?.preventDefault()

    window.history.replaceState(
      null,
      '',
      window.location.pathname +
        window.location.search,
    )

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    setMenuOpen(false)
  }

  const handleResume = (
    event: React.MouseEvent,
  ) => {
    event.preventDefault()
    setMenuOpen(false)

    if (onNavigate) {
      onNavigate('resume')
    } else {
      window.location.hash = 'resume'
    }
  }

  const compactVisible = collapsed || isMobile

  return (
    <>
      <header
        className={`${styles.fullNav} ${
          collapsed ? styles.fullNavCollapsed : ''
        }`}
        aria-label="Primary navigation"
      >
        <div className={styles.fullNavInner}>
          <a
            href="/"
            className={styles.brand}
            onClick={handleHomeClick}
          >
            ABHIVOCOPEDIA
          </a>

          <nav
            className={styles.mainLinks}
            aria-label="Sections"
          >
            {sectionLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(event) =>
                  handleSectionClick(
                    event,
                    link.id,
                  )
                }
                className={
                  styles.navLink
                }
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className={styles.secondaryRow}>
          <div className={styles.socialRow}>
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={styles.socialButton}
                aria-label={link.label}
              >
                <span
                  className={styles.socialIcon}
                  aria-hidden="true"
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </a>
            ))}

            <a
              href="#resume"
              onClick={handleResume}
              className={styles.resumeButton}
            >
              <span
                aria-hidden="true"
                className={styles.documentIcon}
              >
                ▣
              </span>
              RESUME
            </a>
          </div>
        </div>
      </header>

      <div
        className={`${styles.compactBar} ${
          compactVisible ? styles.compactVisible : ''
        }`}
        aria-hidden={!compactVisible}
      >
        <span className={styles.compactBrand}>
          ABHIVOCOPEDIA
        </span>

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          onClick={() =>
            setMenuOpen((open) => !open)
          }
          aria-expanded={menuOpen}
          aria-controls="portfolio-navigation-menu"
          tabIndex={compactVisible ? 0 : -1}
          aria-label={
            menuOpen
              ? 'Close navigation menu'
              : 'Open navigation menu'
          }
        >
          <span>MENU</span>
          <span
            className={styles.menuSymbol}
            aria-hidden="true"
          >
            {menuOpen ? '×' : '+'}
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className={styles.menuLayer}>
          <div
            className={styles.menuBackdrop}
            onClick={() =>
              setMenuOpen(false)
            }
            aria-hidden="true"
          />

          <aside
            id="portfolio-navigation-menu"
            className={styles.menuPanel}
            aria-label="Portfolio navigation"
          >
            <div className={styles.menuPanelTop}>
              <span className={styles.menuEyebrow}>
                NAVIGATION
              </span>

              <button
                type="button"
                className={styles.closeButton}
                onClick={() =>
                  setMenuOpen(false)
                }
                aria-label="Close navigation menu"
              >
                CLOSE ×
              </button>
            </div>

            <nav className={styles.menuList}>
              {sectionLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={styles.menuItem}
                  onClick={(event) =>
                    handleSectionClick(
                      event,
                      link.id,
                    )
                  }
                >
                  <span
                    className={styles.menuNumber}
                  >
                    {link.number}
                  </span>

                  <span
                    className={styles.menuLabel}
                  >
                    {link.label}
                  </span>

                  <span
                    className={styles.menuArrow}
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </a>
              ))}

              <a
                href="#resume"
                className={`${styles.menuItem} ${styles.menuResume}`}
                onClick={handleResume}
              >
                <span
                  className={styles.menuNumber}
                >
                  06
                </span>

                <span
                  className={styles.menuLabel}
                >
                  RESUME
                </span>

                <span
                  className={styles.menuArrow}
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            </nav>

            <div className={styles.menuFooter}>
              <a
                href="mailto:abhivocopedia@gmail.com"
                className={styles.menuEmail}
              >
                abhivocopedia@gmail.com
              </a>

              <span className={styles.menuMeta}>
                CSE · FULL-STACK · BUILDER
              </span>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

