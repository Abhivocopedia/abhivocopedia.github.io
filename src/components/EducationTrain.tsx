import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { education, EducationStation } from '../data/education'
import styles from './EducationTrain.module.css'

export function EducationTrain() {
  const [activeIndex, setActiveIndex] = useState(3)
  const [scrollPosition, setScrollPosition] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(300)
  const [gap, setGap] = useState(48)

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('.station-card')
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
    if (!trackRef.current) return

    const cards = containerRef.current?.querySelectorAll('.station-card')

    if (!containerRef.current || !cards) return

    const containerWidth = containerRef.current.offsetWidth
    const scrollLeft = containerRef.current.scrollLeft
    const centerPoint = scrollLeft + containerWidth / 2

    let closestIndex = 0
    let minDistance = Infinity

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect()
      const containerRect = containerRef.current!.getBoundingClientRect()
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

  return (
    <section id="education" className={styles.section} aria-labelledby="education-title">
      <div className={styles.container}>
        <div className={styles.header} data-reveal>
          <span className={styles.sectionNumber}>02</span>
          <h2 id="education-title" className={styles.title}>EDUCATION</h2>
          <div className={styles.divider} aria-hidden="true"></div>
          <p className={styles.subtitle}>Horizontal journey from SSLC to CSE Engineering</p>
        </div>

        <div className={styles.trainWrapper} data-reveal data-reveal-delay="1">
          <div className={styles.trackContainer} ref={containerRef} onScroll={handleScroll} role="region" aria-label="Education timeline" tabIndex={0}>
            <div className={styles.track} ref={trackRef}>
              <div className={styles.rail} aria-hidden="true">
                <div className={styles.railLine}></div>
                <div className={styles.railTies} aria-hidden="true">
                  {education.map((_, i) => <div key={i} className={styles.railTie}></div>)}
                </div>
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

          <div className={styles.cardsContainer} role="list" aria-label="Education details">
            {education.map((station, index) => (
              <StationCard
                key={station.id}
                station={station}
                index={index}
                isActive={index === activeIndex}
              />
            ))}
          </div>

          <div className={styles.scrollHint} aria-hidden="true">
            <span>SCROLL OR DRAG →</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
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
    >
      <div className={styles.nodeOuter} aria-hidden="true">
        <div className={styles.nodeInner}></div>
      </div>
      <span className={styles.nodeLabel}>{station.label}</span>
      {isCurrent && <span className={styles.currentBadge}>CURRENT</span>}
    </div>
  )
}

interface TrainEngineProps {
  activeIndex: number
  totalStations: number
}

function TrainEngine({ activeIndex, totalStations }: TrainEngineProps) {
  const position = (activeIndex / Math.max(totalStations - 1, 1)) * 100

  return (
    <motion.div
      className={styles.engine}
      style={{ left: `calc(${position}% - 40px)` }}
      animate={{ left: `calc(${position}% - 40px)` }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      aria-hidden="true"
    >
      <div className={styles.engineBody}>
        <div className={styles.engineCab}></div>
        <div className={styles.engineBoiler}></div>
        <div className={styles.engineWheels} aria-hidden="true">
          <div className={styles.wheel}></div>
          <div className={styles.wheel}></div>
          <div className={styles.wheel}></div>
        </div>
        <div className={styles.engineSmoke} aria-hidden="true">
          <div className={styles.smokePuff}></div>
          <div className={styles.smokePuff}></div>
          <div className={styles.smokePuff}></div>
        </div>
      </div>
    </motion.div>
  )
}

interface StationCardProps {
  station: EducationStation
  index: number
  isActive: boolean
}

function StationCard({ station, index: _index, isActive }: StationCardProps) {
  return (
    <div style={{ '--card-color': station.color } as React.CSSProperties} className={styles.cardWrapper}>
      <motion.div
        className={`${styles.stationCard} ${isActive ? styles.cardActive : ''}`}
        role="listitem"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isActive ? 1 : 0.4, y: 0, scale: isActive ? 1 : 0.98 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className={styles.cardNumber}>{station.label}</div>
        <h3 className={styles.cardTitle}>{station.institution}</h3>
        <ul className={styles.cardDetails} role="list">
          {station.details.map((detail, i) => (
            <li key={i} className={styles.cardDetail}>{detail}</li>
          ))}
        </ul>
        <div className={styles.cardPeriod}>{station.period}</div>
        {isActive && <div className={styles.activeIndicator} aria-hidden="true"></div>}
      </motion.div>
    </div>
  )
}