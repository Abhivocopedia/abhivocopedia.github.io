import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import {
  Star,
  Arrow,
  Label,
  Crosshair,
  DotPattern,
  DecorativeCorner,
  OrganicShape,
} from './DecorativeMarks'
import styles from './Contact.module.css'

type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'youtube'
  | 'x'
  | 'photography'

type SocialLink = {
  label: string
  username: string
  href: string
  platform: SocialPlatform
  color: string
}

const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    username: 'Abhivocopedia',
    href: profile.social.github,
    platform: 'github',
    color: '#171717',
  },
  {
    label: 'LinkedIn',
    username: 'abhinandana-bhatta',
    href: profile.social.linkedin,
    platform: 'linkedin',
    color: '#0A66C2',
  },
  {
    label: 'Instagram',
    username: 'abhivocopedia',
    href: profile.social.instagram,
    platform: 'instagram',
    color: '#E1306C',
  },
  {
    label: 'YouTube',
    username: '@abhinandanabhatta-s7b',
    href: profile.social.youtube,
    platform: 'youtube',
    color: '#FF0000',
  },
  {
    label: 'X',
    username: '@Abhinandan43024',
    href: profile.social.x,
    platform: 'x',
    color: '#171717',
  },
  {
    label: 'Photography',
    username: "Abhi's Unscripted",
    href: profile.social.photography,
    platform: 'photography',
    color: '#274D3A',
  },
]

export function Contact() {
  return (
    <section
      id="contact"
      className={styles.section}
      aria-labelledby="contact-title"
    >
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="warm-white" />

        <OrganicShape
          variant={1}
          style={{ top: '5%', right: '5%' }}
        />

        <OrganicShape
          variant={2}
          style={{ bottom: '10%', left: '3%' }}
        />

        <DecorativeCorner
          position="tl"
          color="mustard"
          style={{ top: '8%', left: '4%' }}
        />

        <DecorativeCorner
          position="tr"
          color="warm-white"
          style={{ top: '8%', right: '4%' }}
        />

        <DecorativeCorner
          position="bl"
          color="warm-white"
          style={{ bottom: '8%', left: '4%' }}
        />

        <DecorativeCorner
          position="br"
          color="mustard"
          style={{ bottom: '8%', right: '4%' }}
        />

        <Crosshair
          color="orange"
          style={{ top: '15%', left: '10%' }}
        />

        <Crosshair
          color="teal"
          style={{ bottom: '15%', right: '10%' }}
        />
      </div>

      <div className={styles.container}>

        {/* HEADER */}
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
          <Label variant="number">07</Label>

          <h2
            id="contact-title"
            className={styles.title}
          >
            CONTACT
          </h2>

          <div
            className={styles.divider}
            aria-hidden="true"
          >
            <Star
              size="md"
              color="mustard"
            />
          </div>

          <p className={styles.subtitle}>
            Open to opportunities, collaborations, and conversations
          </p>
        </motion.div>

        {/* CTA BANNER */}
        <motion.div
          className={styles.ctaBanner}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className={styles.bannerContent}>

            <div className={styles.bannerText}>
              <Label
                variant="meta"
                style={{ color: 'var(--mustard)' }}
              >
                LET'S BUILD
              </Label>

              <h3 className={styles.bannerTitle}>
                Ready to create something that matters?
              </h3>

              <p className={styles.bannerDesc}>
                I'm always open to discussing new projects,
                creative ideas, or just chatting about software
                and systems.
              </p>
            </div>

            <div className={styles.bannerActions}>
              <a
                href={`mailto:${profile.social.email}`}
                className={`btn btn-primary ${styles.bannerBtn}`}
              >
                Start a Conversation

                <Arrow
                  direction="right"
                  size={18}
                  color="warm-white"
                />
              </a>

              <a
                href="#projects"
                className={`btn btn-ghost ${styles.bannerBtn}`}
              >
                View Work First

                <Arrow
                  direction="right"
                  size={18}
                  color="warm-white"
                />
              </a>
            </div>

          </div>
        </motion.div>

        {/* SOCIAL PROFILE CARDS */}
        <motion.div
          className={styles.socialGrid}
          role="list"
          aria-label="Social profiles"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {socialLinks.map((link, index) => (
            <SocialProfileCard
              key={link.label}
              link={link}
              index={index}
            />
          ))}
        </motion.div>

        {/* DIRECT EMAIL */}
        <motion.div
          className={styles.emailDirect}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: 0.6,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Label variant="meta">
            DIRECT EMAIL
          </Label>

          <a
            href={`mailto:${profile.social.email}`}
            className={styles.emailLink}
          >
            {profile.social.email}

            <Arrow
              direction="right"
              size={18}
              color="mustard"
            />
          </a>
        </motion.div>

      </div>
    </section>
  )
}


