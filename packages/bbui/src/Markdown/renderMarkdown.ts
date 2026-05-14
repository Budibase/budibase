import DOMPurify from "dompurify"
import { marked, Renderer } from "marked"

const defaultRenderer = new Renderer()

const LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"])
const IMAGE_PROTOCOLS = new Set(["http:", "https:"])

const isControlOrWhitespace = (char: string) => {
  const code = char.charCodeAt(0)
  return code <= 31 || code === 127 || char.trim() === ""
}

const normalizeUrl = (url: string) => {
  let normalizedUrl = ""

  for (const char of url.trim()) {
    if (!isControlOrWhitespace(char)) {
      normalizedUrl += char
    }
  }

  return normalizedUrl
}

const getSafeUrl = (url: string | null, protocols: Set<string>) => {
  if (!url) {
    return
  }

  const normalizedUrl = normalizeUrl(url)

  if (!normalizedUrl) {
    return
  }

  try {
    const parsedUrl = new URL(normalizedUrl)
    if (!protocols.has(parsedUrl.protocol)) {
      return
    }
    return normalizedUrl
  } catch (_err) {
    return
  }
}

const renderer = new Renderer()

renderer.html = () => ""

renderer.link = (href: string | null, title: string | null, text: string) => {
  const safeUrl = getSafeUrl(href, LINK_PROTOCOLS)

  if (!safeUrl) {
    return text
  }

  return defaultRenderer.link(safeUrl, title, text)
}

renderer.image = (href: string | null, title: string | null, text: string) => {
  const safeUrl = getSafeUrl(href, IMAGE_PROTOCOLS)

  if (!safeUrl) {
    return text
  }

  return defaultRenderer.image(safeUrl, title, text)
}

export const renderMarkdown = (markdown: string | undefined) => {
  if (!markdown) {
    return ""
  }

  const html = marked.parse(markdown, { async: false, renderer })

  return DOMPurify.sanitize(html)
}
