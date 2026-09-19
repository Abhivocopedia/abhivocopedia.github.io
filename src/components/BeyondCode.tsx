import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { memories } from '../data/memories.generated'
import styles from './BeyondCode.module.css'

type Memory = (typeof memories)[number]

const DESKTOP_COLUMNS = 4
const TABLET_COLUMNS = 3
const MOBILE_COLUMNS = 2

function getColumnCount(width: number) {
  if (width <= 640) return MOBILE_COLUMNS
  if (width <= 980) return TABLET_COLUMNS
  return DESKTOP_COLUMNS
}

function useColumnCount() {
  const [columnCount, setColumnCount] = useState(() => {
    if (typeof window === 'undefined') return DESKTOP_COLUMNS
    return getColumnCount(window.innerWidth)
  })

  useEffect(() => {
    const update = () => {
      setColumnCount(getColumnCount(window.innerWidth))
    }

    update()

    window.addEventListener('resize', update, {
      passive: true,
    })

    return () => {
      window.removeEventListener('resize', update)
    }
  }, [])

  return columnCount
}

function splitIntoColumns(
  items: readonly Memory[],
  count: number,
) {
  const columns: Memory[][] = Array.from(
    { length: count },
    () => [],
  )

  items.forEach((item, index) => {
    columns[index % count].push(item)
  })

  return columns
}

function humanizeFilename(value: string) {
  return value
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function MemorySet({
  items,
  columnIndex,
}: {
  items: readonly Memory[]
  columnIndex: number
}) {
  return (
    <div
      className={styles.memorySet}
      aria-hidden="true"
    >
      {items.map((memory, index) => {
        const portrait =
          (index + columnIndex) % 5 === 1

        return (
          <figure
            key={`${memory.src}-${columnIndex}-${index}`}
            className={`${styles.memoryFigure} ${
              portrait ? styles.portrait : ''
            }`}
          >
            <img
              src={memory.src}
              alt=""
              className={styles.memoryImage}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </figure>
        )
      })}
    </div>
  )
}

function MemoryColumn({
  items,
  columnIndex,
}: {
  items: readonly Memory[]
  columnIndex: number
}) {
  const reverse = columnIndex % 2 === 1

  return (
    <div
      className={`${styles.memoryColumn} ${
        reverse ? styles.reverse : ''
      }`}
      style={{
        animationDelay: `${columnIndex * -1.7}s`,
      }}
    >
      <div className={styles.memoryTrack}>
        <MemorySet
          items={items}
          columnIndex={columnIndex}
        />

        <MemorySet
          items={items}
          columnIndex={columnIndex}
        />
      </div>
    </div>
  )
}

export function BeyondCode() {
  const columnCount = useColumnCount()

  const columns = useMemo(
    () =>
      splitIntoColumns(
        memories,
        columnCount,
      ),
    [columnCount],
  )

  const hasMemories = memories.length > 0

  const memoryCountLabel = `${memories.length} ${
    Number(memories.length) === 1
      ? 'MEMORY'
      : 'MEMORIES'
  }`

  return (
    <section
      id="beyond-code"
      className={styles.section}
      aria-labelledby="beyond-title"
    >
      <div
        className={styles.topMarquee}
        aria-label="Beyond code interests"
      >
        <div
          className={styles.marqueeTrack}
          aria-hidden="true"
        >
          <div className={styles.marqueeContent}>
            {profile.beyondCode.map((item) => (
              <span
                key={`a-${item}`}
                className={styles.marqueeItem}
              >
                {item}
              </span>
            ))}

            {profile.beyondCode.map((item) => (
              <span
                key={`b-${item}`}
                className={styles.marqueeItem}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <motion.header
          className={styles.header}
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: '-60px',
          }}
          transition={{
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className={styles.sectionNumber}>
            06 / BEYOND CODE
          </span>

          <h2
            id="beyond-title"
            className={styles.title}
          >
            <span>MEMORIES</span>
          </h2>

          <p className={styles.subtitle}>
            A moving archive of stages,
            performances, people, and moments
            beyond the screen.
          </p>
        </motion.header>

        <motion.div
          className={styles.memoryMeta}
          initial={{
            opacity: 0,
            y: 16,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: '-50px',
          }}
          transition={{
            duration: 0.55,
            delay: 0.08,
          }}
        >
          <span>
            PERFORM · CREATE · REMEMBER
          </span>

          <span>
            {memoryCountLabel}
          </span>
        </motion.div>

        {hasMemories ? (
          <motion.div
            className={styles.memoryWall}
            initial={{
              opacity: 0,
              y: 24,
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
              duration: 0.7,
              delay: 0.12,
            }}
            aria-label="Moving memories photo wall"
          >
            {columns.map(
              (
                items,
                columnIndex,
              ) => (
                <MemoryColumn
                  key={`column-${columnIndex}`}
                  items={items}
                  columnIndex={columnIndex}
                />
              ),
            )}

            <div
              className={styles.wallVignette}
              aria-hidden="true"
            />
          </motion.div>
        ) : (
          <div className={styles.emptyState}>
            <span>
              ADD PHOTOS TO
            </span>

            <strong>
              public/images/memories/
            </strong>

            <small>
              JPG · JPEG · PNG · WEBP · AVIF ·
              GIF · BMP · SVG
            </small>
          </div>
        )}

        <p className={styles.photoHint}>
          Add as many photos as you like inside{' '}
          <code>
            public/images/memories/
          </code>
          . The build scanner picks them up
          automatically.
        </p>

        <span className={styles.srOnly}>
          Memory filenames:{' '}
          {memories
            .map((memory) =>
              humanizeFilename(
                memory.name,
              ),
            )
            .join(', ')}
        </span>
      </div>
    </section>
  )
}