/* =========================================================
   SOCIAL PROFILE CARD
========================================================= */

function SocialProfileCard({
  link,
  index,
}: {
  link: SocialLink
  index: number
}) {
  const isExternal = !link.href.startsWith('mailto:')

  return (
    <motion.a
      href={link.href}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`${styles.profileCard} ${styles[`platform-${link.platform}`]}`}
      role="listitem"
      aria-label={`Open ${link.label} profile`}
      style={
        {
          '--profile-color': link.color,
        } as React.CSSProperties
      }
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: 0.3 + index * 0.06,
      }}
      whileHover={{
        y: -6,
      }}
      whileTap={{
        scale: 0.985,
      }}
    >
      {/* CARD HEADER */}
      <div className={styles.profileHeader}>

        <div className={styles.avatarWrapper}>
          {profile.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt=""
              className={styles.avatar}
              loading="lazy"
            />
          ) : (
            <div
              className={styles.avatarFallback}
              aria-hidden="true"
            >
              AB
            </div>
          )}
        </div>

        <div className={styles.profileIdentity}>
          <strong className={styles.profileUsername}>
            {link.username}
          </strong>

          <span className={styles.profileName}>
            {profile.name}
          </span>
        </div>

        <div
          className={styles.platformIcon}
          aria-hidden="true"
        >
          {renderPlatformIcon(link.platform)}
        </div>

      </div>


      {/* PLATFORM PREVIEW */}
      <div className={styles.previewFrame}>

        {link.platform === 'instagram' && (
          <InstagramPreview />
        )}

        {link.platform === 'github' && (
          <GithubPreview />
        )}

        {link.platform === 'linkedin' && (
          <LinkedInPreview />
        )}

        {link.platform === 'youtube' && (
          <YouTubePreview />
        )}

        {link.platform === 'x' && (
          <XPreview />
        )}

        {link.platform === 'photography' && (
          <PhotographyPreview />
        )}

      </div>


      {/* CARD FOOTER */}
      <div className={styles.profileFooter}>

        <span className={styles.platformName}>
          {link.label}
        </span>

        <span className={styles.openProfile}>
          OPEN PROFILE
          <span aria-hidden="true">↗</span>
        </span>

      </div>

    </motion.a>
  )
}


/* =========================================================
   INSTAGRAM
========================================================= */

function InstagramPreview() {
  return (
    <div className={styles.instagramGrid}>
      <div className={`${styles.instagramTile} ${styles.tileOne}`} />
      <div className={`${styles.instagramTile} ${styles.tileTwo}`} />
      <div className={`${styles.instagramTile} ${styles.tileThree}`} />
      <div className={`${styles.instagramTile} ${styles.tileFour}`} />
      <div className={`${styles.instagramTile} ${styles.tileFive}`} />
      <div className={`${styles.instagramTile} ${styles.tileSix}`} />
    </div>
  )
}


/* =========================================================
   GITHUB
========================================================= */

function GithubPreview() {
  const cells = Array.from({ length: 84 })

  return (
    <div className={styles.githubPreview}>

      <div className={styles.githubTop}>
        <span className={styles.githubRepoDot} />
        <span>Abhivocopedia</span>
      </div>

      <div className={styles.githubActivity}>
        {cells.map((_, index) => {
          const level =
            (index * 7 + index * index) % 5

          return (
            <span
              key={index}
              className={`${styles.githubCell} ${styles[`githubLevel${level}`]}`}
            />
          )
        })}
      </div>

      <div className={styles.githubBottom}>
        <span>CONTRIBUTIONS</span>
        <span>BUILD • SHIP • REPEAT</span>
      </div>

    </div>
  )
}


