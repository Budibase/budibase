import lodashMerge from "lodash/fp/merge"
import {
  HTTPError,
  db as dbCore,
  tenancy,
  users as usersCore,
  utils,
} from "@budibase/backend-core"
import { db as userDb } from "../users"
import { SCIMDisableAction, SearchIndex, User } from "@budibase/types"

export interface GetUsersFilters {
  equal?: Record<string, any>
}

interface GetParams {
  pageSize: number
  skip?: number
  filters?: GetUsersFilters
}

export async function get(
  params: GetParams
): Promise<{ users: User[]; total: number }> {
  const db = tenancy.getGlobalDB()

  const builder = new dbCore.QueryBuilder<User>(db.name, SearchIndex.USER)
  builder.setIndexBuilder(dbCore.searchIndexes.createUserIndex)
  builder.setLimit(params.pageSize)
  builder.addEqual("scimInfo.isSync", true)

  for (const [key, value] of Object.entries(params.filters?.equal ?? {})) {
    builder.addEqual(key, value)
  }

  builder.setSort("_id")
  builder.setSkip(params.skip)

  const docs = await builder.run()

  return {
    users: docs.rows,
    total: docs.totalRows,
  }
}

export async function find(id: string) {
  return await usersCore.getById(id)
}

export async function create(user: User) {
  const existingUser = await userDb.getUserByEmail(user.email)
  if (existingUser) {
    if (existingUser.scimInfo?.isSync) {
      throw new HTTPError(`User is already synched`, 409)
    }
    user = {
      ...existingUser,
      scimInfo: lodashMerge(existingUser.scimInfo, user.scimInfo),
      password: undefined,
      firstName: user.firstName,
      lastName: user.lastName,
      updatedAt: user.updatedAt,
    }
  }

  return await userDb.save(user, { requirePassword: false })
}

export async function update(
  user: User,
  opts?: { allowChangingEmail?: boolean }
) {
  return await userDb.save(user, {
    requirePassword: false,
    allowChangingEmail: opts?.allowChangingEmail,
  })
}

export async function remove(id: string) {
  return await userDb.destroy(id)
}

async function getAllSCIMUsers(): Promise<User[]> {
  const allUsers = await usersCore.getAllUsers()
  return allUsers.filter(u => u.scimInfo?.isSync)
}

export async function handleDisable(action: SCIMDisableAction): Promise<void> {
  const scimUsers = await getAllSCIMUsers()
  if (!scimUsers.length) {
    return
  }

  switch (action) {
    case "remove":
      await usersCore.UserDB.bulkDelete(
        scimUsers.map(u => ({ userId: u._id!, email: u.email }))
      )
      break
    case "convert": {
      const regularUsers = await Promise.all(
        scimUsers.map(async u => {
          const user = { ...u }
          delete user.scimInfo
          delete user.ssoId
          user.password = await utils.hash(crypto.randomUUID())
          return user
        })
      )
      await usersCore.bulkUpdateGlobalUsers(regularUsers)
      break
    }
  }
}
