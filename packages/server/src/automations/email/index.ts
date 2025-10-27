import { EmailTrigger } from "@budibase/types"
import { CheckMailOutput } from "./types/CheckMailOutput"
import { toOutputFields } from "./utils/toOutputFields"
import { getClient } from "./utils/getClient"
import { fetchMessages } from "./utils/fetchMessages"
import { getMessageId } from "./utils/getMessageId"
import { checkSender } from "./utils/checkSender"
import { getLastSeenUid, setLastSeenUid } from "./state"

export const lockKey = "INBOX"

export const checkMail = async (
  trigger: EmailTrigger,
  automationId: string
): Promise<CheckMailOutput> => {
  const smtpClient = await getClient()
  const stateKey = automationId

  try {
    const lastSeenUid = await getLastSeenUid(stateKey)
    const messages = await fetchMessages(smtpClient, lockKey, lastSeenUid)
    console.log("[email trigger] fetched messages", messages)

    if (!messages.length) {
      return { proceed: false, reason: "no new mail" }
    }

    const messagesWithUid = messages
      .map(message => ({
        message,
        uid: getMessageId(message),
      }))
      .filter(entry => entry.uid > 0)

    if (!messagesWithUid.length) {
      return { proceed: false, reason: "no message id" }
    }

    messagesWithUid.sort((a, b) => a.uid - b.uid)
    const { message, uid: messageUid } =
      messagesWithUid[messagesWithUid.length - 1]

    if (lastSeenUid == null) {
      await setLastSeenUid(stateKey, messageUid)
      return { proceed: false, reason: "init, now waiting" }
    }

    if (messageUid <= lastSeenUid) {
      return { proceed: false, reason: "no new mail" }
    }

    await setLastSeenUid(stateKey, messageUid)

    if (!checkSender(trigger.inputs.from, message)) {
      return { proceed: false, reason: "sender email does not match expected" }
    }

    return {
      proceed: true,
      messages: messagesWithUid.map(({ message }) => toOutputFields(message)),
    }
  } catch (err) {
    console.log(err)
  } finally {
    await smtpClient.logout().catch(console.log)
  }
  return { proceed: false, reason: "unknown" }
}
