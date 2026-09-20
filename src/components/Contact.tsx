import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
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
import { RichLinkPreview } from './RichLinkPreview'
import styles from './Contact.module.css'

type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'youtube'
  | 'x'
  | 'photography'
  | 'discord'
  | 'spotify'
  | 'devfolio'
  | 'callofduty'
  | 'snapchat'
  | 'facebook'
  | 'devto'
  | 'unstop'
  | 'mlh'

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
  {
    label: 'Discord',
    username: 'abhivocopedia_32437',
    href: profile.social.discord,
    platform: 'discord',
    color: '#5865F2',
  },
  {
    label: 'Spotify',
    username: 'Abhivocopedia',
    href: profile.social.spotify,
    platform: 'spotify',
    color: '#1DB954',
  },
  {
    label: 'Devfolio',
    username: '@abhivocopedia',
    href: profile.social.devfolio,
    platform: 'devfolio',
    color: '#3770FF',
  },
  {
    label: 'MLH',
    username: 'Abhinandana Bhatta',
    href: profile.social.mlh,
    platform: 'mlh',
    color: '#e53028',
  },
  {
    label: 'Unstop',
    username: 'abhinbha29455',
    href: profile.social.unstop,
    platform: 'unstop',
    color: '#2563eb',
  },
  {
    label: 'Dev.to',
    username: '@abhivocopedia',
    href: profile.social.devto,
    platform: 'devto',
    color: '#f5f5f5',
  },
  {
    label: 'Facebook',
    username: 'Abhinandana Bhatta',
    href: profile.social.facebook,
    platform: 'facebook',
    color: '#1877F2',
  },
  {
    label: 'Snapchat',
    username: 'abhinandan03110',
    href: profile.social.snapchat,
    platform: 'snapchat',
    color: '#FFFC00',
  },
  {
    label: 'Call of Duty',
    username: 'Abhi.vocopedia',
    href: profile.social.callofduty,
    platform: 'callofduty',
    color: '#6DBB45',
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

        {/* RICH SOCIAL LINK PREVIEWS */}
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
        <QuickChatLinks />

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
   RICH SOCIAL PROFILE CARD
========================================================= */



/* =========================================================
   QUICK CHAT LINKS
========================================================= */

function QuickChatLinks() {
  return (
    <div className={styles.quickChatLayer} aria-label="Quick chat links">
      <motion.a
        href={profile.social.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.quickChat} ${styles.quickChatLeft}`}
        aria-label="Chat with me on WhatsApp"
        whileHover={{ y: -4, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className={`${styles.quickChatIcon} ${styles.whatsappIcon}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M20.52 3.48A11.73 11.73 0 0 0 12.06 0C5.52 0 .2 5.31.2 11.85c0 2.09.55 4.13 1.59 5.93L.1 24l6.38-1.67a11.86 11.86 0 0 0 5.58 1.42h.01c6.54 0 11.85-5.32 11.85-11.86 0-3.17-1.23-6.14-3.4-8.41ZM12.07 21.7h-.01a9.84 9.84 0 0 1-5.01-1.37l-.36-.22-3.79.99 1.01-3.69-.24-.38a9.8 9.8 0 0 1-1.51-5.18c0-5.41 4.41-9.81 9.83-9.81 2.61 0 5.06 1.02 6.91 2.88a9.75 9.75 0 0 1 2.87 6.93c0 5.41-4.41 9.81-9.82 9.81Zm5.38-7.35c-.29-.14-1.72-.85-1.99-.95-.27-.1-.46-.14-.66.14-.19.29-.75.95-.92 1.15-.17.19-.34.22-.63.07-.29-.14-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.12-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.66-1.59-.9-2.18-.24-.58-.48-.5-.66-.51h-.56c-.19 0-.5.07-.76.36-.26.29-1 0.97-1 2.37 0 1.4 1.02 2.75 1.16 2.94.14.19 2 3.05 4.84 4.28.67.29 1.2.46 1.61.59.68.22 1.31.19 1.8.11.55-.08 1.72-.7 1.96-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34Z"
            />
          </svg>
        </span>

        <span className={styles.quickChatText}>
          <small>CHAT ME ON</small>
          <strong>WhatsApp</strong>
        </span>

        <span className={styles.quickChatArrow}>↗</span>
      </motion.a>

      <motion.a
        href={profile.social.googleChat}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.quickChat} ${styles.quickChatRight}`}
        aria-label="Open Google Chat"
        whileHover={{ y: -4, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <span className={`${styles.quickChatIcon} ${styles.googleChatIcon}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 3h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-7.3l-3.8 4v-4H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>
            <path d="M7 7h10M7 10.5h7M7 14h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </span>

        <span className={styles.quickChatText}>
          <small>OPEN</small>
          <strong>Google Chat</strong>
        </span>

        <span className={styles.quickChatArrow}>↗</span>
      </motion.a>
    </div>
  )
}

function SocialProfileCard({
  link,
  index,
}: {
  link: SocialLink
  index: number
}) {
  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.profileCard} ${styles[`platform-${link.platform}`]}`}
      role="listitem"
      aria-label={`Open ${link.label} profile`}
      style={
        {
          '--profile-color': link.color,
        } as CSSProperties
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
      <RichLinkPreview
        url={link.href}
        label={link.label}
        username={link.username}
        accent={link.color}
      />
    </motion.a>
  )
}
