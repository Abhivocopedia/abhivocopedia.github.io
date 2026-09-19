import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { education } from '../data/education'
import type { EducationStation } from '../data/education'
import styles from './EducationTrain.module.css'

type StationSide = 'top' | 'bottom'

interface Metrics {
  viewportWidth: number
  trackWidth: number
  stationPositions: number[]
}

const MIN_TRACK_WIDTH = 1500
const DESKTOP_TRACK_MULTIPLIER = 3.2
const MOBILE_TRACK_MULTIPLIER = 4.1
const CAMERA_BIAS = 0.42
const WHEEL_DEGREES_PER_PIXEL = 0.72

export function EducationTrain() {
  const journeyRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const moveStopTimerRef = useRef<number | null>(null)
  const previousTrainXRef = useRef(0)

  const [progress, setProgress] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
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
      const positions = metrics.stationPositions

      if (positions.length === 0) return 0
      if (value <= 0) return positions[0]
      if (value >= 1) return positions[positions.length - 1]

      const scaled = value * maxStationIndex
      const lowerIndex = Math.floor(scaled)
      const upperIndex = Math.min(lowerIndex + 1, maxStationIndex)
      const localProgress = scaled - lowerIndex

      const lower = positions[lowerIndex] ?? 0
      const upper = positions[upperIndex] ?? lower

      return lower + (upper - lower) * localProgress
    },
    [maxStationIndex, metrics.stationPositions],
  )

  const trainX = interpolateStationPosition(progress)
  const trainScreenBias = metrics.viewportWidth * CAMERA_BIAS

  const worldTranslateX =
    metrics.viewportWidth > 0
      ? trainScreenBias - trainX
      : 0

  const wheelRotation = trainX * WHEEL_DEGREES_PER_PIXEL

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
      Math.round(viewportWidth * multiplier),
    )

    const sidePadding = Math.max(
      viewportWidth * 0.38,
      viewportWidth <= 768 ? 115 : 190,
    )

    const usableWidth = Math.max(
      viewportWidth,
      trackWidth - sidePadding * 2,
    )

    const stationPositions = education.map((_, index) => {
      if (maxStationIndex === 0) {
        return trackWidth / 2
      }

      return (
        sidePadding +
        (usableWidth * index) / maxStationIndex
      )
    })

    setMetrics({
      viewportWidth,
      trackWidth,
      stationPositions,
    })
  }, [maxStationIndex])

  const updateScroll = useCallback(() => {
    const journey = journeyRef.current
    const sticky = stickyRef.current

    if (!journey || !sticky) return

    const journeyRect = journey.getBoundingClientRect()
    const stickyHeight = sticky.clientHeight
    const scrollDistance = Math.max(
      journey.offsetHeight - stickyHeight,
      1,
    )

    const rawProgress = -journeyRect.top / scrollDistance
    const nextProgress = Math.max(
      0,
      Math.min(1, rawProgress),
    )

    const nextStationX = interpolateStationPosition(nextProgress)
    const delta = Math.abs(
      nextStationX - previousTrainXRef.current,
    )

    previousTrainXRef.current = nextStationX

    if (delta > 0.05) {
      setIsMoving(true)

      if (moveStopTimerRef.current !== null) {
        window.clearTimeout(moveStopTimerRef.current)
      }

      moveStopTimerRef.current = window.setTimeout(() => {
        setIsMoving(false)
        moveStopTimerRef.current = null
      }, 130)
    }

    setProgress(nextProgress)
  }, [interpolateStationPosition])

  useEffect(() => {
    const media = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    const syncReducedMotion = () => {
      setReducedMotion(media.matches)
    }

    syncReducedMotion()
    media.addEventListener?.(
      'change',
      syncReducedMotion,
    )

    return () => {
      media.removeEventListener?.(
        'change',
        syncReducedMotion,
      )
    }
  }, [])

  useEffect(() => {
    measure()

    const observer = new ResizeObserver(() => {
      measure()
      updateScroll()
    })

    if (viewportRef.current) {
      observer.observe(viewportRef.current)
    }

    return () => observer.disconnect()
  }, [measure, updateScroll])

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      measure()
      updateScroll()
    }, 120)

    return () => window.clearTimeout(initialTimer)
  }, [measure, updateScroll])

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null
        updateScroll()
      })
    }

    updateScroll()
    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', onScroll)

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }

      if (moveStopTimerRef.current !== null) {
        window.clearTimeout(moveStopTimerRef.current)
        moveStopTimerRef.current = null
      }
    }
  }, [updateScroll])

  const getSide = (index: number): StationSide =>
    index % 2 === 0 ? 'top' : 'bottom'

  return (
    <section
      id="education"
      className={styles.section}
      aria-labelledby="education-title"
    >
      <div className={styles.sectionInner}>
        <header className={styles.header}>
          <span className={styles.sectionNumber}>02</span>

          <h2
            id="education-title"
            className={styles.title}
          >
            EDUCATION
          </h2>

          <div
            className={styles.divider}
            aria-hidden="true"
          />
        </header>

        <div
          ref={journeyRef}
          className={styles.journey}
        >
          <div
            ref={stickyRef}
            className={styles.sticky}
          >
            <div
              ref={viewportRef}
              className={styles.trackViewport}
              role="region"
              aria-label="Education journey"
            >
              <div
                className={styles.track}
                style={{
                  width: `${metrics.trackWidth}px`,
                  transform: `translate3d(${worldTranslateX}px, 0, 0)`,
                }}
              >
                <div
                  className={styles.rail}
                  aria-hidden="true"
                >
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
                    {education.map((station) => (
                      <span
                        key={station.id}
                        className={styles.railTie}
                      />
                    ))}
                  </div>
                </div>

                {education.map((station, index) => {
                  const x =
                    metrics.stationPositions[index] ?? 0

                  const stationReached =
                    index === 0 ||
                    progress >=
                      stationProgress[index] - 0.06

                  const isActive =
                    Math.abs(
                      progress -
                        stationProgress[index],
                    ) < 0.12

                  return (
                    <div
                      key={station.id}
                      className={`${styles.station} ${
                        isActive
                          ? styles.stationActive
                          : ''
                      }`}
                      style={{
                        left: `${x}px`,
                      }}
                    >
                      <div
                        className={styles.stationNode}
                        style={
                          {
                            '--station-color':
                              station.color,
                          } as CSSProperties
                        }
                      >
                        <span
                          className={
                            styles.nodePulse
                          }
                        />

                        <span
                          className={styles.nodeOuter}
                        >
                          <span
                            className={styles.nodeInner}
                          />
                        </span>
                      </div>

                      <StationCard
                        station={station}
                        side={getSide(index)}
                        visible={stationReached}
                        active={isActive}
                      />
                    </div>
                  )
                })}

                <TrainEngine
                  x={trainX}
                  wheelRotation={wheelRotation}
                  moving={
                    isMoving && !reducedMotion
                  }
                  reducedMotion={reducedMotion}
                />
              </div>
            </div>

            <div
              className={styles.progressMeta}
              aria-hidden="true"
            >
              <span>
                {String(
                  Math.min(
                    totalStations,
                    Math.floor(
                      progress *
                        totalStations +
                        1,
                    ),
                  ),
                ).padStart(2, '0')}
              </span>

              <div className={styles.progressRule}>
                <div
                  className={styles.progressRuleFill}
                  style={{
                    transform: `scaleX(${progress})`,
                  }}
                />
              </div>

              <span>
                {String(totalStations).padStart(2, '0')}
              </span>
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
  visible: boolean
  active: boolean
}

