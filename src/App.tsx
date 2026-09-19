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
import './styles/globals.css'

type Route = 'home' | 'resume'

function getRouteFromLocation(): Route {
  return window.location.hash.replace(/^#/, '') === 'resume'
    ? 'resume'
    : 'home'
}

function App() {
  const [route, setRoute] = useState<Route>(getRouteFromLocation)

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRouteFromLocation())
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const navigate = (newRoute: Route) => {
    window.location.hash =
      newRoute === 'home' ? '' : newRoute
  }

  const isResume = route === 'resume'

  return (
    <>
      <CopyProtection />

      {!isResume && <Navbar onNavigate={navigate} />}

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
