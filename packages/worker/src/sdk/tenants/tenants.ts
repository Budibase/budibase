import { db as dbCore, platform, tenancy } from "@budibase/backend-core"
import { quotas } from "@budibase/pro"

export async function deleteTenant(tenantId: string) {
  await quotas.bustCache()
  await removeTenantUsers(tenantId)
  await removeTenantApps(tenantId)
  await removeGlobalDB(tenantId)
}

async function removeGlobalDB(tenantId: string) {
  try {
    const db = tenancy.getTenantDB(tenantId)
    await db.destroy()
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} users from info db`, err)
    throw err
  }
}

async function removeTenantApps(tenantId: string) {
  try {
    const workspaces = await dbCore.getAllWorkspaces({
      all: true,
    })
    const destroyPromises = workspaces.map(workspace => {
      const db = dbCore.getDB(workspace.appId)
      return db.destroy()
    })
    await Promise.allSettled(destroyPromises)
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} apps`, err)
    throw err
  }
}

function getTenantUsers(tenantId: string) {
  const db = tenancy.getTenantDB(tenantId)

  return db.allDocs(
    dbCore.getGlobalUserParams(null, {
      include_docs: true,
    })
  )
}

async function removeTenantUsers(tenantId: string) {
  try {
    const allUsers = await getTenantUsers(tenantId)
    const allEmails = allUsers.rows.map((row: any) => row.doc.email)
    const allSsoIds = allUsers.rows
      .map((row: any) => row.doc.ssoId)
      .filter(id => !!id)

    // get the id and email doc ids
    let keys = allUsers.rows.map((row: any) => row.id)
    keys = keys.concat(allEmails).concat(allSsoIds)

    const platformDb = platform.getPlatformDB()

    // retrieve the docs
    const userDocs = await platformDb.allDocs({
      keys,
      include_docs: true,
    })

    // delete the docs
    const toDelete = userDocs.rows.map((row: any) => {
      return {
        ...row.doc,
        _deleted: true,
      }
    })
    await platformDb.bulkDocs(toDelete)
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} users from info db`, err)
    throw err
  }
}

export async function tenantInfo(tenantId: string) {
  const globalDbName = tenancy.getGlobalDBName(tenantId)
  return {
    exists: await dbCore.dbExists(globalDbName),
  }
}