/* =========================================================
   LINKEDIN
========================================================= */

function LinkedInPreview() {
  return (
    <div className={styles.linkedinPreview}>

      <div className={styles.linkedinBanner}>
        <div className={styles.linkedinPattern} />
      </div>

      <div className={styles.linkedinBody}>

        <div className={styles.linkedinAvatar}>
          {profile.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt=""
              loading="lazy"
            />
          ) : (
            'AB'
          )}
        </div>

        <div className={styles.linkedinLines}>
          <span className={styles.linkedinName}>
            Abhinandana Bhatta
          </span>

          <span>
            CSE Student • Full-Stack Developer • Builder
          </span>

          <span>
            Karnataka, India
          </span>
        </div>

      </div>

    </div>
  )
}


/* =========================================================
   YOUTUBE
========================================================= */

function YouTubePreview() {
  return (
    <div className={styles.youtubePreview}>

      <div className={styles.youtubeTile}>
        <div className={styles.youtubePlay}>
          ▶
        </div>
      </div>

      <div className={styles.youtubeTile}>
        <div className={styles.youtubePlay}>
          ▶
        </div>
      </div>

      <div className={styles.youtubeTile}>
        <div className={styles.youtubePlay}>
          ▶
        </div>
      </div>

      <div className={styles.youtubeTile}>
        <div className={styles.youtubePlay}>
          ▶
        </div>
      </div>

    </div>
  )
}


/* =========================================================
   X / TWITTER
========================================================= */

function XPreview() {
  return (
    <div className={styles.xPreview}>

      <div className={styles.xPost}>

        <div className={styles.xPostHeader}>
          <div className={styles.xMiniAvatar}>
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt=""
                loading="lazy"
              />
            ) : (
              'AB'
            )}
          </div>

          <div>
            <strong>
              Abhinandana Bhatta
            </strong>

            <span>
              @Abhinandan43024
            </span>
          </div>
        </div>

        <p>
          Building software, exploring AI,
          shipping ideas and making things matter.
        </p>

      </div>

      <div className={styles.xPost}>

        <div className={styles.xPostHeader}>
          <div className={styles.xMiniAvatar}>
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt=""
                loading="lazy"
              />
            ) : (
              'AB'
            )}
          </div>

          <div>
            <strong>
              Abhivocopedia
            </strong>

            <span>
              @Abhinandan43024
            </span>
          </div>
        </div>

        <p>
          Code • AI • Systems • Engineering
        </p>

      </div>

    </div>
  )
}


/* =========================================================
   PHOTOGRAPHY
========================================================= */

function PhotographyPreview() {
  return (
    <div className={styles.photographyPreview}>

      <div className={styles.photographyMain}>
        {profile.profilePhoto ? (
          <img
            src={profile.profilePhoto}
            alt=""
            loading="lazy"
          />
        ) : (
          <span>PHOTO</span>
        )}
      </div>

      <div className={styles.photographySide}>

        <div className={styles.photoSideOne}>
          <span>01</span>
        </div>

        <div className={styles.photoSideTwo}>
          <span>02</span>
        </div>

      </div>

    </div>
  )
}


/* =========================================================
   PLATFORM ICONS
========================================================= */

function renderPlatformIcon(
  platform: SocialPlatform,
) {
  const icons: Record<
    SocialPlatform,
    JSX.Element
  > = {

    github: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),

    linkedin: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),

    instagram: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          ry="5"
        />

        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />

        <line
          x1="17.5"
          y1="6.5"
          x2="17.51"
          y2="6.5"
        />
      </svg>
    ),

    youtube: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),

    x: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),

    photography: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />

        <circle
          cx="12"
          cy="12"
          r="4"
        />
      </svg>
    ),
  }

  return icons[platform]
}
