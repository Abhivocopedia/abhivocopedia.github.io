import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { skills, SkillCategory } from '../data/skills'
import { Star, Label } from './DecorativeMarks'
import styles from './Skills.module.css'

export function Skills() {
  return (
    <section
      id="skills"
      className={styles.section}
      aria-labelledby="skills-title"
    >
      <div className={styles.gridTexture} aria-hidden="true" />

      <GrowingRoutesCanvas />

      <div className={styles.curvedOverlay} aria-hidden="true">
        <span className={styles.curveGlow} />
      </div>

      <div className={styles.container}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.55,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Label variant="number" className={styles.sectionNumber}>
            03
          </Label>

          <h2 id="skills-title" className={styles.title}>
            SKILLS
          </h2>

          <div className={styles.divider} aria-hidden="true">
            <span />
            <Star size="md" color="mustard" />
            <span />
          </div>

          <p className={styles.subtitle}>
            TECHNICAL STACK · FLIP TO EXPLORE
          </p>
        </motion.header>

        <div
          className={styles.grid}
          role="list"
          aria-label="Skill categories"
        >
          {skills.map((category, index) => (
            <SkillFlipCard
              key={category.number}
              category={category}
              index={index}
            />
          ))}
        </div>

        <div className={styles.bottomMarker} aria-hidden="true">
          <span>SKILL SYSTEM</span>
          <span className={styles.bottomRule} />
          <span>03 / 06</span>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   CONTINUOUS GROWING TECHNICAL ROUTES
   ============================================================ */

function GrowingRoutesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const context = canvas.getContext('2d')

    if (!context) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    let animationFrame = 0
    let running = true

    type Point = {
      x: number
      y: number
    }

    type Route = {
      points: Point[]
      progress: number
      speed: number
      pulse: number
      pulseSpeed: number
      opacity: number
    }

    let routes: Route[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()

      width = rect.width
      height = rect.height

      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.max(
        1,
        Math.round(width * dpr),
      )

      canvas.height = Math.max(
        1,
        Math.round(height * dpr),
      )

      context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0,
      )

      seedRoutes()
    }

    const routeCount = () => {
      if (width < 600) return 4

      if (width < 900) return 6

      return 9
    }

    const createRoute = (): Route => {
      const horizontal = Math.random() > 0.45

      const points: Point[] = [
        {
          x: Math.random() * width,
          y: Math.random() * height,
        },
      ]

      let angle = horizontal
        ? Math.random() > 0.5
          ? 0
          : Math.PI
        : Math.random() > 0.5
          ? Math.PI / 2
          : -Math.PI / 2

      const step = 42 + Math.random() * 72

      for (let i = 1; i < 17; i += 1) {
        if (Math.random() > 0.68) {
          angle +=
            Math.random() > 0.5
              ? Math.PI / 2
              : -Math.PI / 2
        }

        points.push({
          x:
            points[i - 1].x +
            Math.cos(angle) * step,

          y:
            points[i - 1].y +
            Math.sin(angle) * step,
        })
      }

      return {
        points,

        progress:
          0.02 + Math.random() * 0.55,

        speed:
          0.000045 +
          Math.random() * 0.000055,

        pulse: Math.random(),

        pulseSpeed:
          0.001 +
          Math.random() * 0.0015,

        opacity:
          0.055 +
          Math.random() * 0.045,
      }
    }

    const seedRoutes = () => {
      routes = Array.from(
        {
          length: routeCount(),
        },
        createRoute,
      )
    }

    const getRoutePoint = (
      route: Route,
      progress: number,
    ): Point => {
      const scaled =
        progress *
        (route.points.length - 1)

      const index = Math.min(
        Math.floor(scaled),
        route.points.length - 2,
      )

      const local =
        scaled - index

      const a = route.points[index]
      const b = route.points[index + 1]

      return {
        x:
          a.x +
          (b.x - a.x) *
            local,

        y:
          a.y +
          (b.y - a.y) *
            local,
      }
    }

    /* ============================================================
       LIGHT TECHNICAL GRID
       ============================================================ */

    const drawGrid = (time: number) => {
      const size = 62

      const offsetX =
        (time * 0.0025) %
        size

      const offsetY =
        (time * 0.0017) %
        size

      context.save()

      context.lineWidth = 1

      context.strokeStyle =
        'rgba(224,174,62,0.055)'

      context.beginPath()

      for (
        let x =
          -size +
          offsetX;

        x <
        width +
          size;

        x += size
      ) {
        context.moveTo(x, 0)
        context.lineTo(
          x,
          height,
        )
      }

      for (
        let y =
          -size +
          offsetY;

        y <
        height +
          size;

        y += size
      ) {
        context.moveTo(0, y)

        context.lineTo(
          width,
          y,
        )
      }

      context.stroke()

      context.restore()
    }

    /* ============================================================
       GROWING ROUTES
       ============================================================ */

    const drawRoutes = () => {
      routes.forEach((route) => {
        route.progress +=
          route.speed *
          (reduceMotion
            ? 0.2
            : 1)

        if (
          route.progress >=
          1.08
        ) {
          route.progress = 0

          route.pulse = 0
        }

        const visibleProgress =
          Math.min(
            route.progress,
            1,
          )

        const visiblePoints =
          Math.max(
            2,

            Math.floor(
              route.points.length *
                visibleProgress,
            ),
          )

        context.save()

        context.lineWidth = 1.2

        context.strokeStyle =
          `rgba(224,174,62,${route.opacity})`

        context.beginPath()

        for (
          let i = 0;
          i < visiblePoints;
          i += 1
        ) {
          const point =
            route.points[i]

          if (i === 0) {
            context.moveTo(
              point.x,
              point.y,
            )
          } else {
            context.lineTo(
              point.x,
              point.y,
            )
          }
        }

        const partial =
          getRoutePoint(
            route,
            visibleProgress,
          )

        context.lineTo(
          partial.x,
          partial.y,
        )

        context.stroke()

        /* Route nodes */

        context.fillStyle =
          'rgba(255,253,246,0.18)'

        for (
          let i = 0;
          i < visiblePoints;
          i += 1
        ) {
          const point =
            route.points[i]

          context.beginPath()

          context.arc(
            point.x,
            point.y,
            1.5,
            0,
            Math.PI * 2,
          )

          context.fill()
        }

        /* Moving route pulse */

        route.pulse +=
          route.pulseSpeed *
          (reduceMotion
            ? 0.3
            : 1)

        if (
          route.pulse >
          1
        ) {
          route.pulse = 0
        }

        if (
          route.progress >
            0.18 &&
          route.pulse <
            visibleProgress
        ) {
          const pulse =
            getRoutePoint(
              route,
              route.pulse,
            )

          context.beginPath()

          context.fillStyle =
            'rgba(255,118,47,0.78)'

          context.shadowColor =
            'rgba(255,118,47,0.5)'

          context.shadowBlur = 8

          context.arc(
            pulse.x,
            pulse.y,
            2,
            0,
            Math.PI * 2,
          )

          context.fill()
        }

        context.restore()
      })
    }

    /* ============================================================
       RENDER
       ============================================================ */

    const draw = (
      time: number,
    ) => {
      context.clearRect(
        0,
        0,
        width,
        height,
      )

      drawGrid(time)

      drawRoutes()
    }

    const tick = (
      time: number,
    ) => {
      if (!running) return

      draw(time)

      animationFrame =
        window.requestAnimationFrame(
          tick,
        )
    }

    const stop = () => {
      running = false

      window.cancelAnimationFrame(
        animationFrame,
      )
    }

    const start = () => {
      if (
        running &&
        animationFrame
      ) {
        return
      }

      running = true

      animationFrame =
        window.requestAnimationFrame(
          tick,
        )
    }

    const onVisibilityChange =
      () => {
        if (
          document.hidden
        ) {
          stop()
        } else {
          start()
        }
      }

    const resizeObserver =
      new ResizeObserver(
        resize,
      )

    resizeObserver.observe(
      canvas,
    )

    document.addEventListener(
      'visibilitychange',
      onVisibilityChange,
    )

    resize()

    if (reduceMotion) {
      draw(0)
    } else {
      start()
    }

    return () => {
      stop()

      resizeObserver.disconnect()

      document.removeEventListener(
        'visibilitychange',
        onVisibilityChange,
      )
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={styles.routesCanvas}
      aria-hidden="true"
    />
  )
}

