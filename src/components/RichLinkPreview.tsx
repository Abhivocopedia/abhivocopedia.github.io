import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { motion } from 'framer-motion'
import styles from './RichLinkPreview.module.css'

type PreviewPlatform =
  | 'instagram'
  | 'github'
  | 'linkedin'
  | 'youtube'
  | 'x'
  | 'web'

type PreviewTile = {
  type: 'image' | 'text'
  src?: string
  label: string
  meta?: string
}

type LinkPreviewData = {
  ok: boolean
  url: string
  platform: PreviewPlatform
  title: string
  description: string
  siteName: string
  favicon: string
  images: string[]
  image: string | null
  tiles: PreviewTile[]
  error?: string
}

type RichLinkPreviewProps = {
  url: string
  label?: string
  username?: string
  accent?: string
}

const API_BASE =
  import.meta.env.VITE_LINK_PREVIEW_API ||
  '/api/link-preview'

function buildApiUrl(url: string) {
  return `${API_BASE}?url=${encodeURIComponent(url)}`
}

function detectPlatform(url: string): PreviewPlatform {
  try {
    const host = new URL(url).hostname
      .toLowerCase()
      .replace(/^www\./, '')

    if (
      host === 'github.com' ||
      host.endsWith('.github.com')
    ) {
      return 'github'
    }

    if (
      host === 'instagram.com' ||
      host.endsWith('.instagram.com')
    ) {
      return 'instagram'
    }

    if (
      host === 'linkedin.com' ||
      host.endsWith('.linkedin.com')
    ) {
      return 'linkedin'
    }

    if (
      host === 'youtube.com' ||
      host === 'youtu.be' ||
      host.endsWith('.youtube.com')
    ) {
      return 'youtube'
    }

    if (
      host === 'x.com' ||
      host === 'twitter.com' ||
      host.endsWith('.x.com') ||
      host.endsWith('.twitter.com')
    ) {
      return 'x'
    }
  } catch {
    // Keep generic web fallback.
  }

  return 'web'
}

function platformLabel(
  platform: PreviewPlatform,
) {
  switch (platform) {
    case 'github':
      return 'GITHUB'
    case 'linkedin':
      return 'LINKEDIN'
    case 'instagram':
      return 'INSTAGRAM'
    case 'youtube':
      return 'YOUTUBE'
    case 'x':
      return 'X'
    default:
      return 'WEB'
  }
}

function fallbackTiles(
  platform: PreviewPlatform,
): PreviewTile[] {
  if (platform === 'youtube') {
    return []
  }

  const sets: Record<
    Exclude<PreviewPlatform, 'youtube'>,
    string[]
  > = {
    github: [
      'PROFILE',
      'RECENT REPO',
      'RECENT FILE',
      'COMMITS',
      'README',
      'EXPLORE',
    ],

    instagram: [
      'PROFILE',
      'LATEST',
      'POST',
      'MEDIA',
      'REELS',
      'EXPLORE',
    ],

    linkedin: [
      'PROFILE',
      'LATEST',
      'POST',
      'EXPERIENCE',
      'ABOUT',
      'ACTIVITY',
    ],

    x: [
      'PROFILE',
      'LATEST',
      'POSTS',
      'MEDIA',
      'ABOUT',
      'EXPLORE',
    ],

    web: [
      'PAGE',
      'LATEST',
      'MEDIA',
      'INFO',
      'LINK',
      'EXPLORE',
    ],
  }

  return sets[platform].map((label) => ({
    type: 'text',
    label,
  }))
}

function makeFallbackData(
  url: string,
  label?: string,
): LinkPreviewData {
  const platform = detectPlatform(url)

  return {
    ok: false,
    url,
    platform,
    title: label || platformLabel(platform),
    description:
      'Open the destination to explore the original.',
    siteName: platformLabel(platform),
    favicon: '',
    images: [],
    image: null,
    tiles: fallbackTiles(platform),
  }
}

