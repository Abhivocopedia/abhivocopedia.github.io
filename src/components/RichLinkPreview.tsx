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

type PlatformKey =
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'youtube'
  | 'x'
  | 'photography'
  | 'web'

type PlatformInfo = {
  name: string
  color: string
  icon: JSX.Element
}

const API_BASE =
  import.meta.env.VITE_LINK_PREVIEW_API ||
  '/api/link-preview'

function buildApiUrl(url: string) {
  return `${API_BASE}?url=${encodeURIComponent(url)}`
}

/* =========================================================
   PLATFORM DETECTION
========================================================= */

function detectPlatform(
  url: string,
  label?: string,
): PlatformKey {
  const value = `${url} ${label || ''}`.toLowerCase()

  if (
    value.includes('instagram.com') ||
    value.includes('instagram')
  ) {
    return 'instagram'
  }

  if (
    value.includes('github.com') ||
    value.includes('github')
  ) {
    return 'github'
  }

  if (
    value.includes('linkedin.com') ||
    value.includes('linkedin')
  ) {
    return 'linkedin'
  }

  if (
    value.includes('youtube.com') ||
    value.includes('youtu.be') ||
    value.includes('youtube')
  ) {
    return 'youtube'
  }

  if (
    value.includes('x.com') ||
    value.includes('twitter.com') ||
    value.includes(' twitter')
  ) {
    return 'x'
  }

  if (
    value.includes('photography') ||
    value.includes('camera')
  ) {
    return 'photography'
  }

  return 'web'
}

/* =========================================================
   PLATFORM INFO
========================================================= */

function getPlatformInfo(
  platform: PlatformKey,
): PlatformInfo {
  switch (platform) {
    case 'github':
      return {
        name: 'GitHub',
        color: '#f0f0f0',
        icon: <GitHubIcon />,
      }

    case 'linkedin':
      return {
        name: 'LinkedIn',
        color: '#0a66c2',
        icon: <LinkedInIcon />,
      }

    case 'instagram':
      return {
        name: 'Instagram',
        color: '#e1306c',
        icon: <InstagramIcon />,
      }

    case 'youtube':
      return {
        name: 'YouTube',
        color: '#ff0000',
        icon: <YouTubeIcon />,
      }

    case 'x':
      return {
        name: 'X',
        color: '#ffffff',
        icon: <XIcon />,
      }

    case 'photography':
      return {
        name: 'Photography',
        color: '#65a884',
        icon: <CameraIcon />,
      }

    default:
      return {
        name: 'Web',
        color: '#ffffff',
        icon: <GlobeIcon />,
      }
  }
}

/* =========================================================
   IMAGE NORMALIZATION
========================================================= */

function getPreviewImages(
  data: LinkPreviewData | null,
) {
  if (!data) {
    return []
  }

  const values = [
    data.image,
    ...(data.images || []),
  ].filter(
    (value): value is string =>
      Boolean(value),
  )

  return [...new Set(values)]
}

