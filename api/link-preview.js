import * as cheerio from 'cheerio'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153.0 Safari/537.36'

const DEFAULT_HEADERS = {
  'User-Agent': USER_AGENT,
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
}

function cleanText(value) {
  if (!value) return ''

  return String(value)
    .replace(/\s+/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function absoluteUrl(base, value) {
  if (!value) return ''

  try {
    return new URL(value, base).href
  } catch {
    return ''
  }
}

function decodeEscapedUrl(value) {
  if (!value) return ''

  return value
    .replace(/\\u002F/gi, '/')
    .replace(/\\u0026/gi, '&')
    .replace(/\\u003F/gi, '?')
    .replace(/\\u003D/gi, '=')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&')
}

function getMeta($, selectors) {
  for (const selector of selectors) {
    const value = $(selector).attr('content')

    if (value) {
      return cleanText(value)
    }
  }

  return ''
}

function getLink($, rel) {
  const value = $(`link[rel="${rel}"]`).attr('href')
  return value ? cleanText(value) : ''
}

function getFavicon($, baseUrl) {
  const icon =
    getLink($, 'icon') ||
    getLink($, 'shortcut icon') ||
    getLink($, 'apple-touch-icon')

  return absoluteUrl(baseUrl, icon)
}

async function fetchText(url, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeout || 8000,
  )

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        ...DEFAULT_HEADERS,
        ...(options.headers || {}),
      },
    })

    const text = await response.text()

    if (!response.ok) {
      throw new Error(
        `Remote request failed with ${response.status}`,
      )
    }

    return {
      text,
      finalUrl: response.url || url,
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeout || 8000,
  )

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': USER_AGENT,
        ...(options.headers || {}),
      },
    })

    if (!response.ok) {
      throw new Error(
        `Remote API request failed with ${response.status}`,
      )
    }

    return await response.json()
  } finally {
    clearTimeout(timeout)
  }
}

