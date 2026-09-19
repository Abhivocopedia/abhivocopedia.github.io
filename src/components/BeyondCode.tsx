import { useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { memories } from '../data/memories.generated'
import {
  Label,
  DotPattern,
  Sticker,
} from './DecorativeMarks'
import styles from './BeyondCode.module.css'

type MemoryOrientation =
  | 'portrait'
  | 'landscape'

function MemoryPhoto({
  src,
  name,
  index,
}: {
  src: string
  name: string
  index: number
}) {
  const [orientation, setOrientation] =
    useState<MemoryOrientation | null>(null)

  const handleLoad = (
    event: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    const image = event.currentTarget

    setOrientation(
      image.naturalHeight > image.naturalWidth
        ? 'portrait'
        : 'landscape',
    )
  }

  const cardClass = orientation
    ? `${styles.memoryCard} ${
        orientation === 'portrait'
          ? styles.portrait
          : styles.landscape
      }`
    : styles.memoryCard

  return (
    <motion.figure
      className={cardClass}
      initial={{
        opacity: 0,
        y: 20,
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
        duration: 0.65,
        delay: Math.min(index * 0.04, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      style={
        {
          '--float-delay': `${(index % 6) * -0.7}s`,
        } as CSSProperties
      }
    >
      <div className={styles.memoryImageWrap}>
        <img
          src={src}
          alt={name}
          className={styles.memoryImage}
          loading={index < 4 ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
        />

        <div
          className={styles.memoryOverlay}
          aria-hidden="true"
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
      </div>
    </motion.figure>
  )
}

export function BeyondCode() {
  const marqueeItems = [
    ...profile.vexr.lines,
    ...profile.beyondCode,
    ...profile.vexr.lines,
    ...profile.beyondCode,
  ]

  return (
    <section
      id="beyond-code"
      className={styles.section}
      aria-labelledby="beyond-title"
    >
      <div
        className={styles.bgDecoration}
        aria-hidden="true"
      >
        <DotPattern color="ink" />
      </div>

      <div className={styles.container}>
        {/* HEADER */}
        <motion.div
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
            margin: '-50px',
          }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Label variant="number">06</Label>

          <h2
            id="beyond-title"
            className={styles.title}
          >
            BEYOND CODE
          </h2>

          <div
            className={styles.divider}
            aria-hidden="true"
          />

          <p className={styles.subtitle}>
            The things that happen beyond the screen.
          </p>
        </motion.div>

        {/* TOP MOVING MARQUEE */}
        <motion.div
          className={styles.marqueeWrapper}
          initial={{
            opacity: 0,
            y: 20,
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
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div
            className={styles.marqueeTrack}
            aria-hidden="true"
          >
            <div className={styles.marqueeContent}>
              {marqueeItems.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className={styles.marqueeItem}
                >
                  {profile.vexr.lines.includes(item) ? (
                    <Sticker
                     
                    >
                      {item}
                    </Sticker>
                  ) : (
                    item
                  )}

                  <span className={styles.marqueeDot}>
                    •
                  </span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* MEMORY WALL */}
        <motion.div
          className={styles.memorySection}
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
            margin: '-50px',
          }}
          transition={{
            duration: 0.65,
            delay: 0.15,
          }}
        >
          <div className={styles.memoryHeading}>
            <div>
              <Label variant="meta">
                MEMORY WALL
              </Label>

              <h3 className={styles.memoryTitle}>
                LIFE IN FRAMES
              </h3>
            </div>

            <span className={styles.memoryCount}>
              {memories.length} FRAME
              {Number(memories.length) === 1
                ? ''
                : 'S'}
            </span>
          </div>

          <div className={styles.memoryWall}>
            {memories.map((memory, index) => (
              <MemoryPhoto
                key={memory.src}
                src={memory.src}
                name={memory.name}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
