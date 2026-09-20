import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { featuredSong } from '../data/featuredSong'
import { profile } from '../data/profile'
import styles from './ProfileMusicCard.module.css'

interface SpotifyEmbedController {
  play: () => void
  pause: () => void
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: { uri: string },
    callback: (controller: SpotifyEmbedController) => void,
  ) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void
    SpotifyIframeApi?: SpotifyIframeApi
  }
}

function getSpotifyTrackId(url: string) {
  return url.match(/track\/([A-Za-z0-9]+)/)?.[1] ?? ''
}

let spotifyApiPromise: Promise<SpotifyIframeApi> | null = null

function loadSpotifyIframeApi(): Promise<SpotifyIframeApi> {
  if (spotifyApiPromise) return spotifyApiPromise

  spotifyApiPromise = new Promise<SpotifyIframeApi>((resolve, reject) => {
    if (window.SpotifyIframeApi) {
      resolve(window.SpotifyIframeApi)
      return
    }

    const previousReady = window.onSpotifyIframeApiReady

    window.onSpotifyIframeApiReady = (api) => {
      window.SpotifyIframeApi = api
      previousReady?.(api)
      resolve(api)
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-spotify-iframe-api]',
    )

    if (existingScript) {
      window.setTimeout(() => {
        if (window.SpotifyIframeApi) {
          resolve(window.SpotifyIframeApi)
        } else {
          reject(new Error('Spotify iFrame API did not initialize.'))
        }
      }, 10000)

      return
    }

    const script = document.createElement('script')
    script.src = 'https://open.spotify.com/embed/iframe-api/v1'
    script.async = true
    script.dataset.spotifyIframeApi = 'true'

    script.onerror = () => {
      reject(new Error('Failed to load Spotify iFrame API.'))
    }

    document.head.appendChild(script)

    window.setTimeout(() => {
      if (!window.SpotifyIframeApi) {
        reject(new Error('Spotify iFrame API timed out.'))
      }
    }, 10000)
  })

  return spotifyApiPromise
}

export function ProfileMusicCard() {
  const [flipped, setFlipped] = useState(false)

  const spotifyFrameRef = useRef<HTMLDivElement | null>(null)
  const controllerRef = useRef<SpotifyEmbedController | null>(null)
  const initializedRef = useRef(false)

  const trackId = getSpotifyTrackId(featuredSong.spotifyUrl)

  useEffect(() => {
    if (!trackId || !spotifyFrameRef.current || initializedRef.current) {
      return
    }

    initializedRef.current = true

    const initializeSpotify = async () => {
      try {
        const api = await loadSpotifyIframeApi()

        if (!spotifyFrameRef.current) return

        api.createController(
          spotifyFrameRef.current,
          {
            uri: `spotify:track:${trackId}`,
          },
          (controller) => {
            controllerRef.current = controller

            // IMPORTANT:
            // Never autoplay. Spotify starts only when its own Play
            // button is clicked by the user.
            controller.pause()
          },
        )
      } catch (error) {
        console.error('Spotify initialization failed:', error)
      }
    }

    void initializeSpotify()

    return () => {
      controllerRef.current?.pause()
      controllerRef.current = null
    }
  }, [trackId])

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const y = event.clientY - rect.top

    // Only the upper half flips the card.
    // The lower half keeps the colorful front widget visible.
    if (y < rect.height / 2) {
      setFlipped(true)
    } else {
      setFlipped(false)
    }
  }

  const handlePointerLeave = () => {
    controllerRef.current?.pause()
    setFlipped(false)
  }


  return (
    <div
      className={styles.shell}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className={`${styles.card} ${flipped ? styles.cardFlipped : ''}`}>
        {/* FRONT */}
        <div className={`${styles.face} ${styles.front}`}>
          <img
            className={styles.profileImage}
            src={profile.profilePhoto}
            alt={profile.name}
          />

          <div className={styles.photoOverlay} />

          <div className={styles.frontLabel}>
            ABHIVOCOPEDIA
          </div>

          {/* EXISTING FRONT MUSIC WIDGET RESTORED */}
          <div className={styles.spotifyMiniWidget}>
            <div className={styles.spotifyMiniTop}>
              <div className={styles.spotifyMiniArtwork}>
                <span aria-hidden="true">♪</span>
              </div>

              <div className={styles.spotifyMiniInfo}>
                <span className={styles.spotifyMiniTitle}>
                  {featuredSong.title}
                </span>
                <span className={styles.spotifyMiniArtist}>
                  {featuredSong.artist}
                </span>
              </div>

              <div className={styles.spotifyMiniSpotify}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M7 9.2c3.2-1 6.9-.8 10 .5" />
                  <path d="M7.8 12.2c2.7-.7 5.6-.5 8.2.6" />
                  <path d="M8.8 15.1c2.1-.4 4.3-.2 6.1.5" />
                </svg>
              </div>
            </div>

            <div className={styles.spotifyMiniControls}>
              <span className={styles.spotifyMiniControl} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M18 5v14L6 12z" />
                  <path d="M6 5v14" />
                </svg>
              </span>

              <span className={`${styles.spotifyMiniControl} ${styles.spotifyMiniPlay}`} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5.5v13L19 12z" />
                </svg>
              </span>

              <span className={styles.spotifyMiniControl} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M6 5v14l12-7z" />
                  <path d="M18 5v14" />
                </svg>
              </span>
            </div>

            <div className={styles.spotifyMiniProgress}>
              <span />
            </div>
          </div>

<div className={styles.hoverHint}>
            HOVER TO OPEN PLAYER
          </div>
        </div>

        {/* BACK */}
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
            <strong>{featuredSong.title}</strong>
            <span>{featuredSong.artist}</span>
          </div>

          <div
            ref={spotifyFrameRef}
            className={styles.spotifyFrame}
            aria-label={`Spotify player for ${featuredSong.title}`}
          />

          <div className={styles.playerFooter}>
            <a
              href={featuredSong.spotifyUrl}
              target="_blank"
              rel="noreferrer"
            >
              OPEN IN SPOTIFY
            </a>

            <button
              type="button"
              className={styles.flipBack}
              onClick={() => {
                controllerRef.current?.pause()
                setFlipped(false)
              }}
            >
              FLIP BACK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
