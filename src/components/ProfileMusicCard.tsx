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
  const [albumArtUrl, setAlbumArtUrl] = useState('')

  const trackId = getSpotifyTrackId(featuredSong.spotifyUrl)

  const embedUrl = trackId
    ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
    : ''

  useEffect(() => {
    let cancelled = false

    const loadAlbumArt = async () => {
      try {
        const response = await fetch(
          `https://open.spotify.com/oembed?url=${encodeURIComponent(
            featuredSong.spotifyUrl,
          )}`,
        )

        if (!response.ok) return

        const data = (await response.json()) as {
          thumbnail_url?: string
        }

        if (!cancelled && data.thumbnail_url) {
          setAlbumArtUrl(data.thumbnail_url)
        }
      } catch {
        // Keep the local fallback artwork when Spotify metadata is unavailable.
      }
    }

    void loadAlbumArt()

    return () => {
      cancelled = true
    }
  }, [])

  /*
   * Upper half:
   *   hover -> flip
   *
   * Once flipped:
   *   stay flipped
   *
   * Click:
   *   flip back to profile
   */
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

  const handleCardClick = () => {
    setFlipped((current) => !current)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setFlipped((current) => !current)
    }
  }

  return (
    <div
      className={styles.shell}
      onPointerMove={handlePointerMove}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Profile photo with featured Spotify song"
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

          <div className={styles.frontLabel}>
            <span>ABHIVOCOPEDIA</span>
          </div>

          {/* Compact Spotify-style widget */}
          <button
            type="button"
            className={styles.spotifyMiniWidget}
            aria-label={`Open Spotify player for ${featuredSong.title}`}
            onClick={(event) => {
              event.stopPropagation()
              setFlipped(true)
            }}
          >
            <span className={styles.spotifyMiniTop}>
              <span className={styles.spotifyMiniArtwork}>
                {albumArtUrl ? (
                  <img
                    src={albumArtUrl}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <span aria-hidden="true">♪</span>
                )}
              </span>

              <span className={styles.spotifyMiniInfo}>
                <span className={styles.spotifyMiniTitle}>
                  {featuredSong.title}
                </span>

                <span className={styles.spotifyMiniArtist}>
                  {featuredSong.artist}
                </span>
              </span>

              <span
                className={styles.spotifyMiniBrand}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M7 9.4c3.7-1.1 6.9-.8 10 .5" />
                  <path d="M7.5 12.2c3-.8 5.9-.55 8.9.58" />
                  <path d="M8 14.9c2.25-.55 4.5-.35 6.8.45" />
                </svg>
              </span>
            </span>

            <span
              className={styles.spotifyMiniControls}
              aria-hidden="true"
            >
              <span className={styles.spotifyMiniControl}>
                <svg viewBox="0 0 24 24">
                  <path d="M18 5v14L6 12z" />
                  <path d="M6 5v14" />
                </svg>
              </span>

              <span
                className={`${styles.spotifyMiniControl} ${styles.spotifyMiniPlay}`}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M8 5.5v13L19 12z" />
                </svg>
              </span>

              <span className={styles.spotifyMiniControl}>
                <svg viewBox="0 0 24 24">
                  <path d="M6 5v14l12-7z" />
                  <path d="M18 5v14" />
                </svg>
              </span>
            </span>

            <span className={styles.spotifyMiniProgress}>
              <span />
            </span>
          </button>

          <div className={styles.hoverHint}>
            HOVER TOP HALF
            <span>FOR MUSIC ↗</span>
          </div>
        </div>

        {/* =====================================================
            BACK — REAL SPOTIFY EMBED
        ===================================================== */}
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.playerTop}>
            <span className={styles.playerEyebrow}>
              NOW PLAYING
            </span>

            <span className={styles.spotifyBadge}>
              SPOTIFY
            </span>
          </div>

          <div className={styles.playerIdentity}>
            <div className={styles.musicDot}>
              <span />
              <span />
              <span />
            </div>

            <div>
              <strong>{featuredSong.title}</strong>
              <span>{featuredSong.artist}</span>
            </div>
          </div>

          <div className={styles.spotifyFrame}>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${featuredSong.title} by ${featuredSong.artist}`}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className={styles.playerFallback}>
                <p>Spotify track unavailable.</p>
              </div>
            )}
          </div>

          <div className={styles.playerFooter}>
            <a
              href={featuredSong.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.spotifyLink}
              onClick={(event) => event.stopPropagation()}
            >
              OPEN IN SPOTIFY
              <span>↗</span>
            </a>

            <button
              type="button"
              className={styles.flipBack}
              onClick={(event) => {
                event.stopPropagation()
                setFlipped(false)
              }}
            >
              FLIP BACK
              <span>↩</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
