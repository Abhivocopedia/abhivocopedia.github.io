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
