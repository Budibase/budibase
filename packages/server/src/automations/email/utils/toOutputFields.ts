import { FetchMessageObject } from "imapflow"
import { simpleParser } from "mailparser"
import type { EmailTriggerOutputs } from "@budibase/types"

export const EMAIL_BODY_CHARACTER_LIMIT = 50_000
export const EMAIL_BODY_TRUNCATION_SUFFIX =
  "\n\n[Email body truncated due to size limit]"

const applyBodyLimit = (body: string | undefined) => {
  if (!body) {
    return body
  }

  if (body.length <= EMAIL_BODY_CHARACTER_LIMIT) {
    return body
  }

  const sliceLength = Math.max(
    0,
    EMAIL_BODY_CHARACTER_LIMIT - EMAIL_BODY_TRUNCATION_SUFFIX.length
  )

  return `${body.slice(0, sliceLength)}${EMAIL_BODY_TRUNCATION_SUFFIX}`
}

const getBodyText = async (
  message: FetchMessageObject
): Promise<string | undefined> => {
  if (!message.source) {
    return undefined
  }

  try {
    const parsed = await simpleParser(message.source)
    return parsed.text
  } catch (err) {
    console.log("[email trigger] failed to parse message body", err)
    return undefined
  }
}

export const toOutputFields = async (
  message: FetchMessageObject
): Promise<EmailTriggerOutputs> => {
  return {
    from: message.envelope?.from?.map(f => f.address).join(", ") || "unknown",
    to: message.envelope?.to?.map(f => f.address).join(", ") || "unknown",
    subject: message.envelope?.subject,
    sentAt: message.envelope?.date?.toISOString(),
    body: applyBodyLimit(await getBodyText(message)),
  }
}
