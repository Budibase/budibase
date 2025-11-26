import { context } from "@budibase/backend-core"
import { Document, MetadataType } from "@budibase/types"
import { UNICODE_MAX, generateMetadataID } from "../../db/utils"
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

export const deleteAutomationMailboxState = async (automationId: string) => {
  const db = context.getWorkspaceDB()
  const startkey = generateMetadataID(
    MetadataType.AUTOMATION_EMAIL_STATE,
    `${automationId}:`
  )
  const endkey = `${startkey}${UNICODE_MAX}`

  const response = await db.allDocs<MailboxStateDoc>({
    startkey,
    endkey,
    include_docs: false,
  })

  if (!response.rows.length) {
    return
  }

  const docsToDelete = response.rows
    .map(row => {
      const rev = row.value?._rev
      if (!rev) {
        return undefined
      }
      return {
        _id: row.id,
        _rev: rev,
        _deleted: true,
      }
    })
    .filter(
      (doc): doc is { _id: string; _rev: string; _deleted: true } => !!doc
    )

  if (!docsToDelete.length) {
    return
  }

  await db.bulkDocs(docsToDelete)
}
