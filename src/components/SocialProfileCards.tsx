import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import styles from './SocialProfileCards.module.css'

type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'youtube'
  | 'x'
  | 'photography'
  | 'email'

interface SocialCard {
  key: SocialPlatform
  label: string
  handle: string
  href: string
  external?: boolean
}

const socialCards: SocialCard[] = [
  {
    key: 'github',
    label: 'GitHub',
    handle: 'Abhivocopedia',
    href: profile.social.github,
    external: true,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    handle: 'abhinandana-bhatta',
    href: profile.social.linkedin,
    external: true,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    handle: 'abhivocopedia',
    href: profile.social.instagram,
    external: true,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    handle: '@abhinandanabhatta-s7b',
    href: profile.social.youtube,
    external: true,
  },
  {
    key: 'x',
    label: 'X',
    handle: '@Abhinandan43024',
    href: profile.social.x,
    external: true,
  },
  {
    key: 'photography',
    label: 'Photography',
    handle: "Abhi's Unscripted",
    href: profile.social.photography,
    external: true,
  },
  {
    key: 'email',
    label: 'Email',
    handle: profile.social.email,
    href: `mailto:${profile.social.email}`,
    external: false,
  },
]

export function SocialProfileCards() {
  return (
    <section
      id="social-links"
      className={styles.section}
      aria-labelledby="social-links-title"
    >
      <div className={styles.sectionInner}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className={styles.sectionNumber}>04 / CONNECT</span>

          <h2 id="social-links-title" className={styles.title}>
            FIND ME <em>ELSEWHERE.</em>
          </h2>

          <p className={styles.subtitle}>
            Profile previews for the places where I build, publish, and connect.
          </p>
        </motion.header>

        <div
          className={styles.grid}
          role="list"
          aria-label="Social profiles"
        >
          {socialCards.map((card, index) => (
            <SocialProfileCard
              key={card.key}
              card={card}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

interface SocialProfileCardProps {
  card: SocialCard
  index: number
}

function SocialProfileCard({
  card,
  index,
}: SocialProfileCardProps) {
  const [imageLoaded, setImageLoaded] = useState(
    !profile.profilePhoto,
  )

  const preview = useMemo(
    () => <PlatformPreview platform={card.key} />,
    [card.key],
  )

  const linkProps = card.external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {}

  return (
    <motion.a
      href={card.href}
      className={`${styles.card} ${styles[`card_${card.key}`]}`}
      role="listitem"
      aria-label={`${card.label} profile: ${card.handle}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        margin: '-50px',
      }}
      transition={{
        duration: 0.65,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...linkProps}
    >
      <div className={styles.cardTop}>
        <div className={styles.identity}>
          <div className={styles.avatar}>
            {profile.profilePhoto ? (
              <>
                {!imageLoaded && (
                  <span
                    className={styles.avatarSkeleton}
                    aria-hidden="true"
                  />
                )}

                <img
                  src={profile.profilePhoto}
                  alt=""
                  className={`${styles.avatarImage} ${
                    imageLoaded
                      ? styles.avatarImageLoaded
                      : ''
                  }`}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <span className={styles.avatarInitials}>
                AB
              </span>
            )}
          </div>

          <div className={styles.identityText}>
            <strong>{profile.name}</strong>
            <span>{card.handle}</span>
          </div>
        </div>

        <span
          className={styles.platformMark}
          aria-hidden="true"
        >
          <PlatformIcon platform={card.key} />
        </span>
      </div>

      <div className={styles.previewFrame}>
        {preview}

        <div
          className={styles.previewShade}
          aria-hidden="true"
        />

        <span className={styles.previewLabel}>
          {card.label}
        </span>
      </div>

      <div className={styles.cardBottom}>
        <span className={styles.cardPlatform}>
          {card.label}
        </span>

        <span className={styles.openLabel}>
          OPEN PROFILE{' '}
          <span aria-hidden="true">↗</span>
        </span>
      </div>
    </motion.a>
  )
}

function PlatformPreview({
  platform,
}: {
  platform: SocialPlatform
}) {
  if (platform === 'instagram') {
    return (
      <div
        className={styles.instagramPreview}
        aria-hidden="true"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <span
            key={index}
            className={styles.instagramTile}
            style={
              {
                '--tile-index': index,
              } as CSSProperties
            }
          />
        ))}
      </div>
    )
  }

  if (platform === 'github') {
    return (
      <div
        className={styles.githubPreview}
        aria-hidden="true"
      >
        <div className={styles.githubHeader}>
          <span />
          <span />
          <span />
        </div>

        <div className={styles.contributionGrid}>
          {Array.from({ length: 84 }).map((_, index) => (
            <span
              key={index}
              className={styles.contributionCell}
              style={
                {
                  '--cell-index': index,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div className={styles.githubRepoLine}>
          <span />
          <span />
        </div>

        <div className={styles.githubRepoLine}>
          <span />
          <span />
        </div>
      </div>
    )
  }

  if (platform === 'linkedin') {
    return (
      <div
        className={styles.linkedinPreview}
        aria-hidden="true"
      >
        <div className={styles.linkedinBanner} />

        <div className={styles.linkedinBody}>
          <div className={styles.linkedinAvatar}>
            AB
          </div>

          <div className={styles.linkedinLines}>
            <span className={styles.lineWide} />
            <span className={styles.lineMedium} />
            <span className={styles.lineShort} />
          </div>
        </div>

        <div className={styles.linkedinMeta}>
          <span />
          <span />
          <span />
        </div>
      </div>
    )
  }

  if (platform === 'youtube') {
    return (
      <div
        className={styles.youtubePreview}
        aria-hidden="true"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={styles.videoTile}
          >
            <span className={styles.playButton}>
              ▶
            </span>

            <span className={styles.videoLine} />
          </div>
        ))}
      </div>
    )
  }

  if (platform === 'x') {
    return (
      <div
        className={styles.xPreview}
        aria-hidden="true"
      >
        <div className={styles.post}>
          <div className={styles.postHeader}>
            <span className={styles.postAvatar}>
              AB
            </span>

            <span className={styles.postNameLine} />
          </div>

          <span className={styles.postLineWide} />
          <span className={styles.postLineMedium} />
          <span className={styles.postLineShort} />

          <div className={styles.postActions}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={styles.post}>
          <div className={styles.postHeader}>
            <span className={styles.postAvatar}>
              AB
            </span>

            <span className={styles.postNameLine} />
          </div>

          <span className={styles.postLineWide} />
          <span className={styles.postLineMedium} />

          <div className={styles.postActions}>
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    )
  }

  if (platform === 'photography') {
    return (
      <div
        className={styles.photoPreview}
        aria-hidden="true"
      >
        <div className={styles.photoLarge}>
          {profile.profilePhoto && (
            <img
              src={profile.profilePhoto}
              alt=""
              loading="lazy"
            />
          )}
        </div>

        <div className={styles.photoSmall}>
          <span />
          <span />
        </div>
      </div>
    )
  }

  return (
    <div
      className={styles.emailPreview}
      aria-hidden="true"
    >
      <span className={styles.emailGlyph}>
        @
      </span>

      <span className={styles.emailLineWide} />
      <span className={styles.emailLineMedium} />
      <span className={styles.emailLineShort} />
    </div>
  )
}

function PlatformIcon({
  platform,
}: {
  platform: SocialPlatform
}) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true,
  } as const

  switch (platform) {
    case 'github':
      return (
        <svg {...common}>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.304 3.438 9.8 8.207 11.387.599.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12 24 5.373 18.627 0 12 0Z" />
        </svg>
      )

    case 'linkedin':
      return (
        <svg {...common}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" />
        </svg>
      )

    case 'instagram':
      return (
        <svg {...common}>
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />

          <circle
            cx="12"
            cy="12"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />

          <circle
            cx="17.5"
            cy="6.5"
            r="1.2"
          />
        </svg>
      )

    case 'youtube':
      return (
        <svg {...common}>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.9.58 9.4.58 9.4.58s7.5 0 9.4-.58a3 3 0 0 0 2.1-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8Z" />

          <path
            d="m9.5 8.5 6 3.5-6 3.5v-7Z"
            fill="var(--paper, #f4efe5)"
          />
        </svg>
      )

    case 'x':
      return (
        <svg {...common}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
        </svg>
      )

    case 'photography':
      return (
        <svg {...common}>
          <path
            d="M4 5h4l1.5-2h5L16 5h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <circle
            cx="12"
            cy="13"
            r="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      )

    case 'email':
      return (
        <svg {...common}>
          <path
            d="M3 5h18v14H3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <path
            d="m3 6 9 7 9-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      )
  }
}
