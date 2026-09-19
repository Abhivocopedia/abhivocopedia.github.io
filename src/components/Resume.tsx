import { useEffect } from 'react'
import { profile } from '../data/profile'
import { education } from '../data/education'
import { skills } from '../data/skills'
import { projects } from '../data/projects'
import styles from './Resume.module.css'

export function Resume() {
  const handlePrint = () => {
    window.print()
  }

  const handleBack = () => {
    window.location.hash = ''
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Abhinandana Bhatta — Resume'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.title = previousTitle
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className={styles.resumePage}>
      <div className={styles.actionBar} aria-label="Resume actions">
        <button
          type="button"
          className={styles.backBtn}
          onClick={handleBack}
        >
          ← BACK TO PORTFOLIO
        </button>

        <button
          type="button"
          className={styles.printBtn}
          onClick={handlePrint}
        >
          ↓ DOWNLOAD / PRINT PDF
        </button>
      </div>

      <main className={styles.sheetViewport}>
        <article className={styles.resumeSheet}>
          <header className={styles.resumeHeader}>
            <div className={styles.identityBlock}>
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={`${profile.name} profile`}
                  className={styles.profilePhoto}
                />
              ) : null}

              <div className={styles.identityText}>
                <p className={styles.eyebrow}>ABHIVOCOPEDIA</p>
                <h1>{profile.name.toUpperCase()}</h1>
                <p className={styles.tagline}>{profile.tagline}</p>
              </div>
            </div>

            <div className={styles.contactBlock}>
              <a href={`mailto:${profile.social.email}`}>
                {profile.social.email}
              </a>
              <a
                href={profile.social.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/Abhivocopedia
              </a>
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/abhinandana-bhatta
              </a>
              <a
                href={profile.social.x}
                target="_blank"
                rel="noopener noreferrer"
              >
                x.com/Abhinandan43024
              </a>
            </div>
          </header>

          <div className={styles.rule} />

          <div className={styles.resumeGrid}>
            <aside className={styles.leftColumn}>
              <section className={styles.compactSection}>
                <p className={styles.sectionLabel}>01 / PROFILE</p>
                <p className={styles.profileText}>
                  I enjoy turning ideas into working products — from web
                  applications and AI-powered tools to cloud deployments
                  and experimental systems.
                </p>
              </section>

              <section className={styles.compactSection}>
                <p className={styles.sectionLabel}>02 / EDUCATION</p>

                <div className={styles.educationList}>
                  {education.map((item) => (
                    <div
                      key={item.id}
                      className={styles.educationItem}
                    >
                      <div className={styles.itemTop}>
                        <strong>{item.label}</strong>
                        {item.isCurrent && (
                          <span className={styles.current}>
                            CURRENT
                          </span>
                        )}
                      </div>

                      <h3>{item.institution}</h3>

                      {item.details.map((detail, index) => (
                        <p key={`${item.id}-${index}`}>
                          {detail}
                        </p>
                      ))}

                      <span>{item.period}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className={styles.compactSection}>
                <p className={styles.sectionLabel}>03 / STACK</p>

                <div className={styles.skillGroups}>
                  {skills.map((category) => (
                    <div
                      key={category.number}
                      className={styles.skillGroup}
                    >
                      <strong>{category.category}</strong>
                      <p>
                        {category.technologies.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </aside>

            <div className={styles.rightColumn}>
              <section className={styles.compactSection}>
                <p className={styles.sectionLabel}>
                  04 / SELECTED PROJECTS
                </p>

                <div className={styles.projectList}>
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className={styles.projectItem}
                    >
                      <div className={styles.projectHeading}>
                        <h3>{project.title}</h3>
                        <span>{project.category}</span>
                      </div>

                      <p>{project.description}</p>

                      <div className={styles.projectMeta}>
                        <span>
                          {project.tech.join(' · ')}
                        </span>

                        {project.team && (
                          <span>TEAM: {project.team}</span>
                        )}

                        {project.award && (
                          <span>{project.award}</span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.compactSection}>
                <p className={styles.sectionLabel}>
                  05 / RECOGNITION
                </p>

                <div className={styles.recognition}>
                  <strong>DSU DEVHACK 2.0 — VULTR BEST BUILD</strong>
                  <span>
                    TheAPIcalypse · Weighnix — Smart Home Cylinder
                    Management System
                  </span>
                  <span>Hardware Development + Cloud Assistance</span>
                </div>
              </section>

              <section className={styles.compactSection}>
                <p className={styles.sectionLabel}>06 / VEX-R</p>

                <div className={styles.vexr}>
                  {profile.vexr.lines.map((line, index) => (
                    <span key={index}>{line}</span>
                  ))}
                </div>
              </section>

              <section className={styles.compactSection}>
                <p className={styles.sectionLabel}>
                  07 / DIRECT LINKS
                </p>

                <div className={styles.directLinks}>
                  <a
                    href={profile.social.photography}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Photography ↗
                  </a>

                  <a
                    href={profile.social.genesis}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Genesis Lab ↗
                  </a>
                </div>
              </section>
            </div>
          </div>

          <footer className={styles.resumeFooter}>
            <span>ABHINANDANA BHATTA / ABHIVOCOPEDIA</span>
            <span>MAKE SOMETHING · MAKE IT MATTER · MAKE MONEY</span>
          </footer>
        </article>
      </main>
    </div>
  )
}
