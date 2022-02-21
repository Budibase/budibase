const { getGlobalUserParams, getAllApps } = require("../db/utils")
const { getDB } = require("../db")
const { getGlobalDB } = require("../tenancy")
const { StaticDatabases } = require("../db/constants")

const TENANT_DOC = StaticDatabases.PLATFORM_INFO.docs.tenants
const PLATFORM_INFO_DB = StaticDatabases.PLATFORM_INFO.name

const removeTenantFromInfoDB = async tenantId => {
  try {
    const infoDb = getDB(PLATFORM_INFO_DB)
    let tenants = await infoDb.get(TENANT_DOC)
    tenants.tenantIds = tenants.tenantIds.filter(id => id !== tenantId)

    await infoDb.put(tenants)
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} from info db`, err)
    throw err
  }
}

exports.removeUserFromInfoDB = async dbUser => {
  const infoDb = getDB(PLATFORM_INFO_DB)
  const keys = [dbUser._id, dbUser.email]
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
}

const removeUsersFromInfoDB = async tenantId => {
  try {
    const globalDb = getGlobalDB(tenantId)
    const infoDb = getDB(PLATFORM_INFO_DB)
    const allUsers = await globalDb.allDocs(
      getGlobalUserParams(null, {
        include_docs: true,
      })
    )
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
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} users from info db`, err)
    throw err
  }
}

const removeGlobalDB = async tenantId => {
  try {
    const globalDb = getGlobalDB(tenantId)
    await globalDb.destroy()
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} users from info db`, err)
    throw err
  }
}

const removeTenantApps = async tenantId => {
  try {
    const apps = await getAllApps({ all: true })
    const destroyPromises = apps.map(app => getDB(app.appId).destroy())
    await Promise.allSettled(destroyPromises)
  } catch (err) {
    console.error(`Error removing tenant ${tenantId} apps`, err)
    throw err
  }
}

// can't live in tenancy package due to circular dependency on db/utils
exports.deleteTenant = async tenantId => {
  await removeTenantFromInfoDB(tenantId)
  await removeUsersFromInfoDB(tenantId)
  await removeGlobalDB(tenantId)
  await removeTenantApps(tenantId)
}
