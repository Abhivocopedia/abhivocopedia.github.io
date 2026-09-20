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

  const handleMouseEnter = () => {
    // Hover only flips the card.
    // It MUST NOT start Spotify.
    setFlipped(true)
  }

  const handleMouseLeave = () => {
    // Leaving the profile card pauses Spotify.
    // Playback position is preserved by Spotify.
    controllerRef.current?.pause()
    setFlipped(false)
  }

  const handleFrontWidgetClick = () => {
    // Front widget opens the player but does not autoplay.
    setFlipped(true)
  }

  return (
    <div
      className={styles.shell}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          <button
            type="button"
            className={styles.musicButton}
            aria-label="Open featured Spotify track"
            onClick={handleFrontWidgetClick}
          >
            ▶
          </button>

          <div className={styles.bottomCaption}>
            <span>FEATURED TRACK</span>
            <strong>{featuredSong.title}</strong>
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
