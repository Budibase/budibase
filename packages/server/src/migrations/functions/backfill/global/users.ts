import {
  events,
  db as dbUtils,
  users as usersCore,
} from "@budibase/backend-core"
import { User, CloudAccount } from "@budibase/types"
import { DEFAULT_TIMESTAMP } from ".."

// manually define user doc params - normally server doesn't read users from the db
const getUserParams = (props: any) => {
  return dbUtils.getDocParams(dbUtils.DocumentType.USER, null, props)
}

export const getUsers = async (globalDb: any): Promise<User[]> => {
  const response = await globalDb.allDocs(
    getUserParams({
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (
  globalDb: any,
  account: CloudAccount | undefined
) => {
  const users = await getUsers(globalDb)

  for (const user of users) {
    let timestamp: string | number = DEFAULT_TIMESTAMP
    if (user.createdAt) {
      timestamp = user.createdAt
    }
    await events.identification.identifyUser(user, account, timestamp)
    await events.user.created(user, timestamp)

    if (usersCore.hasAdminPermissions(user)) {
      await events.user.permissionAdminAssigned(user, timestamp)
    }

    if (usersCore.hasBuilderPermissions(user)) {
      await events.user.permissionBuilderAssigned(user, timestamp)
    }

    if (user.roles) {
      for (const [appId, role] of Object.entries(user.roles)) {
        await events.role.assigned(user, role, timestamp)
      }
    }
  }

  return users.length
}
