import { useEffect, useRef } from 'react'

const MUSIC_SRC = '/music/music.mp3'
const MAX_VOLUME = 0.6
const FADE_DISTANCE = 900

type WindowWithAudioFlag = Window & {
  __portfolioAudioEnabled?: boolean
}

function readAudioPreference() {
  const win = window as WindowWithAudioFlag

  if (typeof win.__portfolioAudioEnabled === 'boolean') {
    return win.__portfolioAudioEnabled
  }

  const keys = [
    'portfolio-audio-enabled',
    'portfolio-sound-enabled',
    'audio-enabled',
    'sound-enabled',
    'audioEnabled',
    'soundEnabled',
  ]

  for (const key of keys) {
    const value = window.localStorage.getItem(key)

    if (value === 'true') {
      return true
    }

    if (value === 'false') {
      return false
    }
  }

  // Default:
  // audio is off until the existing sound control enables it.
  return false
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function smoothstep(value: number) {
  const x = clamp(value, 0, 1)
  return x * x * (3 - 2 * x)
}

function calculateSectionProximity(
  section: HTMLElement,
) {
  const rect = section.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  const sectionCenter =
    rect.top + rect.height / 2

  const viewportCenter = viewportHeight / 2

  const distance = Math.abs(
    sectionCenter - viewportCenter,
  )

  const normalized =
    1 - distance / (viewportHeight / 2 + FADE_DISTANCE)

  return smoothstep(normalized)
}

export function MemoryMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const targetVolumeRef = useRef(0)
  const enabledRef = useRef(false)
  const startedRef = useRef(false)

  useEffect(() => {
    const section = document.getElementById('beyond-code')

    if (!section) {
      return
    }

    sectionRef.current = section

    const audio = new Audio(MUSIC_SRC)

    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0

    audioRef.current = audio

    const syncEnabledState = () => {
      enabledRef.current = readAudioPreference()

      if (!enabledRef.current) {
        targetVolumeRef.current = 0

        if (audioRef.current) {
          audioRef.current.pause()
        }

        startedRef.current = false
      }
    }

    const startPlayback = async () => {
      if (!enabledRef.current) {
        return
      }

      if (!startedRef.current) {
        try {
          await audio.play()
          startedRef.current = true
        } catch {
          // Browser autoplay policy can reject playback.
          // Playback will retry after the next user interaction.
        }
      }
    }

    const updateVolume = () => {
      if (!sectionRef.current || !audioRef.current) {
        return
      }

      const proximity =
        calculateSectionProximity(
          sectionRef.current,
        )

      targetVolumeRef.current =
        enabledRef.current
          ? proximity * MAX_VOLUME
          : 0

      if (
        enabledRef.current &&
        proximity > 0.01
      ) {
        void startPlayback()
      }

      animationFrameRef.current =
        requestAnimationFrame(updateVolume)

      const currentVolume = audioRef.current.volume
      const targetVolume = targetVolumeRef.current

      const nextVolume =
        currentVolume +
        (targetVolume - currentVolume) * 0.08

      audioRef.current.volume =
        clamp(nextVolume, 0, MAX_VOLUME)

      if (
        !enabledRef.current &&
        audioRef.current.volume < 0.005
      ) {
        audioRef.current.volume = 0
        audioRef.current.pause()
        startedRef.current = false
      }
    }

    const handleInteraction = () => {
      if (enabledRef.current) {
        void startPlayback()
      }
    }

    const handleStorage = () => {
      syncEnabledState()

      if (enabledRef.current) {
        handleInteraction()
      }
    }

    const handleAudioPreference = () => {
      syncEnabledState()

      if (enabledRef.current) {
        handleInteraction()
      }
    }

    syncEnabledState()

    window.addEventListener(
      'scroll',
      handleInteraction,
      { passive: true },
    )

    window.addEventListener(
      'pointerdown',
      handleInteraction,
      { passive: true },
    )

    window.addEventListener(
      'keydown',
      handleInteraction,
    )

    window.addEventListener(
      'storage',
      handleStorage,
    )

    window.addEventListener(
      'portfolio-audio-change',
      handleAudioPreference,
    )

    animationFrameRef.current =
      requestAnimationFrame(updateVolume)

    return () => {
      if (
        animationFrameRef.current !== null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current,
        )
      }

      window.removeEventListener(
        'scroll',
        handleInteraction,
      )

      window.removeEventListener(
        'pointerdown',
        handleInteraction,
      )

      window.removeEventListener(
        'keydown',
        handleInteraction,
      )

      window.removeEventListener(
        'storage',
        handleStorage,
      )

      window.removeEventListener(
        'portfolio-audio-change',
        handleAudioPreference,
      )

      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  return null
}
