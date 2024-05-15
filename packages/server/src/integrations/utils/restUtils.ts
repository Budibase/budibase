import type { Headers } from "node-fetch"

export function getAttachmentHeaders(headers: Headers) {
  const contentType = headers.get("content-type") || ""
  let contentDisposition = headers.get("content-disposition") || ""

  // the API does not follow the requirements of https://www.ietf.org/rfc/rfc2183.txt
  // all content-disposition headers should be format disposition-type; parameters
  // but some APIs do not provide a type, causing the parse below to fail - add one to fix this
  if (contentDisposition) {
    const quotesRegex = /"(?:[^"\\]|\\.)*"|;/g
    let match: RegExpMatchArray | null = null,
      found = false
    while ((match = quotesRegex.exec(contentDisposition)) !== null) {
      if (match[0] === ";") {
        found = true
      }
    }
    if (!found) {
      return {
        contentDisposition: `attachment; ${contentDisposition}`,
        contentType,
      }
    }
  }

  return { contentDisposition, contentType }
}
