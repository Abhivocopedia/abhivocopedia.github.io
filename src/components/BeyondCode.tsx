import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { Label, DotPattern, Sticker } from './DecorativeMarks'
import styles from './BeyondCode.module.css'

export function BeyondCode() {
  const marqueeItems = [
    ...profile.vexr.lines,
    ...profile.beyondCode,
    ...profile.vexr.lines,
    ...profile.beyondCode,
  ]

  return (
    <section id="beyond-code" className={styles.section} aria-labelledby="beyond-title">
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="ink" />
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Label variant="number">06</Label>
          <h2 id="beyond-title" className={styles.title}>BEYOND CODE</h2>
          <div className={styles.divider} aria-hidden="true"></div>
        </motion.div>

        <motion.div
          className={styles.marqueeWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.marqueeTrack} aria-hidden="true">
            <div className={styles.marqueeContent}>
              {marqueeItems.map((item, index) => (
                <span key={index} className={styles.marqueeItem}>
                  {profile.vexr.lines.includes(item) ? (
                    <span className={styles.marqueeText}>{item}</span>
                  ) : (
                    <Sticker variant="ink" className={styles.marqueeSticker}>{item}</Sticker>
                  )}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.vexrPoster}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.posterContent}>
            <div className={styles.posterTop}>
              <Label variant="meta" style={{ color: 'var(--mustard)' }}>VEX-R</Label>
              <div className={styles.posterLines}>
                {profile.vexr.lines.map((line, index) => (
                  <motion.div
                    key={index}
                    className={styles.posterLine}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className={styles.posterBottom}>
              <div className={styles.posterTags}>
                {profile.beyondCode.map((item, index) => (
                  <Sticker key={item} variant={index % 4 === 0 ? 'mustard' : index % 4 === 1 ? 'green' : index % 4 === 2 ? 'teal' : 'orange'} className={styles.posterTag}>
                    {item}
                  </Sticker>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}