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
