import * as cheerio from 'cheerio'

type ApiRequest = {
  method?: string
  query?: Record<string, string | string[] | undefined>
}

type ApiResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => ApiResponse
  json: (body: unknown) => void
  end: () => void
}

type PreviewResponse = {
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

function getQueryUrl(
  request: ApiRequest,
): string | null {
  const value = request.query?.url

  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] || null
  }

  return value
}

function isPrivateIPv4(hostname: string) {
  const parts = hostname.split('.')

  if (
    parts.length !== 4 ||
    parts.some(
      (part) =>
        !/^\d+$/.test(part),
    )
  ) {
    return false
  }

  const numbers = parts.map(Number)

  if (numbers.some((n) => n < 0 || n > 255)) {
    return true
  }

  const [a, b] = numbers

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127)
  )
}

function isUnsafeHostname(hostname: string) {
  const normalized = hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, '')

  if (
    normalized === 'localhost' ||
    normalized.endsWith('.localhost') ||
    normalized.endsWith('.local')
  ) {
    return true
  }

  if (normalized === '::1') {
    return true
  }

  if (
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80:')
  ) {
    return true
  }

  return isPrivateIPv4(normalized)
}

function validateUrl(
  value: string,
) {
  const url = new URL(value)

  if (
    url.protocol !== 'http:' &&
    url.protocol !== 'https:'
  ) {
    throw new Error(
      'Only HTTP and HTTPS URLs are supported.',
    )
  }

  if (isUnsafeHostname(url.hostname)) {
    throw new Error(
      'This host cannot be previewed.',
    )
  }

  return url
}

function absoluteUrl(
  value: string | undefined,
  baseUrl: string,
) {
  if (!value) {
    return null
  }

  const trimmed = value.trim()

  if (
    !trimmed ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return null
  }

  try {
    const resolved = new URL(
      trimmed,
      baseUrl,
    )

    if (
      resolved.protocol !== 'http:' &&
      resolved.protocol !== 'https:'
    ) {
      return null
    }

    return resolved.href
  } catch {
    return null
  }
}

function cleanText(
  value: string | undefined,
) {
  return (value || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function detectPlatform(
  hostname: string,
): PreviewResponse['platform'] {
  const host = hostname.toLowerCase()

  if (
    host === 'instagram.com' ||
    host.endsWith('.instagram.com')
  ) {
    return 'instagram'
  }

  if (
    host === 'github.com' ||
    host.endsWith('.github.com')
  ) {
    return 'github'
  }

  if (
    host === 'linkedin.com' ||
    host.endsWith('.linkedin.com')
  ) {
    return 'linkedin'
  }

  if (
    host === 'youtube.com' ||
    host === 'youtu.be' ||
    host.endsWith('.youtube.com')
  ) {
    return 'youtube'
  }

  if (
    host === 'x.com' ||
    host === 'twitter.com' ||
    host.endsWith('.x.com') ||
    host.endsWith('.twitter.com')
  ) {
    return 'x'
  }

  return 'web'
}

function pushUnique(
  list: string[],
  value: string | null,
) {
  if (!value) {
    return
  }

  if (list.includes(value)) {
    return
  }

  list.push(value)
}

async function fetchPage(
  startUrl: string,
) {
  let currentUrl = validateUrl(
    startUrl,
  ).href

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(
      currentUrl,
      {
        redirect: 'manual',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language':
            'en-US,en;q=0.9',
          'Cache-Control':
            'no-cache',
        },
      },
    )

    if (
      response.status >= 300 &&
      response.status < 400
    ) {
      const location =
        response.headers.get(
          'location',
        )

      if (!location) {
        throw new Error(
          'The destination returned an invalid redirect.',
        )
      }

      currentUrl = validateUrl(
        new URL(
          location,
          currentUrl,
        ).href,
      ).href

      continue
    }

    if (!response.ok) {
      throw new Error(
        `Destination returned HTTP ${response.status}.`,
      )
    }

    const contentType =
      response.headers.get(
        'content-type',
      ) || ''

    if (
      !contentType.includes(
        'text/html',
      )
    ) {
      return {
        url: currentUrl,
        html: '',
      }
    }

    return {
      url: currentUrl,
      html: await response.text(),
    }
  }

  throw new Error(
    'Too many redirects.',
  )
}

function parsePreview(
  html: string,
  finalUrl: string,
): Omit<
  PreviewResponse,
  'ok' | 'url'
