import {
  useEffect,
  useState,
} from 'react'

import {
  Counter,
} from 'counterapi'

import styles from './VisitorCount.module.css'
import { COUNTER_API_TOKEN } from '../lib/counterConfig'

const WORKSPACE =
  'abhivocopedia-portfolio'

const COUNTER_NAME =
  'visitors'

const STORAGE_KEY =
  'portfolio-visitor-counted'

const counter =
  new Counter({
    workspace: WORKSPACE,
    accessToken:
      COUNTER_API_TOKEN,
    timeout: 5000,
  })

let requestInFlight:
  Promise<number> | null = null

function getStoredValue() {
  try {
    return sessionStorage.getItem(
      STORAGE_KEY,
    )
  } catch {
    return null
  }
}

function markAsCounted() {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      'true',
    )
  } catch {
    // Ignore storage errors.
  }
}

function readCount(
  response: {
    data: {
      up_count?: number
    }
  },
) {
  const count =
    response.data.up_count

  if (
    typeof count !== 'number'
  ) {
    throw new Error(
      'CounterAPI returned an invalid visitor count.',
    )
  }

  return count
}

async function fetchVisitorCount(): Promise<number> {
  const alreadyCounted =
    getStoredValue() === 'true'

  if (alreadyCounted) {
    const response =
      await counter.get(
        COUNTER_NAME,
      )

    return readCount(response)
  }

  const response =
    await counter.up(
      COUNTER_NAME,
    )

  const count =
    readCount(response)

  markAsCounted()

  return count
}

function loadVisitorCount(): Promise<number> {
  if (requestInFlight) {
    return requestInFlight
  }

  const request =
    fetchVisitorCount()

  requestInFlight =
    request

  void request.finally(() => {
    if (
      requestInFlight === request
    ) {
      requestInFlight = null
    }
  })

  return request
}

export function VisitorCount() {
  const [
    count,
    setCount,
  ] = useState<number | null>(null)

  const [
    failed,
    setFailed,
  ] = useState(false)

  useEffect(() => {
    let mounted = true

    loadVisitorCount()
      .then((visitorCount) => {
        if (!mounted) {
          return
        }

        setCount(
          visitorCount,
        )
      })
      .catch((error) => {
        if (!mounted) {
          return
        }

        setFailed(true)

        if (
          import.meta.env.DEV
        ) {
          console.error(
            'Visitor counter error:',
            error,
          )
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  const displayValue =
    failed
      ? '—'
      : count === null
        ? '...'
        : count.toLocaleString()

  return (
    <div
      className={
        styles.visitorCount
      }
      aria-label={
        count !== null
          ? `${count.toLocaleString()} visitors`
          : 'Visitor count'
      }
    >
      <span
        className={
          styles.dot
        }
        aria-hidden="true"
      />

      <span
        className={
          styles.value
        }
      >
        {displayValue}
      </span>

      <span
        className={
          styles.label
        }
      >
        VISITORS
      </span>
    </div>
  )
}
