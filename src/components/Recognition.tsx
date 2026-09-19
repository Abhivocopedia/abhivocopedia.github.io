import { motion } from 'framer-motion'
import { AchievementFlipCard } from './AchievementFlipCard'
import { Star, Label, DotPattern, DecorativeCorner, Crosshair } from './DecorativeMarks'
import styles from './Recognition.module.css'

export function Recognition() {
  return (
    <section id="recognition" className={styles.section} aria-labelledby="recognition-title">
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="mustard" />
        <DecorativeCorner position="tl" color="ink" style={{ top: '6%', left: '4%' }} />
        <DecorativeCorner position="tr" color="mustard" style={{ top: '6%', right: '4%' }} />
        <DecorativeCorner position="bl" color="mustard" style={{ bottom: '6%', left: '4%' }} />
        <DecorativeCorner position="br" color="ink" style={{ bottom: '6%', right: '4%' }} />
        <Crosshair color="orange" style={{ top: '15%', left: '10%' }} />
        <Crosshair color="green" style={{ bottom: '15%', right: '10%' }} />
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Label variant="number">05</Label>
          <h2 id="recognition-title" className={styles.title}>RECOGNITION</h2>
          <div className={styles.divider} aria-hidden="true">
            <Star size="md" color="mustard" />
          </div>
        </motion.div>

        <motion.div
          className={styles.awardWrapper}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <AchievementFlipCard
            event="DSU DEVHACK 2.0"
            title="VULTR BEST BUILD"
            team="TheAPIcalypse"
            project="Weighnix — Smart Home Cylinder Management System"
            contribution="Hardware Development + Cloud Assistance"
            photoBaseName="dsu-devhack-2"
            photoAlt="DSU DevHack 2.0 Vultr Best Build - Team TheAPIcalypse receiving award"
          />
        </motion.div>

        <motion.div
          className={styles.note}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p>
            <Star size="sm" color="mustard" />
            Click or tap the award card to reveal the event photo
            <Star size="sm" color="mustard" />
          </p>
        </motion.div>
      </div>
    </section>
  )
}