import { FetchMessageObject, MessageAddressObject } from "imapflow"
import { simpleParser } from "mailparser"
import { sanitizeHtmlString } from "@budibase/shared-core"
import type { EmailTriggerOutputs } from "@budibase/types"
import { htmlToText } from "html-to-text"
export const EMAIL_BODY_CHARACTER_LIMIT = 50_000
export const EMAIL_HTML_CHARACTER_LIMIT = 500_000
export const EMAIL_HTML_SOURCE_CHARACTER_LIMIT = 1_000_000
export const EMAIL_BODY_TRUNCATION_SUFFIX =
  "\n\n[Email body truncated due to size limit]"
const HTML_BODY_TRUNCATION_SUFFIX = `<p>${EMAIL_BODY_TRUNCATION_SUFFIX.trim()}</p>`

interface BodyLimitResult {
  body: string | undefined
  truncated: boolean
}

interface EmailBodies {
  text?: string
  html?: string
}

const extractAddresses = (addresses: MessageAddressObject[] = []): string[] =>
  addresses.reduce<string[]>((acc, { address }) => {
    if (address) acc.push(address)
    return acc
  }, [])

const applyBodyLimit = (body: string | undefined): BodyLimitResult => {
  if (!body) {
    return { body, truncated: false }
  }

  if (body.length <= EMAIL_BODY_CHARACTER_LIMIT) {
    return { body, truncated: false }
  }

  const sliceLength = Math.max(
    0,
    EMAIL_BODY_CHARACTER_LIMIT - EMAIL_BODY_TRUNCATION_SUFFIX.length
  )

  return {
    body: `${body.slice(0, sliceLength)}${EMAIL_BODY_TRUNCATION_SUFFIX}`,
    truncated: true,
  }
}

const applyHtmlBodyLimit = (body: string | undefined): BodyLimitResult => {
  if (!body) {
    return { body: undefined, truncated: false }
  }

  const sourceTruncated = body.length > EMAIL_HTML_SOURCE_CHARACTER_LIMIT
  const sanitizedHtml = sanitizeHtmlString(
    body.slice(0, EMAIL_HTML_SOURCE_CHARACTER_LIMIT)
  )
  if (!sanitizedHtml) {
    return sourceTruncated
      ? { body: HTML_BODY_TRUNCATION_SUFFIX, truncated: true }
      : { body: undefined, truncated: false }
  }

  if (!sourceTruncated && sanitizedHtml.length <= EMAIL_HTML_CHARACTER_LIMIT) {
    return { body: sanitizedHtml, truncated: false }
  }

  let sliceLength =
    Math.min(sanitizedHtml.length, EMAIL_HTML_CHARACTER_LIMIT) -
    HTML_BODY_TRUNCATION_SUFFIX.length

  while (sliceLength > 0) {
    const result = sanitizeHtmlString(
      `${sanitizedHtml.slice(0, sliceLength)}${HTML_BODY_TRUNCATION_SUFFIX}`
    )

    if (result.length <= EMAIL_HTML_CHARACTER_LIMIT) {
      return { body: result, truncated: true }
    }

    sliceLength -= result.length - EMAIL_HTML_CHARACTER_LIMIT
  }

  return {
    body: HTML_BODY_TRUNCATION_SUFFIX,
    truncated: true,
  }
}

const getBodies = async (message: FetchMessageObject): Promise<EmailBodies> => {
  if (!message.source) {
    return {}
  }

  try {
    const parsed = await simpleParser(message.source)
    const plainText = parsed.text?.trim() || undefined
    const html = parsed.html || undefined
    const text = plainText ?? (html ? htmlToText(html) : undefined)

    return {
      text,
      html,
    }
  } catch (err) {
    console.log("[email trigger] failed to parse message body", err)
    return {}
  }
}

export const toOutputFields = async (
  message: FetchMessageObject
): Promise<EmailTriggerOutputs> => {
  const { text, html } = await getBodies(message)
  const { body: bodyText, truncated: bodyTextTruncated } = applyBodyLimit(text)
  const { body: bodyHtml, truncated: bodyHtmlTruncated } =
    applyHtmlBodyLimit(html)

  const toAddresses = extractAddresses(message.envelope?.to)
  const cc = extractAddresses(message.envelope?.cc)
  const fromAddresses = extractAddresses(message.envelope?.from)
  return {
    from: fromAddresses.join(", ") || "unknown",
    to: toAddresses.join(", ") || "unknown",
    cc,
    subject: message.envelope?.subject,
    sentAt: message.envelope?.date?.toISOString(),
    bodyText,
    bodyTextTruncated,
    bodyHtml,
    bodyHtmlTruncated,
  }
}