function detectPlatform(inputUrl) {
  const hostname = new URL(inputUrl).hostname
    .toLowerCase()
    .replace(/^www\./, '')

  if (
    hostname === 'github.com' ||
    hostname.endsWith('.github.com')
  ) {
    return 'github'
  }

  if (
    hostname === 'instagram.com' ||
    hostname.endsWith('.instagram.com')
  ) {
    return 'instagram'
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

function baseResult({
  url,
  platform,
  title,
  description,
  siteName,
  favicon,
  image,
  images,
  tiles,
}) {
  return {
    ok: true,
    url,
    platform,
    title: cleanText(title),
    description: cleanText(description),
    siteName: cleanText(siteName),
    favicon: favicon || '',
    image: image || null,
    images: unique(images || []).slice(0, 12),
    tiles: (tiles || []).slice(0, 6),
  }
}

function extractGenericPage(url, html) {
  const $ = cheerio.load(html)

  const title =
    getMeta($, [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ]) ||
    $('title').first().text() ||
    'Web page'

  const description =
    getMeta($, [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ]) || 'Explore the original page.'

  const siteName =
    getMeta($, ['meta[property="og:site_name"]']) ||
    new URL(url).hostname

  const ogImage = absoluteUrl(
    url,
    getMeta($, [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]),
  )

  const images = unique([
    ogImage,
    ...$('img')
      .map((_, element) =>
        absoluteUrl(url, $(element).attr('src')),
      )
      .get()
      .filter((item) => /^https?:\/\//i.test(item)),
  ])

  const tiles = images.slice(0, 6).map((src, index) => ({
    type: 'image',
    src,
    label: `MEDIA ${String(index + 1).padStart(2, '0')}`,
  }))

  while (tiles.length < 6) {
    tiles.push({
      type: 'text',
      label: ['PROFILE', 'LATEST', 'MEDIA', 'POST', 'INFO', 'EXPLORE'][
        tiles.length
      ],
    })
  }

  return baseResult({
    url,
    platform: 'web',
    title,
    description,
    siteName,
    favicon: getFavicon($, url),
    image: ogImage,
    images,
    tiles,
  })
}

/* =========================================================
   GITHUB
========================================================= */

async function githubPreview(url) {
  const parsed = new URL(url)
  const parts = parsed.pathname
    .split('/')
    .filter(Boolean)

  const username = parts[0]

  if (!username) {
    return extractGenericPage(url, '')
  }

  const token = process.env.GITHUB_TOKEN

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'Abhivocopedia-Portfolio',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const user = await fetchJson(
    `https://api.github.com/users/${encodeURIComponent(
      username,
    )}`,
    { headers },
  )

  const repos = await fetchJson(
    `https://api.github.com/users/${encodeURIComponent(
      username,
    )}/repos?sort=updated&direction=desc&per_page=6`,
    { headers },
  )

  const tiles = []

  for (const repo of Array.isArray(repos)
    ? repos.slice(0, 3)
    : []) {
    try {
      const contents = await fetchJson(
        `https://api.github.com/repos/${encodeURIComponent(
          username,
        )}/${encodeURIComponent(repo.name)}/contents`,
        { headers },
      )

      if (Array.isArray(contents)) {
        for (const item of contents
          .filter((entry) => entry.type === 'file')
          .slice(0, 2)) {
          tiles.push({
            type: 'text',
            label: item.name,
            meta: repo.name,
          })
        }
      }
    } catch {
      tiles.push({
        type: 'text',
        label: repo.name,
        meta: repo.language || 'Repository',
      })
    }
  }

  for (const repo of Array.isArray(repos)
    ? repos.slice(0, 6)
    : []) {
    if (tiles.length >= 6) break

    tiles.push({
      type: 'text',
      label: repo.name,
      meta: repo.language || 'Repository',
    })
  }

  while (tiles.length < 6) {
    const fallbacks = [
      ['PROFILE', username],
      ['REPOSITORIES', `${user.public_repos || 0} public`],
      ['FOLLOWERS', `${user.followers || 0}`],
      ['LATEST', 'Updated projects'],
      ['CODE', 'Open source'],
      ['EXPLORE', 'GitHub'],
    ]

    const fallback = fallbacks[tiles.length]

    tiles.push({
      type: 'text',
      label: fallback[0],
      meta: fallback[1],
    })
  }

  return baseResult({
    url,
    platform: 'github',
    title: user.name || user.login,
    description:
      user.bio ||
      'Open-source projects, repositories and recent work.',
    siteName: 'GitHub',
    favicon:
      user.avatar_url ||
      'https://github.com/favicon.ico',
    image: user.avatar_url || null,
    images: user.avatar_url ? [user.avatar_url] : [],
    tiles,
  })
}

/* =========================================================
   INSTAGRAM
========================================================= */

function extractInstagramImages(html, baseUrl) {
  const values = []

  const metaMatches = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/gi,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)/gi,
    /"display_url":"(https?:\\\/\\\/[^"]+)"/gi,
    /"thumbnail_src":"(https?:\\\/\\\/[^"]+)"/gi,
    /"image":"(https?:\\\/\\\/[^"]+)"/gi,
  ]

  for (const pattern of metaMatches) {
    let match

    while ((match = pattern.exec(html))) {
      const decoded = decodeEscapedUrl(match[1])

      const absolute = absoluteUrl(
        baseUrl,
        decoded,
      )

      if (
        absolute &&
        /\.(jpg|jpeg|png|webp)(\?|$)/i.test(
          absolute,
        )
      ) {
        values.push(absolute)
      }
    }
  }

  return unique(values)
}

async function instagramPreview(url) {
  const { text, finalUrl } = await fetchText(url)

  const $ = cheerio.load(text)

  const ogImage = absoluteUrl(
    finalUrl,
    getMeta($, [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]),
  )

  const images = unique([
    ...extractInstagramImages(
      text,
      finalUrl,
    ),
    ogImage,
  ])

  const title =
    getMeta($, ['meta[property="og:title"]']) ||
    $('title').first().text() ||
    'Instagram profile'

  const description =
    getMeta($, [
      'meta[property="og:description"]',
      'meta[name="description"]',
    ]) ||
    'Instagram profile and public media.'

  const tiles = images
    .slice(0, 6)
    .map((src, index) => ({
      type: 'image',
      src,
      label: `POST ${String(index + 1).padStart(2, '0')}`,
    }))

  const fallbackLabels = [
    'PROFILE',
    'LATEST',
    'POST',
    'MEDIA',
    'REELS',
    'EXPLORE',
  ]

  while (tiles.length < 6) {
    tiles.push({
      type: 'text',
      label: fallbackLabels[tiles.length],
    })
  }

  return baseResult({
    url,
    platform: 'instagram',
    title,
    description,
    siteName: 'Instagram',
    favicon:
      getFavicon($, finalUrl) ||
      'https://www.instagram.com/favicon.ico',
    image: ogImage || images[0] || null,
    images,
    tiles,
  })
}

/* =========================================================
   LINKEDIN
========================================================= */

