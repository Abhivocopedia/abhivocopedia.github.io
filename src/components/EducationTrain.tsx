import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { education, EducationStation } from '../data/education'
import { Label, DotPattern, Arrow } from './DecorativeMarks'
import styles from './EducationTrain.module.css'

export function EducationTrain() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!sectionRef.current || !stickyRef.current) return

    const sectionRect = sectionRef.current.getBoundingClientRect()
    const stickyRect = stickyRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight

    const sectionTop = sectionRect.top
    const sectionBottom = sectionRect.bottom
    const stickyHeight = stickyRect.height

    const navbarOffset = 88

    if (sectionBottom <= navbarOffset || sectionTop >= viewportHeight) {
      return
    }

    const triggerStart = navbarOffset
    const triggerEnd = sectionBottom - stickyHeight - navbarOffset

    const scrollProgress = Math.max(0, Math.min(1, (triggerStart - sectionTop) / (triggerEnd - triggerStart)))

    setProgress(scrollProgress)

    const maxIndex = education.length - 1
    const activeStationIndex = Math.round(scrollProgress * maxIndex)
    setActiveIndex(Math.min(activeStationIndex, maxIndex))
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const totalWidth = education.length > 1 ? (education.length - 1) * 400 : 400
  const translateX = -progress * totalWidth

  return (
    <section id="education" ref={sectionRef} className={styles.section} aria-labelledby="education-title">
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="ink" />
      </div>

      <div className={styles.sectionInner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Label variant="number">02</Label>
          <h2 id="education-title" className={styles.title}>EDUCATION</h2>
          <div className={styles.divider} aria-hidden="true"></div>
          <p className={styles.subtitle}>Vertical scroll drives horizontal journey — SSLC to CSE</p>
        </motion.div>

        <div className={styles.trainWrapper} ref={stickyRef}>
          <div className={styles.trackViewport} role="region" aria-label="Education timeline" tabIndex={0}>
            <div 
              className={styles.track} 
              ref={trackRef}
              style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
            >
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
                    isActive={index === activeIndex}
                    isCurrent={station.isCurrent}
                  />
                ))}
              </div>

              <TrainEngine activeIndex={activeIndex} totalStations={education.length} />
            </div>
          </div>

          <div className={styles.scrollHint} aria-hidden="true">
            <Label variant="meta">SCROLL TO PROGRESS</Label>
            <Arrow direction="down" size={20} color="mustard" />
          </div>
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
      </div>
    </section>
  )
}

interface StationNodeProps {
  station: EducationStation
  isActive: boolean
  isCurrent?: boolean
}

function StationNode({ station, isActive, isCurrent }: StationNodeProps) {
  return (
    <div
      className={`${styles.stationNode} ${isActive ? styles.active : ''} ${isCurrent ? styles.current : ''}`}
      role="listitem"
      aria-current={isActive ? 'true' : undefined}
      aria-label={`${station.label}: ${station.institution}`}
      style={{ '--card-color': station.color } as React.CSSProperties}
    >
      <div className={styles.nodeOuter} aria-hidden="true">
        <div className={styles.nodeInner}></div>
        <div className={styles.nodeRing} aria-hidden="true"></div>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mustard)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
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
        animate={{ opacity: isActive ? 1 : 0.4, y: 0, scale: isActive ? 1 : 0.98 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className={styles.cardTop}>
          <div className={styles.cardNumberWrapper}>
            <Label variant="number">{station.label}</Label>
          </div>
          {station.isCurrent && <span className={styles.currentSticker}>CURRENT</span>}
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