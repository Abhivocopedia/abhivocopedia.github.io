#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "=========================================="
echo " Abhivocopedia Rich Link Preview Installer"
echo "=========================================="
echo
echo "Project: $ROOT"
echo

cd "$ROOT"

mkdir -p api src/components

echo "[1/6] Installing preview dependencies..."

pnpm add cheerio

echo "[2/6] Creating API endpoint..."

cat > api/link-preview.js <<'API'
import * as cheerio from 'cheerio'
import dns from 'node:dns/promises'
import net from 'node:net'
import { URL } from 'node:url'

const MAX_HTML_BYTES = 2 * 1024 * 1024
const MAX_IMAGES = 6

function isPrivateIPv4(ip) {
  const parts = ip.split('.').map(Number)

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return false
  }

  const [a, b] = parts

  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  )
}

function isPrivateIPv6(ip) {
  const normalized = ip.toLowerCase()

  return (
    normalized === '::1' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80:')
  )
}

async function assertPublicHost(hostname) {
  const lower = hostname.toLowerCase()

  if (
    lower === 'localhost' ||
    lower.endsWith('.localhost') ||
    lower.endsWith('.local')
  ) {
    throw new Error('Private hosts are not allowed.')
  }

  const ipType = net.isIP(lower)

  if (ipType === 4 && isPrivateIPv4(lower)) {
    throw new Error('Private IP addresses are not allowed.')
  }

  if (ipType === 6 && isPrivateIPv6(lower)) {
    throw new Error('Private IP addresses are not allowed.')
  }

  if (!ipType) {
    const result = await dns.lookup(lower)

    if (
      (result.family === 4 && isPrivateIPv4(result.address)) ||
      (result.family === 6 && isPrivateIPv6(result.address))
    ) {
      throw new Error('Private hosts are not allowed.')
    }
  }
}

function absoluteUrl(value, baseUrl) {
  if (!value) {
    return null
  }

  try {
    return new URL(value, baseUrl).href
  } catch {
    return null
  }
}

function unique(items) {
  return [...new Set(items.filter(Boolean))]
}

