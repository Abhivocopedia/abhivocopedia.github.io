import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { Star, OrganicShape, DotPattern, DecorativeCorner, Crosshair, Sticker, Label, Arrow } from './DecorativeMarks'
import styles from './About.module.css'

export function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="ink" />
        <OrganicShape variant={1} style={{ top: '8%', right: '5%' }} />
        <OrganicShape variant={2} style={{ bottom: '12%', left: '3%' }} />
        <DecorativeCorner position="tl" color="mustard" style={{ top: '10%', left: '6%' }} />
        <DecorativeCorner position="br" color="ink" style={{ bottom: '10%', right: '6%' }} />
        <Crosshair color="green" style={{ top: '15%', right: '12%' }} />
        <Crosshair color="mustard" style={{ bottom: '20%', left: '15%' }} />
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Label variant="number">01</Label>
          <h2 id="about-title" className={styles.title}>ABOUT</h2>
          <div className={styles.divider} aria-hidden="true">
            <Star size="md" color="mustard" />
          </div>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            className={styles.statement}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className={styles.bioText}>{profile.bio}</p>

            <div className={styles.themes} role="list" aria-label="Focus areas">
              {profile.themes.map((theme, index) => (
                <motion.span
                  key={index}
                  className={styles.themeChip}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.04 }}
                  role="listitem"
                >
                  {theme}
                </motion.span>
              ))}
            </div>

            <div className={styles.philosophy}>
              <span className={styles.philosophyLabel}>PHILOSOPHY</span>
              <ul className={styles.philosophyLines} role="list">
                {profile.vexr.lines.map((line, index) => (
                  <li key={index} className={styles.philosophyLine}>
                    <Star size="sm" color="mustard" className={styles.philosophyStar} />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className={styles.panelHeader}>
              <h3 className={styles.panelTitle}>CURRENT STATUS</h3>
              <Arrow direction="right" size={20} color="mustard" />
            </div>

            <dl className={styles.statusList}>
              {Object.entries(profile.currentStatus).map(([key, value]) => (
                <div key={key} className={styles.statusItem}>
                  <dt className={styles.statusTerm}>{key.toUpperCase()}</dt>
                  <dd className={styles.statusValue}>{value}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.panelFooter}>
              <div className={styles.focusBlock}>
                <span className={styles.focusBlockLabel}>FOCUS</span>
                <div className={styles.focusBlockTags}>
                  <Sticker variant="green">SOFTWARE</Sticker>
                  <Sticker variant="teal">AI / CV</Sticker>
                  <Sticker variant="orange">SYSTEMS</Sticker>
                  <Sticker variant="mustard">CLOUD</Sticker>
                </div>
              </div>
              <div className={styles.focusBlock}>
                <span className={styles.focusBlockLabel}>APPROACH</span>
                <div className={styles.focusBlockTags}>
                  <Sticker variant="ink">EXPERIMENT</Sticker>
                  <Sticker variant="coral">BUILD FAST</Sticker>
                  <Sticker variant="green">SHIP OFTEN</Sticker>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className={styles.ctaBlock}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.ctaContent}>
            <div className={styles.ctaText}>
              <Label variant="meta">READY TO BUILD</Label>
              <h3 className={styles.ctaTitle}>Let's create something that matters</h3>
              <p className={styles.ctaDesc}>Open to collaborations, freelance projects, and conversations about software, AI, and systems engineering.</p>
            </div>
            <div className={styles.ctaActions}>
              <a href="#projects" className={`btn btn-primary ${styles.ctaBtn}`}>
                View Projects
                <Arrow direction="right" size={18} color="warm-white" />
              </a>
              <a href="#contact" className={`btn btn-accent ${styles.ctaBtn}`}>
                Get In Touch
                <Arrow direction="right" size={18} color="ink" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}