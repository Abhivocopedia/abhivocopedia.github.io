import {
  useEffect,
  useState,
} from 'react'

import {
  soundFX,
} from '../lib/SoundFX'

interface SoundToggleProps {
  compact?: boolean
}

export function SoundToggle({
  compact = false,
}: SoundToggleProps) {
  const [
    enabled,
    setEnabled,
  ] = useState(
    soundFX.isEnabled(),
  )

  useEffect(() => {
    const unlock = () => {
      if (soundFX.isEnabled()) {
        soundFX.click()
      }

      window.removeEventListener(
        'pointerdown',
        unlock,
      )
    }

    window.addEventListener(
      'pointerdown',
      unlock,
      {
        once: true,
      },
    )

    return () => {
      window.removeEventListener(
        'pointerdown',
        unlock,
      )
    }
  }, [])

  const toggle = () => {
    const next =
      !soundFX.isEnabled()

    soundFX.setEnabled(next)

    setEnabled(next)

    if (next) {
      soundFX.unlock()
      soundFX.click()
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        enabled
          ? 'Mute interface sounds'
          : 'Enable interface sounds'
      }
      aria-pressed={enabled}
      title={
        enabled
          ? 'Mute sounds'
          : 'Enable sounds'
      }
      style={{
        display: 'grid',
        placeItems: 'center',

        width: compact
          ? 34
          : 38,

        height: compact
          ? 34
          : 38,

        padding: 0,

        border:
          '1px solid rgba(255,255,255,0.18)',

        borderRadius: 999,

        background:
          'rgba(5,10,18,0.72)',

        color:
          enabled
            ? '#E0AE3E'
            : '#FFFDF6',

        cursor: 'pointer',

        backdropFilter:
          'blur(10px)',

        WebkitBackdropFilter:
          'blur(10px)',

        transition:
          'transform 180ms ease, color 180ms ease, border-color 180ms ease',
      }}
    >
      {enabled ? (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5L6 9H3v6h3l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 010 7" />
          <path d="M18.5 6a9 9 0 010 12" />
        </svg>
      ) : (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5L6 9H3v6h3l5 4V5Z" />
          <path d="M23 9l-6 6" />
          <path d="M17 9l6 6" />
        </svg>
      )}
    </button>
  )
}
