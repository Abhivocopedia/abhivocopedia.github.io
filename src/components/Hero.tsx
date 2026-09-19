import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { Star, Arrow, DotPattern, Sticker, Label } from './DecorativeMarks'
import styles from './Hero.module.css'

export function Hero() {
  const hasProfilePhoto = profile.profilePhoto && profile.profilePhoto.trim() !== ''

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="ink" />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <motion.div
            className={styles.badgeRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className={styles.badge}>
              <Sticker variant="mustard">ABHIVOCOPEDIA</Sticker>
            </span>
            <span className={styles.badge}>
              <Sticker variant="green">CSE STUDENT</Sticker>
            </span>
            <span className={styles.badge}>
              <Sticker variant="teal">FULL-STACK</Sticker>
            </span>
            <span className={styles.badge}>
              <Sticker variant="orange">BUILDER</Sticker>
            </span>
          </motion.div>

          <motion.h1
            id="hero-title"
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className={styles.nameLine}>
              <span className={styles.name}>ABHINANDANA</span>
              <Star size="md" color="mustard" className={styles.titleStar} />
              <span className={styles.name}>BHATTA</span>
            </span>
            <span className={styles.dividerLine} aria-hidden="true">
              <Label variant="meta">ABHIVOCOPEDIA</Label>
            </span>
          </motion.h1>

          <motion.p
            className={styles.statement}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {profile.heroStatement}
          </motion.p>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            className={styles.meta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>PROGRAM</span>
              <span className={styles.metaValue}>CSE / 3RD SEM</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>FOCUS</span>
              <span className={styles.metaValue}>SOFTWARE · AI · SYSTEMS · CLOUD</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>LOCATION</span>
              <span className={styles.metaValue}>KARNATAKA, INDIA</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>STATUS</span>
              <span className={styles.metaValue}>
                <span className={styles.statusDot} aria-hidden="true"></span>
                BUILDING
              </span>
            </div>
          </motion.div>

          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <a href="#projects" className={`btn btn-primary ${styles.ctaPrimary}`}>
              Explore Projects
              <Arrow direction="right" size={18} color="warm-white" />
            </a>
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className={`btn btn-secondary ${styles.ctaSecondary}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="#contact" className={`btn btn-accent ${styles.ctaAccent}`}>
              Get In Touch
              <Arrow direction="right" size={18} color="ink" />
            </a>
            <a href="/resume" className={`btn btn-ghost ${styles.ctaGhost}`}>
              View Resume
              <Arrow direction="right" size={18} color="ink" />
            </a>
          </motion.div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <motion.div
            className={styles.visualWrapper}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {hasProfilePhoto ? (
              <div className={styles.profilePhotoCard}>
                <img
                  src={profile.profilePhoto}
                  alt={`${profile.name} - ${profile.identity}`}
                  className={styles.profilePhoto}
                  loading="eager"
                />
                <div className={styles.photoOverlay} />
              </div>
            ) : (
              <div className={styles.visualCard}>
                <div className={styles.visualHeader}>
                  <span className={styles.visualDot} style={{ background: 'var(--orange)' }} />
                  <span className={styles.visualDot} style={{ background: 'var(--mustard)' }} />
                  <span className={styles.visualDot} style={{ background: 'var(--deep-green)' }} />
                  <span className={styles.visualTitle}>SYSTEM_CONFIG.tsx</span>
                </div>
                <div className={styles.visualContent}>
                  <pre className={styles.codeBlock}><code>{`const builder = {
  identity: "Abhivocopedia",
  role: "CSE Student | Full-Stack Dev",
  stack: {
    languages: ["Python", "TypeScript", "Java", "JS"],
    frontend: ["React", "Tailwind", "Framer Motion"],
    backend: ["Node.js", "FastAPI", "Django", "Express"],
    data: ["MongoDB", "PostgreSQL", "Supabase"],
    infra: ["Docker", "AWS", "Nginx", "PM2"],
    ai: ["PyTorch", "OpenCV", "ML Pipelines"]
  },
  philosophy: [
    "MAKE SOMETHING",
    "MAKE IT MATTER", 
    "MAKE MONEY"
  ],
  currentlyBuilding: true,
  openTo: ["Collaborations", "Opportunities", "Conversations"]
};

export default builder;`}</code></pre>
                </div>
                <div className={styles.visualFooter}>
                  <div className={styles.visualTags}>
                    <Sticker variant="mustard">EXPERIMENTAL</Sticker>
                    <Sticker variant="green">OPEN SOURCE</Sticker>
                    <Sticker variant="teal">PRODUCTION READY</Sticker>
                  </div>
                  <div className={styles.visualStats}>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>5</span>
                      <span className={styles.statLabel}>PROJECTS</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>7</span>
                      <span className={styles.statLabel}>SKILL DOMAINS</span>
                    </div>
                    <div className={styles.stat}>
                      <span className={styles.statValue}>1</span>
                      <span className={styles.statLabel}>AWARD</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        aria-hidden="true"
      >
        <Label variant="meta">SCROLL</Label>
        <Arrow direction="down" size={24} color="ink" className={styles.scrollArrow} />
      </motion.div>
    </section>
  )
}