async function linkedinPreview(url) {
  const { text, finalUrl } = await fetchText(url)

  const $ = cheerio.load(text)

  const image = absoluteUrl(
    finalUrl,
    getMeta($, [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]),
  )

  const title =
    getMeta($, ['meta[property="og:title"]']) ||
    $('title').first().text() ||
    'LinkedIn profile'

  const description =
    getMeta($, [
      'meta[property="og:description"]',
      'meta[name="description"]',
    ]) ||
    'LinkedIn profile and professional activity.'

  const tiles = []

  if (image) {
    tiles.push({
      type: 'image',
      src: image,
      label: 'PROFILE',
    })
  }

  const labels = [
    'LATEST',
    'POST',
    'EXPERIENCE',
    'ABOUT',
    'ACTIVITY',
  ]

  while (tiles.length < 6) {
    tiles.push({
      type: 'text',
      label: labels[tiles.length - 1] || 'LINKEDIN',
    })
  }

  return baseResult({
    url,
    platform: 'linkedin',
    title,
    description,
    siteName: 'LinkedIn',
    favicon:
      getFavicon($, finalUrl) ||
      'https://www.linkedin.com/favicon.ico',
    image: image || null,
    images: image ? [image] : [],
    tiles,
  })
}

/* =========================================================
   X
========================================================= */

async function xPreview(url) {
  const { text, finalUrl } = await fetchText(url)

  const $ = cheerio.load(text)

  const image = absoluteUrl(
    finalUrl,
    getMeta($, [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]),
  )

  const title =
    getMeta($, [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ]) ||
    $('title').first().text() ||
    'X profile'

  const description =
    getMeta($, [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[name="description"]',
    ]) ||
    'Profile and public activity on X.'

  const tiles = []

  if (image) {
    tiles.push({
      type: 'image',
      src: image,
      label: 'PROFILE',
    })
  }

  const labels = [
    'LATEST',
    'POSTS',
    'MEDIA',
    'ABOUT',
    'EXPLORE',
  ]

  while (tiles.length < 6) {
    tiles.push({
      type: 'text',
      label: labels[tiles.length - 1] || 'X',
    })
  }

  return baseResult({
    url,
    platform: 'x',
    title,
    description,
    siteName: 'X',
    favicon:
      getFavicon($, finalUrl) ||
      'https://abs.twimg.com/favicons/twitter.3.ico',
    image: image || null,
    images: image ? [image] : [],
    tiles,
  })
}

/* =========================================================
   YOUTUBE
========================================================= */

async function youtubePreview(url) {
  return baseResult({
    url,
    platform: 'youtube',
    title: 'YouTube',
    description: 'Channel link.',
    siteName: 'YouTube',
    favicon: 'https://www.youtube.com/s/desktop/favicon.ico',
    image: null,
    images: [],
    tiles: [],
  })
}

/* =========================================================
   GENERIC WEB
========================================================= */

async function webPreview(url) {
  const { text, finalUrl } = await fetchText(url)
  return extractGenericPage(finalUrl, text)
}

/* =========================================================
   HANDLER
========================================================= */

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

  res.setHeader(
    'Cache-Control',
    's-maxage=900, stale-while-revalidate=3600',
  )

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed.',
    })
  }

  const input =
    typeof req.query?.url === 'string'
      ? req.query.url
      : ''

  if (!input) {
    return res.status(400).json({
      ok: false,
      error: 'Missing url parameter.',
    })
  }

  let target

  try {
    target = new URL(input)
  } catch {
    return res.status(400).json({
      ok: false,
      error: 'Invalid URL.',
    })
  }

  if (!['http:', 'https:'].includes(target.protocol)) {
    return res.status(400).json({
      ok: false,
      error: 'Only HTTP and HTTPS URLs are supported.',
    })
  }

  try {
    const platform = detectPlatform(
      target.href,
    )

    let result

    switch (platform) {
      case 'github':
        result = await githubPreview(
          target.href,
        )
        break

      case 'instagram':
        result = await instagramPreview(
          target.href,
        )
        break

      case 'linkedin':
        result = await linkedinPreview(
          target.href,
        )
        break

      case 'youtube':
        result = await youtubePreview(
          target.href,
        )
        break

      case 'x':
        result = await xPreview(
          target.href,
        )
        break

      default:
        result = await webPreview(
          target.href,
        )
        break
    }

    return res.status(200).json(result)
  } catch (error) {
    console.error(
      'Link preview error:',
      error,
    )

    return res.status(502).json({
      ok: false,
      url: target.href,
      error:
        error instanceof Error
          ? error.message
          : 'Preview generation failed.',
    })
  }
}
