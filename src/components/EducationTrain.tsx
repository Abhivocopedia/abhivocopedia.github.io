import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { education, EducationStation } from '../data/education'
import { Star, Arrow, Label, Crosshair, Sticker, DotPattern, DecorativeCorner } from './DecorativeMarks'
import styles from './EducationTrain.module.css'

export function EducationTrain() {
  const [activeIndex, setActiveIndex] = useState(3)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [cardWidth, setCardWidth] = useState(320)
  const [gap, setGap] = useState(48)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [scrollStart, setScrollStart] = useState(0)

  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('.stationCard')
    if (cards.length > 0) {
      const firstCard = cards[0] as HTMLElement
      const style = getComputedStyle(container)
      const gapValue = parseInt(style.gap) || 48
      setCardWidth(firstCard.offsetWidth)
      setGap(gapValue)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll('.stationCard')
    const container = containerRef.current

    if (!cards.length) return

    const containerWidth = container.offsetWidth
    const scrollLeft = container.scrollLeft
    const centerPoint = scrollLeft + containerWidth / 2

    let closestIndex = 0
    let minDistance = Infinity

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      const cardCenter = cardRect.left + cardRect.width / 2 - containerRect.left
      const distance = Math.abs(cardCenter - centerPoint)
      if (distance < minDistance) {
        minDistance = distance
        closestIndex = index
      }
    })

    setActiveIndex(closestIndex)
  }, [scrollPosition])

  const scrollToStation = (index: number) => {
    if (!containerRef.current) return
    const scrollLeft = index * (cardWidth + gap)
    containerRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' && index < education.length - 1) {
      e.preventDefault()
      scrollToStation(index + 1)
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      scrollToStation(index - 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      scrollToStation(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      scrollToStation(education.length - 1)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setDragStart(e.clientX)
    setScrollStart(containerRef.current.scrollLeft)
    containerRef.current.style.scrollBehavior = 'auto'
    containerRef.current.style.cursor = 'grabbing'
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    const delta = e.clientX - dragStart
    containerRef.current.scrollLeft = scrollStart - delta
  }

  const handleMouseUp = () => {
    if (!containerRef.current) return
    setIsDragging(false)
    containerRef.current.style.scrollBehavior = 'smooth'
    containerRef.current.style.cursor = 'grab'
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, scrollStart])

  const progress = education.length > 1 ? activeIndex / (education.length - 1) : 0

  return (
    <section id="education" className={styles.section} aria-labelledby="education-title">
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="ink" />
        <DecorativeCorner position="tl" color="mustard" style={{ top: '5%', left: '3%' }} />
        <DecorativeCorner position="tr" color="ink" style={{ top: '5%', right: '3%' }} />
        <DecorativeCorner position="bl" color="ink" style={{ bottom: '5%', left: '3%' }} />
        <DecorativeCorner position="br" color="mustard" style={{ bottom: '5%', right: '3%' }} />
        <Crosshair color="orange" style={{ top: '12%', left: '8%' }} />
        <Crosshair color="mustard" style={{ bottom: '15%', right: '10%' }} />
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Label variant="number">02</Label>
          <h2 id="education-title" className={styles.title}>EDUCATION</h2>
          <div className={styles.divider} aria-hidden="true">
            <Star size="md" color="mustard" />
          </div>
          <p className={styles.subtitle}>Horizontal journey from SSLC to CSE Engineering</p>
        </motion.div>

        <motion.div
          className={styles.trainWrapper}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={styles.trackContainer} ref={containerRef} onScroll={handleScroll} role="region" aria-label="Education timeline" tabIndex={0} onMouseDown={handleMouseDown} style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
            <div className={styles.track} ref={trackRef}>
              <div className={styles.rail} aria-hidden="true">
                <div className={styles.railLine}></div>
                <div className={styles.railTies}>
                  {education.map((_, i) => (
                    <div key={i} className={styles.railTie}></div>
                  ))}
                </div>
              </div>

              <div className={styles.progressTrack} aria-hidden="true">
                <motion.div
                  className={styles.progressFill}
                  style={{ width: `${progress * 100}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>

              <div className={styles.stations} role="list" aria-label="Education stations">
                {education.map((station, index) => (
                  <StationNode
                    key={station.id}
                    station={station}
                    index={index}
                    isActive={index === activeIndex}
                    isCurrent={station.isCurrent}
                    onKeyDown={handleKeyDown}
                    scrollToStation={scrollToStation}
                  />
                ))}
              </div>

              <TrainEngine activeIndex={activeIndex} totalStations={education.length} />
            </div>
          </div>

          <div className={styles.scrollHint} aria-hidden="true">
            <Label variant="meta">DRAG OR SCROLL</Label>
            <Arrow direction="right" size={20} color="mustard" />
          </div>

          <div className={styles.cardsContainer} role="list" aria-label="Education details">
            {education.map((station, index) => (
              <StationCard
                key={station.id}
                station={station}
                isActive={index === activeIndex}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

interface StationNodeProps {
  station: EducationStation
  index: number
  isActive: boolean
  isCurrent?: boolean
  onKeyDown: (e: React.KeyboardEvent, index: number) => void
  scrollToStation: (index: number) => void
}

function StationNode({ station, index, isActive, isCurrent, onKeyDown, scrollToStation }: StationNodeProps) {
  return (
    <div
      className={`${styles.stationNode} ${isActive ? styles.active : ''} ${isCurrent ? styles.current : ''}`}
      role="listitem"
      tabIndex={0}
      aria-current={isActive ? 'true' : undefined}
      aria-label={`${station.label}: ${station.institution}`}
      onClick={() => scrollToStation(index)}
      onKeyDown={(e) => onKeyDown(e, index)}
      style={{ '--card-color': station.color } as React.CSSProperties}
    >
      <div className={styles.nodeOuter} aria-hidden="true">
        <div className={styles.nodeInner}></div>
        <div className={styles.nodeRing} aria-hidden="true"></div>
      </div>
      <span className={styles.nodeLabel}>{station.label}</span>
      {isCurrent && <span className={styles.currentBadge}>CURRENT</span>}
      {isActive && (
        <motion.div
          className={styles.activePulse}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

interface TrainEngineProps {
  activeIndex: number
  totalStations: number
}

function TrainEngine({ activeIndex, totalStations }: TrainEngineProps) {
  const position = totalStations > 1 ? (activeIndex / (totalStations - 1)) * 100 : 0

  return (
    <motion.div
      className={styles.engine}
      style={{ left: `calc(${position}% - 50px)` }}
      animate={{ left: `calc(${position}% - 50px)` }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-hidden="true"
    >
      <div className={styles.engineBody}>
        <div className={styles.engineSmoke} aria-hidden="true">
          <motion.div className={styles.smokePuff} animate={{ y: [-20, -40], opacity: [0.6, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} />
          <motion.div className={styles.smokePuff} animate={{ y: [-20, -40], opacity: [0.6, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }} />
          <motion.div className={styles.smokePuff} animate={{ y: [-20, -40], opacity: [0.6, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }} />
        </div>
        <div className={styles.engineCab}>
          <div className={styles.engineLight} aria-hidden="true"></div>
        </div>
        <div className={styles.engineBoiler}>
          <div className={styles.engineGauge} aria-hidden="true">
            <Star size="sm" color="mustard" />
          </div>
        </div>
        <div className={styles.engineWheels} aria-hidden="true">
          <motion.div className={styles.wheel} animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }} />
          <motion.div className={styles.wheel} animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }} />
          <motion.div className={styles.wheel} animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }} />
        </div>
        <div className={styles.engineCowcatcher} aria-hidden="true"></div>
      </div>
      <div className={styles.engineLabel}>
        <Label variant="number">ENGINE</Label>
      </div>
    </motion.div>
  )
}

interface StationCardProps {
  station: EducationStation
  isActive: boolean
}

function StationCard({ station, isActive }: StationCardProps) {
  return (
    <div style={{ '--card-color': station.color } as React.CSSProperties} className={styles.cardWrapper}>
      <motion.div
        className={`${styles.stationCard} ${isActive ? styles.cardActive : ''}`}
        role="listitem"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isActive ? 1 : 0.5, y: 0, scale: isActive ? 1 : 0.97 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className={styles.cardTop}>
          <div className={styles.cardNumberWrapper}>
            <Label variant="number">{station.label}</Label>
          </div>
          {station.isCurrent && <Sticker variant="mustard" className={styles.currentSticker}>CURRENT</Sticker>}
        </div>
        <h3 className={styles.cardTitle}>{station.institution}</h3>
        <ul className={styles.cardDetails} role="list">
          {station.details.map((detail, i) => (
            <li key={i} className={styles.cardDetail}>{detail}</li>
          ))}
        </ul>
        <div className={styles.cardPeriod}>{station.period}</div>
        <div className={styles.cardAccent} aria-hidden="true"></div>
      </motion.div>
    </div>
  )
}