/* =========================================================
   COMPONENT
========================================================= */

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
        let result: LinkPreviewData | null = null

        try {
          result =
            (await response.json()) as LinkPreviewData
        } catch {
          throw new Error(
            'Preview service returned invalid data.',
          )
        }

        if (
          !response.ok ||
          !result ||
          !result.ok
        ) {
          throw new Error(
            result?.error ||
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

  const detectedPlatform = useMemo(
    () =>
      detectPlatform(
        data?.url || url,
        label,
      ),
    [data?.url, label, url],
  )

  const platform =
    data?.platform || detectedPlatform

  const platformInfo = getPlatformInfo(
    platform as PlatformKey,
  )

  const images = getPreviewImages(data)

  const displayTitle =
    data?.title ||
    label ||
    platformInfo.name

  const displayUsername =
    username ||
    data?.siteName ||
    platformInfo.name

  const hasPreview =
    !error &&
    !loading &&
    Boolean(data)

  const rootStyle = {
    '--preview-accent':
      accent || platformInfo.color,
    '--platform-color':
      platformInfo.color,
  } as CSSProperties

  return (
    <div
      className={`${styles.root} ${
        loading
          ? styles.rootLoading
          : hasPreview
            ? styles.rootPreview
            : styles.rootFallback
      }`}
      style={rootStyle}
    >
      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

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
            <span>
              {platformInfo.icon}
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
          {data
            ? getPlatformInfo(
                data.platform,
              ).name
            : platformInfo.name}
        </span>
      </div>

      {/* =====================================================
          PREVIEW / FALLBACK CONTAINER
      ===================================================== */}

      <div className={styles.previewContainer}>
        {loading && (
          <div
            className={styles.loadingState}
            aria-label="Loading preview"
          >
            <div
              className={
                styles.loadingOrb
              }
            />

            <span>
              FETCHING PREVIEW
            </span>
          </div>
        )}

        {!loading &&
          hasPreview &&
          images.length > 0 && (
            <PreviewMedia
              images={images}
              title={displayTitle}
            />
          )}

        {!loading &&
          hasPreview &&
          images.length === 0 && (
            <PreviewContent
              title={displayTitle}
              description={
                data?.description || ''
              }
              favicon={data?.favicon}
            />
          )}

        {!loading &&
          !hasPreview && (
            <FallbackPreview
              platform={platformInfo}
            />
          )}
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <span>
            {data?.siteName ||
              label ||
              platformInfo.name}
          </span>

          <small>
            {hasPreview
              ? data?.description ||
                'Public page preview'
              : 'Preview unavailable — open the original page'}
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

/* =========================================================
   REAL IMAGE PREVIEW
========================================================= */

function PreviewMedia({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const visibleImages = images.slice(0, 5)

  const [failedImages, setFailedImages] =
    useState<string[]>([])

  const validImages =
    visibleImages.filter(
      (image) =>
        !failedImages.includes(image),
    )

  const markFailed = (
    image: string,
  ) => {
    setFailedImages((current) =>
      current.includes(image)
        ? current
        : [...current, image],
    )
  }

  if (validImages.length === 0) {
    return (
      <div className={styles.imageFailure}>
        <span>
          PREVIEW IMAGE UNAVAILABLE
        </span>
      </div>
    )
  }

  return (
    <div className={styles.mediaStage}>
      <div
        className={styles.primaryImage}
      >
        <img
          src={validImages[0]}
          alt={title}
          loading="lazy"
          onError={() =>
            markFailed(validImages[0])
          }
        />
      </div>

      {validImages
        .slice(1, 5)
        .map((image, index) => (
          <div
            key={image}
            className={`${styles.floatingImage} ${
              styles[
                `floatingImage${index + 1}`
              ]
            }`}
          >
            <img
              src={image}
              alt=""
              loading="lazy"
              onError={() =>
                markFailed(image)
              }
            />
          </div>
        ))}

      <div
        className={styles.mediaBadge}
      >
        LIVE PREVIEW
      </div>
    </div>
  )
}

/* =========================================================
   TEXT / META PREVIEW
========================================================= */

function PreviewContent({
  title,
  description,
  favicon,
}: {
  title: string
  description: string
  favicon?: string
}) {
  return (
    <div className={styles.contentPreview}>
      <div className={styles.contentMark}>
        {favicon ? (
          <img
            src={favicon}
            alt=""
            loading="lazy"
          />
        ) : (
          <GlobeIcon />
        )}
      </div>

      <div
        className={styles.contentText}
      >
        <span>
          PAGE PREVIEW
        </span>

        <strong>
          {title}
        </strong>

        {description && (
          <p>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   FALLBACK LOGO
========================================================= */

function FallbackPreview({
  platform,
}: {
  platform: PlatformInfo
}) {
  return (
    <div
      className={styles.fallback}
    >
      <div
        className={styles.fallbackLogo}
        aria-hidden="true"
      >
        {platform.icon}
      </div>

      <span
        className={styles.fallbackLabel}
      >
        {platform.name}
      </span>

      <span
        className={styles.fallbackHint}
      >
        PREVIEW UNAVAILABLE · OPEN PROFILE
      </span>
    </div>
  )
}

/* =========================================================
   ICONS
========================================================= */

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.5 11.5 0 0 1 12 5.8c1.02.01 2.05.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0Z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0Z"
      />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
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
        r="1.1"
        fill="currentColor"
      />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.9.58 9.4.58 9.4.58s7.5 0 9.4-.58a3 3 0 0 0 2.1-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8Z"
      />

      <path
        d="m9.5 8.5 6 3.5-6 3.5v-7Z"
        fill="#111"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z"
      />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M3 7h4l1.5-2h7L17 7h4a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 21 20H3a1.5 1.5 0 0 1-1.5-1.5v-10A1.5 1.5 0 0 1 3 7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="12"
        cy="13"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M3 12h18M12 3c2.1 2.5 3.2 5.5 3.2 9s-1.1 6.5-3.2 9c-2.1-2.5-3.2-5.5-3.2-9S9.9 5.5 12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  )
}
