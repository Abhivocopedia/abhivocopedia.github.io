import { useCallback, useEffect, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { featuredSong } from '../data/featuredSong'
import { profile } from '../data/profile'
import styles from './ProfileMusicCard.module.css'

function getSpotifyTrackId(url: string) {
  return url.match(/track\/([A-Za-z0-9]+)/)?.[1] ?? ''
}

export function ProfileMusicCard() {
  const [flipped, setFlipped] = useState(false)
  const [thumbnail, setThumbnail] = useState('')

  const trackId = getSpotifyTrackId(featuredSong.spotifyUrl)

  const embedUrl = trackId
    ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
    : ''

  useEffect(() => {
    const controller = new AbortController()

    fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(
        featuredSong.spotifyUrl,
      )}`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Spotify oEmbed request failed')
        }

        return response.json()
      })
      .then((data: { thumbnail_url?: string }) => {
        if (data.thumbnail_url) {
          setThumbnail(data.thumbnail_url)
        }
      })
      .catch(() => {
        // CSS fallback artwork remains available.
      })

    return () => controller.abort()
  }, [])

  const openPlayer = useCallback(() => {
    setFlipped(true)
  }, [])

  const closePlayer = useCallback(() => {
    setFlipped(false)
  }, [])

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (flipped || event.pointerType === 'touch') return

      const rect = event.currentTarget.getBoundingClientRect()
      const y = event.clientY - rect.top

      if (y <= rect.height * 0.5) {
        setFlipped(true)
      }
    },
    [flipped],
  )

  const handleKeyboard = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setFlipped((current) => !current)
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        setFlipped(false)
      }
    },
    [],
  )

  return (
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
            FRONT — PROFILE PHOTO
        ===================================================== */}

        <div className={`${styles.face} ${styles.front}`}>

          <img
            src={profile.profilePhoto}
            alt={`${profile.name} - ${profile.identity}`}
            className={styles.profileImage}
            loading="eager"
          />

          <div className={styles.photoOverlay} />

          {/* Bottom Spotify mini-widget */}
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
                  ? {
                      backgroundImage:
                        `url("${thumbnail}")`,
                    }
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
            BACK — SPOTIFY STAYS INSIDE SAME PROFILE CARD
        ===================================================== */}

        <div className={`${styles.face} ${styles.back}`}>

          <div className={styles.backHeader}>

            <div className={styles.backArtwork}>
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt=""
                />
              ) : (
                <div className={styles.backArtworkFallback}>
                  ♪
                </div>
              )}
            </div>

            <div className={styles.backMeta}>

              <span className={styles.backEyebrow}>
                NOW PLAYING
              </span>

              <h2>
                {featuredSong.title}
              </h2>

              <p>
                {featuredSong.artist}
              </p>

              <div className={styles.backActions}>
                <a
                  href={featuredSong.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.saveSpotify}
                  onClick={(event) => event.stopPropagation()}
                >
                  <span className={styles.spotifyPlus}>+</span>
                  SAVE ON SPOTIFY
                </a>

                <span className={styles.spotifyMark}>
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
                </span>
              </div>

            </div>
          </div>


          <div className={styles.backPlayback}>

            <div className={styles.fakeProgress}>
              <span />
            </div>

            <div className={styles.fakePlaybackRow}>

              <span className={styles.fakeTime}>
                00:00
              </span>

              <span className={styles.fakeDots}>
                •••
              </span>

              <button
                type="button"
                className={styles.backPlay}
                onClick={(event) => {
                  event.stopPropagation()
                }}
                aria-label="Play track in Spotify"
              >
                ▶
              </button>

            </div>

          </div>


          <div className={styles.realSpotifyEmbed}>

            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${featuredSong.title} by ${featuredSong.artist}`}
                className={styles.spotifyEmbed}
                loading="eager"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className={styles.playerFallback}>
                Spotify track unavailable.
              </div>
            )}

          </div>


          <button
            type="button"
            className={styles.flipBack}
            onClick={(event) => {
              event.stopPropagation()
              closePlayer()
            }}
            aria-label="Flip back to profile photo"
          >
            FLIP BACK ↩
          </button>

        </div>

        </div>
      </div>
  )
}
