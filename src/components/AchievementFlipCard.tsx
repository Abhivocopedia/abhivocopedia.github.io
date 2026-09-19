import { useState } from 'react'
import { Star, Label } from './DecorativeMarks'
import styles from './AchievementFlipCard.module.css'
import { soundFX } from '../lib/SoundFX'

interface AchievementFlipCardProps {
  event: string
  title: string
  team: string
  project: string
  contribution: string
  photoBaseName?: string
  photoAlt?: string
}

const IMAGE_EXTENSIONS = [
  '.jpeg',
  '.jpg',
  '.webp',
  '.png',
  '.avif',
  '.gif',
] as const

function getImagePaths(basePath: string): string[] {
  const withoutExt = basePath.replace(/\.[^/.]+$/, '')
  return IMAGE_EXTENSIONS.map((ext) => `${withoutExt}${ext}`)
}

export function AchievementFlipCard({
  event,
  title,
  team,
  project,
  contribution,
  photoBaseName = 'dsu-devhack-2',
  photoAlt = 'DSU DevHack 2.0 Vultr Best Build - Team TheAPIcalypse',
}: AchievementFlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [allFailed, setAllFailed] = useState(false)

  const imagePaths = getImagePaths(`/images/achievements/${photoBaseName}`)
  const currentImagePath = imagePaths[currentImageIndex]
  const visuallyFlipped = isFlipped || isHovered

  const toggleFlip = () => {
    soundFX.flip()

    setIsFlipped((prev) => !prev)
    if (!isFlipped) {
      setCurrentImageIndex(0)
      setAllFailed(false)
    }
  }

  const handleImageError = () => {
    if (currentImageIndex < imagePaths.length - 1) {
      setCurrentImageIndex((prev) => prev + 1)
    } else {
      setAllFailed(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleFlip()
    }
  }

  return (
    <div
      className={styles.cardWrapper}
      style={{ '--award-color': '#E0AE3E' } as React.CSSProperties}
    >
      <div
        className={`${styles.card} ${visuallyFlipped ? styles.flipped : ''}`}
        role="button"
        tabIndex={0}
        aria-label={`${event} - ${title} award details`}
        aria-pressed={visuallyFlipped}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={styles.cardInner}
          style={{
            transform: visuallyFlipped
              ? 'rotateY(180deg)'
              : 'rotateY(0deg)',
          }}
        >
          <div className={styles.cardFace} data-side="front">
            <div className={styles.cardFront}>
              <div className={styles.frontTop}>
                <div className={styles.awardBadge}>
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>

                <div className={styles.awardRibbon}>
                  <span>WINNER</span>
                </div>
              </div>

              <div className={styles.awardContent}>
                <Label variant="meta" className={styles.awardEvent}>
                  {event}
                </Label>
                <h3 className={styles.awardTitle}>{title}</h3>
              </div>

              <div className={styles.awardDetails}>
                <div className={styles.awardDetail}>
                  <Label variant="meta">TEAM</Label>
                  <span className={styles.detailValue}>{team}</span>
                </div>

                <div className={styles.awardDetail}>
                  <Label variant="meta">PROJECT</Label>
                  <span className={styles.detailValue}>{project}</span>
                </div>

                <div className={styles.awardDetail}>
                  <Label variant="meta">ROLE</Label>
                  <span className={styles.detailValue}>{contribution}</span>
                </div>
              </div>

              <div className={styles.flipPrompt}>
                <Star size="sm" color="mustard" />
                <span>HOVER TO REVEAL PHOTO</span>
                <Star size="sm" color="mustard" />
              </div>
            </div>
          </div>

          <div className={styles.cardFace} data-side="back">
            <div className={styles.cardBack}>
              <div className={styles.backImageWrapper}>
                {!allFailed ? (
                  <img
                    src={currentImagePath}
                    alt={photoAlt}
                    className={styles.backImage}
                    onError={handleImageError}
                    loading="eager"
                  />
                ) : (
                  <div className={styles.photoPlaceholder}>
                    <div className={styles.placeholderContent}>
                      <p>ACHIEVEMENT PHOTO</p>
                      <span>COMING SOON</span>
                    </div>
                  </div>
                )}

                <div className={styles.imageOverlay}>
                  <div className={styles.overlayContent}>
                    <Label
                      variant="meta"
                      style={{ color: 'var(--mustard)' }}
                    >
                      {event}
                    </Label>

                    <h4
                      style={{
                        color: 'var(--warm-white)',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                        fontWeight: 700,
                        marginTop: 'var(--space-sm)',
                        marginBottom: 'var(--space-xs)',
                      }}
                    >
                      {title}
                    </h4>

                    <p
                      style={{
                        color: 'rgba(255,253,246,0.8)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {team}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