function cleanText(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getMeta($, selectors) {
  for (const selector of selectors) {
    const value = cleanText($(selector).attr('content'))

    if (value) {
      return value
    }
  }

  return ''
}

function extractImages($, baseUrl) {
  const images = []

  const push = (value) => {
    const absolute = absoluteUrl(value, baseUrl)

    if (!absolute) {
      return
    }

    if (
      absolute.startsWith('data:') ||
      absolute.startsWith('blob:')
    ) {
      return
    }

    images.push(absolute)
  }

  push(
    getMeta($, [
      'meta[property="og:image"]',
      'meta[property="og:image:url"]',
      'meta[name="twitter:image"]',
      'meta[name="twitter:image:src"]',
    ]),
  )

  $('link[rel="image_src"]').each((_, el) => {
    push($(el).attr('href'))
  })

  $('img').each((_, el) => {
    push(
      $(el).attr('src') ||
        $(el).attr('data-src') ||
        $(el).attr('data-lazy-src'),
    )

    const srcset = $(el).attr('srcset')

    if (srcset) {
      const first = srcset
        .split(',')
        .map((entry) => entry.trim().split(/\s+/)[0])
        .find(Boolean)

      push(first)
    }
  })

  return unique(images).slice(0, MAX_IMAGES)
}

function detectPlatform(url) {
  const hostname = new URL(url).hostname.toLowerCase()

  if (
    hostname === 'instagram.com' ||
    hostname.endsWith('.instagram.com')
  ) {
    return 'instagram'
  }

  if (
    hostname === 'github.com' ||
    hostname.endsWith('.github.com')
  ) {
    return 'github'
  }

  if (
    hostname === 'linkedin.com' ||
    hostname.endsWith('.linkedin.com')
  ) {
    return 'linkedin'
  }

  if (
    hostname === 'youtube.com' ||
    hostname === 'youtu.be' ||
    hostname.endsWith('.youtube.com')
  ) {
    return 'youtube'
  }

  if (
    hostname === 'x.com' ||
    hostname === 'twitter.com' ||
    hostname.endsWith('.x.com') ||
    hostname.endsWith('.twitter.com')
  ) {
    return 'x'
  }

  return 'web'
}

export default async function handler(req, res) {
  res.setHeader(
    'Access-Control-Allow-Origin',
    '*',
  )

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, OPTIONS',
  )

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type',
  )

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  try {
    const rawUrl =
      typeof req.query?.url === 'string'
        ? req.query.url.trim()
        : ''

    if (!rawUrl) {
      return res.status(400).json({
        error: 'Missing url parameter.',
      })
    }

    let target

    try {
      target = new URL(rawUrl)
    } catch {
      return res.status(400).json({
        error: 'Invalid URL.',
      })
    }

    if (!['http:', 'https:'].includes(target.protocol)) {
      return res.status(400).json({
        error: 'Only HTTP and HTTPS URLs are supported.',
      })
    }

    await assertPublicHost(target.hostname)

    const response = await fetch(target.href, {
      redirect: 'follow',
      headers: {
        'user-agent':
          'Mozilla/5.0 (compatible; AbhivocopediaLinkPreview/1.0; +https://abhivocopedia.github.io/)',
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    if (!response.ok) {
      return res.status(502).json({
        error: `Target returned HTTP ${response.status}.`,
      })
    }

    const contentType =
      response.headers.get('content-type') || ''

    if (!contentType.includes('text/html')) {
      return res.status(415).json({
        error: 'Target is not an HTML page.',
      })
    }

    const contentLength = Number(
      response.headers.get('content-length') || 0,
    )

    if (
      contentLength &&
      contentLength > MAX_HTML_BYTES
    ) {
      return res.status(413).json({
        error: 'Target page is too large.',
      })
    }

    const html = await response.text()

    if (Buffer.byteLength(html, 'utf8') > MAX_HTML_BYTES) {
      return res.status(413).json({
        error: 'Target page is too large.',
      })
    }

    const finalUrl = response.url || target.href
    const $ = cheerio.load(html)

    const title =
      getMeta($, [
        'meta[property="og:title"]',
        'meta[name="twitter:title"]',
      ]) ||
      cleanText($('title').first().text()) ||
      finalUrl

    const description =
      getMeta($, [
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
        'meta[name="description"]',
      ]) || ''

    const siteName =
      getMeta($, [
        'meta[property="og:site_name"]',
      ]) ||
      new URL(finalUrl).hostname.replace(
        /^www\./,
        '',
      )

    const favicon =
      absoluteUrl(
        $('link[rel="icon"]').first().attr('href') ||
          $('link[rel="shortcut icon"]')
            .first()
            .attr('href'),
        finalUrl,
      ) ||
      `${new URL(finalUrl).origin}/favicon.ico`

    const images = extractImages($, finalUrl)

    return res.status(200).json({
      ok: true,
      url: finalUrl,
      platform: detectPlatform(finalUrl),
      title,
      description,
      siteName,
      favicon,
      images,
      image: images[0] || null,
    })
  } catch (error) {
    console.error('link-preview error:', error)

    return res.status(500).json({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unable to generate preview.',
    })
  }
}
API

echo "[3/6] Creating React rich preview component..."

cat > src/components/RichLinkPreview.tsx <<'REACT'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { motion } from 'framer-motion'
import styles from './RichLinkPreview.module.css'

type LinkPreviewData = {
  ok: boolean
  url: string
  platform:
    | 'instagram'
    | 'github'
    | 'linkedin'
    | 'youtube'
    | 'x'
    | 'web'
  title: string
  description: string
  siteName: string
  favicon: string
  images: string[]
  image: string | null
  error?: string
}

type RichLinkPreviewProps = {
  url: string
  label?: string
  username?: string
  accent?: string
}

const API_BASE =
  import.meta.env.VITE_LINK_PREVIEW_API ||
  '/api/link-preview'

function buildApiUrl(url: string) {
  return `${API_BASE}?url=${encodeURIComponent(url)}`
}

function platformName(
  platform: LinkPreviewData['platform'],
) {
  switch (platform) {
    case 'instagram':
      return 'Instagram'
    case 'github':
      return 'GitHub'
    case 'linkedin':
      return 'LinkedIn'
    case 'youtube':
      return 'YouTube'
    case 'x':
      return 'X'
    default:
      return 'WEB'
  }
}

function fallbackTiles(
  images: string[],
) {
  const tiles = [...images]

  while (tiles.length < 6) {
    tiles.push('')
  }

  return tiles.slice(0, 6)
}

export function RichLinkPreview({
  url,
  label,
  username,
  accent,
}: RichLinkPreviewProps) {
  const [data, setData] =
    useState<LinkPreviewData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)
    setData(null)

    fetch(buildApiUrl(url))
      .then(async (response) => {
        const result =
          (await response.json()) as LinkPreviewData

        if (!response.ok || !result.ok) {
          throw new Error(
            result.error ||
              'Preview could not be generated.',
          )
        }

        return result
      })
      .then((result) => {
        if (cancelled) {
          return
        }

        setData(result)
      })
      .catch((reason) => {
        if (cancelled) {
          return
        }

        setError(
          reason instanceof Error
            ? reason.message
            : 'Preview unavailable.',
        )
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [url])

  const tiles = useMemo(
    () =>
      fallbackTiles(
        data?.images || [],
      ),
    [data?.images],
  )

  const displayTitle =
    data?.title ||
    label ||
    'Link Preview'

  const displayUsername =
    username ||
    data?.siteName ||
    'Open profile'

  return (
    <div
      className={styles.root}
      style={
        {
          '--preview-accent':
            accent || 'var(--mustard)',
        } as React.CSSProperties
      }
    >
      <div className={styles.identity}>
        <div className={styles.avatar}>
          {data?.image ? (
            <img
              src={data.image}
              alt=""
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display =
                  'none'
              }}
            />
          ) : data?.favicon ? (
            <img
              src={data.favicon}
              alt=""
              loading="lazy"
            />
          ) : (
            <span>↗</span>
          )}
        </div>

        <div className={styles.identityText}>
          <strong>
            {displayUsername}
          </strong>

          <span>
            {displayTitle}
          </span>
        </div>

        <span className={styles.platform}>
          {data
            ? platformName(data.platform)
            : label || 'LINK'}
        </span>
      </div>

      <div className={styles.previewArea}>
        {loading && (
          <div
            className={styles.loadingGrid}
            aria-label="Loading link preview"
          >
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <span
                  key={index}
                  className={
                    styles.skeleton
                  }
                />
              ),
            )}
          </div>
        )}

        {!loading && data && (
          <div
            className={styles.imageGrid}
          >
            {tiles.map(
              (image, index) => (
                <div
                  key={`${image}-${index}`}
                  className={
                    styles.imageTile
                  }
                >
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={
                        styles.emptyTile
                      }
                    >
                      <span>
                        {index + 1}
                      </span>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        )}

        {!loading && error && (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>
              !
            </span>

            <div>
              <strong>
                Preview unavailable
              </strong>

              <p>
                Open the link to view the
                original page.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <span>
            {data?.siteName ||
              label ||
              'LINK'}
          </span>

          <small>
            {data?.description ||
              'Rich preview generated from the public page.'}
          </small>
        </div>

        <motion.span
          className={styles.open}
          whileHover={{
            x: 4,
          }}
        >
          OPEN ↗
        </motion.span>
      </div>
    </div>
  )
}
REACT

echo "[4/6] Creating preview CSS..."

cat > src/components/RichLinkPreview.module.css <<'CSS'
.root {
  --preview-accent: var(--mustard);

  display: flex;
  height: 100%;
  min-height: 250px;
  flex-direction: column;
  overflow: hidden;
  background: #111;
  color: var(--warm-white);
}

.identity {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.11);
  background: rgba(0, 0, 0, 0.3);
}

.avatar {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  overflow: hidden;
  border: 2px solid var(--preview-accent);
  border-radius: 50%;
  background: #252525;
  color: var(--warm-white);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.identityText {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.15rem;
}

.identityText strong {
  overflow: hidden;
  color: var(--warm-white);
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.identityText span {
  overflow: hidden;
  color: rgba(255, 253, 246, 0.55);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.platform {
  padding: 0.35rem 0.55rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  color: var(--preview-accent);
  font-family: var(--font-mono);
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.previewArea {
  position: relative;
  min-height: 0;
  flex: 1;
  overflow: hidden;
  background: #090909;
}

.imageGrid,
.loadingGrid {
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 180px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
  background: #000;
}

.imageTile {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: #1b1b1b;
}

.imageTile img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.root:hover .imageTile img {
  transform: scale(1.035);
}

.emptyTile {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  background:
    radial-gradient(
      circle at center,
      rgba(224, 174, 62, 0.15),
      transparent 60%
    ),
    #151515;
  color: rgba(255, 255, 255, 0.2);
  font-family: var(--font-mono);
  font-size: 0.6rem;
}

.skeleton {
  position: relative;
  overflow: hidden;
  background: #191919;
}

.skeleton::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(
    100deg,
    transparent 20%,
    rgba(255, 255, 255, 0.08) 45%,
    transparent 70%
  );
  animation: previewSweep 1.4s linear infinite;
}

.errorState {
  display: flex;
  min-height: 180px;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1.5rem;
  background:
    radial-gradient(
      circle at center,
      rgba(224, 174, 62, 0.12),
      transparent 60%
    ),
    #0c0c0c;
}

.errorIcon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border: 1px solid var(--preview-accent);
  border-radius: 50%;
  color: var(--preview-accent);
  font-family: var(--font-display);
  font-weight: 700;
}

.errorState strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--warm-white);
  font-family: var(--font-display);
}

.errorState p {
  margin: 0;
  color: rgba(255, 253, 246, 0.48);
  font-family: var(--font-body);
  font-size: 0.76rem;
  line-height: 1.5;
}

.footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: space-between;
  padding: 0.75rem 0.95rem;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  background: #111;
}

.footerInfo {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.2rem;
}

.footerInfo > span {
  overflow: hidden;
  color: var(--warm-white);
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.footerInfo small {
  overflow: hidden;
  max-width: 36ch;
  color: rgba(255, 253, 246, 0.44);
  font-family: var(--font-body);
  font-size: 0.64rem;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.open {
  flex: 0 0 auto;
  color: var(--preview-accent);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

@keyframes previewSweep {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(100%);
  }
}

@media (max-width: 680px) {
  .identity {
    padding-inline: 0.75rem;
  }

  .avatar {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .platform {
    display: none;
  }

  .footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .open {
    font-size: 0.54rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .imageTile img,
  .skeleton::after {
    animation: none;
    transition: none;
  }
}
CSS

echo "[5/6] Updating package scripts..."

node <<'NODE'
const fs = require('node:fs')

const packagePath = 'package.json'
const pkg = JSON.parse(
  fs.readFileSync(packagePath, 'utf8'),
)

pkg.scripts = {
  ...(pkg.scripts || {}),
  build: 'tsc && vite build',
  'preview-api': 'vercel dev',
}

fs.writeFileSync(
  packagePath,
  JSON.stringify(pkg, null, 2) + '\n',
)
NODE

echo "[6/6] Installer finished."
echo
echo "Files created:"
echo "  api/link-preview.js"
echo "  src/components/RichLinkPreview.tsx"
echo "  src/components/RichLinkPreview.module.css"
echo
echo "IMPORTANT:"
echo "Contact.tsx still needs to render RichLinkPreview."
echo
echo "Next:"
echo "  pnpm run build"
echo
