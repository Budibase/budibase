import { getGlobalUserParams, getAllApps } from "../db/utils"
import { doWithDB } from "../db"
import { doWithGlobalDB } from "../tenancy"
import { StaticDatabases } from "../db/constants"
import { App, Tenants, User } from "@budibase/types"

const TENANT_DOC = StaticDatabases.PLATFORM_INFO.docs.tenants
const PLATFORM_INFO_DB = StaticDatabases.PLATFORM_INFO.name

const removeTenantFromInfoDB = async (tenantId: string) => {
  try {
    await doWithDB(PLATFORM_INFO_DB, async (infoDb: any) => {
      const tenants = (await infoDb.get(TENANT_DOC)) as Tenants
      tenants.tenantIds = tenants.tenantIds.filter(id => id !== tenantId)

      await infoDb.put(tenants)
    })
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} from info db`, err)
    throw err
  }
}

export const removeUserFromInfoDB = async (dbUser: User) => {
  await doWithDB(PLATFORM_INFO_DB, async (infoDb: any) => {
    const keys = [dbUser._id, dbUser.email]
    const userDocs = await infoDb.allDocs({
      keys,
      include_docs: true,
    })
    const toDelete = userDocs.rows.map((row: any) => {
      return {
        ...row.doc,
        _deleted: true,
      }
    })
    await infoDb.bulkDocs(toDelete)
  })
}

const removeUsersFromInfoDB = async (tenantId: string) => {
  return doWithGlobalDB(tenantId, async (db: any) => {
    try {
      const allUsers = await db.allDocs(
        getGlobalUserParams(null, {
          include_docs: true,
        })
      )
      await doWithDB(PLATFORM_INFO_DB, async (infoDb: any) => {
        const allEmails = allUsers.rows.map((row: any) => row.doc.email)
        // get the id docs
        let keys = allUsers.rows.map((row: any) => row.id)
        // and the email docs
        keys = keys.concat(allEmails)
        // retrieve the docs and delete them
        const userDocs = await infoDb.allDocs({
          keys,
          include_docs: true,
        })
        const toDelete = userDocs.rows.map((row: any) => {
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

const removeGlobalDB = async (tenantId: string) => {
  return doWithGlobalDB(tenantId, async (db: any) => {
    try {
      await db.destroy()
    } catch (err) {
      console.error(`Error removing tenant ${tenantId} users from info db`, err)
      throw err
    }
  })
}

const removeTenantApps = async (tenantId: string) => {
  try {
    const apps = (await getAllApps({ all: true })) as App[]
    const destroyPromises = apps.map(app =>
      doWithDB(app.appId, (db: any) => db.destroy())
    )
    await Promise.allSettled(destroyPromises)
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} apps`, err)
    throw err
  }
}

// can't live in tenancy package due to circular dependency on db/utils
export const deleteTenant = async (tenantId: string) => {
  await removeTenantFromInfoDB(tenantId)
  await removeUsersFromInfoDB(tenantId)
  await removeGlobalDB(tenantId)
  await removeTenantApps(tenantId)
}
