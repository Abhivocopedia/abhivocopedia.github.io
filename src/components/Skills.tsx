import { useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { skills, SkillCategory } from '../data/skills'
import { Star, Label } from './DecorativeMarks'
import styles from './Skills.module.css'

export function Skills() {
  return (
    <section
      id="skills"
      className={styles.section}
      aria-labelledby="skills-title"
    >
      <div className={styles.gridTexture} aria-hidden="true" />
      <div className={styles.curvedOverlay} aria-hidden="true">
        <span className={styles.curveGlow} />
      </div>

      <div className={styles.container}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.55,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Label variant="number" className={styles.sectionNumber}>
            03
          </Label>

          <h2 id="skills-title" className={styles.title}>
            SKILLS
          </h2>

          <div className={styles.divider} aria-hidden="true">
            <span />
            <Star size="md" color="mustard" />
            <span />
          </div>

          <p className={styles.subtitle}>
            TECHNICAL STACK · FLIP TO EXPLORE
          </p>
        </motion.header>

        <div
          className={styles.grid}
          role="list"
          aria-label="Skill categories"
        >
          {skills.map((category, index) => (
            <SkillFlipCard
              key={category.number}
              category={category}
              index={index}
            />
          ))}
        </div>

        <div className={styles.bottomMarker} aria-hidden="true">
          <span>SKILL SYSTEM</span>
          <span className={styles.bottomRule} />
          <span>03 / 06</span>
        </div>
      </div>
    </section>
  )
}

interface SkillFlipCardProps {
  category: SkillCategory
  index: number
}

function SkillFlipCard({
  category,
  index,
}: SkillFlipCardProps) {
  const [flipped, setFlipped] = useState(false)

  const toggle = () => {
    setFlipped((current) => !current)
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }

    if (event.key === 'Escape') {
      setFlipped(false)
    }
  }

  return (
    <motion.div
      className={styles.cardWrapper}
      role="listitem"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.055,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div
        className={`${styles.card} ${
          flipped ? styles.cardFlipped : ''
        }`}
        tabIndex={0}
        role="button"
        aria-label={`${category.category}. Hover or activate to see technologies.`}
        aria-pressed={flipped}
        onClick={(event) => {
          if (event.detail === 0) return
          toggle()
        }}
        onTouchEnd={(event) => {
          event.preventDefault()
          toggle()
        }}
        onKeyDown={handleKeyDown}
      >
        <div
          className={styles.cardInner}
          style={
            {
              '--card-color': category.color,
            } as CSSProperties
          }
        >
          <div className={`${styles.face} ${styles.front}`}>
            <div className={styles.frontTop}>
              <span className={styles.cardNumber}>
                {category.number}
              </span>

              <span className={styles.frontMark}>
                ↗
              </span>
            </div>

            <div className={styles.frontCenter}>
              <h3>{category.category}</h3>
            </div>

            <div className={styles.flipPrompt}>
              <span>↻</span>
              <span>FLIP FOR DETAILS</span>
            </div>
          </div>

          <div className={`${styles.face} ${styles.back}`}>
            <div className={styles.backTop}>
              <span className={styles.backNumber}>
                {category.number}
              </span>

              <span className={styles.backLabel}>
                {category.category}
              </span>
            </div>

            <div className={styles.backContent}>
              <h3>{category.category}</h3>

              <p>{category.description}</p>

              <ul className={styles.techList}>
                {category.technologies.map(
                  (technology, technologyIndex) => (
                    <li key={`${technology}-${technologyIndex}`}>
                      <span
                        className={styles.techDot}
                        style={{
                          backgroundColor:
                            category.color,
                        }}
                        aria-hidden="true"
                      />
                      {technology}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className={styles.backFooter}>
              <span>HOVER TO RETURN</span>
              <span className={styles.backArrow}>
                ↻
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
