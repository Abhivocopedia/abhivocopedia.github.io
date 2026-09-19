import { profile } from '../data/profile'
import styles from './About.module.css'

export function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.container}>
        <div className={styles.header} data-reveal>
          <span className={styles.sectionNumber}>01</span>
          <h2 id="about-title" className={styles.title}>ABOUT</h2>
          <div className={styles.divider} aria-hidden="true"></div>
        </div>

        <div className={styles.grid} data-reveal data-reveal-delay="1">
          <div className={styles.statement}>
            <p>{profile.bio}</p>
          </div>

          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>FOCUS AREAS</h3>
            <ul className={styles.focusList} role="list">
              {profile.themes.map((theme, index) => (
                <li key={index} className={styles.focusItem}>
                  <span className={styles.focusDot} aria-hidden="true"></span>
                  <span>{theme}</span>
                </li>
              ))}
            </ul>

            <div className={styles.status}>
              <h4 className={styles.statusLabel}>CURRENT STATUS</h4>
              <dl className={styles.statusList}>
                <div className={styles.statusItem}>
                  <dt className={styles.statusTerm}>Program</dt>
                  <dd className={styles.statusValue}>{profile.currentStatus.program}</dd>
                </div>
                <div className={styles.statusItem}>
                  <dt className={styles.statusTerm}>Institution</dt>
                  <dd className={styles.statusValue}>{profile.currentStatus.institution}</dd>
                </div>
                <div className={styles.statusItem}>
                  <dt className={styles.statusTerm}>Period</dt>
                  <dd className={styles.statusValue}>{profile.currentStatus.period}</dd>
                </div>
                <div className={styles.statusItem}>
                  <dt className={styles.statusTerm}>Semester</dt>
                  <dd className={styles.statusValue}>{profile.currentStatus.semester}</dd>
                </div>
                <div className={styles.statusItem}>
                  <dt className={styles.statusTerm}>Graduation</dt>
                  <dd className={styles.statusValue}>{profile.currentStatus.expectedGraduation}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}