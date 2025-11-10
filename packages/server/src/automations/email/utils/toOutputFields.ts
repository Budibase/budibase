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

const getBodyText = async (
  message: FetchMessageObject
): Promise<string | undefined> => {
  if (!message.source) {
    return undefined
  }

  try {
    const parsed = await simpleParser(message.source)
    const plainText = parsed.text?.trim()
    if (plainText) return plainText
    if (parsed.html) return htmlToText(parsed.html)
    return undefined
  } catch (err) {
    console.log("[email trigger] failed to parse message body", err)
    return undefined
  }
}

export const toOutputFields = async (
  message: FetchMessageObject
): Promise<EmailTriggerOutputs> => {
  const text = await getBodyText(message)
  const { body: bodyText, truncated: bodyTextTruncated } = applyBodyLimit(text)

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
  }
}
