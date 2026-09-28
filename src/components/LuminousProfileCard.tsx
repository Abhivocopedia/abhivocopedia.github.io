import { useState } from 'react'
import { featuredSong } from '../data/featuredSong'
import { profile } from '../data/profile'
import styles from './LuminousProfileCard.module.css'

function getSpotifyTrackId(url: string) {
  return url.match(/track\/([A-Za-z0-9]+)/)?.[1] ?? ''
}

export function LuminousProfileCard() {
  const [lumenOn, setLumenOn] = useState(false)

  const trackId = getSpotifyTrackId(featuredSong.spotifyUrl)

  const embedUrl = trackId
    ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`
    : ''
  return (
    <div
      className={styles.shell}
    >
      <div
        ${PLACEHOLDER}
      >
      </div>
    </div>
  )
}
