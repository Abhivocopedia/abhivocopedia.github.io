import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { Star, Arrow, Label, DotPattern, DecorativeCorner } from './DecorativeMarks'
import styles from './Resume.module.css'

import { education } from '../data/education'
import { skills } from '../data/skills'
import { projects } from '../data/projects'

export function Resume() {
  const handlePrint = () => {
    window.print()
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        window.print()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <div id="copyNotice" role="status" aria-live="polite" className={styles.copyNotice}>
        Copying is disabled on this page.
      </div>

      <header className={styles.actionBar} role="banner">
        <div className={styles.actionBarInner}>
          <button 
            className={styles.backBtn}
            onClick={handleBack}
            aria-label="Back to portfolio"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>BACK TO PORTFOLIO</span>
          </button>
          
          <div className={styles.resumeTitle}>
            <Label variant="number">ABHIVOCOPEDIA</Label>
            <h1>RESUME</h1>
          </div>

          <button 
            className={styles.printBtn}
            onClick={handlePrint}
            aria-label="Download or print PDF"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>DOWNLOAD / PRINT PDF</span>
          </button>
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="resume-title">
        <div className={styles.bgDecoration} aria-hidden="true">
          <DotPattern color="ink" />
          <DecorativeCorner position="tl" color="ink" style={{ top: '10%', left: '5%' }} />
          <DecorativeCorner position="tr" color="mustard" style={{ top: '10%', right: '5%' }} />
        </div>

        <div className={styles.container}>
          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Label variant="number">00</Label>
            <h1 id="resume-title" className={styles.title}>
              <span className={styles.nameLine}>
                <span className={styles.name}>ABHINANDANA</span>
                <Star size="md" color="mustard" className={styles.titleStar} />
                <span className={styles.name}>BHATTA</span>
              </span>
              <span className={styles.dividerLine} aria-hidden="true">
                <Label variant="meta">ABHIVOCOPEDIA</Label>
              </span>
            </h1>
            <p className={styles.tagline}>{profile.tagline}</p>
          </motion.div>

          <motion.div
            className={styles.profileSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {profile.profilePhoto && profile.profilePhoto.trim() !== '' ? (
              <img
                src={profile.profilePhoto}
                alt={`${profile.name} - ${profile.identity}`}
                className={styles.profilePhoto}
                loading="eager"
              />
            ) : (
              <div className={styles.profilePlaceholder}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
              </div>
            )}
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>
                <span className={styles.nameFirst}>ABHINANDANA</span>
                <span className={styles.nameLast}>BHATTA</span>
              </h2>
              <p className={styles.profileIdentity}>ABHIVOCOPEDIA</p>
              <p className={styles.profileTagline}>{profile.tagline}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          aria-hidden="true"
        >
          <Label variant="meta">SCROLL</Label>
          <Arrow direction="down" size={24} color="ink" className={styles.scrollArrow} />
        </motion.div>
      </section>

      <section className={styles.section} aria-labelledby="contact-section">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Label variant="number">01</Label>
            <h2 id="contact-section" className={styles.sectionTitle}>CONTACT</h2>
            <div className={styles.divider} aria-hidden="true"></div>
          </motion.div>

          <motion.div
            className={styles.contactGrid}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <a href={`mailto:${profile.social.email}`} className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>EMAIL</span>
                <span className={styles.contactValue}>{profile.social.email}</span>
              </div>
              <Arrow direction="right" size={20} color="ink" />
            </a>

            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>GITHUB</span>
                <span className={styles.contactValue}>github.com/Abhivocopedia</span>
              </div>
              <Arrow direction="right" size={20} color="ink" />
            </a>

            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>LINKEDIN</span>
                <span className={styles.contactValue}>linkedin.com/in/abhinandana-bhatta</span>
              </div>
              <Arrow direction="right" size={20} color="ink" />
            </a>

            <a href={profile.social.x} target="_blank" rel="noopener noreferrer" className={styles.contactCard}>
              <div className={styles.contactIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </div>
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>X</span>
                <span className={styles.contactValue}>x.com/Abhinandan43024</span>
              </div>
              <Arrow direction="right" size={20} color="ink" />
            </a>
          </motion.div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="education-section">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Label variant="number">02</Label>
            <h2 id="education-section" className={styles.sectionTitle}>EDUCATION</h2>
            <div className={styles.divider} aria-hidden="true"></div>
          </motion.div>

          <motion.div
            className={styles.educationList}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {education.map((item, index) => (
              <motion.article
                key={item.id}
                className={styles.educationCard}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ '--card-color': item.color } as React.CSSProperties}
              >
                <div className={styles.eduHeader}>
                  <Label variant="number">{item.label}</Label>
                  {item.isCurrent && <span className={styles.currentBadge}>CURRENT</span>}
                </div>
                <h3 className={styles.eduInstitution}>{item.institution}</h3>
                <ul className={styles.eduDetails} role="list">
                  {item.details.map((detail, i) => (
                    <li key={i} className={styles.eduDetail}>{detail}</li>
                  ))}
                </ul>
                <div className={styles.eduPeriod}>{item.period}</div>
                <div className={styles.eduAccent} aria-hidden="true"></div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="skills-section">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Label variant="number">03</Label>
            <h2 id="skills-section" className={styles.sectionTitle}>TECHNICAL SKILLS</h2>
            <div className={styles.divider} aria-hidden="true"></div>
          </motion.div>

          <motion.div
            className={styles.skillsGrid}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {skills.map((category, index) => (
              <motion.div
                key={category.number}
                className={styles.skillCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ '--card-color': category.color } as React.CSSProperties}
              >
                <Label variant="number">{category.number}</Label>
                <h3 className={styles.skillCategoryTitle}>{category.category}</h3>
                <p className={styles.skillDescription}>{category.description}</p>
                <ul className={styles.skillTechList} role="list">
                  {category.technologies.map((tech, i) => (
                    <li key={i} className={styles.skillTechItem}>
                      <span className={styles.techDot} style={{ backgroundColor: category.color }} aria-hidden="true"></span>
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="projects-section">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Label variant="number">04</Label>
            <h2 id="projects-section" className={styles.sectionTitle}>SELECTED PROJECTS</h2>
            <div className={styles.divider} aria-hidden="true"></div>
          </motion.div>

          <motion.div
            className={styles.projectsGrid}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                className={styles.projectCard}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ '--project-color': project.color } as React.CSSProperties}
              >
                <div className={styles.projectHeader}>
                  <Label variant="number">{project.number}</Label>
                  <span className={styles.projectCategory}>{project.category}</span>
                </div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                <div className={styles.projectTech} role="list" aria-label="Technologies">
                  {project.tech.map((tech, i) => (
                    <span key={i} className={styles.techTag}>{tech}</span>
                  ))}
                </div>
                {project.contribution && (
                  <div className={styles.projectMeta}>
                    <Label variant="meta">CONTRIBUTION</Label>
                    <span>{project.contribution}</span>
                  </div>
                )}
                {project.team && (
                  <div className={styles.projectMeta}>
                    <Label variant="meta">TEAM</Label>
                    <span>{project.team}</span>
                  </div>
                )}
                {project.award && (
                  <div className={styles.projectMeta}>
                    <Label variant="meta">RECOGNITION</Label>
                    <span>{project.award}</span>
                  </div>
                )}
                <div className={styles.projectAccent} aria-hidden="true"></div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="recognition-section">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Label variant="number">05</Label>
            <h2 id="recognition-section" className={styles.sectionTitle}>RECOGNITION</h2>
            <div className={styles.divider} aria-hidden="true"></div>
          </motion.div>

          <motion.div
            className={styles.recognitionCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className={styles.recognitionBadge}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--mustard)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div className={styles.recognitionContent}>
              <Label variant="meta" className={styles.recognitionEvent}>DSU DEVHACK 2.0</Label>
              <h3 className={styles.recognitionTitle}>VULTR BEST BUILD</h3>
            </div>
            <div className={styles.recognitionDetails}>
              <div className={styles.recognitionDetail}>
                <Label variant="meta">TEAM</Label>
                <span>TheAPIcalypse</span>
              </div>
              <div className={styles.recognitionDetail}>
                <Label variant="meta">PROJECT</Label>
                <span>Weighnix — Smart Home Cylinder Management System</span>
              </div>
              <div className={styles.recognitionDetail}>
                <Label variant="meta">ROLE</Label>
                <span>Hardware Development + Cloud Assistance</span>
              </div>
            </div>
            <div className={styles.recognitionRibbon}>
              <span>WINNER</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="vexr-section">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.vexrPoster}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className={styles.vexrContent}>
              <Label variant="meta" style={{ color: 'var(--mustard)' }}>VEX-R</Label>
              <div className={styles.vexrLines}>
                {profile.vexr.lines.map((line, index) => (
                  <motion.div
                    key={index}
                    className={styles.vexrLine}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="links-section">
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Label variant="number">06</Label>
            <h2 id="links-section" className={styles.sectionTitle}>DIRECT LINKS</h2>
            <div className={styles.divider} aria-hidden="true"></div>
          </motion.div>

          <motion.div
            className={styles.linksGrid}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <a
              href={profile.social.photography}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkCard}
            >
              <div className={styles.linkIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="12" r="4"/></svg>
              </div>
              <div className={styles.linkInfo}>
                <span className={styles.linkLabel}>ABHI'S UNSCRIPTED PHOTOGRAPHY</span>
                <span className={styles.linkUrl}>abhivocopedia.github.io/Abhis_Unscripted-Photography/</span>
              </div>
              <Arrow direction="right" size={24} color="ink" />
            </a>

            <a
              href={profile.social.genesis}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkCard}
            >
              <div className={styles.linkIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <div className={styles.linkInfo}>
                <span className={styles.linkLabel}>GENESIS LAB</span>
                <span className={styles.linkUrl}>genesis-lab-nu.vercel.app</span>
              </div>
              <Arrow direction="right" size={24} color="ink" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}