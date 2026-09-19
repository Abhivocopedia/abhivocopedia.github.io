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
import './styles/globals.css'

function App() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <EducationTrain />
        <Skills />
        <Projects />
        <Recognition />
        <BeyondCode />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App