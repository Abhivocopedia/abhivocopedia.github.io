import { profile } from '../data/profile'
import { Label } from './DecorativeMarks'
import styles from './Footer.module.css'


const footerToolLogos = [
  ['GitHub', profile.social.github, 'https://cdn.simpleicons.org/github/181717'],
  ['Git', 'https://git-scm.com/', 'https://cdn.simpleicons.org/git/F05032'],
  ['GitHub Actions', 'https://github.com/features/actions', 'https://cdn.simpleicons.org/githubactions/2088FF'],
  ['GitHub Pages', 'https://pages.github.com/', 'https://cdn.simpleicons.org/githubpages/FFFFFF'],
  ['pnpm', 'https://pnpm.io/', 'https://cdn.simpleicons.org/pnpm/F69220'],
  ['MLH', 'https://www.mlh.com/', 'https://static.mlh.io/brand-assets/logo/official/mlh-logo-color.svg'],
  ['Instagram', profile.social.instagram, 'https://cdn.simpleicons.org/instagram/E4405F'],
  ['X', profile.social.x, 'https://cdn.simpleicons.org/x/FFFFFF'],
  ['ChatGPT / OpenAI', 'https://chatgpt.com/', '/icons/openai.svg'],
  ['OpenCode', 'https://opencode.ai/', 'https://cdn.simpleicons.org/opencode/FFFFFF'],
  ['Spotify', profile.social.spotify, 'https://cdn.simpleicons.org/spotify/1ED760'],
  ['React', 'https://react.dev/', 'https://cdn.simpleicons.org/react/61DAFB'],
  ['TypeScript', 'https://www.typescriptlang.org/', 'https://cdn.simpleicons.org/typescript/3178C6'],
  ['JavaScript', 'https://developer.mozilla.org/docs/Web/JavaScript', '/icons/javascript.svg'],
  ['HTML', 'https://developer.mozilla.org/docs/Web/HTML', '/icons/html5.svg'],
  ['CSS', 'https://developer.mozilla.org/docs/Web/CSS', '/icons/css3.svg'],
  ['Vite', 'https://vite.dev/', 'https://cdn.simpleicons.org/vite/646CFF'],
  ['Framer Motion', 'https://motion.dev/', 'https://cdn.simpleicons.org/framer/0055FF'],
  ['Node.js', 'https://nodejs.org/', 'https://cdn.simpleicons.org/nodedotjs/339933'],
  ['Vercel', 'https://vercel.com/', 'https://cdn.simpleicons.org/vercel/FFFFFF'],
  ['NVIDIA', 'https://www.nvidia.com/', 'https://cdn.simpleicons.org/nvidia/76B900'],

  ['Lenovo Yoga', 'https://www.lenovo.com/', 'https://cdn.simpleicons.org/lenovo/E2231A'],
  ['Microsoft', 'https://www.microsoft.com/', '/icons/microsoft.svg'],
  ['Google', 'https://www.google.com/', 'https://cdn.simpleicons.org/google/4285F4'],
  ['Samsung', 'https://www.samsung.com/', 'https://cdn.simpleicons.org/samsung/1428A0'],
  ['HP', 'https://www.hp.com/', 'https://cdn.simpleicons.org/hp/0096D6'],
  ['Android', 'https://www.android.com/', 'https://cdn.simpleicons.org/android/3DDC84'],
  ['Apple', 'https://www.apple.com/', 'https://cdn.simpleicons.org/apple/FFFFFF'],

  ['Portronics', 'https://www.portronics.com/', 'https://www.google.com/s2/favicons?domain=portronics.com&sz=64'],
  ['Milton', 'https://www.milton.in/', 'https://www.google.com/s2/favicons?domain=milton.in&sz=64'],
  ['realme', 'https://www.realme.com/', 'https://www.google.com/s2/favicons?domain=realme.com&sz=64'],
  ['Fastrack', 'https://www.fastrack.in/', 'https://www.google.com/s2/favicons?domain=fastrack.in&sz=64'],
  ['DSU DEVHACK 3', 'https://www.dsudevhack3.tech/', '/icons/dsu-devhack-3.webp'],

  ['Call of Duty', 'https://www.callofduty.com/', 'https://www.callofduty.com/favicon.ico'],
  ['WhatsApp', 'https://www.whatsapp.com/', '/icons/whatsapp.svg'],
  ['Meta', 'https://about.meta.com/', '/icons/meta.svg'],
  ['Gmail', 'https://mail.google.com/', '/icons/gmail.svg'],
  ['Google Gemini', 'https://gemini.google.com/', '/icons/google-gemini.svg'],
  ['Boid.js', 'https://developer.mozilla.org/docs/Web/JavaScript', '/icons/javascript.svg'],
  ['Google Chat', 'https://chat.google.com/', '/icons/googlechat.svg'],

  ['Nvim', 'https://neovim.io/', '/icons/neovim.svg'],
  ['Linux', 'https://www.linux.org/', '/icons/linux.svg'],
  ['Windows', 'https://www.microsoft.com/windows/', '/icons/windows.svg'],
  ['WSL', 'https://learn.microsoft.com/windows/wsl/', '/icons/wsl.svg'],  
  ['Coca-Cola', 'https://www.coca-cola.com/', '/icons/cocacola.svg'],
  ['Red Bull', 'https://www.redbull.com/', '/icons/redbull.svg'],
  ['Diet Coke', 'https://www.coca-cola.com/', '/icons/diet-coke.svg'],] as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>

        <div
          className={styles.toolMarqueeSection}
          aria-label="Tools, platforms and services used in this portfolio"
        >
          <span className={styles.toolMarqueeLabel}>
            THANKS TO
          </span>

          <div className={styles.toolMarqueeViewport}>
            <div className={styles.toolMarqueeTrack}>
              {[...footerToolLogos, ...footerToolLogos].map(
                ([label, href, logo], index) => (
                  <a
                    key={`${label}-${index}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.toolMarqueeItem}
                    aria-label={label}
                  >
                    <img
                      src={logo}
                      alt=""
                      loading="lazy"
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                  </a>
                ),
              )}
            </div>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.brand}>
            <span className={styles.logo}>ABHIVOCOPEDIA</span>
            <p className={styles.tagline}>{profile.tagline}</p>
          </div>

          <div className={styles.vexr}>
            <Label variant="meta" className={styles.vexrLabel}>VEX-R</Label>
            <ul className={styles.vexrLines} aria-label="Vex-R philosophy">
              {profile.vexr.lines.map((line, index) => (
                <li key={index} className={styles.vexrLine}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.divider} aria-hidden="true"></div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <p>&copy; {currentYear} Abhinandana Bhatta. Built with React, TypeScript & Vite.</p>
          </div>

          <nav className={styles.footerLinks} aria-label="Footer navigation">
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href={profile.social.x} target="_blank" rel="noopener noreferrer" aria-label="X">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href={profile.social.email} aria-label="Email">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
