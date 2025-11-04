import { FetchMessageObject } from "imapflow"
import { simpleParser } from "mailparser"
import type { EmailTriggerOutputs } from "@budibase/types"

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
    body: await getBodyText(message),
  }
}
