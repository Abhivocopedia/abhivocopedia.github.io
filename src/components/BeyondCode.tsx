import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { memories } from '../data/memories.generated'
import {
  Label,
  DotPattern,
} from './DecorativeMarks'
import styles from './BeyondCode.module.css'

const COLUMN_COUNT = 4

const memoryColumns = Array.from(
  { length: COLUMN_COUNT },
  (_, columnIndex) =>
    memories.filter(
      (_, imageIndex) =>
        imageIndex % COLUMN_COUNT === columnIndex,
    ),
)

const marqueeItems = [
  ...profile.beyondCode,
  ...profile.beyondCode,
  ...profile.beyondCode,
  ...profile.beyondCode,
]

export function BeyondCode() {
  return (
    <section
      id="beyond-code"
      className={styles.section}
      aria-labelledby="beyond-code-title"
    >
      <div
        className={styles.background}
        aria-hidden="true"
      >
        <DotPattern color="warm-white" />
      </div>

      <div className={styles.container}>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <motion.header
          className={styles.header}
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: '-80px',
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <Label variant="number">06</Label>

          <h2
            id="beyond-code-title"
            className={styles.title}
          >
            BEYOND CODE
          </h2>

          <p className={styles.subtitle}>
            The things that happen beyond the screen.
          </p>
        </motion.header>

        {/* =====================================================
            FULL WIDTH MOVING MARQUEE
        ===================================================== */}

        <div
          className={styles.marqueeViewport}
          aria-hidden="true"
        >
          <div className={styles.marqueeTrack}>
            {marqueeItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={styles.marqueeItem}
              >
                <span className={styles.marqueeDot}>
                  •
                </span>

                <span className={styles.marqueeText}>
                  {item}
                </span>

                <span className={styles.marqueeDot}>
                  •
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================
            MEMORY WALL
        ===================================================== */}

        <motion.div
          className={styles.memoryHeader}
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
            margin: '-50px',
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <Label variant="meta">
            MEMORY WALL
          </Label>
        </motion.div>

        <div className={styles.memoryWall}>
          {memoryColumns.map(
            (column, columnIndex) => {
              if (column.length === 0) {
                return null
              }

              const movingDown =
                columnIndex % 2 === 1

              return (
                <div
                  key={`memory-column-${columnIndex}`}
                  className={`${styles.memoryColumn} ${
                    movingDown
                      ? styles.memoryColumnDown
                      : styles.memoryColumnUp
                  }`}
                >
                  <div className={styles.memoryTrack}>
                    <MemorySequence
                      items={column}
                    />

                    <MemorySequence
                      items={column}
                      duplicate
                    />
                  </div>
                </div>
              )
            },
          )}
        </div>
      </div>
    </section>
  )
}

function MemorySequence({
  items,
  duplicate = false,
}: {
  items: readonly (typeof memories)[number][]
  duplicate?: boolean
}) {
  return (
    <div
      className={styles.memorySequence}
      aria-hidden={duplicate}
    >
      {items.map((memory, index) => {
        const isPortrait =
          index % 4 === 1

        const rotation =
          index % 3 === 0
            ? styles.rotateLeft
            : index % 3 === 1
              ? styles.rotateRight
              : styles.rotateNeutral

        return (
          <figure
            key={`${duplicate ? 'copy-' : ''}${memory.src}-${index}`}
            className={`${styles.memoryFigure} ${
              isPortrait
                ? styles.memoryPortrait
                : styles.memoryLandscape
            } ${rotation}`}
          >
            <div className={styles.imageFrame}>
              <img
                src={memory.src}
                alt={memory.name}
                loading="lazy"
                draggable="false"
              />

              <span
                className={styles.frameIndex}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </figure>
        )
      })}
    </div>
  )
}