export function RichLinkPreview({
  url,
  label,
  username,
  accent,
}: RichLinkPreviewProps) {
  const requestedPlatform =
    useMemo(
      () => detectPlatform(url),
      [url],
    )

  const [data, setData] =
    useState<LinkPreviewData | null>(
      null,
    )

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setData(null)

    fetch(buildApiUrl(url))
      .then(async (response) => {
        const result =
          (await response.json()) as LinkPreviewData

        if (!response.ok) {
          throw new Error(
            result.error ||
              'Preview unavailable.',
          )
        }

        return result
      })
      .then((result) => {
        if (cancelled) return

        setData(result)
      })
      .catch(() => {
        if (cancelled) return

        setData(
          makeFallbackData(
            url,
            label,
          ),
        )
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [url, label])

  const platform =
    data?.platform ||
    requestedPlatform

  const tiles =
    data?.tiles?.length
      ? data.tiles
      : fallbackTiles(platform)

  const displayUsername =
    username ||
    data?.title ||
    label ||
    platformLabel(platform)

  const displayTitle =
    data?.title ||
    label ||
    platformLabel(platform)

  const avatar =
    data?.image ||
    data?.favicon ||
    null

  const isYoutube =
    platform === 'youtube'

  return (
    <div
      className={`${styles.root} ${
        isYoutube
          ? styles.youtubeRoot
          : ''
      }`}
      style={
        {
          '--preview-accent':
            accent ||
            'var(--mustard)',
        } as React.CSSProperties
      }
    >
      {/* HEADER */}
      <div className={styles.identity}>
        <div className={styles.avatar}>
          {avatar ? (
            <img
              src={avatar}
              alt=""
              loading="lazy"
            />
          ) : (
            <span>
              {displayUsername
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>

        <div className={styles.identityText}>
          <strong>
            {displayUsername}
          </strong>

          <span>
            {displayTitle}
          </span>
        </div>

        <span
          className={styles.platform}
        >
          {platformLabel(platform)}
        </span>
      </div>

      {/* CONTENT */}
      {!isYoutube && (
        <div className={styles.previewArea}>
          {loading ? (
            <div
              className={
                styles.tileGrid
              }
              aria-label="Loading preview"
            >
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <motion.div
                  key={index}
                  className={`${styles.tile} ${styles.loadingTile}`}
                  animate={{
                    y: [
                      0,
                      -5,
                      0,
                    ],
                    rotate: [
                      -2,
                      1,
                      -2,
                    ],
                  }}
                  transition={{
                    duration:
                      2.4 +
                      index * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay:
                      index * 0.08,
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className={styles.tileGrid}
            >
              {tiles
                .slice(0, 6)
                .map(
                  (
                    tile,
                    index,
                  ) => (
                    <motion.div
                      key={`${tile.label}-${index}`}
                      className={`${styles.tile} ${
                        tile.type ===
                        'image'
                          ? styles.imageTile
                          : styles.textTile
                      }`}
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: [
                          0,
                          index % 2
                            ? -4
                            : 4,
                          0,
                        ],
                        rotate:
                          index % 2
                            ? 1.4
                            : -1.4,
                      }}
                      transition={{
                        opacity: {
                          duration: 0.45,
                          delay:
                            index * 0.06,
                        },
                        scale: {
                          duration: 0.45,
                          delay:
                            index * 0.06,
                          ease: [
                            0.16,
                            1,
                            0.3,
                            1,
                          ],
                        },
                        y: {
                          duration:
                            3.2 +
                            index *
                              0.2,
                          repeat:
                            Infinity,
                          ease: 'easeInOut',
                          delay:
                            index * 0.12,
                        },
                        rotate: {
                          duration:
                            3.8 +
                            index *
                              0.15,
                          repeat:
                            Infinity,
                          ease: 'easeInOut',
                        },
                      }}
                      whileHover={{
                        scale: 1.05,
                        rotate: 0,
                        zIndex: 5,
                      }}
                    >
                      {tile.type ===
                        'image' &&
                      tile.src ? (
                        <>
                          <img
                            src={tile.src}
                            alt=""
                            loading="lazy"
                          />

                          <span
                            className={
                              styles.imageLabel
                            }
                          >
                            {
                              tile.label
                            }
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            className={
                              styles.tileNumber
                            }
                          >
                            {String(
                              index + 1,
                            ).padStart(
                              2,
                              '0',
                            )}
                          </span>

                          <span
                            className={
                              styles.tileLabel
                            }
                          >
                            {
                              tile.label
                            }
                          </span>

                          {tile.meta && (
                            <span
                              className={
                                styles.tileMeta
                              }
                            >
                              {
                                tile.meta
                              }
                            </span>
                          )}
                        </>
                      )}
                    </motion.div>
                  ),
                )}
            </div>
          )}
        </div>
      )}

      {/* YOUTUBE EMPTY STATE */}
      {isYoutube && (
        <div
          className={styles.youtubeSpace}
          aria-hidden="true"
        />
      )}

      {/* FOOTER */}
      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <span>
            {data?.siteName ||
              platformLabel(
                platform,
              )}
          </span>

          <small>
            {data?.description ||
              'Open the original profile.'}
          </small>
        </div>

        <span
          className={styles.open}
        >
          OPEN ↗
        </span>
      </div>
    </div>
  )
}
