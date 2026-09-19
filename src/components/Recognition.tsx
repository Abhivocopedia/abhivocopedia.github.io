import { motion } from 'framer-motion'
import styles from './Recognition.module.css'

export function Recognition() {
  const award = {
    event: 'DSU DEVHACK 2.0',
    title: 'VULTR BEST BUILD',
    team: 'TheAPIcalypse',
    project: 'Weighnix — Smart Home Cylinder Management System',
    contribution: 'Hardware Development + Cloud Assistance'
  }

  return (
    <section id="recognition" className={styles.section} aria-labelledby="recognition-title">
      <div className={styles.container}>
        <div className={styles.header} data-reveal>
          <span className={styles.sectionNumber}>05</span>
          <h2 id="recognition-title" className={styles.title}>RECOGNITION</h2>
          <div className={styles.divider} aria-hidden="true"></div>
        </div>

        <motion.div
          className={styles.awardCard}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          role="article"
          aria-labelledby="award-event"
        >
          <div className={styles.awardBadge} aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>

          <div className={styles.awardContent}>
            <h3 id="award-event" className={styles.awardEvent}>{award.event}</h3>
            <h4 className={styles.awardTitle}>{award.title}</h4>

            <div className={styles.awardDetails}>
              <div className={styles.awardDetail}>
                <span className={styles.detailLabel}>TEAM</span>
                <span className={styles.detailValue}>{award.team}</span>
              </div>
              <div className={styles.awardDetail}>
                <span className={styles.detailLabel}>PROJECT</span>
                <span className={styles.detailValue}>{award.project}</span>
              </div>
              <div className={styles.awardDetail}>
                <span className={styles.detailLabel}>CONTRIBUTION</span>
                <span className={styles.detailValue}>{award.contribution}</span>
              </div>
            </div>
          </div>

          <div className={styles.awardRibbon} aria-hidden="true">
            <span>WINNER</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}