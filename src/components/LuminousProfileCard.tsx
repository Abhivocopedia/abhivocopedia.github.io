import { useState } from 'react'
import { profile } from '../data/profile'
import styles from './LuminousProfileCard.module.css'

export function LuminousProfileCard() {
  const [active, setActive] = useState(false)

  return (
    <div className={styles.container}>
      <input
        id="luminousProfileToggle"
        type="checkbox"
        className={styles.toggleInput}
        checked={active}
        onChange={(event) => setActive(event.target.checked)}
        aria-label="Activate profile lumen"
      />

      <label
        htmlFor="luminousProfileToggle"
        className={`${styles.card} ${active ? styles.active : ''}`}
      >
        <div className={styles.lightLayer} aria-hidden="true">
          <div className={styles.slit} />
          <div className={styles.lumen}>
            <div className={styles.min} />
            <div className={styles.mid} />
            <div className={styles.hi} />
          </div>

          <div className={styles.darken}>
            <div className={styles.sl} />
            <div className={styles.ll} />
            <div className={styles.slt} />
            <div className={styles.srt} />
          </div>
        </div>

        <div className={styles.photo}>
          <img
            src={profile.profilePhoto}
            alt={`${profile.name} - ${profile.identity}`}
            draggable="false"
          />

          <div className={styles.photoShade} />
          <div className={styles.photoGlow} />
          <div className={styles.photoScan} />
        </div>

        <div className={styles.content}>
          <div className={styles.icon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="profileIconGradient"
                  x1="0"
                  x2="0"
                  y1="-1"
                  y2="0.8"
                >
                  <stop offset="0%" stopColor="#f4f4f4" />
                  <stop offset="100%" stopColor="#5b5b5b" />
                </linearGradient>
              </defs>

              <path
                fill="url(#profileIconGradient)"
                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 88c198.8 0 360 161.2 360 360c0 198.8-161.2 360-360 360S152 710.8 152 512s161.2-360 360-360m0 80c-92.8 0-168 75.2-168 168s75.2 168 168 168s168-75.2 168-168s-75.2-168-168-168m0 88c44.2 0 80 35.8 80 80s-35.8 80-80 80s-80-35.8-80-80s35.8-80 80-80m0 304c-113.8 0-213.7 56.3-274.8 141.8C300 818.1 399.2 856 512 856s212-37.9 274.8-90.2C725.7 680.3 625.8 624 512 624"
              />
            </svg>
          </div>

          <div className={styles.bottom}>
            <div className={styles.title}>
              ABHIVOCOPEDIA
            </div>

            <p className={styles.description}>
              LIGHT FOLDS AROUND FORM
              <br />
              REVEALING LAYERS OF DEPTH
            </p>

            <div className={styles.toggle}>
              <div className={styles.handle} />
              <span className={styles.toggleLabel}>
                {active ? 'Deactivate Lumen' : 'Activate Lumen'}
              </span>
            </div>
          </div>
        </div>
      </label>
    </div>
  )
}
