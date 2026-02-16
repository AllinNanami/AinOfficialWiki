function hasFileExtension(pathname) {
  const last = pathname.split('/').pop() || ''
  return last.includes('.')
}

function shouldBypass(pathname, nestedPath) {
  if (!nestedPath) return true
  if (nestedPath.startsWith('assets/')) return true
  if (nestedPath === 'index' || nestedPath === 'index.html') return true
  if (nestedPath === '404' || nestedPath === '404.html') return true
  if (hasFileExtension(pathname)) return true
  return false
}

export default async function middleware(req) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return fetch(req)
  }

  const pathname = req.nextUrl.pathname
  const match = pathname.match(/^\/decks\/([^/]+)\/(.+)$/)

  if (!match) {
    return fetch(req)
  }

  const deckName = match[1]
  const nestedPath = match[2]

  if (shouldBypass(pathname, nestedPath)) {
    return fetch(req)
  }

  const rewriteUrl = new URL(req.url)
  rewriteUrl.pathname = `/decks/${deckName}/index.html`

  return fetch(rewriteUrl.toString(), {
    method: req.method,
    headers: req.headers,
  })
}

export const config = {
  matcher: ['/decks/:deck/:path*'],
}
