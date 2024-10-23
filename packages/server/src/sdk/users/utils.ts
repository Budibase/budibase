import { getGlobalUsers } from "../../utilities/global"
import { context, roles as rolesCore } from "@budibase/backend-core"
import {
  getGlobalIDFromUserMetadataID,
  generateUserMetadataID,
  getUserMetadataParams,
  InternalTables,
} from "../../db/utils"
import isEqual from "lodash/isEqual"
import {
  ContextUser,
  UserMetadata,
  Database,
  ContextUserMetadata,
  UserBindings,
} from "@budibase/types"

export function combineMetadataAndUser(
  user: ContextUser,
  metadata: UserMetadata | UserMetadata[]
): ContextUserMetadata | null {
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
  // clear fields that shouldn't be in metadata
  delete newDoc.password
  delete newDoc.forceResetPassword
  delete newDoc.roles
  if (found == null || !isEqual(newDoc, found)) {
    return {
      ...found,
      ...newDoc,
    }
  }
  return null
}

export async function rawUserMetadata(db?: Database): Promise<UserMetadata[]> {
  if (!db) {
    db = context.getAppDB()
  }
  return (
    await db.allDocs<UserMetadata>(
      getUserMetadataParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(row => row.doc!)
}

export async function fetchMetadata(): Promise<ContextUserMetadata[]> {
  const global = await getGlobalUsers()
  const metadata = await rawUserMetadata()
  const users: ContextUserMetadata[] = []
  for (let user of global) {
    // find the metadata that matches up to the global ID
    const info = metadata.find(meta => meta._id!.includes(user._id!))
    // remove these props, not for the correct DB
    users.push({
      ...user,
      ...info,
      tableId: InternalTables.USER_METADATA,
      // make sure the ID is always a local ID, not a global one
      _id: generateUserMetadataID(user._id!),
    })
  }
  return users
}

export async function syncGlobalUsers() {
  // sync user metadata
  const dbs = [context.getDevAppDB(), context.getProdAppDB()]
  for (let db of dbs) {
    if (!(await db.exists())) {
      continue
    }
    const [users, metadata] = await Promise.all([
      getGlobalUsers(),
      rawUserMetadata(db),
    ])
    const toWrite = []
    for (let user of users) {
      const combined = combineMetadataAndUser(user, metadata)
      if (combined) {
        toWrite.push(combined)
      }
    }
    let foundEmails: string[] = []
    for (let data of metadata) {
      if (!data._id) {
        continue
      }
      const alreadyExisting =
        data.email && foundEmails.indexOf(data.email) !== -1
      const globalId = getGlobalIDFromUserMetadataID(data._id)
      if (!users.find(user => user._id === globalId) || alreadyExisting) {
        toWrite.push({ ...data, _deleted: true })
      }
      if (data.email) {
        foundEmails.push(data.email)
      }
    }
    await db.bulkDocs(toWrite)
  }
}

export function getUserContextBindings(user: ContextUser): UserBindings {
  if (!user) {
    return {}
  }
  // Current user context for bindable search
  const {
    _id,
    _rev,
    firstName,
    lastName,
    email,
    status,
    roleId,
    globalId,
    userId,
  } = user
  return {
    _id,
    _rev,
    firstName,
    lastName,
    email,
    status,
    roleId,
    globalId,
    userId,
  }
}
