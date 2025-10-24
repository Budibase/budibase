import { EmailTrigger } from "@budibase/types"
import { CheckMailOutput } from "./types/CheckMailOutput"
import { toOutputFields } from "./utils/toOutputFields"
import { getClient } from "./utils/getClient"
import { fetchMessage } from "./utils/fetchMessage"
import { getMessageId } from "./utils/getMessageId"
import { checkSender } from "./utils/checkSender"

const mailboxState = new Map<string, number>()
export const lockKey = "INBOX"

export const checkMail = async (
  trigger: EmailTrigger,
  automationId: string
): Promise<CheckMailOutput> => {
  const smtpClient = await getClient()
  try {
    const message = await fetchMessage(smtpClient, lockKey)
    if (!message) {
      return { proceed: false, reason: "no new mail" }
    }

    const messageUid = getMessageId(message)
    if (!messageUid) {
      return { proceed: false, reason: "no message id" }
    }

    const stateKey = automationId
    const lastSeenUid = mailboxState.get(stateKey)
    if (lastSeenUid == null) {
      mailboxState.set(stateKey, messageUid)
      return { proceed: false, reason: "init, now waiting" }
    }

    if (messageUid <= lastSeenUid) {
      return { proceed: false, reason: "no new mail" }
    }

    mailboxState.set(stateKey, messageUid)

    if (!checkSender(trigger.inputs.from, message)) {
      return { proceed: false, reason: "sender email does not match expected" }
    }

    return {
      proceed: true,
      fields: toOutputFields(message),
    }
  } catch (err) {
    console.log(err)
  } finally {
    await smtpClient.logout().catch(console.log)
  }
  return { proceed: false, reason: "unknown" }
}
