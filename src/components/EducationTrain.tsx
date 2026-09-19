import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { education, EducationStation } from '../data/education'
import { Label, DotPattern, Arrow } from './DecorativeMarks'
import styles from './EducationTrain.module.css'

type StationSide = 'top' | 'bottom'

const NAVBAR_OFFSET = 88
const DESKTOP_TRACK_MULTIPLIER = 3.4
const MOBILE_TRACK_MULTIPLIER = 4.2
const MIN_TRACK_WIDTH = 1400

interface Metrics {
  viewportWidth: number
  trackWidth: number
  stationPositions: number[]
}

export function EducationTrain() {
  const sectionRef = useRef<HTMLElement>(null)
  const journeyRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const [progress, setProgress] = useState(0)
  const [metrics, setMetrics] = useState<Metrics>({
    viewportWidth: 0,
    trackWidth: MIN_TRACK_WIDTH,
    stationPositions: [],
  })

  const totalStations = education.length
  const maxStationIndex = Math.max(totalStations - 1, 1)

  const stationProgress = useMemo(
    () =>
      education.map((_, index) =>
        maxStationIndex === 0 ? 0 : index / maxStationIndex,
      ),
    [maxStationIndex],
  )


  const interpolateStationPosition = useCallback(
    (value: number) => {
      if (metrics.stationPositions.length === 0) return 0

      if (value <= 0) return metrics.stationPositions[0]
      if (value >= 1)
        return metrics.stationPositions[metrics.stationPositions.length - 1]

      const scaled = value * maxStationIndex
      const lowerIndex = Math.floor(scaled)
      const upperIndex = Math.min(lowerIndex + 1, maxStationIndex)
      const localProgress = scaled - lowerIndex

      const lower = metrics.stationPositions[lowerIndex] ?? 0
      const upper = metrics.stationPositions[upperIndex] ?? lower

      return lower + (upper - lower) * localProgress
    },
    [maxStationIndex, metrics.stationPositions],
  )

  const trainX = interpolateStationPosition(progress)

  const translateX =
    metrics.viewportWidth > 0
      ? metrics.viewportWidth / 2 - trainX
      : 0

  const measure = useCallback(() => {
    const viewport = viewportRef.current

    if (!viewport) return

    const viewportWidth = viewport.clientWidth
    const multiplier =
      viewportWidth <= 768
        ? MOBILE_TRACK_MULTIPLIER
        : DESKTOP_TRACK_MULTIPLIER

    const trackWidth = Math.max(
      MIN_TRACK_WIDTH,
      viewportWidth * multiplier,
    )

    // Keep the first and final stations equally inset from each track edge.
    // This makes all four station distances mathematically identical.
    const horizontalInset = Math.max(
      viewportWidth * 0.55,
      viewportWidth <= 768 ? 110 : 180,
    )

    const usableTrackWidth = Math.max(
      viewportWidth,
      trackWidth - horizontalInset * 2,
    )

    const stationPositions = education.map((_, index) => {
      if (maxStationIndex === 0) return trackWidth / 2

      return (
        horizontalInset +
        (usableTrackWidth * index) / maxStationIndex
      )
    })

    setMetrics({
      viewportWidth,
      trackWidth,
      stationPositions,
    })
  }, [maxStationIndex])

  const updateScroll = useCallback(() => {
    if (!journeyRef.current || !stickyRef.current) return

    const journeyRect = journeyRef.current.getBoundingClientRect()
    const stickyHeight =
      stickyRef.current.getBoundingClientRect().height

    const scrollableDistance = Math.max(
      journeyRect.height - stickyHeight,
      1,
    )

    const rawProgress =
      (NAVBAR_OFFSET - journeyRect.top) / scrollableDistance

    const nextProgress = Math.max(0, Math.min(1, rawProgress))

    setProgress(nextProgress)
  }, [])

  useEffect(() => {
    measure()

    const observer = new ResizeObserver(() => {
      measure()
      updateScroll()
    })

    if (viewportRef.current) observer.observe(viewportRef.current)

    return () => observer.disconnect()
  }, [measure, updateScroll])

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) return

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null
        updateScroll()
      })
    }

    updateScroll()
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [updateScroll])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      measure()
      updateScroll()
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [measure, updateScroll])

  const getSide = (index: number): StationSide =>
    index % 2 === 0 ? 'top' : 'bottom'

  return (
    <section
      id="education"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="education-title"
    >
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="ink" />
      </div>

      <div className={styles.sectionInner}>
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
          <Label variant="number">02</Label>
          <h2 id="education-title" className={styles.title}>
            EDUCATION
          </h2>
          <div className={styles.divider} aria-hidden="true" />
          <p className={styles.subtitle}>
            Scroll vertically to travel horizontally through the journey.
          </p>
        </motion.div>

        <div className={styles.journey} ref={journeyRef}>
          <div className={styles.sticky} ref={stickyRef}>
            <div
              ref={viewportRef}
              className={styles.trackViewport}
              role="region"
              aria-label="Horizontal education timeline controlled by vertical scroll"
            >
              <div
                className={styles.track}
                style={{
                  width: `${metrics.trackWidth}px`,
                  transform: `translate3d(${translateX}px, 0, 0)`,
                }}
              >
                <div className={styles.rail} aria-hidden="true">
                  <div className={styles.railBase} />
                  <div
                    className={styles.railProgress}
                    style={{
                      left: `${
                        metrics.stationPositions[0] ?? 0
                      }px`,
                      width: `${Math.max(
                        0,
                        trainX -
                          (metrics.stationPositions[0] ?? 0),
                      )}px`,
                    }}
                  />
                  <div className={styles.railTies}>
                    {education.map((_, index) => (
                      <span key={index} className={styles.railTie} />
                    ))}
                  </div>
                </div>

                {education.map((station, index) => {
                  const x = metrics.stationPositions[index] ?? 0
                  const threshold =
                    stationProgress[index] - 0.08
                  const isRevealed =
                    index === 0 || progress >= threshold
                  const isActive =
                    Math.abs(
                      progress - stationProgress[index],
                    ) <= 0.14

                  return (
                    <div
                      key={station.id}
                      className={`${styles.station} ${
                        isActive ? styles.stationActive : ''
                      }`}
                      style={{ left: `${x}px` }}
                    >
                      <div
                        className={styles.stationNode}
                        style={
                          {
                            '--card-color': station.color,
                          } as React.CSSProperties
                        }
                        aria-label={`${station.label}: ${station.institution}`}
                      >
                        <span className={styles.nodeRing} />
                        <span className={styles.nodeOuter}>
                          <span className={styles.nodeInner} />
                        </span>
                        <span className={styles.nodeLabel}>
                          {station.label}
                        </span>
                        {station.isCurrent && (
                          <span className={styles.currentBadge}>
                            CURRENT
                          </span>
                        )}
                      </div>

                      <StationCard
                        station={station}
                        side={getSide(index)}
                        isRevealed={isRevealed}
                        isActive={isActive}
                      />
                    </div>
                  )
                })}

                <TrainEngine
                  x={trainX}
                  reducedMotion={false}
                />
              </div>
            </div>

            <div className={styles.scrollHint} aria-hidden="true">
              <Label variant="meta">
                VERTICAL SCROLL → HORIZONTAL JOURNEY
              </Label>
              <Arrow
                direction="down"
                size={18}
                color="mustard"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface StationCardProps {
  station: EducationStation
  side: StationSide
  isRevealed: boolean
  isActive: boolean
}

function StationCard({
  station,
  side,
  isRevealed,
  isActive,
}: StationCardProps) {
  return (
    <motion.article
      className={`${styles.stationCardWrap} ${
        side === 'top'
          ? styles.cardTop
          : styles.cardBottom
      }`}
      initial={false}
      animate={{
        opacity: isRevealed ? 1 : 0,
        y: isRevealed ? 0 : side === 'top' ? 16 : -16,
        scale: isRevealed ? 1 : 0.97,
      }}
      transition={{
        duration: 0.45,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div
        className={`${styles.stationCard} ${
          isActive ? styles.cardActive : ''
        }`}
        style={
          {
            '--card-color': station.color,
          } as React.CSSProperties
        }
      >
        <div className={styles.cardConnector} aria-hidden="true" />

        <div className={styles.cardTopRow}>
          <Label variant="number">{station.label}</Label>
          {station.isCurrent && (
            <span className={styles.currentSticker}>
              CURRENT
            </span>
          )}
        </div>

        <h3 className={styles.cardTitle}>
          {station.institution}
        </h3>

        <ul className={styles.cardDetails} role="list">
          {station.details.map((detail, index) => (
            <li
              key={`${station.id}-${index}`}
              className={styles.cardDetail}
            >
              {detail}
            </li>
          ))}
        </ul>

        <div className={styles.cardPeriod}>
          {station.period}
        </div>

        <div
          className={styles.cardAccent}
          aria-hidden="true"
        />
      </div>
    </motion.article>
  )
}

interface TrainEngineProps {
  x: number
  reducedMotion: boolean
}

function TrainEngine({
  x,
  reducedMotion,
}: TrainEngineProps) {
  return (
    <div
      className={styles.engine}
      style={{ left: `${x}px` }}
      aria-hidden="true"
    >
      <div className={styles.engineBody}>
        <div className={styles.engineCab}>
          <div className={styles.engineWindow} />
          <div className={styles.engineLight} />
        </div>

        <div className={styles.engineBoiler}>
          <div className={styles.engineGauge}>
            <span />
          </div>
        </div>

        <div className={styles.engineCowcatcher} />

        <div className={styles.engineWheels}>
          <span
            className={`${styles.wheel} ${
              reducedMotion ? '' : styles.wheelSpin
            }`}
          />
          <span
            className={`${styles.wheel} ${
              reducedMotion ? '' : styles.wheelSpin
            }`}
          />
          <span
            className={`${styles.wheel} ${
              reducedMotion ? '' : styles.wheelSpin
            }`}
          />
        </div>
      </div>

      <span className={styles.engineLabel}>ENGINE</span>
    </div>
  )
}

