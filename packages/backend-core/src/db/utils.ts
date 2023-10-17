import env from "../environment"
import { DEFAULT_TENANT_ID, SEPARATOR, DocumentType } from "../constants"
import { getTenantId, getGlobalDBName } from "../context"
import { doWithDB, directCouchAllDbs } from "./db"
import { AppState, DeletedApp, getAppMetadata } from "../cache/appMetadata"
import { isDevApp, isDevAppID, getProdAppID } from "../docIds/conversions"
import { App, Database } from "@budibase/types"
import { getStartEndKeyURL } from "../docIds"
export * from "../docIds"

/**
 * if in production this will use the CouchDB _all_dbs call to retrieve a list of databases. If testing
 * when using Pouch it will use the pouchdb-all-dbs package.
 * opts.efficient can be provided to make sure this call is always quick in a multi-tenant environment,
 * but it may not be 100% accurate in full efficiency mode (some tenantless apps may be missed).
 */
export async function getAllDbs(opts = { efficient: false }) {
  const efficient = opts && opts.efficient

  let dbs: any[] = []
  async function addDbs(queryString?: string) {
    const json = await directCouchAllDbs(queryString)
    dbs = dbs.concat(json)
  }
  let tenantId = getTenantId()
  if (!env.MULTI_TENANCY || (!efficient && tenantId === DEFAULT_TENANT_ID)) {
    // just get all DBs when:
    // - single tenancy
    // - default tenant
    //    - apps dbs don't contain tenant id
    //    - non-default tenant dbs are filtered out application side in getAllApps
    await addDbs()
  } else {
    // get prod apps
    await addDbs(getStartEndKeyURL(DocumentType.APP, tenantId))
    // get dev apps
    await addDbs(getStartEndKeyURL(DocumentType.APP_DEV, tenantId))
    // add global db name
    dbs.push(getGlobalDBName(tenantId))
  }
  return dbs
}

/**
 * Lots of different points in the system need to find the full list of apps, this will
 * enumerate the entire CouchDB cluster and get the list of databases (every app).
 *
 * @return {Promise<object[]>} returns the app information document stored in each app database.
 */
export async function getAllApps({
  dev,
  all,
  idsOnly,
  efficient,
}: any = {}): Promise<App[] | string[]> {
  let tenantId = getTenantId()
  if (!env.MULTI_TENANCY && !tenantId) {
    tenantId = DEFAULT_TENANT_ID
  }
  let dbs = await getAllDbs({ efficient })
  const appDbNames = dbs.filter((dbName: any) => {
    if (env.isTest() && !dbName) {
      return false
    }

    const split = dbName.split(SEPARATOR)
    // it is an app, check the tenantId
    if (split[0] === DocumentType.APP) {
      // tenantId is always right before the UUID
      const possibleTenantId = split[split.length - 2]

      const noTenantId =
        split.length === 2 || possibleTenantId === DocumentType.DEV

      return (
        (tenantId === DEFAULT_TENANT_ID && noTenantId) ||
        possibleTenantId === tenantId
      )
    }
    return false
  })
  if (idsOnly) {
    const devAppIds = appDbNames.filter(appId => isDevAppID(appId))
    const prodAppIds = appDbNames.filter(appId => !isDevAppID(appId))
    switch (dev) {
      case true:
        return devAppIds
      case false:
        return prodAppIds
      default:
        return appDbNames
    }
  }
  const appPromises = appDbNames.map((app: any) =>
    // skip setup otherwise databases could be re-created
    getAppMetadata(app)
  )
  if (appPromises.length === 0) {
    return []
  } else {
    const response = await Promise.allSettled(appPromises)
    const apps = response
      .filter(
        (result: any) =>
          result.status === "fulfilled" &&
          result.value?.state !== AppState.INVALID
      )
      .map(({ value }: any) => value)
    if (!all) {
      return apps.filter((app: any) => {
        if (dev) {
          return isDevApp(app)
        }
        return !isDevApp(app)
      })
    } else {
      return apps.map((app: any) => ({
        ...app,
        status: isDevApp(app) ? "development" : "published",
      }))
    }
  }
}

export async function getAppsByIDs(appIds: string[]) {
  const settled = await Promise.allSettled(
    appIds.map(appId => getAppMetadata(appId))
  )
  // have to list the apps which exist, some may have been deleted
  return settled
    .filter(
      promise =>
        promise.status === "fulfilled" &&
        (promise.value as DeletedApp).state !== AppState.INVALID
    )
    .map(promise => (promise as PromiseFulfilledResult<App>).value)
}

/**
 * Utility function for getAllApps but filters to production apps only.
 */
export async function getProdAppIDs() {
  const apps = (await getAllApps({ idsOnly: true })) as string[]
  return apps.filter((id: any) => !isDevAppID(id))
}

/**
 * Utility function for the inverse of above.
 */
export async function getDevAppIDs() {
  const apps = (await getAllApps({ idsOnly: true })) as string[]
  return apps.filter((id: any) => isDevAppID(id))
}

export function isSameAppID(
  appId1: string | undefined,
  appId2: string | undefined
) {
  if (appId1 == undefined || appId2 == undefined) {
    return false
  }
  return getProdAppID(appId1) === getProdAppID(appId2)
}

export async function dbExists(dbName: any) {
  return doWithDB(
    dbName,
    async (db: Database) => {
      return await db.exists()
    },
    { skip_setup: true }
  )
}

export function pagination<T>(
  data: T[],
  pageSize: number,
  {
    paginate,
    property,
    getKey,
  }: {
    paginate: boolean
    property: string
    getKey?: (doc: T) => string | undefined
  } = {
    paginate: true,
    property: "_id",
  }
) {
  if (!paginate) {
    return { data, hasNextPage: false }
  }
  const hasNextPage = data.length > pageSize
  let nextPage = undefined
  if (!getKey) {
    getKey = (doc: any) => (property ? doc?.[property] : doc?._id)
  }
  if (hasNextPage) {
    nextPage = getKey(data[pageSize])
  }
  return {
    data: data.slice(0, pageSize),
    hasNextPage,
    nextPage,
  }
}