function StationCard({
  station,
  side,
  visible,
  active,
}: StationCardProps) {
  return (
    <article
      className={`${styles.stationCardWrap} ${
        side === 'top'
          ? styles.cardTop
          : styles.cardBottom
      } ${visible ? styles.cardVisible : styles.cardHidden}`}
      style={
        {
          '--station-color': station.color,
        } as CSSProperties
      }
    >
      <div className={styles.cardConnector} />

      <div
        className={`${styles.stationCard} ${
          active ? styles.cardActive : ''
        }`}
      >
        <div className={styles.cardHeader}>
          <span className={styles.cardLabel}>
            {station.label}
          </span>

          {station.isCurrent && (
            <span className={styles.currentSticker}>
              CURRENT
            </span>
          )}
        </div>

        <h3 className={styles.cardTitle}>
          {station.institution}
        </h3>

        <ul className={styles.cardDetails}>
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

        <span
          className={styles.cardAccent}
          aria-hidden="true"
        />
      </div>
    </article>
  )
}

interface TrainEngineProps {
  x: number
  wheelRotation: number
  moving: boolean
  reducedMotion: boolean
}

function TrainEngine({
  x,
  wheelRotation,
  moving,
  reducedMotion,
}: TrainEngineProps) {
  const engineClass = [
    styles.engine,
    moving ? styles.engineMoving : '',
    reducedMotion ? styles.engineReduced : '',
  ]
    .filter(Boolean)
    .join(' ')

  const wheelStyle = {
    '--wheel-rotation': `${wheelRotation}deg`,
  } as CSSProperties

  return (
    <div
      className={engineClass}
      style={{ left: `${x}px` }}
      aria-hidden="true"
    >
      <div className={styles.smokeStack}>
        <span className={styles.smokePuff} />
        <span className={styles.smokePuff} />
        <span className={styles.smokePuff} />
      </div>

      <div className={styles.engineBody}>
        <div className={styles.engineCab}>
          <div className={styles.engineWindow} />
          <div className={styles.engineWindowBar} />
        </div>

        <div className={styles.engineBoiler}>
          <div className={styles.engineGauge}>
            <span />
          </div>
        </div>

        <div className={styles.engineChimney}>
          <span className={styles.chimneyCap} />
        </div>

        <div className={styles.engineCowcatcher} />

        <div className={styles.engineWheels}>
          <span
            className={styles.wheel}
            style={wheelStyle}
          />
          <span
            className={`${styles.wheel} ${styles.wheelLarge}`}
            style={wheelStyle}
          />
          <span
            className={styles.wheel}
            style={wheelStyle}
          />
        </div>
      </div>
    </div>
  )
}
