import { getGlobalUserParams, getAllApps } from "../db/utils"
import { doWithDB, PouchLike } from "../db"
import { doWithGlobalDB } from "../tenancy"
import { StaticDatabases } from "../db/constants"
import { User } from "@budibase/types"

const TENANT_DOC = StaticDatabases.PLATFORM_INFO.docs.tenants
const PLATFORM_INFO_DB = StaticDatabases.PLATFORM_INFO.name

async function removeTenantFromInfoDB(tenantId: string) {
  try {
    await doWithDB(PLATFORM_INFO_DB, async (infoDb: PouchLike) => {
      let tenants = await infoDb.get(TENANT_DOC)
      tenants.tenantIds = tenants.tenantIds.filter(
        (id: string) => id !== tenantId
      )

      await infoDb.put(tenants)
    })
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} from info db`, err)
    throw err
  }
}

async function removeUsersFromInfoDB(tenantId: string) {
  return doWithGlobalDB(tenantId, async (db: PouchLike) => {
    try {
      const allUsers = await db.allDocs(
        getGlobalUserParams(null, {
          include_docs: true,
        })
      )
      await doWithDB(PLATFORM_INFO_DB, async (infoDb: PouchLike) => {
        const allEmails = allUsers.rows.map(row => row.doc.email)
        // get the id docs
        let keys = allUsers.rows.map(row => row.id)
        // and the email docs
        keys = keys.concat(allEmails)
        // retrieve the docs and delete them
        const userDocs = await infoDb.allDocs({
          keys,
          include_docs: true,
        })
        const toDelete = userDocs.rows.map(row => {
          return {
            ...row.doc,
            _deleted: true,
          }
        })
        await infoDb.bulkDocs(toDelete)
      })
    } catch (err) {
      console.error(`Error removing tenant ${tenantId} users from info db`, err)
      throw err
    }
  })
}

async function removeGlobalDB(tenantId: string) {
  return doWithGlobalDB(tenantId, async (db: PouchLike) => {
    try {
      await db.destroy()
    } catch (err) {
      console.error(`Error removing tenant ${tenantId} users from info db`, err)
      throw err
    }
  })
}

async function removeTenantApps(tenantId: string) {
  try {
    const apps = await getAllApps({ all: true })
    const destroyPromises = apps.map(app =>
      doWithDB(app.appId, (db: PouchLike) => db.destroy())
    )
    await Promise.allSettled(destroyPromises)
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} apps`, err)
    throw err
  }
}

export async function removeUserFromInfoDB(dbUser: User) {
  await doWithDB(PLATFORM_INFO_DB, async (infoDb: PouchLike) => {
    const keys = [dbUser._id!, dbUser.email]
    const userDocs = await infoDb.allDocs({
      keys,
      include_docs: true,
    })
    const toDelete = userDocs.rows.map(row => {
      return {
        ...row.doc,
        _deleted: true,
      }
    })
    await infoDb.bulkDocs(toDelete)
  })
}

// can't live in tenancy package due to circular dependency on db/utils
export async function deleteTenant(tenantId: string) {
  await removeTenantFromInfoDB(tenantId)
  await removeUsersFromInfoDB(tenantId)
  await removeGlobalDB(tenantId)
  await removeTenantApps(tenantId)
}
