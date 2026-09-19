import { profile } from '../data/profile'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.bgDecoration} aria-hidden="true">
        <div className={`${styles.blob} ${styles.blob1}`}></div>
        <div className={`${styles.blob} ${styles.blob2}`}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeText}>ABHIVOCOPEDIA</span>
          </div>

          <h1 id="hero-title" className={styles.title}>
            <span className={styles.name}>ABHINANDANA BHATTA</span>
            <span className={styles.divider} aria-hidden="true">/</span>
            <span className={styles.identity}>ABHIVOCOPEDIA</span>
          </h1>

          <p className={styles.statement}>{profile.heroStatement}</p>

          <p className={styles.subtitle}>{profile.tagline}</p>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>PROGRAM</span>
              <span className={styles.metaValue}>CSE / 3RD SEM</span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>FOCUS</span>
              <span className={styles.metaValue}>SOFTWARE / AI</span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>LOCATION</span>
              <span className={styles.metaValue}>KARNATAKA, INDIA</span>
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>STATUS</span>
              <span className={styles.metaValue}>BUILDING</span>
            </span>
          </div>

          <div className={styles.cta}>
            <a href="#projects" className={`btn btn-primary ${styles.ctaPrimary}`}>
              Explore Projects
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className={`btn btn-secondary ${styles.ctaSecondary}`}>
              GitHub
            </a>
            <a href="#contact" className={`btn btn-ghost ${styles.ctaGhost}`}>
              Contact
            </a>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.visualCard}>
            <div className={styles.visualHeader}>
              <span className={styles.visualDot}></span>
              <span className={styles.visualDot}></span>
              <span className={styles.visualDot}></span>
            </div>
            <div className={styles.visualContent}>
              <pre className={styles.codeBlock}><code>{`const builder = {
  name: "Abhinandana Bhatta",
  identity: "Abhivocopedia",
  focus: ["Software", "AI", "Systems", "Cloud"],
  philosophy: "MAKE SOMETHING,
MAKE IT MATTER,
MAKE MONEY",
  currentlyBuilding: true
};`}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollIndicator} aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        <span>SCROLL</span>
      </div>
    </section>
  )
}