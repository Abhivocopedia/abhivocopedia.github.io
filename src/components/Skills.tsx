import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { skills, SkillCategory } from '../data/skills'
import { Star, Arrow, Label, Crosshair, DotPattern, DecorativeCorner } from './DecorativeMarks'
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
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="mustard" />
        <DecorativeCorner position="tl" color="ink" style={{ top: '8%', left: '4%' }} />
        <DecorativeCorner position="tr" color="mustard" style={{ top: '8%', right: '4%' }} />
        <DecorativeCorner position="bl" color="mustard" style={{ bottom: '8%', left: '4%' }} />
        <DecorativeCorner position="br" color="ink" style={{ bottom: '8%', right: '4%' }} />
        <Crosshair color="teal" style={{ top: '15%', left: '10%' }} />
        <Crosshair color="orange" style={{ bottom: '15%', right: '10%' }} />
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Label variant="number">03</Label>
          <h2 id="skills-title" className={styles.title}>SKILLS</h2>
          <div className={styles.divider} aria-hidden="true">
            <Star size="md" color="mustard" />
          </div>
          <p className={styles.subtitle}>Technical stack organized by domain — flip to explore</p>
        </motion.div>

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

        <motion.div
          className={styles.legend}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          aria-hidden="true"
        >
          <Label variant="meta">INTERACTION</Label>
          <div className={styles.legendIcons}>
            <span className={styles.legendIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>Hover / Tap to flip</span>
            </span>
            <span className={styles.legendIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              <span>Keyboard: Enter / Space</span>
            </span>
          </div>
        </motion.div>
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
        style={{ perspective: '1000px' }}
      >
        <div className={styles.cardInner}>
          <div className={styles.cardFace} data-side="front">
            <div className={styles.cardFront}>
              <div className={styles.cardHeader}>
                <Label variant="number">{category.number}</Label>
                <span className={styles.cardCategory}>{category.category}</span>
              </div>
              <div className={styles.cardIcon} aria-hidden="true">
                <div className={styles.iconShape}>
                  <Star size="lg" color="warm-white" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
                </div>
              </div>
              <div className={styles.flipHint}>
                <Arrow direction="right" size={14} color="warm-white" />
                <span>FLIP</span>
              </div>
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
                  <div className={styles.backHeader}>
                    <h3 className={styles.backTitle}>{category.category}</h3>
                    <button
                      className={styles.closeBtn}
                      onClick={(e) => { e.stopPropagation(); onFlip(index); }}
                      aria-label="Close card"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                  <p className={styles.backDescription}>{category.description}</p>
                  <ul className={styles.backTechList} role="list">
                    {category.technologies.map((tech, i) => (
                      <li key={i} className={styles.backTechItem}>
                        <span className={styles.techDot} style={{ backgroundColor: category.color }} aria-hidden="true"></span>
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}