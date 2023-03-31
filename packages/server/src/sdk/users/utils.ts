import { getGlobalUsers } from "../../utilities/global"
import { context, roles as rolesCore } from "@budibase/backend-core"
import {
  generateUserMetadataID,
  getUserMetadataParams,
  InternalTables,
} from "../../db/utils"
import { isEqual } from "lodash"
import { ContextUser, UserMetadata } from "@budibase/types"

export function combineMetadataAndUser(
  user: ContextUser,
  metadata: UserMetadata | UserMetadata[]
) {
  const metadataId = generateUserMetadataID(user._id!)
  const found = Array.isArray(metadata)
    ? metadata.find(doc => doc._id === metadataId)
    : metadata
  // skip users with no access
  if (
    user.roleId == null ||
    user.roleId === rolesCore.BUILTIN_ROLE_IDS.PUBLIC
  ) {
    // If it exists and it should not, we must remove it
    if (found?._id) {
      return { ...found, _deleted: true }
    }
    return null
  }
  delete user._rev
  const newDoc = {
    ...user,
    _id: metadataId,
    tableId: InternalTables.USER_METADATA,
  }
  // copy rev over for the purposes of equality check
  if (found) {
    newDoc._rev = found._rev
  }
  if (found == null || !isEqual(newDoc, found)) {
    return {
      ...found,
      ...newDoc,
    }
  }
  return null
}

export async function rawUserMetadata() {
  const db = context.getAppDB()
  return (
    await db.allDocs(
      getUserMetadataParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc)
}

export async function syncGlobalUsers() {
  // sync user metadata
  const db = context.getAppDB()
  const [users, metadata] = await Promise.all([
    getGlobalUsers(),
    rawUserMetadata(),
  ])
  const toWrite = []
  for (let user of users) {
    const combined = combineMetadataAndUser(user, metadata)
    if (combined) {
      toWrite.push(combined)
    }
  }
  await db.bulkDocs(toWrite)
}
