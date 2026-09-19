import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import styles from './RichLinkPreview.module.css'

type LinkPreviewData = {
  ok: boolean
  url: string
  platform:
    | 'instagram'
    | 'github'
    | 'linkedin'
    | 'youtube'
    | 'x'
    | 'web'
  title: string
  description: string
  siteName: string
  favicon: string
  images: string[]
  image: string | null
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

function buildApiUrl(
  url: string,
) {
  return `${API_BASE}?url=${encodeURIComponent(url)}`
}

function platformName(
  platform: LinkPreviewData['platform'],
) {
  switch (platform) {
    case 'instagram':
      return 'Instagram'
    case 'github':
      return 'GitHub'
    case 'linkedin':
      return 'LinkedIn'
    case 'youtube':
      return 'YouTube'
    case 'x':
      return 'X'
    default:
      return 'WEB'
  }
}

function fallbackTiles(
  data: LinkPreviewData | null,
) {
  const images = [
    ...(data?.images || []),
  ]

  if (
    data?.image &&
    !images.includes(data.image)
  ) {
    images.unshift(data.image)
  }

  while (images.length < 6) {
    images.push('')
  }

  return images.slice(0, 6)
}

const tileContent = [
  'PROFILE',
  'LATEST',
  'BUILD',
  'POST',
  'MEDIA',
  'EXPLORE',
]

export function RichLinkPreview({
  url,
  label,
  username,
  accent,
}: RichLinkPreviewProps) {
  const [data, setData] =
    useState<LinkPreviewData | null>(null)

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
              `Preview request failed with ${response.status}.`,
          )
        }

        return result
      })
      .then((result) => {
        if (!cancelled) {
          setData(result)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData({
            ok: true,
            url,
            platform: 'web',
            title:
              label ||
              'Link Preview',
            description:
              'Open the destination to explore the original page.',
            siteName:
              label ||
              'WEB',
            favicon: '',
            images: [],
            image: null,
          })
        }
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

  const tiles =
    useMemo(
      () => fallbackTiles(data),
      [data],
    )

  const displayUsername =
    username ||
    data?.siteName ||
    label ||
    'Open profile'

  const displayTitle =
    data?.title ||
    label ||
    'Link Preview'

  const displayPlatform =
    data
      ? platformName(data.platform)
      : label || 'LINK'

  return (
    <div
      className={styles.root}
      style={
        {
          '--preview-accent':
            accent ||
            'var(--mustard)',
        } as CSSProperties
      }
    >
      <div className={styles.identity}>
        <div className={styles.avatar}>
          {data?.image ? (
            <img
              src={data.image}
              alt=""
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display =
                  'none'
              }}
            />
          ) : data?.favicon ? (
            <img
              src={data.favicon}
              alt=""
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display =
                  'none'
              }}
            />
          ) : (
            <span>
              {displayUsername
                .slice(0, 1)
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

        <span className={styles.platform}>
          {displayPlatform}
        </span>
      </div>

      <div
        className={styles.previewArea}
        aria-label={`${displayPlatform} link preview`}
      >
        {loading
          ? Array.from({
              length: 6,
            }).map((_, index) => (
              <motion.div
                key={index}
                className={
                  styles.floatingTile
                }
                initial={{
                  opacity: 0,
                  scale: 0.7,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.06,
                  duration: 0.4,
                }}
              >
                <div
                  className={
                    styles.skeletonTile
                  }
                />
              </motion.div>
            ))
          : tiles.map(
              (image, index) => (
                <motion.div
                  key={`${image}-${index}`}
                  className={
                    styles.floatingTile
                  }
                  whileHover={{
                    y: -10,
                    rotate: 0,
                    scale: 1.04,
                    zIndex: 10,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 18,
                  }}
                  style={
                    {
                      '--tile-index':
                        index,
                    } as CSSProperties
                  }
                >
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      className={
                        styles.tileImage
                      }
                      loading="lazy"
                      onError={(
                        event,
                      ) => {
                        event.currentTarget.style.display =
                          'none'

                        const parent =
                          event.currentTarget
                            .parentElement

                        parent?.classList.add(
                          styles.tileFailed,
                        )
                      }}
                    />
                  ) : null}

                  <div
                    className={
                      styles.tileOverlay
                    }
                  >
                    <span
                      className={
                        styles.tileNumber
                      }
                    >
                      0{index + 1}
                    </span>

                    <span
                      className={
                        styles.tileText
                      }
                    >
                      {image
                        ? displayPlatform
                        : tileContent[
                            index
                          ]}
                    </span>
                  </div>
                </motion.div>
              ),
            )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <span>
            {data?.siteName ||
              label ||
              'LINK'}
          </span>

          <small>
            {data?.description ||
              'Rich preview from the public destination.'}
          </small>
        </div>

        <span className={styles.open}>
          OPEN ↗
        </span>
      </div>
    </div>
  )
}
