import { useId, useState } from 'react'
import { featuredSong } from '../data/featuredSong'
import { profile } from '../data/profile'
import styles from './LuminousProfileCard.module.css'

function getSpotifyTrackId(url: string) {
  return url.match(/track\/([A-Za-z0-9]+)/)?.[1] ?? ''
}

export function LuminousProfileCard() {
  const [lumenOn, setLumenOn] = useState(false)

  const instanceId = useId().replace(/:/g, '')
  const trackId = getSpotifyTrackId(featuredSong.spotifyUrl)

  const embedUrl = trackId
    ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
    : ''

  return (
    <div className={styles.shell}>
      <div
        className={`${styles.card} ${
          lumenOn ? styles.lumenOn : ''
        }`}
      >
        {/* =====================================================
            PROFILE PHOTO
        ===================================================== */}
        <div className={styles.photo}>
          <img
            src={profile.profilePhoto}
            alt={`${profile.name} - ${profile.identity}`}
            draggable="false"
            loading="eager"
          />
        </div>

        {/* =====================================================
            ORIGINAL LUMINOUS LIGHT SYSTEM
        ===================================================== */}
        <div className={styles.lightLayer} aria-hidden="true">
          <div className={styles.slit} />

          <div className={styles.lumen}>
            <div className={styles.min} />
            <div className={styles.mid} />
            <div className={styles.hi} />
          </div>

          <div className={styles.darken}>
            <div className={styles.sl} />
            <div className={styles.ll} />
            <div className={styles.slt} />
            <div className={styles.srt} />
          </div>
        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className={styles.content}>
          <div className={styles.topLabel}>
            PROFILE / SYSTEM
          </div>

          <div className={styles.bottom}>
            <div className={styles.title}>
              ABHIVOCOPEDIA
            </div>

            {/* =================================================
                REAL SPOTIFY EMBED
            ================================================= */}
            <div
              className={styles.spotifyMini}
              onPointerDown={(event) => {
                event.stopPropagation()
              }}
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              {embedUrl ? (
                <iframe
                  key={`${instanceId}-${trackId}`}
                  src={embedUrl}
                  title={`Spotify player for ${featuredSong.title}`}
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className={styles.playerFallback}>
                  Spotify track unavailable.
                </div>
              )}
            </div>

            <p className={styles.description}>
              LIGHT FOLDS AROUND FORM
              <br />
              REVEALING LAYERS OF DEPTH
            </p>

            {/* =================================================
                LUMEN CONTROL
            ================================================= */}
            <button
              type="button"
              className={styles.luminousToggle}
              onClick={() => {
                setLumenOn((current) => !current)
              }}
              aria-pressed={lumenOn}
            >
              <span className={styles.luminousToggleRail}>
                <span className={styles.luminousHandle} />
              </span>

              <span className={styles.luminousToggleLabel}>
                {lumenOn
                  ? 'DEACTIVATE LUMEN'
                  : 'ACTIVATE LUMEN'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
