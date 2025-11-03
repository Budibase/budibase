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
  const imapClient = await getClient()
  const stateKey = automationId

  try {
    const lastSeenUid = await getLastSeenUid(stateKey)
    const messages = await fetchMessages(imapClient, lockKey, lastSeenUid)
    console.info(`[email trigger] fetched ${messages.length} messages`)

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
    const latestUid = messagesWithUid[messagesWithUid.length - 1]?.uid

    if (!latestUid) {
      return { proceed: false, reason: "no message id" }
    }

    if (!lastSeenUid) {
      await setLastSeenUid(stateKey, latestUid)
      return { proceed: false, reason: "init, now waiting" }
    }

    const unseenMessages = messagesWithUid.filter(
      ({ uid }) => uid > lastSeenUid
    )

    if (!unseenMessages.length) {
      return { proceed: false, reason: "no new mail" }
    }

    const filteredMessages = unseenMessages.filter(({ message }) =>
      checkSender(trigger.inputs.from, message)
    )

    await setLastSeenUid(stateKey, latestUid)

    if (!filteredMessages.length) {
      return { proceed: false, reason: "sender email does not match expected" }
    }

    return {
      proceed: true,
      messages: filteredMessages.map(({ message }) => toOutputFields(message)),
    }
  } catch (err) {
    console.log(err)
  } finally {
    await imapClient.logout().catch(console.log)
  }
  return { proceed: false, reason: "unknown" }
}
