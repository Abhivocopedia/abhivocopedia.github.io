import { useState, useEffect, useRef, useCallback, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { education, EducationStation } from '../data/education'
import { Label, DotPattern, Arrow } from './DecorativeMarks'
import styles from './EducationTrain.module.css'

export function EducationTrain() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [stationPositions, setStationPositions] = useState<number[]>([])
  const [trackWidth, setTrackWidth] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)
  
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const stationNodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const engineRef = useRef<HTMLDivElement>(null)

  const measureStationPositions = useCallback(() => {
    if (!trackRef.current) return
    
    const track = trackRef.current
    const stationNodes = track.querySelectorAll('[data-station-index]')
    const positions: number[] = []
    
    stationNodes.forEach((node) => {
      const rect = (node as HTMLElement).getBoundingClientRect()
      const trackRect = track.getBoundingClientRect()
      // Center of the station node relative to track start
      const centerX = rect.left - trackRect.left + rect.width / 2
      positions.push(centerX)
    })
    
    if (positions.length > 0) {
      setStationPositions(positions)
      setTrackWidth(track.scrollWidth)
      setViewportWidth(track.clientWidth)
    }
  }, [])

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

    // Determine active station based on progress and station positions
    if (stationPositions.length > 0) {
      const maxIndex = stationPositions.length - 1
      let activeStationIndex = 0
      
      // Find the station closest to the current progress
      for (let i = 0; i < stationPositions.length; i++) {
        const stationProgress = i / maxIndex
        if (scrollProgress >= stationProgress - 0.15 && scrollProgress <= stationProgress + 0.15) {
          activeStationIndex = i
          break
        }
        if (scrollProgress > stationProgress) {
          activeStationIndex = i
        }
      }
      
      setActiveIndex(Math.min(activeStationIndex, maxIndex))
    }
  }, [stationPositions])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Measure station positions on mount and resize
  useEffect(() => {
    measureStationPositions()
    window.addEventListener('resize', measureStationPositions)
    return () => window.removeEventListener('resize', measureStationPositions)
  }, [measureStationPositions])

  // Also measure after initial render
  useEffect(() => {
    const timer = setTimeout(measureStationPositions, 100)
    return () => clearTimeout(timer)
  }, [])

  // Calculate train position based on actual station positions
  const getTrainPosition = () => {
    if (stationPositions.length === 0 || activeIndex >= stationPositions.length) return 0
    
    const stationX = stationPositions[activeIndex]
    const viewportCenter = viewportWidth / 2
    const trainOffset = 50 // Approximate half width of engine
    
    // Position train so its center aligns with the active station
    const position = stationX - viewportCenter + trainOffset
    
    // Clamp to track boundaries
    const maxPosition = trackWidth - viewportWidth
    return Math.max(0, Math.min(position, maxPosition))
  }

  const translateX = getTrainPosition()

  // Side alternation: SSLC(top), PUC(bottom), ECE(top), CSE(bottom)
  const getCardSide = (index: number) => index % 2 === 0 ? 'top' : 'bottom'

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
              style={{ transform: `translate3d(${-translateX}px, 0, 0)` }}
            >
              <div className={styles.rail} aria-hidden="true">
                <div className={styles.railLine}></div>
                <div className={styles.progressTrack} aria-hidden="true">
                  <motion.div
                    className={styles.progressFill}
                    style={{ width: `${progress * 100}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </div>
                <div className={styles.railLine}></div>
                <div className={styles.railTies}>
                  {education.map((_, i) => (
                    <div key={i} className={styles.railTie}></div>
                  ))}
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
                    ref={(el) => { stationNodeRefs.current[index] = el }}
                  />
                ))}
              </div>

              <TrainEngine 
                ref={engineRef}
                activeIndex={activeIndex} 
                totalStations={education.length} 
              />
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
              index={index}
              isActive={index === activeIndex}
              isPast={index < activeIndex}
              side={getCardSide(index)}
            />
          ))}
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
}

const StationNode = forwardRef<HTMLDivElement, StationNodeProps>(
  ({ station, index, isActive, isCurrent }: StationNodeProps, ref: React.Ref<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      data-station-index={index}
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
})

interface TrainEngineProps {
  activeIndex: number
  totalStations: number
}

const TrainEngine = forwardRef<HTMLDivElement, TrainEngineProps>(
  ({ activeIndex, totalStations }: TrainEngineProps, ref: React.Ref<HTMLDivElement>) => {
  const position = totalStations > 1 ? (activeIndex / (totalStations - 1)) * 100 : 0

  return (
    <motion.div
      ref={ref}
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
})

interface StationCardProps {
  station: EducationStation
  index: number
  isActive: boolean
  isPast: boolean
  side: 'top' | 'bottom'
}

function StationCard({ station, index, isActive, isPast, side }: StationCardProps) {
  return (
    <div 
      style={{ '--card-color': station.color } as React.CSSProperties} 
      className={`${styles.cardWrapper} ${styles[side]}`}
    >
      <motion.div
        className={`${styles.stationCard} ${isActive ? styles.cardActive : ''} ${isPast ? styles.cardPast : ''}`}
        role="listitem"
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: index <= 0 ? 1 : 0.3, 
          y: 0, 
          scale: 1 
        }}
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