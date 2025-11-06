import { context } from "@budibase/backend-core"
import { Document, MetadataType } from "@budibase/types"
import { generateMetadataID } from "../../db/utils"
import { updateEntityMetadata } from "../../utilities"

interface MailboxStateDoc extends Document {
  lastSeenUid?: number
}

// we have to do this because mailbox names can include characters that
// couchdb wont allow in a key
const encodeMailbox = (mailbox: string) =>
  Buffer.from(mailbox, "utf8").toString("hex")

const getMailboxEntityId = (automationId: string, mailbox: string) =>
  `${automationId}:${encodeMailbox(mailbox)}`

const getMailboxMetadataId = (automationId: string, mailbox: string) =>
  generateMetadataID(
    MetadataType.AUTOMATION_EMAIL_STATE,
    getMailboxEntityId(automationId, mailbox)
  )

export const getLastSeenUid = async (
  automationId: string,
  mailbox: string
): Promise<number | undefined> => {
  const db = context.getWorkspaceDB()
  const mailboxDoc = await db.tryGet<MailboxStateDoc>(
    getMailboxMetadataId(automationId, mailbox)
  )

  return mailboxDoc?.lastSeenUid
}

export const setLastSeenUid = async (
  automationId: string,
  mailbox: string,
  lastSeenUid: number
) => {
  await updateEntityMetadata(
    MetadataType.AUTOMATION_EMAIL_STATE,
    getMailboxEntityId(automationId, mailbox),
    (metadata: MailboxStateDoc) => ({
      ...metadata,
      lastSeenUid,
    })
  )
}
