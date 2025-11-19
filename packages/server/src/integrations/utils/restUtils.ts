import type { Headers as UndiciHeaders } from "undici"
import type { Headers as NodeFetchHeaders } from "node-fetch"

export function getAttachmentHeaders(
  headers: UndiciHeaders | NodeFetchHeaders,
  opts?: { downloadImages?: boolean }
) {
  const contentType = headers.get("content-type") || ""
  let contentDisposition = headers.get("content-disposition") || ""

  // the API does not follow the requirements of https://www.ietf.org/rfc/rfc2183.txt
  // all content-disposition headers should be format disposition-type; parameters
  // but some APIs do not provide a type, causing the parse below to fail - add one to fix this
  if (contentDisposition) {
    const tokenRegex = /"(?:[^"\\]|\\.)*"|[;=]/g
    // Example match: parses "filename=\"report.pdf\"; size=123" into the quoted filename token and the ; or = separators
    let match: RegExpMatchArray | null = null
    let hasSeparator = false
    let hasParameters = false

    while ((match = tokenRegex.exec(contentDisposition)) !== null) {
      if (match[0] === ";") {
        hasSeparator = true
        break
      }
      if (match[0] === "=") {
        hasParameters = true
      }
    }

    if (!hasSeparator && hasParameters) {
      return {
        contentDisposition: `attachment; ${contentDisposition}`,
        contentType,
      }
    }
  }
  // for images which don't supply a content disposition, make one up, as binary
  // data for images in REST responses isn't really useful, we should always download them
  else if (opts?.downloadImages && contentType.startsWith("image/")) {
    const format = contentType.split("/")[1]
    return {
      contentDisposition: `attachment; filename="image.${format}"`,
      contentType,
    }
  }

  return { contentDisposition, contentType }
}
