import { useState, useEffect } from 'react'
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

function App() {
  const [route, setRoute] = useState<Route>('home')

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash === 'resume') {
        setRoute('resume')
      } else {
        setRoute('home')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (newRoute: Route) => {
    setRoute(newRoute)
    window.location.hash = newRoute === 'home' ? '' : newRoute
  }

  return (
    <>
      <CopyProtection />
      <Navbar onNavigate={navigate} />
      <main id="main-content">
        {route === 'home' ? (
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
        ) : (
          <Resume />
        )}
      </main>
      <Footer />
    </>
  )
}

export default App