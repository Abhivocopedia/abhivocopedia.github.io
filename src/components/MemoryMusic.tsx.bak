import { useEffect, useRef } from 'react'

const MUSIC_SRC = '/music/music.mp3'

const MAX_VOLUME = 0.6
const FADE_DISTANCE = 900
const MUSIC_STORAGE_KEY = 'portfolio-music-enabled'
const MUSIC_EVENT = 'portfolio-music-change'

type MusicWindow = Window & {
  __portfolioMusicEnabled?: boolean
}

function getMusicPreference() {
  if (typeof window === 'undefined') {
    return true
  }

  const win = window as MusicWindow

  if (typeof win.__portfolioMusicEnabled === 'boolean') {
    return win.__portfolioMusicEnabled
  }

  const stored =
    window.localStorage.getItem(MUSIC_STORAGE_KEY)

  if (stored === 'true') {
    return true
  }

  if (stored === 'false') {
    return false
  }

  // Default ON.
  return true
}

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(max, Math.max(min, value))
}

function smoothstep(value: number) {
  const x = clamp(value, 0, 1)

  return x * x * (3 - 2 * x)
}

function calculateSectionProximity(
  section: HTMLElement,
) {
  const rect =
    section.getBoundingClientRect()

  const viewportHeight =
    window.innerHeight

  if (rect.bottom <= 0) {
    return 0
  }

  if (rect.top >= viewportHeight) {
    return 0
  }

  const sectionCenter =
    rect.top + rect.height / 2

  const viewportCenter =
    viewportHeight / 2

  const distance =
    Math.abs(
      sectionCenter -
        viewportCenter,
    )

  const range =
    viewportHeight / 2 +
    FADE_DISTANCE

  const normalized =
    1 - distance / range

  return smoothstep(normalized)
}

export function setPortfolioMusicEnabled(
  enabled: boolean,
) {
  if (
    typeof window === 'undefined'
  ) {
    return
  }

  const win =
    window as MusicWindow

  win.__portfolioMusicEnabled =
    enabled

  window.localStorage.setItem(
    MUSIC_STORAGE_KEY,
    String(enabled),
  )

  window.dispatchEvent(
    new Event(MUSIC_EVENT),
  )
}

export function getPortfolioMusicEnabled() {
  return getMusicPreference()
}

export function MemoryMusic() {
  const audioRef =
    useRef<HTMLAudioElement | null>(null)

  const sectionRef =
    useRef<HTMLElement | null>(null)

  const frameRef =
    useRef<number | null>(null)

  const enabledRef =
    useRef(true)

  const startedRef =
    useRef(false)

  const targetVolumeRef =
    useRef(0)

  useEffect(() => {
    const section =
      document.getElementById(
        'beyond-code',
      )

    if (!section) {
      console.warn(
        '[MemoryMusic] #beyond-code section not found.',
      )

      return
    }

    sectionRef.current = section

    const audio =
      new Audio(MUSIC_SRC)

    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0

    audioRef.current = audio

    enabledRef.current =
      getMusicPreference()

    const stopPlayback = () => {
      targetVolumeRef.current = 0

      audio.pause()

      audio.currentTime = 0

      startedRef.current = false
    }

    const startPlayback =
      async () => {
        if (
          !enabledRef.current
        ) {
          return
        }

        if (startedRef.current) {
          return
        }

        try {
          await audio.play()

          startedRef.current =
            true
        } catch {
          // Browser blocked playback.
          // The next user interaction will retry.
          startedRef.current =
            false
        }
      }

    const updateVolume = () => {
      if (
        !sectionRef.current
      ) {
        return
      }

      const proximity =
        calculateSectionProximity(
          sectionRef.current,
        )

      const targetVolume =
        enabledRef.current
          ? proximity * MAX_VOLUME
          : 0

      targetVolumeRef.current =
        targetVolume

      if (
        enabledRef.current &&
        proximity > 0.01
      ) {
        void startPlayback()
      }

      const currentVolume =
        audio.volume

      const nextVolume =
        currentVolume +
        (
          targetVolume -
          currentVolume
        ) *
          0.08

      audio.volume =
        clamp(
          nextVolume,
          0,
          MAX_VOLUME,
        )

      if (
        !enabledRef.current &&
        audio.volume < 0.005
      ) {
        stopPlayback()
      }

      frameRef.current =
        requestAnimationFrame(
          updateVolume,
        )
    }

    const handleUserInteraction =
      () => {
        if (
          !enabledRef.current
        ) {
          return
        }

        const proximity =
          sectionRef.current
            ? calculateSectionProximity(
                sectionRef.current,
              )
            : 0

        if (proximity > 0.01) {
          void startPlayback()
        }
      }

    const syncPreference =
      () => {
        enabledRef.current =
          getMusicPreference()

        if (
          !enabledRef.current
        ) {
          stopPlayback()
          return
        }

        handleUserInteraction()
      }

    const handleVisibility =
      () => {
        if (
          document.hidden
        ) {
          audio.pause()
          return
        }

        if (
          enabledRef.current
        ) {
          handleUserInteraction()
        }
      }

    window.addEventListener(
      'pointerdown',
      handleUserInteraction,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'keydown',
      handleUserInteraction,
    )

    window.addEventListener(
      'touchstart',
      handleUserInteraction,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'portfolio-music-change',
      syncPreference,
    )

    window.addEventListener(
      'storage',
      syncPreference,
    )

    document.addEventListener(
      'visibilitychange',
      handleVisibility,
    )

    frameRef.current =
      requestAnimationFrame(
        updateVolume,
      )

    return () => {
      if (
        frameRef.current !== null
      ) {
        cancelAnimationFrame(
          frameRef.current,
        )
      }

      window.removeEventListener(
        'pointerdown',
        handleUserInteraction,
      )

      window.removeEventListener(
        'keydown',
        handleUserInteraction,
      )

      window.removeEventListener(
        'touchstart',
        handleUserInteraction,
      )

      window.removeEventListener(
        'portfolio-music-change',
        syncPreference,
      )

      window.removeEventListener(
        'storage',
        syncPreference,
      )

      document.removeEventListener(
        'visibilitychange',
        handleVisibility,
      )

      audio.pause()

      audio.removeAttribute(
        'src',
      )

      audio.load()

      audioRef.current = null
    }
  }, [])

  return null
}
