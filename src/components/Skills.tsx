import { useState } from 'react'
import { motion } from 'framer-motion'
import { skills, SkillCategory } from '../data/skills'
import {
  Star,
  Arrow,
  Label,
  Crosshair,
  DotPattern,
  DecorativeCorner,
} from './DecorativeMarks'
import styles from './Skills.module.css'

export function Skills() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(
    new Set(),
  )
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev)

      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }

      return next
    })
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleFlip(index)
    }
  }

  const handleMouseEnter = (index: number) => {
    setHoveredCard(index)
  }

  const handleMouseLeave = () => {
    setHoveredCard(null)
  }

  return (
    <section
      id="skills"
      className={styles.section}
      aria-labelledby="skills-title"
    >
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="mustard" />
        <DecorativeCorner
          position="tl"
          color="ink"
          style={{ top: '8%', left: '4%' }}
        />
        <DecorativeCorner
          position="tr"
          color="mustard"
          style={{ top: '8%', right: '4%' }}
        />
        <DecorativeCorner
          position="bl"
          color="mustard"
          style={{ bottom: '8%', left: '4%' }}
        />
        <DecorativeCorner
          position="br"
          color="ink"
          style={{ bottom: '8%', right: '4%' }}
        />
        <Crosshair
          color="teal"
          style={{ top: '15%', left: '10%' }}
        />
        <Crosshair
          color="orange"
          style={{ bottom: '15%', right: '10%' }}
        />
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Label variant="number">03</Label>
          <h2 id="skills-title" className={styles.title}>
            SKILLS
          </h2>

          <div className={styles.divider} aria-hidden="true">
            <Star size="md" color="mustard" />
          </div>

          <p className={styles.subtitle}>
            Technical stack organized by domain — flip to explore
          </p>
        </motion.div>

        <div
          className={styles.grid}
          role="list"
          aria-label="Skill categories"
        >
          {skills.map((category, index) => (
            <SkillFlipCard
              key={category.number}
              category={category}
              isFlipped={flippedCards.has(index)}
              isHovered={hoveredCard === index}
              onFlip={toggleFlip}
              onKeyDown={handleKeyDown}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              index={index}
            />
          ))}
        </div>

        <motion.div
          className={styles.legend}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          aria-hidden="true"
        >
          <Label variant="meta">INTERACTION</Label>

          <div className={styles.legendIcons}>
            <span className={styles.legendIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>Hover / Tap to flip</span>
            </span>

            <span className={styles.legendIcon}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
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
  isHovered: boolean
  onFlip: (index: number) => void
  onKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number,
  ) => void
  onMouseEnter: (index: number) => void
  onMouseLeave: () => void
  index: number
}

function SkillFlipCard({
  category,
  isFlipped,
  isHovered,
  onFlip,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  index,
}: SkillFlipCardProps) {
  const visuallyFlipped = isFlipped || isHovered

  return (
    <div
      style={
        {
          '--card-color': category.color,
        } as React.CSSProperties
      }
      className={styles.cardWrapper}
    >
      <div
        className={`${styles.card} ${
          visuallyFlipped ? styles.flipped : ''
        }`}
        role="listitem"
        tabIndex={0}
        aria-label={`${category.category} skills`}
        aria-pressed={visuallyFlipped}
        onClick={() => onFlip(index)}
        onKeyDown={(e) => onKeyDown(e, index)}
        onMouseEnter={() => onMouseEnter(index)}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={styles.cardInner}
          style={{
            transform: visuallyFlipped
              ? 'rotateY(180deg)'
              : 'rotateY(0deg)',
          }}
        >
          {/* FRONT */}
          <div className={styles.cardFace} data-side="front">
            <div className={styles.cardFront}>
              <div className={styles.cardHeader}>
                <Label variant="number">{category.number}</Label>
                <span className={styles.cardCategory}>
                  {category.category}
                </span>
              </div>

              <div className={styles.cardIcon} aria-hidden="true">
                <div className={styles.iconShape}>
                  <Star
                    size="lg"
                    color="warm-white"
                    style={{
                      filter:
                        'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                    }}
                  />
                </div>
              </div>

              <div className={styles.flipHint}>
                <Arrow
                  direction="right"
                  size={14}
                  color="warm-white"
                />
                <span>FLIP</span>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className={styles.cardFace}
            data-side="back"
            style={{
              transform: 'rotateY(180deg)',
            }}
          >
            <div className={styles.cardBack}>
              <h3 className={styles.backTitle}>
                {category.category}
              </h3>

              <p className={styles.backDescription}>
                {category.description}
              </p>

              <ul
                className={styles.backTechList}
                role="list"
              >
                {category.technologies.map((tech, i) => (
                  <li
                    key={`${category.number}-${tech}-${i}`}
                    className={styles.backTechItem}
                  >
                    <span
                      className={styles.techDot}
                      style={{
                        backgroundColor: category.color,
                      }}
                      aria-hidden="true"
                    />
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
