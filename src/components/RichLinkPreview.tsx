import {
  useEffect,
  useMemo,
  useState,
} from 'react'
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

function buildApiUrl(url: string) {
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
  images: string[],
) {
  const tiles = [...images]

  while (tiles.length < 6) {
    tiles.push('')
  }

  return tiles.slice(0, 6)
}

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

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)
    setData(null)

    fetch(buildApiUrl(url))
      .then(async (response) => {
        const result =
          (await response.json()) as LinkPreviewData

        if (!response.ok || !result.ok) {
          throw new Error(
            result.error ||
              'Preview could not be generated.',
          )
        }

        return result
      })
      .then((result) => {
        if (cancelled) {
          return
        }

        setData(result)
      })
      .catch((reason) => {
        if (cancelled) {
          return
        }

        setError(
          reason instanceof Error
            ? reason.message
            : 'Preview unavailable.',
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
  }, [url])

  const tiles = useMemo(
    () =>
      fallbackTiles(
        data?.images || [],
      ),
    [data?.images],
  )

  const displayTitle =
    data?.title ||
    label ||
    'Link Preview'

  const displayUsername =
    username ||
    data?.siteName ||
    'Open profile'

  return (
    <div
      className={styles.root}
      style={
        {
          '--preview-accent':
            accent || 'var(--mustard)',
        } as React.CSSProperties
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
            />
          ) : (
            <span>↗</span>
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
          {data
            ? platformName(data.platform)
            : label || 'LINK'}
        </span>
      </div>

      <div className={styles.previewArea}>
        {loading && (
          <div
            className={styles.loadingGrid}
            aria-label="Loading link preview"
          >
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <span
                  key={index}
                  className={
                    styles.skeleton
                  }
                />
              ),
            )}
          </div>
        )}

        {!loading && data && (
          <div
            className={styles.imageGrid}
          >
            {tiles.map(
              (image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={
                    styles.imageTile
                  }
                >
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={
                        styles.emptyTile
                      }
                    >
                      <span>
                        {index + 1}
                      </span>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        )}

        {!loading && error && (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>
              !
            </span>

            <div>
              <strong>
                Preview unavailable
              </strong>

              <p>
                Open the link to view the
                original page.
              </p>
            </div>
          </div>
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
              'Rich preview generated from the public page.'}
          </small>
        </div>

        <motion.span
          className={styles.open}
          whileHover={{
            x: 4,
          }}
        >
          OPEN ↗
        </motion.span>
      </div>
    </div>
  )
}
