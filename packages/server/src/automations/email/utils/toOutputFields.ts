import { FetchMessageObject, MessageAddressObject } from "imapflow"
import { simpleParser } from "mailparser"
import type { EmailTriggerOutputs } from "@budibase/types"
import { htmlToText } from "html-to-text"

export const EMAIL_BODY_CHARACTER_LIMIT = 50_000
export const EMAIL_BODY_TRUNCATION_SUFFIX =
  "\n\n[Email body truncated due to size limit]"

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
  const { body: bodyHtml, truncated: bodyHtmlTruncated } = applyBodyLimit(html)

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
