import { EmailTriggerInputs } from "@budibase/types"
import { CheckMailOutput } from "./types/CheckMailOutput"
import { toOutputFields } from "./utils/toOutputFields"
import { getClient } from "./utils/getClient"
import { fetchMessages } from "./utils/fetchMessages"
import { getMessageId } from "./utils/getMessageId"
import { getLastSeenUid, setLastSeenUid } from "./state"

export const DEFAULT_MAILBOX = "INBOX"

export const checkMail = async (
  automationId: string,
  imapInputs: EmailTriggerInputs
): Promise<CheckMailOutput> => {
  if (!imapInputs) {
    throw new Error("Email trigger inputs are required")
  }

  let imapClient: Awaited<ReturnType<typeof getClient>> | null = null
  const mailbox = imapInputs.mailbox || DEFAULT_MAILBOX
  const stateKey = automationId

  try {
    imapClient = await getClient(imapInputs)
    const lastSeenUid = await getLastSeenUid(stateKey, mailbox)
    const messages = await fetchMessages(imapClient, mailbox, lastSeenUid)
    console.info(
      `[email trigger] fetched ${messages.length} messages from mailbox ${mailbox}`
    )

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
      await setLastSeenUid(stateKey, mailbox, latestUid)
      return { proceed: false, reason: "init, now waiting" }
    }

    const unseenMessages = messagesWithUid.filter(
      ({ uid }) => uid > lastSeenUid
    )

    if (!unseenMessages.length) {
      return { proceed: false, reason: "no new mail" }
    }

    await setLastSeenUid(stateKey, mailbox, latestUid)

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
    if (imapClient) {
      await imapClient.logout().catch(console.log)
    }
  }
  return { proceed: false, reason: "unknown" }
}
