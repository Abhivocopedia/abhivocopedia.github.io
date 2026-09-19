import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { Star, Label, DotPattern, DecorativeCorner, Crosshair, Sticker } from './DecorativeMarks'
import styles from './BeyondCode.module.css'

export function BeyondCode() {
  return (
    <section id="beyond-code" className={styles.section} aria-labelledby="beyond-title">
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="ink" />
        <DecorativeCorner position="tl" color="mustard" style={{ top: '10%', left: '5%' }} />
        <DecorativeCorner position="tr" color="ink" style={{ top: '10%', right: '5%' }} />
        <DecorativeCorner position="bl" color="ink" style={{ bottom: '10%', left: '5%' }} />
        <DecorativeCorner position="br" color="mustard" style={{ bottom: '10%', right: '5%' }} />
        <Crosshair color="teal" style={{ top: '20%', right: '12%' }} />
        <Crosshair color="orange" style={{ bottom: '20%', left: '12%' }} />
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
          <div className={styles.divider} aria-hidden="true">
            <Star size="md" color="mustard" />
          </div>
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
              {profile.vexr.lines.map((line, index) => (
                <span key={index} className={styles.marqueeItem}>
                  <Star size="lg" color="mustard" className={styles.marqueeStar} />
                  <span className={styles.marqueeText}>{line}</span>
                  <Star size="lg" color="mustard" className={styles.marqueeStar} />
                </span>
              ))}
              <span className={styles.marqueeSeparator} aria-hidden="true">
                <Star size="md" color="orange" />
              </span>
              {profile.beyondCode.map((item, index) => (
                <span key={index} className={styles.marqueeItem}>
                  <Sticker variant="ink" className={styles.marqueeSticker}>{item}</Sticker>
                </span>
              ))}
              <span className={styles.marqueeSeparator} aria-hidden="true">
                <Star size="md" color="orange" />
              </span>
              {profile.vexr.lines.map((line, index) => (
                <span key={`repeat-${index}`} className={styles.marqueeItem}>
                  <Star size="lg" color="mustard" className={styles.marqueeStar} />
                  <span className={styles.marqueeText}>{line}</span>
                  <Star size="lg" color="mustard" className={styles.marqueeStar} />
                </span>
              ))}
              <span className={styles.marqueeSeparator} aria-hidden="true">
                <Star size="md" color="orange" />
              </span>
              {profile.beyondCode.map((item, index) => (
                <span key={`repeat-${item}-${index}`} className={styles.marqueeItem}>
                  <Sticker variant="ink" className={styles.marqueeSticker}>{item}</Sticker>
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
          <div className={styles.posterAccents} aria-hidden="true">
            <Star size="lg" color="mustard" style={{ top: '10%', left: '5%' }} />
            <Star size="sm" color="orange" style={{ top: '20%', right: '8%' }} />
            <Star size="md" color="teal" style={{ bottom: '15%', left: '8%' }} />
            <Star size="sm" color="green" style={{ bottom: '10%', right: '5%' }} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}