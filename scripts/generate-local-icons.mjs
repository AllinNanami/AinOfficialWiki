import fs from 'node:fs/promises'
import path from 'node:path'

import mdiIcons from '@iconify-json/mdi/icons.json' with { type: 'json' }
import simpleIcons from '@iconify-json/simple-icons/icons.json' with { type: 'json' }
import { getIconData } from '@iconify/utils'

const ROOT = process.cwd()
const SOURCE_DIRECTORIES = ['docs', 'slides']
const OUTPUT_FILE = path.join(ROOT, 'docs/.vitepress/theme/generated/local-icons.ts')
const ICON_NAME_PATTERN = /\b(?:mdi|simple-icons|provider):[a-z0-9-]+\b/g
const TEXT_FILE_PATTERN = /\.(md|mdx|vue|ts|tsx|js|jsx|mjs|cjs|mts|cts|json|css)$/i
const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  '.git',
  '.cloudflare-dist',
  'dist',
  'coverage',
  'cache',
  'generated',
  'public'
])

const DOWNLOAD_ICON = {
  body: '<path fill="currentColor" d="M12 2a1 1 0 0 1 1 1v8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L11 11.586V3a1 1 0 0 1 1-1m-7 14a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1"/>',
  width: 24,
  height: 24
}

const PROVIDER_ICON_MAP = {
  download: DOWNLOAD_ICON,
  baidu: simpleIcons.icons.baidu,
  googledrive: simpleIcons.icons.googledrive,
  mega: simpleIcons.icons.mega,
  onedrive: simpleIcons.icons.microsoftonedrive,
  github: simpleIcons.icons.github,
  icloud: simpleIcons.icons.icloud,
  // Grok 品牌图标：simple-icons 尚未收录，SVG 取自 CelestPlume 自绘版本（fill=currentColor，viewBox 24）
  grok: {
    body: '<path fill="currentColor" fill-rule="evenodd" d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"/>',
    width: 24,
    height: 24
  },
  // Devin 品牌图标：simple-icons 尚未收录，SVG 取自 BrushUp 的 devin.svg
  devin: {
    body: '<path fill="currentColor" fill-rule="evenodd" d="M2.033 9.867l2.554 1.483a.589.589 0 00.592 0l2.554-1.483.01-.008a.608.608 0 00.11-.084l.013-.015a.631.631 0 00.076-.1c.003-.005.008-.01.01-.016a.558.558 0 00.052-.125l.007-.028a.611.611 0 00.019-.14V7.868c0-.572.307-1.105.8-1.392a1.595 1.595 0 011.598 0l1.277.742a.54.54 0 00.129.053l.028.01c.044.01.088.015.133.016h.006l.013-.002a.587.587 0 00.27-.074l.011-.004 2.554-1.483a.596.596 0 00.297-.516V2.253a.595.595 0 00-.297-.516L12.293.257a.587.587 0 00-.591 0L9.148 1.737l-.01.01a.609.609 0 00-.109.083l-.014.015a.632.632 0 00-.076.1c-.003.005-.008.01-.01.016a.57.57 0 00-.052.124l-.007.028a.612.612 0 00-.018.14v1.483c0 .572-.307 1.105-.8 1.393a1.597 1.597 0 01-1.599 0l-1.276-.742a.603.603 0 00-.13-.053l-.028-.008a.658.658 0 00-.133-.018h-.02a.57.57 0 00-.269.074c-.003.002-.008.002-.012.005L2.033 5.872a.596.596 0 00-.297.515v2.966c0 .213.113.41.297.515z"/><path fill="currentColor" fill-rule="evenodd" d="M15.943 10.607a1.596 1.596 0 011.599 0l1.276.74c.041.025.085.04.13.055l.028.008c.043.01.088.016.133.018h.005c.005 0 .01-.002.014-.003a.474.474 0 00.122-.016l.021-.005a.616.616 0 00.126-.052c.004-.002.009-.002.013-.005l2.554-1.482a.597.597 0 00.297-.516V6.383a.596.596 0 00-.297-.515l-2.552-1.483a.587.587 0 00-.592 0l-2.553 1.482-.011.008a.61.61 0 00-.108.084l-.014.016a.637.637 0 00-.076.1c-.003.005-.008.01-.01.016a.57.57 0 00-.052.124l-.007.029a.612.612 0 00-.018.14v1.482c0 .572-.307 1.105-.8 1.393a1.597 1.597 0 01-1.599 0l-1.276-.742a.584.584 0 00-.13-.053l-.028-.008a.62.62 0 00-.133-.018h-.02a.587.587 0 00-.269.074l-.012.004L9.15 10a.596.596 0 00-.296.516v2.966c0 .212.112.409.296.515l2.554 1.483s.008.002.012.005c.04.022.082.04.126.052l.02.004a.57.57 0 00.123.017l.014.002h.006c.054 0 .108-.01.16-.025a.587.587 0 00.13-.054l1.277-.741a1.597 1.597 0 012.398 1.392v1.482c0 .049.007.095.019.14l.007.028a.619.619 0 00.051.125c.004.006.008.01.01.016a.6.6 0 00.076.1l.014.015c.033.032.069.06.108.084.004.002.006.006.011.008l2.554 1.483a.59.59 0 00.593 0l2.554-1.483a.597.597 0 00.296-.516v-2.965a.595.595 0 00-.296-.516l-2.554-1.483s-.008-.002-.012-.005a.54.54 0 00-.126-.051c-.007-.003-.013-.003-.02-.005a.635.635 0 00-.125-.017h-.018a.557.557 0 00-.16.026.588.588 0 00-.13.053l-1.276.742a1.595 1.595 0 01-1.598 0 1.615 1.615 0 010-2.785l-.005-.001z"/><path fill="currentColor" fill-rule="evenodd" d="M14.848 18.265l-2.554-1.482-.012-.005a.526.526 0 00-.126-.052c-.007-.002-.014-.002-.02-.005a.64.64 0 00-.124-.017h-.02a.56.56 0 00-.16.026.588.588 0 00-.13.053l-1.276.742a1.594 1.594 0 01-1.598 0c-.493-.286-.8-.82-.8-1.393V14.65a.563.563 0 00-.018-.14l-.008-.028a.604.604 0 00-.051-.124l-.01-.017a.603.603 0 00-.076-.1l-.014-.015a.596.596 0 00-.109-.084c-.003-.002-.005-.006-.01-.008L5.178 12.65a.587.587 0 00-.591 0l-2.554 1.483a.596.596 0 00-.297.516v2.965c0 .213.113.41.297.516l2.554 1.483.012.004a.618.618 0 00.267.074l.016.002h.007a.55.55 0 00.16-.026.584.584 0 00.129-.053l1.277-.742a1.597 1.597 0 012.398 1.393v1.482c0 .05.007.095.019.14l.007.028c.013.044.03.085.051.125l.01.016c.022.036.047.07.076.1l.014.015c.032.032.069.06.109.084l.01.008 2.554 1.483a.587.587 0 00.593 0l2.554-1.483a.596.596 0 00.296-.515v-2.966a.596.596 0 00-.296-.516h-.002z"/>',
    width: 24,
    height: 24
  }
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) continue
      files.push(...(await walk(path.join(directory, entry.name))))
      continue
    }

    if (!TEXT_FILE_PATTERN.test(entry.name)) continue
    files.push(path.join(directory, entry.name))
  }

  return files
}

