import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import {
  Arrow,
  DotPattern,
  Label,
  Star,
} from './DecorativeMarks'
import { soundFX } from '../lib/SoundFX'
import styles from './Hero.module.css'

export function Hero() {
  const handleClick = () => {
    soundFX.click()
  }

  return (
    <section
      id="home"
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div
        className={styles.bgDecoration}
        aria-hidden="true"
      >
        <DotPattern color="mustard" />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <motion.div
            className={styles.badgeRow}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Label variant="number">00</Label>

            <span aria-hidden="true">/</span>

            <Label variant="meta">
              CSE · 03RD SEMESTER
            </Label>
          </motion.div>

          <motion.h1
            id="hero-title"
            className={styles.title}
            initial={{
              opacity: 0,
              y: 28,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.08,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <span className={styles.nameLine}>
              <span className={styles.name}>
                ABHINANDANA
              </span>

              <Star
                size="md"
                color="mustard"
                className={styles.titleStar}
              />
            </span>

            <span className={styles.nameLine}>
              <span className={styles.name}>
                BHATTA
              </span>
            </span>
          </motion.h1>

          <motion.div
            className={styles.dividerLine}
            initial={{
              opacity: 0,
              scaleX: 0.8,
            }}
            animate={{
              opacity: 1,
              scaleX: 1,
            }}
            transition={{
              duration: 0.55,
              delay: 0.18,
            }}
          >
            <Label variant="meta">
              ABHIVOCOPEDIA
            </Label>
          </motion.div>

          <motion.p
            className={styles.statement}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.24,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            I BUILD SYSTEMS THAT TURN IDEAS INTO
            <span> WORKING PRODUCTS.</span>
          </motion.p>

          <motion.p
            className={styles.subtitle}
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              delay: 0.3,
            }}
          >
            CSE STUDENT · FULL-STACK DEVELOPER ·
            INDEPENDENT BUILDER
          </motion.p>

          <motion.div
            className={styles.meta}
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              delay: 0.36,
            }}
          >
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                CURRENT
              </span>

              <span className={styles.metaValue}>
                B.E. CSE · JIT DAVANGERE
              </span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                FOCUS
              </span>

              <span className={styles.metaValue}>
                SOFTWARE · AI · SYSTEMS
              </span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                STATUS
              </span>

              <span className={styles.metaValue}>
                <span
                  className={styles.statusDot}
                  aria-hidden="true"
                />

                BUILDING
              </span>
            </div>
          </motion.div>

          <motion.div
            className={styles.cta}
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              delay: 0.42,
            }}
          >
            <a
              href="#projects"
              className={styles.ctaPrimary}
              onClick={handleClick}
            >
              <span>EXPLORE PROJECTS</span>

              <Arrow
                direction="right"
                size={18}
                color="ink"
              />
            </a>

            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaSecondary}
              onClick={handleClick}
            >
              GITHUB ↗
            </a>

            <a
              href="#contact"
              className={styles.ctaAccent}
              onClick={handleClick}
            >
              GET IN TOUCH
            </a>

            <a
              href="#resume"
              className={styles.ctaSecondary}
              onClick={handleClick}
            >
              VIEW RESUME
            </a>
          </motion.div>
        </div>

        <motion.div
          className={styles.visual}
          initial={{
            opacity: 0,
            x: 32,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.75,
            delay: 0.18,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className={styles.visualWrapper}>
            <div className={styles.profilePhotoCard}>
              <div className={styles.profileSection}>
                {profile.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt={`${profile.name} — ${profile.identity}`}
                    className={styles.profilePhoto}
                    loading="eager"
                  />
                ) : (
                  <div
                    className={styles.profilePhoto}
                    role="img"
                    aria-label="Profile photo placeholder"
                  >
                    <span aria-hidden="true">
                      AB
                    </span>
                  </div>
                )}

                <div className={styles.profileInfo}>
                  <h2 className={styles.profileName}>
                    <span className={styles.nameFirst}>
                      ABHINANDANA
                    </span>

                    <span className={styles.nameLast}>
                      BHATTA
                    </span>
                  </h2>

                  <p className={styles.profileIdentity}>
                    ABHIVOCOPEDIA
                  </p>

                  <p className={styles.profileTagline}>
                    {profile.tagline}
                  </p>
                </div>
              </div>

              <div
                className={styles.photoOverlay}
                aria-hidden="true"
              >
                <span>ABHIVOCOPEDIA</span>
                <span>03 / 11 / 2007</span>
              </div>
            </div>

            <div className={styles.visualCard}>
              <div className={styles.visualHeader}>
                <span>
                  VEX-R / BUILDER MODE
                </span>

                <span aria-hidden="true">
                  ●
                </span>
              </div>

              <div className={styles.visualContent}>
                <div className={styles.codeBlock}>
                  <span>01</span>
                  <span>MAKE SOMETHING</span>

                  <span>02</span>
                  <span>MAKE IT MATTER</span>

                  <span>03</span>
                  <span>MAKE MONEY</span>
                </div>
              </div>

              <div className={styles.visualFooter}>
                <div className={styles.visualTags}>
                  <span>SOFTWARE</span>
                  <span>AI</span>
                  <span>CLOUD</span>
                </div>

                <div className={styles.visualStats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      04
                    </span>

                    <span className={styles.statLabel}>
                      PROJECTS
                    </span>
                  </div>

                  <div className={styles.stat}>
                    <span className={styles.statValue}>
                      01
                    </span>

                    <span className={styles.statLabel}>
                      BUILDER
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={styles.floatingElements}
            aria-hidden="true"
          >
            <span className={styles.floatItem}>
              CSE
            </span>

            <span className={styles.floatItem}>
              VTU
            </span>

            <span className={styles.floatItem}>
              INDIA
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 1,
        }}
        aria-hidden="true"
      >
        <Label variant="meta">
          SCROLL
        </Label>

        <Arrow
          direction="down"
          size={22}
          color="mustard"
          className={styles.scrollArrow}
        />
      </motion.div>
    </section>
  )
}
