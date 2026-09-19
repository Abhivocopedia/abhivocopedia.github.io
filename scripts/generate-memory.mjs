import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')

const memoriesDir = path.join(
  projectRoot,
  'public',
  'images',
  'memories',
)

const outputDir = path.join(
  projectRoot,
  'src',
  'data',
)

const outputFile = path.join(
  outputDir,
  'memories.generated.ts',
)

const supportedExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.jfif',
  '.png',
  '.webp',
  '.avif',
  '.gif',
  '.bmp',
  '.svg',
])

function walk(directory) {
  if (!fs.existsSync(directory)) {
    return []
  }

  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
  })

  const files = []

  for (const entry of entries) {
    const absolutePath = path.join(
      directory,
      entry.name,
    )

    if (entry.isDirectory()) {
      files.push(...walk(absolutePath))
      continue
    }

    const extension = path
      .extname(entry.name)
      .toLowerCase()

    if (supportedExtensions.has(extension)) {
      files.push(absolutePath)
    }
  }

  return files
}

const files = walk(memoriesDir).sort((a, b) => {
  const aRelative = path.relative(
    memoriesDir,
    a,
  )

  const bRelative = path.relative(
    memoriesDir,
    b,
  )

  return aRelative.localeCompare(
    bRelative,
    undefined,
    {
      numeric: true,
      sensitivity: 'base',
    },
  )
})

const memories = files.map((absolutePath) => {
  const relativePath = path.relative(
    memoriesDir,
    absolutePath,
  )

  const urlPath = relativePath
    .split(path.sep)
    .map((part) => encodeURIComponent(part))
    .join('/')

  return {
    src: `/images/memories/${urlPath}`,
    name: relativePath.replaceAll('\\', '/'),
  }
})

fs.mkdirSync(outputDir, {
  recursive: true,
})

const generatedFile = `// AUTO-GENERATED FILE
// DO NOT EDIT MANUALLY
// Source: public/images/memories/

export const memories = ${JSON.stringify(
  memories,
  null,
  2,
)} as const

export type Memory = (typeof memories)[number]
`

fs.writeFileSync(
  outputFile,
  generatedFile,
  'utf8',
)

console.log(
  `Generated ${memories.length} memory image${
    memories.length === 1 ? '' : 's'
  }.`,
)

console.log(
  `Output: ${outputFile}`,
)
