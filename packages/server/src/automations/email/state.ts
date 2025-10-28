import { context } from "@budibase/backend-core"
import { Document, MetadataType } from "@budibase/types"
import { generateMetadataID } from "../../db/utils"
import { updateEntityMetadata } from "../../utilities"

interface MailboxStateDoc extends Document {
  lastSeenUid?: number
}

const getMetadataId = (automationId: string) =>
  generateMetadataID(MetadataType.AUTOMATION_EMAIL_STATE, automationId)

export const getLastSeenUid = async (
  automationId: string
): Promise<number | undefined> => {
  const db = context.getWorkspaceDB()
  const doc = await db.tryGet<MailboxStateDoc>(getMetadataId(automationId))

  return doc?.lastSeenUid
}

export const setLastSeenUid = async (
  automationId: string,
  lastSeenUid: number
) => {
  await updateEntityMetadata(
    MetadataType.AUTOMATION_EMAIL_STATE,
    automationId,
    (metadata: MailboxStateDoc) => ({
      ...metadata,
      lastSeenUid,
    })
  )
}
