import { Database, Workspace } from "@budibase/types"
import {
  DeletedWorkspace,
  getWorkspaceMetadata,
  WorkspaceState,
} from "../cache/workspaceMetadata"
import { DEFAULT_TENANT_ID, DocumentType, SEPARATOR } from "../constants"
import { getGlobalDBName, getTenantId } from "../context"
import { getStartEndKeyURL } from "../docIds"
import {
  getProdWorkspaceID,
  isDevWorkspace,
  isDevWorkspaceID,
} from "../docIds/conversions"
import env from "../environment"
import { directCouchAllDbs, doWithDB } from "./db"

export * from "../docIds"

/**
 * if in production this will use the CouchDB _all_dbs call to retrieve a list of databases. If testing
 * when using Pouch it will use the pouchdb-all-dbs package.
 * opts.efficient can be provided to make sure this call is always quick in a multi-tenant environment,
 * but it may not be 100% accurate in full efficiency mode (some tenantless workspaces may be missed).
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
    //    - workspaces dbs don't contain tenant id
    //    - non-default tenant dbs are filtered out workspace side in getAllWorkspaces
    await addDbs()
  } else {
    // get prod workspaces
    await addDbs(getStartEndKeyURL(DocumentType.WORKSPACE, tenantId))
    // get dev workspaces
    await addDbs(getStartEndKeyURL(DocumentType.WORKSPACE_DEV, tenantId))
    // add global db name
    dbs.push(getGlobalDBName(tenantId))
  }
  return dbs
}

/**
 * Lots of different points in the system need to find the full list of workspaces, this will
 * enumerate the entire CouchDB cluster and get the list of databases (every workspace).
 *
 * @return returns the workspace information document stored in each workspace database.
 */
export async function getAllWorkspaces(opts: {
  dev?: boolean
  all?: boolean
  idsOnly: true
  efficient?: boolean
}): Promise<string[]>
export async function getAllWorkspaces(opts?: {
  dev?: boolean
  all?: boolean
  idsOnly?: false
  efficient?: boolean
}): Promise<Workspace[]>
export async function getAllWorkspaces({
  dev,
  all,
  idsOnly,
  efficient,
}: {
  dev?: boolean
  all?: boolean
  idsOnly?: boolean
  efficient?: boolean
} = {}): Promise<Workspace[] | string[]> {
  let tenantId = getTenantId()
  if (!env.MULTI_TENANCY && !tenantId) {
    tenantId = DEFAULT_TENANT_ID
  }
  let dbs = await getAllDbs({ efficient: efficient || false })
  const workspaceDbNames = dbs.filter((dbName: any) => {
    if (env.isTest() && !dbName) {
      return false
    }

    const split = dbName.split(SEPARATOR)
    // it is an workspace, check the tenantId
    if (split[0] === DocumentType.WORKSPACE) {
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
    const devWorkspaceIds = workspaceDbNames.filter(workspaceId =>
      isDevWorkspaceID(workspaceId)
    )
    const prodWorkspaceIds = workspaceDbNames.filter(
      workspaceId => !isDevWorkspaceID(workspaceId)
    )
    switch (dev) {
      case true:
        return devWorkspaceIds
      case false:
        return prodWorkspaceIds
      default:
        return workspaceDbNames
    }
  }
  const workspacePromises = workspaceDbNames.map(workspace =>
    // skip setup otherwise databases could be re-created
    getWorkspaceMetadata(workspace)
  )
  if (workspacePromises.length === 0) {
    return []
  } else {
    const response = await Promise.allSettled(workspacePromises)
    const workspaces = response
      .filter(
        (result: any) =>
          result.status === "fulfilled" &&
          result.value?.state !== WorkspaceState.INVALID
      )
      .map(({ value }: any) => value)
    if (!all) {
      return workspaces.filter((workspace: any) => {
        if (dev) {
          return isDevWorkspace(workspace)
        }
        return !isDevWorkspace(workspace)
      })
    } else {
      return workspaces.map((workspace: any) => ({
        ...workspace,
        status: isDevWorkspace(workspace) ? "development" : "published",
      }))
    }
  }
}

export async function getWorkspacesByIDs(workspaceIds: string[]) {
  const settled = await Promise.allSettled(
    workspaceIds.map(workspaceId => getWorkspaceMetadata(workspaceId))
  )
  // have to list the workspaces which exist, some may have been deleted
  return settled
    .filter(
      promise =>
        promise.status === "fulfilled" &&
        (promise.value as DeletedWorkspace).state !== WorkspaceState.INVALID
    )
    .map(promise => (promise as PromiseFulfilledResult<Workspace>).value)
}

/**
 * Utility function for getAllWorkspaces but filters to production workspaces only.
 */
export async function getProdWorkpaceIDs() {
  const workspaceIds = await getAllWorkspaces({ idsOnly: true })
  return workspaceIds.filter(id => !isDevWorkspaceID(id))
}

/**
 * Utility function for the inverse of above.
 */
export async function getDevWorkspaceIDs() {
  const workspaceIds = await getAllWorkspaces({ idsOnly: true })
  return workspaceIds.filter(id => isDevWorkspaceID(id))
}

export function isSameWorkspaceID(
  workspaceId1: string | undefined,
  workspaceId2: string | undefined
) {
  if (workspaceId1 == undefined || workspaceId2 == undefined) {
    return false
  }
  return getProdWorkspaceID(workspaceId1) === getProdWorkspaceID(workspaceId2)
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