> {
  const $ = cheerio.load(html)

  const meta = (
    ...names: string[]
  ) => {
    for (const name of names) {
      const value = cleanText(
        $(
          `meta[property="${name}"], meta[name="${name}"]`,
        )
          .first()
          .attr('content'),
      )

      if (value) {
        return value
      }
    }

    return ''
  }

  const title =
    meta(
      'og:title',
      'twitter:title',
    ) ||
    cleanText(
      $('title')
        .first()
        .text(),
    ) ||
    new URL(finalUrl).hostname

  const description =
    meta(
      'og:description',
      'twitter:description',
      'description',
    ) ||
    'Public preview from the destination page.'

  const siteName =
    meta('og:site_name') ||
    new URL(finalUrl).hostname
      .replace(/^www\./, '')

  const favicon =
    absoluteUrl(
      $(
        'link[rel~="icon"]',
      )
        .first()
        .attr('href'),
      finalUrl,
    ) ||
    absoluteUrl(
      $(
        'link[rel="shortcut icon"]',
      )
        .first()
        .attr('href'),
      finalUrl,
    ) ||
    new URL(
      '/favicon.ico',
      finalUrl,
    ).href

  const imageCandidates: string[] = []

  const metadataImages = [
    meta('og:image'),
    meta('og:image:secure_url'),
    meta(
      'twitter:image',
      'twitter:image:src',
    ),
  ]

  for (const candidate of metadataImages) {
    pushUnique(
      imageCandidates,
      absoluteUrl(
        candidate,
        finalUrl,
      ),
    )
  }

  $('link[rel="image_src"]').each(
    (_, element) => {
      pushUnique(
        imageCandidates,
        absoluteUrl(
          $(element).attr('href'),
          finalUrl,
        ),
      )
    },
  )

  $('img').each(
    (_, element) => {
      if (
        imageCandidates.length >= 12
      ) {
        return
      }

      const src =
        $(element).attr('src') ||
        $(element).attr(
          'data-src',
        ) ||
        $(element).attr(
          'data-lazy-src',
        )

      pushUnique(
        imageCandidates,
        absoluteUrl(
          src,
          finalUrl,
        ),
      )
    },
  )

  const platform = detectPlatform(
    new URL(finalUrl).hostname,
  )

  return {
    platform,
    title,
    description,
    siteName,
    favicon,
    images:
      imageCandidates.slice(0, 12),
    image:
      imageCandidates[0] ||
      favicon ||
      null,
  }
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse,
) {
  response.setHeader(
    'Access-Control-Allow-Origin',
    '*',
  )

  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS',
  )

  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type',
  )

  response.setHeader(
    'Cache-Control',
    's-maxage=900, stale-while-revalidate=86400',
  )

  if (
    request.method === 'OPTIONS'
  ) {
    response.status(204).end()
    return
  }

  if (
    request.method &&
    request.method !== 'GET'
  ) {
    response.status(405).json({
      ok: false,
      error: 'Method not allowed.',
    })
    return
  }

  const rawUrl =
    getQueryUrl(request)

  if (!rawUrl) {
    response.status(400).json({
      ok: false,
      error:
        'Missing ?url= parameter.',
    })
    return
  }

  let targetUrl: URL

  try {
    targetUrl = validateUrl(
      rawUrl,
    )
  } catch (error) {
    response.status(400).json({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Invalid URL.',
    })
    return
  }

  try {
    const page = await fetchPage(
      targetUrl.href,
    )

    if (!page.html) {
      const parsedUrl =
        new URL(page.url)

      const fallback: PreviewResponse = {
        ok: true,
        url: page.url,
        platform:
          detectPlatform(
            parsedUrl.hostname,
          ),
        title:
          parsedUrl.hostname,
        description:
          'Open the destination to view its full content.',
        siteName:
          parsedUrl.hostname.replace(
            /^www\./,
            '',
          ),
        favicon:
          new URL(
            '/favicon.ico',
            page.url,
          ).href,
        images: [],
        image: null,
      }

      response.status(200).json(
        fallback,
      )
      return
    }

    const parsed =
      parsePreview(
        page.html,
        page.url,
      )

    const result: PreviewResponse = {
      ok: true,
      url: page.url,
      ...parsed,
    }

    response.status(200).json(
      result,
    )
  } catch (error) {
    const hostname =
      targetUrl.hostname
        .replace(/^www\./, '')

    const fallback: PreviewResponse = {
      ok: true,
      url: targetUrl.href,
      platform:
        detectPlatform(
          targetUrl.hostname,
        ),
      title: hostname,
      description:
        'The destination blocked automatic extraction. Open the link to view the original page.',
      siteName: hostname,
      favicon:
        new URL(
          '/favicon.ico',
          targetUrl.href,
        ).href,
      images: [],
      image: null,
      error:
        error instanceof Error
          ? error.message
          : 'Preview extraction failed.',
    }

    response.status(200).json(
      fallback,
    )
  }
}