/* ============================================================
   SKILL FLIP CARD
   ============================================================ */

interface SkillFlipCardProps {
  category: SkillCategory
  index: number
}

function SkillFlipCard({
  category,
  index,
}: SkillFlipCardProps) {
  const [flipped, setFlipped] =
    useState(false)

  const toggle = () => {
    setFlipped(
      (current) =>
        !current,
    )
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()

      toggle()
    }

    if (
      event.key === 'Escape'
    ) {
      setFlipped(false)
    }
  }

  return (
    <motion.div
      className={
        styles.cardWrapper
      }
      role="listitem"
      initial={{
        opacity: 0,
        y: 28,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '-40px',
      }}
      transition={{
        duration: 0.5,

        delay:
          index *
          0.055,

        ease: [
          0.25,
          0.46,
          0.45,
          0.94,
        ],
      }}
    >
      <div
        className={`${styles.card} ${
          flipped
            ? styles.cardFlipped
            : ''
        }`}
        tabIndex={0}
        role="button"
        aria-label={`${category.category}. Activate to see technologies.`}
        aria-pressed={flipped}
        onClick={(event) => {
          if (
            event.detail === 0
          ) {
            return
          }

          toggle()
        }}
        onTouchEnd={(event) => {
          event.preventDefault()

          toggle()
        }}
        onKeyDown={
          handleKeyDown
        }
      >
        <div
          className={
            styles.cardInner
          }
          style={
            {
              '--card-color':
                category.color,
            } as CSSProperties
          }
        >
          {/* FRONT */}

          <div
            className={`${styles.face} ${styles.front}`}
          >
            <div
              className={
                styles.frontTop
              }
            >
              <span
                className={
                  styles.cardNumber
                }
              >
                {
                  category.number
                }
              </span>

              <span
                className={
                  styles.frontMark
                }
              >
                ↗
              </span>
            </div>

            <div
              className={
                styles.frontCenter
              }
            >
              <h3>
                {
                  category.category
                }
              </h3>
            </div>

            <div
              className={
                styles.flipPrompt
              }
            >
              <span>
                ↻
              </span>

              <span>
                FLIP FOR DETAILS
              </span>
            </div>
          </div>

          {/* BACK */}

          <div
            className={`${styles.face} ${styles.back}`}
          >
            <div
              className={
                styles.backTop
              }
            >
              <span
                className={
                  styles.backNumber
                }
              >
                {
                  category.number
                }
              </span>

              <span
                className={
                  styles.backLabel
                }
              >
                {
                  category.category
                }
              </span>
            </div>

            <div
              className={
                styles.backContent
              }
            >
              <h3>
                {
                  category.category
                }
              </h3>

              <p>
                {
                  category.description
                }
              </p>

              <ul
                className={
                  styles.techList
                }
              >
                {category.technologies.map(
                  (
                    technology,
                    technologyIndex,
                  ) => (
                    <li
                      key={`${technology}-${technologyIndex}`}
                    >
                      <span
                        className={
                          styles.techDot
                        }
                        style={{
                          backgroundColor:
                            category.color,
                        }}
                        aria-hidden="true"
                      />

                      {
                        technology
                      }
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div
              className={
                styles.backFooter
              }
            >
              <span>
                HOVER TO RETURN
              </span>

              <span
                className={
                  styles.backArrow
                }
              >
                ↻
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
