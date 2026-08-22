/**
 * Cloudflare Pages 高级模式 Worker：Markdown 内容协商（acceptmarkdown.com 兼容）。
 *
 * 策略：
 * - 仅当 Accept 显式包含 `text/markdown` 时，尝试改写为同名 `.md` 静态资源
 *   （vitepress-plugin-llms 已为每个页面生成 Markdown 版本）。
 * - 浏览器与 Googlebot 的 Accept 为 `text/html,...` 加通配符，不含字面量
 *   `text/markdown`，永远走原 HTML 分支——对 SEO 零影响。
 *
 * 本文件位于 docs/public/，随构建拷贝到产物根目录 .cloudflare-dist/_worker.js。
 */

const MARKDOWN_TYPE = 'text/markdown; charset=utf-8'
// 这些前缀是纯静态资产/第三方产物，不存在同名 .md 变体，直接透传
const SKIP_PREFIXES = ['/assets/', '/pagefind/', '/decks/', '@vite/', '@fs/']

function wantsMarkdown(request) {
  const accept = request.headers.get('Accept') || ''
  return accept.split(',').some((part) => {
    const mediaType = part.trim().split(';')[0].trim().toLowerCase()
    return mediaType === 'text/markdown' || mediaType === 'text/x-markdown'
  })
}

// /foo/bar -> /foo/bar.md；/foo/ -> /foo.md；带扩展名的路径不协商
function toMarkdownPath(pathname) {
  let decoded
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    return null
  }
  if (SKIP_PREFIXES.some((prefix) => decoded.startsWith(prefix))) return null

  const lastSegment = decoded.split('/').pop()
  if (lastSegment.includes('.')) {
    // 唯一例外：.html 后缀同样映射到对应 .md（兼容旧链接）
    return lastSegment.endsWith('.html')
      ? `${decoded.slice(0, -'.html'.length)}.md`
      : null
  }
  // 目录页（如 /lectures/）的 Markdown 由 llms 插件生成在上级：/lectures.md；
  // 站点根目录无 Markdown 变体，返回 null 走 HTML 分支。
  return decoded === '/' ? null : `${decoded.replace(/\/$/, '')}.md`
}


function appendVary(headers, token) {
  const existing = headers.get('Vary') || ''
  const tokens = existing
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  if (!tokens.some((value) => value.toLowerCase() === token.toLowerCase())) {
    tokens.push(token)
  }
  return tokens.join(', ')
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if ((request.method === 'GET' || request.method === 'HEAD') && wantsMarkdown(request)) {
      const markdownPath = toMarkdownPath(url.pathname)
      if (markdownPath) {
        const markdownUrl = new URL(url)
        markdownUrl.pathname = markdownPath
        const markdownRes = await env.ASSETS.fetch(markdownUrl)
        if (markdownRes.status === 200) {
          const res = new Response(markdownRes.body, markdownRes)
          res.headers.set('Content-Type', MARKDOWN_TYPE)
          res.headers.set('Vary', appendVary(res.headers, 'Accept'))
          // Markdown 变体仅面向 agent，禁止进入搜索引擎索引
          res.headers.set('X-Robots-Tag', 'noindex')
          return res
        }
      }
    }

    const assetsRes = await env.ASSETS.fetch(request)
    const vary = appendVary(assetsRes.headers, 'Accept')
    if (vary !== (assetsRes.headers.get('Vary') || '')) {
      const res = new Response(assetsRes.body, assetsRes)
      res.headers.set('Vary', vary)
      return res
    }
    return assetsRes
  }
}
