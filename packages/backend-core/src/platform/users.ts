import { getPlatformDB } from "./platformDb"
import { DEFAULT_TENANT_ID } from "../constants"
import env from "../environment"
import {
  PlatformUser,
  PlatformUserByEmail,
  PlatformUserById,
  User,
} from "@budibase/types"

// READ

export async function lookupTenantId(userId: string) {
  if (!env.MULTI_TENANCY) {
    return DEFAULT_TENANT_ID
  }

  const user = await getUserDoc(userId)
  return user.tenantId
}

async function getUserDoc(emailOrId: string): Promise<PlatformUser> {
  const db = getPlatformDB()
  return db.get(emailOrId)
}

// CREATE

function newUserIdDoc(id: string, tenantId: string): PlatformUserById {
  return {
    _id: id,
    tenantId,
  }
}

function newUserEmailDoc(
  userId: string,
  email: string,
  tenantId: string
): PlatformUserByEmail {
  return {
    _id: email,
    userId,
    tenantId,
  }
}

/**
 * Add a new user id or email doc if it doesn't exist.
 */
async function addUserDoc(emailOrId: string, newDocFn: () => PlatformUser) {
  const db = getPlatformDB()
  let user: PlatformUser

  try {
    await db.get(emailOrId)
  } catch (e: any) {
    if (e.status === 404) {
      user = newDocFn()
      await db.put(user)
    } else {
      throw e
    }
  }
}

export async function addUser(tenantId: string, userId: string, email: string) {
  await Promise.all([
    addUserDoc(userId, () => newUserIdDoc(userId, tenantId)),
    addUserDoc(email, () => newUserEmailDoc(userId, email, tenantId)),
  ])
}

// DELETE

export async function removeUser(user: User) {
  const db = getPlatformDB()
  const keys = [user._id!, user.email]
  const userDocs = await db.allDocs({
    keys,
    include_docs: true,
  })
  const toDelete = userDocs.rows.map((row: any) => {
    return {
      ...row.doc,
      _deleted: true,
    }
  })
  await db.bulkDocs(toDelete)
}
