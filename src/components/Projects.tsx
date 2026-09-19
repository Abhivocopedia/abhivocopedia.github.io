import { useState } from 'react'
import { motion } from 'framer-motion'
import { projects, Project } from '../data/projects'
import { Star, Label, Crosshair, DotPattern, DecorativeCorner } from './DecorativeMarks'
import styles from './Projects.module.css'

export function Projects() {
  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-title">
      <div className={styles.bgDecoration} aria-hidden="true">
        <DotPattern color="ink" />
        <DecorativeCorner position="tl" color="mustard" style={{ top: '5%', left: '3%' }} />
        <DecorativeCorner position="tr" color="ink" style={{ top: '5%', right: '3%' }} />
        <DecorativeCorner position="bl" color="ink" style={{ bottom: '5%', left: '3%' }} />
        <DecorativeCorner position="br" color="mustard" style={{ bottom: '5%', right: '3%' }} />
        <Crosshair color="green" style={{ top: '12%', right: '8%' }} />
        <Crosshair color="orange" style={{ bottom: '12%', left: '8%' }} />
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Label variant="number">04</Label>
          <h2 id="projects-title" className={styles.title}>PROJECTS</h2>
          <div className={styles.divider} aria-hidden="true">
            <Star size="md" color="mustard" />
          </div>
          <p className={styles.subtitle}>Selected work across full-stack, AI, and experimental systems</p>
        </motion.div>

        <div className={styles.grid} role="list" aria-label="Projects">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              variant={getVariant(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function getVariant(index: number): 'feature' | 'block' | 'offset' | 'split' | 'outlined' {
  const variants: ('feature' | 'block' | 'offset' | 'split' | 'outlined')[] = ['feature', 'block', 'offset', 'split', 'outlined']
  return variants[index % variants.length]
}

interface ProjectCardProps {
  project: Project
  index: number
  variant: 'feature' | 'block' | 'offset' | 'split' | 'outlined'
}

function ProjectCard({ project, index, variant }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  const variantStyles: Record<string, string> = {
    feature: styles.feature,
    block: styles.block,
    offset: styles.offset,
    split: styles.split,
    outlined: styles.outlined
  }

  return (
    <div style={{ '--project-color': project.color } as React.CSSProperties} className={styles.cardWrapper}>
      <motion.article
        className={`${styles.card} ${variantStyles[variant]} ${hovered ? styles.hovered : ''}`}
        role="listitem"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className={styles.cardInner}>
          {variant === 'feature' && (
            <div className={styles.featureHeader}>
              <Label variant="number">{project.number}</Label>
              <span className={styles.cardCategory}>{project.category}</span>
            </div>
          )}

          <div className={styles.cardContent}>
            <div className={styles.cardMain}>
              {variant !== 'feature' && (
                <div className={styles.cardMeta}>
                  <Label variant="number">{project.number}</Label>
                  <span className={styles.cardCategory}>{project.category}</span>
                </div>
              )}

              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDescription}>{project.description}</p>

              <div className={styles.cardTech} role="list" aria-label="Technologies">
                {project.tech.map((tech, i) => (
                  <span key={i} className={styles.techTag}>{tech}</span>
                ))}
              </div>

              {project.contribution && (
                <div className={styles.cardContribution}>
                  <Label variant="meta">CONTRIBUTION</Label>
                  <span className={styles.contribValue}>{project.contribution}</span>
                </div>
              )}

              {project.team && (
                <div className={styles.cardTeam}>
                  <Label variant="meta">TEAM</Label>
                  <span className={styles.teamValue}>{project.team}</span>
                </div>
              )}

              {project.award && (
                <div className={styles.cardAward}>
                  <Label variant="meta">RECOGNITION</Label>
                  <span className={styles.awardValue}>{project.award}</span>
                </div>
              )}
            </div>

            <div className={styles.cardActions}>
              {project.liveUrl && project.liveUrl !== 'ADD LINK' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionLink}
                  aria-label={`View ${project.title} live`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Live
                </a>
              )}

              {project.githubUrl && project.githubUrl !== 'ADD LINK' && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.actionLink}
                  aria-label={`View ${project.title} on GitHub`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  Code
                </a>
              )}

              {(project.liveUrl === 'ADD LINK' || !project.liveUrl) && project.githubUrl === 'ADD LINK' && (
                <span className={styles.actionPlaceholder}>COMING SOON</span>
              )}
            </div>
          </div>

          <div className={styles.cardAccent} aria-hidden="true"></div>
          
          {variant === 'block' && (
            <div className={styles.blockOverlay} aria-hidden="true">
              <Star size="lg" color="mustard" style={{ opacity: 0.1 }} />
              <Star size="md" color="mustard" style={{ opacity: 0.05, top: '20%', right: '10%' }} />
              <Star size="sm" color="mustard" style={{ opacity: 0.08, bottom: '15%', left: '15%' }} />
            </div>
          )}
        </div>
      </motion.article>
    </div>
  )
}