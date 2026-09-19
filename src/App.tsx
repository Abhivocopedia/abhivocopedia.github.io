import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { EducationTrain } from './components/EducationTrain'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Recognition } from './components/Recognition'
import { BeyondCode } from './components/BeyondCode'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Resume } from './components/Resume'
import { CopyProtection } from './components/CopyProtection'
import { soundFX } from './lib/SoundFX'
import './styles/globals.css'
import { MemoryMusic } from './components/MemoryMusic'

type Route = 'home' | 'resume'

function getRouteFromLocation(): Route {
  return window.location.hash.replace(/^#/, '') === 'resume'
    ? 'resume'
    : 'home'
}

function App() {
  const [route, setRoute] = useState<Route>(getRouteFromLocation)

  /*
   * ------------------------------------------------------------
   * AUDIO UNLOCK
   * ------------------------------------------------------------
   *
   * Browsers require a user interaction before Web Audio can
   * start producing sound.
   *
   * Unlock the sound engine on the first pointer or keyboard
   * interaction.
   */
  useEffect(() => {
    const unlockAudio = () => {
      soundFX.unlock()

      window.removeEventListener(
        'pointerdown',
        unlockAudio,
      )

      window.removeEventListener(
        'keydown',
        unlockAudio,
      )
    }

    window.addEventListener(
      'pointerdown',
      unlockAudio,
      { passive: true },
    )

    window.addEventListener(
      'keydown',
      unlockAudio,
    )

    return () => {
      window.removeEventListener(
        'pointerdown',
        unlockAudio,
      )

      window.removeEventListener(
        'keydown',
        unlockAudio,
      )
    }
  }, [])

  /*
   * ------------------------------------------------------------
   * SCROLL SOUND
   * ------------------------------------------------------------
   *
   * requestAnimationFrame prevents the scroll handler from
   * firing sound logic excessively during fast scrolling.
   */
  useEffect(() => {
    let frame: number | null = null

    const handleScroll = () => {
      if (frame !== null) return

      frame = window.requestAnimationFrame(() => {
        frame = null
        soundFX.scroll()
      })
    }

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true },
    )

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      )

      if (frame !== null) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  /*
   * ------------------------------------------------------------
   * HASH / ROUTE HANDLING
   * ------------------------------------------------------------
   */
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromLocation())

      window.scrollTo({
        top: 0,
        behavior: 'auto',
      })
    }

    window.addEventListener(
      'hashchange',
      handleHashChange,
    )

    return () => {
      window.removeEventListener(
        'hashchange',
        handleHashChange,
      )
    }
  }, [])

  /*
   * ------------------------------------------------------------
   * NAVIGATION
   * ------------------------------------------------------------
   */
  const navigate = (newRoute: Route) => {
    window.location.hash =
      newRoute === 'home'
        ? ''
        : newRoute
  }

  const isResume = route === 'resume'

  return (
    <>
      <CopyProtection />
        <MemoryMusic />

      {!isResume && (
        <Navbar onNavigate={navigate} />
      )}

      <main id="main-content">
        {isResume ? (
          <Resume />
        ) : (
          <>
            <Hero />

            <About />

            <EducationTrain />

            <Skills />

            <Projects />

            <Recognition />

            <BeyondCode />

            <Contact />
          </>
        )}
      </main>

      {!isResume && <Footer />}
    </>
  )
}

export default App
