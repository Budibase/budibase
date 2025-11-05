import { CheckMailOutput } from "./types/CheckMailOutput"
import { toOutputFields } from "./utils/toOutputFields"
import { getClient } from "./utils/getClient"
import { fetchMessages } from "./utils/fetchMessages"
import { getMessageId } from "./utils/getMessageId"
import { getLastSeenUid, setLastSeenUid } from "./state"

export const lockKey = "INBOX"

export const checkMail = async (
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

    await setLastSeenUid(stateKey, latestUid)

    const outputMessages = await Promise.all(
      unseenMessages.map(({ message }) => toOutputFields(message))
    )

    return {
      proceed: true,
      messages: outputMessages,
    }
  } catch (err) {
    console.log(err)
  } finally {
    await imapClient.logout().catch(console.log)
  }
  return { proceed: false, reason: "unknown" }
}