async function collectIconNames() {
  const names = new Set()

  for (const relativeDirectory of SOURCE_DIRECTORIES) {
    const absoluteDirectory = path.join(ROOT, relativeDirectory)
    const files = await walk(absoluteDirectory)

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8')
      const matches = content.match(ICON_NAME_PATTERN) ?? []

      for (const match of matches) {
        names.add(match)
      }
    }
  }

  return [...names].sort((left, right) => left.localeCompare(right))
}

function resolveIconData(iconName) {
  const [prefix, name] = iconName.split(':')

  if (!prefix || !name) {
    throw new Error(`Invalid icon name: ${iconName}`)
  }

  if (prefix === 'mdi') {
    const icon = getIconData(mdiIcons, name)
    if (!icon) throw new Error(`Cannot resolve mdi icon: ${iconName}`)
    return { prefix, name, icon }
  }

  if (prefix === 'simple-icons') {
    const icon = getIconData(simpleIcons, name)
    if (!icon) throw new Error(`Cannot resolve simple-icons icon: ${iconName}`)
    return { prefix, name, icon }
  }

  if (prefix === 'provider') {
    const icon = PROVIDER_ICON_MAP[name]
    if (!icon) throw new Error(`Cannot resolve provider icon: ${iconName}`)
    return { prefix, name, icon }
  }

  throw new Error(`Unsupported icon prefix: ${iconName}`)
}

function buildCollection(prefix, source, names) {
  return {
    prefix,
    width: source.width ?? 24,
    height: source.height ?? 24,
    icons: Object.fromEntries(names.map((name) => [name, resolveIconData(`${prefix}:${name}`).icon]))
  }
}

function toTypeScriptModule(iconNames) {
  const grouped = {
    mdi: [],
    'simple-icons': [],
    provider: []
  }

  for (const iconName of iconNames) {
    const [prefix, name] = iconName.split(':')
    grouped[prefix].push(name)
  }

  const mdiCollection = buildCollection('mdi', mdiIcons, grouped.mdi)
  const simpleIconsCollection = buildCollection('simple-icons', simpleIcons, grouped['simple-icons'])
  const providerCollection = buildCollection('provider', { width: 24, height: 24 }, grouped.provider)

  return `/* eslint-disable */\n// Generated by scripts/generate-local-icons.mjs. Do not edit manually.\nimport type { IconifyJSON } from '@iconify/types'\n\nexport const mdiIconSet = ${JSON.stringify(mdiCollection, null, 2)} as const satisfies IconifyJSON\n\nexport const simpleIconsIconSet = ${JSON.stringify(simpleIconsCollection, null, 2)} as const satisfies IconifyJSON\n\nexport const providerIconSet = ${JSON.stringify(providerCollection, null, 2)} as const satisfies IconifyJSON\n\nexport const LOCAL_ICON_COLLECTIONS = [mdiIconSet, simpleIconsIconSet, providerIconSet] as const\n`
}

async function main() {
  const iconNames = await collectIconNames()
  const moduleSource = toTypeScriptModule(iconNames)
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true })
  await fs.writeFile(OUTPUT_FILE, moduleSource)
  console.log(`Generated ${iconNames.length} local icons -> ${path.relative(ROOT, OUTPUT_FILE)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
