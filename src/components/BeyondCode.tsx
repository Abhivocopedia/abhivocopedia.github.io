import { profile } from '../data/profile'
import { motion } from 'framer-motion'
import styles from './BeyondCode.module.css'

export function BeyondCode() {
  return (
    <section id="beyond-code" className={styles.section} aria-labelledby="beyond-title">
      <div className={styles.container}>
        <div className={styles.header} data-reveal>
          <span className={styles.sectionNumber}>06</span>
          <h2 id="beyond-title" className={styles.title}>BEYOND CODE</h2>
          <div className={styles.divider} aria-hidden="true"></div>
        </div>

        <motion.div
          className={styles.strip}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          role="list"
          aria-label="Creative pursuits"
        >
          {profile.beyondCode.map((item, index) => (
            <span key={index} className={styles.item} role="listitem">
              {item}
              {index < profile.beyondCode.length - 1 && <span className={styles.separator} aria-hidden="true">·</span>}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}