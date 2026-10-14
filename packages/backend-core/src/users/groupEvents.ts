import {
  DocumentType,
  prefixed,
  type User,
  type UserGroupEventOutbox,
} from "@budibase/types"
import { getGlobalDB } from "../context"
import { isDocumentConflictError } from "../db/errors"

export const archiveUserGroupEvents = async ({ user }: { user: User }) => {
  if (!user.pendingGroupEvents?.length) {
    return
  }

  const db = getGlobalDB()
  const id = `${prefixed(DocumentType.USER_GROUP_EVENT_OUTBOX)}${user._id}_${user._rev}`
  if (await db.tryGet<UserGroupEventOutbox>(id)) {
    return
  }

  const outbox: UserGroupEventOutbox = {
    _id: id,
    userId: user._id!,
    sourceUserRev: user._rev!,
    pendingGroupEvents: user.pendingGroupEvents,
  }
  try {
    await db.put(outbox)
  } catch (error) {
    if (!isDocumentConflictError(error)) {
      throw error
    }
  }
}
