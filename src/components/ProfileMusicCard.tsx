import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

import { featuredSong } from '../data/featuredSong'
import { profile } from '../data/profile'

import styles from './ProfileMusicCard.module.css'

function getSpotifyTrackId(url: string) {
  return url.match(/track\/([A-Za-z0-9]+)/)?.[1] ?? ''
}

export function ProfileMusicCard() {
  const [flipped, setFlipped] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [thumbnail, setThumbnail] = useState('')

  const openTimerRef = useRef<number | null>(null)

  const trackId = getSpotifyTrackId(featuredSong.spotifyUrl)

  const embedUrl = trackId
    ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
    : ''

  /*
   * Spotify oEmbed gives us the real artwork for the
   * little front-side mini-player.
   */
  useEffect(() => {
    const controller = new AbortController()

    fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(
        featuredSong.spotifyUrl,
      )}`,
      {
        signal: controller.signal,
      },
    )
      .then((response) => {
        if (!response.ok) throw new Error('Spotify oEmbed failed')
        return response.json()
      })
      .then((data: { thumbnail_url?: string }) => {
        if (data.thumbnail_url) {
          setThumbnail(data.thumbnail_url)
        }
      })
      .catch(() => {
        // Fallback artwork is handled entirely in CSS.
      })

    return () => controller.abort()
  }, [])

  const openPlayer = useCallback(() => {
    setFlipped(true)

    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current)
    }

    /*
     * Let the profile card visibly rotate first,
     * then promote the player to a real viewport overlay.
     */
    openTimerRef.current = window.setTimeout(() => {
      setFullscreen(true)
      openTimerRef.current = null
    }, 430)
  }, [])

  const closePlayer = useCallback(() => {
    setFullscreen(false)

    window.setTimeout(() => {
      setFlipped(false)
    }, 80)
  }, [])

  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current)
      }
    }
  }, [])

  /*
   * Lock the page behind the full-screen player.
   */
  useEffect(() => {
    if (!fullscreen) return

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [fullscreen])

  /*
   * Escape closes the full-screen player.
   */
  useEffect(() => {
    if (!fullscreen) return

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closePlayer()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [fullscreen, closePlayer])

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (fullscreen || flipped || event.pointerType === 'touch') {
        return
      }

      const rect = event.currentTarget.getBoundingClientRect()
      const y = event.clientY - rect.top

      /*
       * Upper half -> Spotify experience.
       */
      if (y <= rect.height * 0.5) {
        openPlayer()
      }
    },
    [fullscreen, flipped, openPlayer],
  )

  const handleKeyboard = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openPlayer()
      }

      if (event.key === 'Escape' && fullscreen) {
        event.preventDefault()
        closePlayer()
      }
    },
    [openPlayer, closePlayer, fullscreen],
  )

  return (
    <>
      <div
        className={styles.shell}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyboard}
        tabIndex={0}
        aria-label="Profile photo and featured Spotify player"
      >
        <div
          className={`${styles.card} ${
            flipped ? styles.cardFlipped : ''
          }`}
        >

          {/* =====================================================
              FRONT
          ===================================================== */}

          <div className={`${styles.face} ${styles.front}`}>

            <img
              src={profile.profilePhoto}
              alt={`${profile.name} - ${profile.identity}`}
              className={styles.profileImage}
              loading="eager"
            />

            <div className={styles.photoOverlay} />

            <div className={styles.frontLabel}>
              ABHIVOCOPEDIA
            </div>

            {/* =================================================
                MINI SPOTIFY WIDGET
                INSPIRED BY THE THIRD REFERENCE IMAGE
            ================================================= */}

            <div
              className={styles.frontMiniPlayer}
              onClick={(event) => {
                event.stopPropagation()
                openPlayer()
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openPlayer()
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Open ${featuredSong.title}`}
            >

              <div
                className={styles.miniArtwork}
                style={
                  thumbnail
                    ? { backgroundImage: `url("${thumbnail}")` }
                    : undefined
                }
              >
                {!thumbnail && (
                  <span className={styles.miniMusicIcon}>
                    ♪
                  </span>
                )}
              </div>

              <div className={styles.miniInfo}>
                <span className={styles.miniEyebrow}>
                  NOW PLAYING
                </span>

                <strong>
                  {featuredSong.title}
                </strong>

                <span>
                  {featuredSong.artist}
                </span>
              </div>

              <div className={styles.miniSpotifyIcon}>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="currentColor"
                  />

                  <path
                    d="M7 10.1c3.45-1 7.32-.7 10.2.65"
                    fill="none"
                    stroke="#111"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />

                  <path
                    d="M7.6 13c2.8-.7 5.8-.45 8.25.6"
                    fill="none"
                    stroke="#111"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  <path
                    d="M8.4 15.7c2.1-.4 4.2-.2 5.95.48"
                    fill="none"
                    stroke="#111"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className={styles.miniControls}>
                <span aria-hidden="true">‹</span>

                <button
                  type="button"
                  className={styles.miniPlay}
                  onClick={(event) => {
                    event.stopPropagation()
                    openPlayer()
                  }}
                  aria-label="Open Spotify player"
                >
                  ▶
                </button>

                <span aria-hidden="true">›</span>
              </div>

            </div>
</div>


          {/* =====================================================
              BACK
              The actual full-screen promotion happens through
              the portal below.
          ===================================================== */}

          <div className={`${styles.face} ${styles.back}`}>
            <div className={styles.backHint}>
              OPENING SPOTIFY
            </div>
          </div>

        </div>
      </div>


      {/* =======================================================
          FULL VIEWPORT SPOTIFY EXPERIENCE

          PORTAL = outside the transformed card
          so position:fixed really means the whole viewport.
      ======================================================= */}

      {fullscreen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className={styles.fullscreenPlayer}>

            <div className={styles.fullscreenTopbar}>
              <button
                type="button"
                className={styles.fullscreenBack}
                onClick={closePlayer}
                aria-label="Close Spotify player"
              >
                <span>‹</span>
              </button>

              <div className={styles.fullscreenIdentity}>
                <span>PLAYING FROM PORTFOLIO</span>
                <strong>{featuredSong.title}</strong>
              </div>

              <button
                type="button"
                className={styles.fullscreenClose}
                onClick={closePlayer}
                aria-label="Close"
              >
                ×
              </button>
            </div>


            <div className={styles.fullscreenPlayerStage}>

              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${featuredSong.title} by ${featuredSong.artist}`}
                  className={styles.fullscreenSpotifyEmbed}
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className={styles.fullscreenFallback}>
                  Spotify track unavailable.
                </div>
              )}

            </div>


            <div className={styles.fullscreenBottomBar}>

              <div>
                <span>NOW PLAYING</span>
                <strong>{featuredSong.title}</strong>
                <small>{featuredSong.artist}</small>
              </div>

              <a
                href={featuredSong.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.openSpotify}
              >
                OPEN SPOTIFY ↗
              </a>

            </div>

          </div>,
          document.body,
        )}
    </>
  )
}
