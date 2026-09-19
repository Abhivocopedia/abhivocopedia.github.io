import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skills, SkillCategory } from '../data/skills'
import styles from './Skills.module.css'

export function Skills() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleFlip(index)
    }
  }

  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-title">
      <div className={styles.container}>
        <div className={styles.header} data-reveal>
          <span className={styles.sectionNumber}>03</span>
          <h2 id="skills-title" className={styles.title}>SKILLS</h2>
          <div className={styles.divider} aria-hidden="true"></div>
          <p className={styles.subtitle}>Technical stack organized by domain</p>
        </div>

        <div className={styles.grid} role="list" aria-label="Skill categories">
          {skills.map((category, index) => (
            <SkillFlipCard
              key={category.number}
              category={category}
              isFlipped={flippedCards.has(index)}
              onFlip={toggleFlip}
              onKeyDown={handleKeyDown}
              index={index}
            />
          ))}
        </div>

        <div className={styles.legend} data-reveal data-reveal-delay="2" aria-hidden="true">
          <span className={styles.legendLabel}>INTERACTION</span>
          <div className={styles.legendIcons}>
            <span className={styles.legendIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>Hover / Tap to flip</span>
            </span>
            <span className={styles.legendIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              <span>Keyboard: Enter/Space</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

interface SkillFlipCardProps {
  category: SkillCategory
  isFlipped: boolean
  onFlip: (index: number) => void
  onKeyDown: (e: React.KeyboardEvent, index: number) => void
  index: number
}

function SkillFlipCard({ category, isFlipped, onFlip, onKeyDown, index }: SkillFlipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node) && isFlipped) {
        onFlip(index)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFlipped, index, onFlip])

  return (
    <div style={{ '--card-color': category.color } as React.CSSProperties} className={styles.cardWrapper} ref={cardRef}>
      <motion.div
        className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
        role="listitem"
        tabIndex={0}
        aria-label={`${category.category} skills`}
        onClick={() => onFlip(index)}
        onKeyDown={(e) => onKeyDown(e, index)}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
      >
        <div className={styles.cardInner}>
          <div className={styles.cardFace} data-side="front">
            <div className={styles.cardFront}>
              <div className={styles.cardHeader}>
                <span className={styles.cardNumber}>{category.number}</span>
                <span className={styles.cardCategory}>{category.category}</span>
              </div>
              <div className={styles.cardIcon} aria-hidden="true">
                <div className={styles.iconShape}></div>
              </div>
              <span className={styles.flipHint}>FLIP</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isFlipped && (
              <motion.div
                className={styles.cardFace}
                data-side="back"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.cardBack}>
                  <h3 className={styles.backTitle}>{category.category}</h3>
                  <p className={styles.backDescription}>{category.description}</p>
                  <ul className={styles.backTechList} role="list">
                    {category.technologies.map((tech, i) => (
                      <li key={i} className={styles.backTechItem}>
                        <span className={styles.techDot} style={{ backgroundColor: category.color }} aria-hidden="true"></span>
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                  <span className={styles.flipBackHint}>CLICK TO CLOSE</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}