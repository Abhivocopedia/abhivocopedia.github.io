import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '../data/profile'
import { Star } from './DecorativeMarks'
import styles from './Navbar.module.css'

const navItems = [
  { href: '#projects', label: 'PROJECTS' },
  { href: '#education', label: 'EDUCATION' },
  { href: '#skills', label: 'SKILLS' },
  { href: '#recognition', label: 'RECOGNITION' },
  { href: '#contact', label: 'CONTACT' }
]

const socialLinks = [
  { href: profile.social.github, label: 'GitHub', icon: 'github' },
  { href: profile.social.linkedin, label: 'LinkedIn', icon: 'linkedin' },
  { href: profile.social.x, label: 'X', icon: 'x' }
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('projects')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = ['projects', 'education', 'skills', 'recognition', 'contact']
      const scrollPos = window.scrollY + 200
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileOpen(false)
  }

  return (
    <header
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.navInner}>
        <div className={styles.navMain}>
          <a href="/" className={styles.logo} aria-label="Abhivocopedia - Home">
            <span className={styles.logoMark}>ABHIVOCOPEDIA</span>
            <Star size="sm" color="mustard" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
          </a>

          <nav className={styles.navLinks} aria-label="Primary navigation">
            <ul className={styles.list} role="list">
              {navItems.map(item => (
                <li key={item.href}>
                  <button
                    className={`${styles.link} ${activeSection === item.href.replace('#', '') ? styles.active : ''}`}
                    onClick={() => scrollToSection(item.href)}
                    aria-current={activeSection === item.href.replace('#', '') ? 'page' : undefined}
                  >
                    {item.label}
                    {activeSection === item.href.replace('#', '') && (
                      <Star size="sm" color="mustard" className={styles.activeStar} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.navActions}>
          <div className={styles.socialGroup} aria-label="Social links">
            {socialLinks.map((social, index) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={social.label}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {renderSocialIcon(social.icon)}
                <span className={styles.socialLabel}>{social.label}</span>
              </a>
            ))}
          </div>

          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`} aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className={styles.mobileMenu}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <nav aria-label="Mobile navigation">
              <ul className={styles.mobileList} role="list">
                {navItems.map((item, index) => (
                  <li key={item.href}>
                    <motion.button
                      className={`${styles.mobileLink} ${activeSection === item.href.replace('#', '') ? styles.mobileActive : ''}`}
                      onClick={() => scrollToSection(item.href)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      aria-current={activeSection === item.href.replace('#', '') ? 'page' : undefined}
                    >
                      {item.label}
                      {activeSection === item.href.replace('#', '') && <Star size="sm" color="mustard" />}
                    </motion.button>
                  </li>
                ))}
                <li className={styles.mobileDivider} aria-hidden="true" />
                {socialLinks.map((social, index) => (
                  <li key={social.label}>
                    <motion.a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mobileSocialLink}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (navItems.length + index) * 0.05 }}
                      aria-label={social.label}
                    >
                      {renderSocialIcon(social.icon, 20)}
                      <span>{social.label}</span>
                    </motion.a>
                  </li>
                ))}
                <li>
                  <motion.a
                    href={`mailto:${profile.social.email}`}
                    className={styles.mobileSocialLink}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (navItems.length + socialLinks.length) * 0.05 }}
                    aria-label="Email"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span>Email</span>
                  </motion.a>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function renderSocialIcon(name: string, size = 18) {
  const icons: Record<string, JSX.Element> = {
    github: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>,
    linkedin: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  }
  return icons[name] || icons.github
}