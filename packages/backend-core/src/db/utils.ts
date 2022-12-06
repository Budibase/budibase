import { newid } from "../newid"
import env from "../environment"
import {
  DEFAULT_TENANT_ID,
  SEPARATOR,
  DocumentType,
  UNICODE_MAX,
  ViewName,
  InternalTable,
  APP_PREFIX,
} from "../constants"
import { getTenantId, getGlobalDB, getGlobalDBName } from "../context"
import { doWithDB, allDbs, directCouchAllDbs } from "./db"
import { getAppMetadata } from "../cache/appMetadata"
import { isDevApp, isDevAppID, getProdAppID } from "./conversions"
import * as events from "../events"
import { App, Database, ConfigType } from "@budibase/types"

/**
 * Generates a new app ID.
 * @returns {string} The new app ID which the app doc can be stored under.
 */
export const generateAppID = (tenantId?: string | null) => {
  let id = APP_PREFIX
  if (tenantId) {
    id += `${tenantId}${SEPARATOR}`
  }
  return `${id}${newid()}`
}

/**
 * If creating DB allDocs/query params with only a single top level ID this can be used, this
 * is usually the case as most of our docs are top level e.g. tables, automations, users and so on.
 * More complex cases such as link docs and rows which have multiple levels of IDs that their
 * ID consists of need their own functions to build the allDocs parameters.
 * @param {string} docType The type of document which input params are being built for, e.g. user,
 * link, app, table and so on.
 * @param {string|null} docId The ID of the document minus its type - this is only needed if looking
 * for a singular document.
 * @param {object} otherProps Add any other properties onto the request, e.g. include_docs.
 * @returns {object} Parameters which can then be used with an allDocs request.
 */
export function getDocParams(
  docType: string,
  docId?: string | null,
  otherProps: any = {}
) {
  if (docId == null) {
    docId = ""
  }
  return {
    ...otherProps,
    startkey: `${docType}${SEPARATOR}${docId}`,
    endkey: `${docType}${SEPARATOR}${docId}${UNICODE_MAX}`,
  }
}

/**
 * Gets the DB allDocs/query params for retrieving a row.
 * @param {string|null} tableId The table in which the rows have been stored.
 * @param {string|null} rowId The ID of the row which is being specifically queried for. This can be
 * left null to get all the rows in the table.
 * @param {object} otherProps Any other properties to add to the request.
 * @returns {object} Parameters which can then be used with an allDocs request.
 */
export function getRowParams(
  tableId?: string | null,
  rowId?: string | null,
  otherProps = {}
) {
  if (tableId == null) {
    return getDocParams(DocumentType.ROW, null, otherProps)
  }

  const endOfKey = rowId == null ? `${tableId}${SEPARATOR}` : rowId

  return getDocParams(DocumentType.ROW, endOfKey, otherProps)
}

/**
 * Retrieve the correct index for a view based on default design DB.
 */
export function getQueryIndex(viewName: ViewName) {
  return `database/${viewName}`
}

/**
 * Gets a new row ID for the specified table.
 * @param {string} tableId The table which the row is being created for.
 * @param {string|null} id If an ID is to be used then the UUID can be substituted for this.
 * @returns {string} The new ID which a row doc can be stored under.
 */
export function generateRowID(tableId: string, id?: string) {
  id = id || newid()
  return `${DocumentType.ROW}${SEPARATOR}${tableId}${SEPARATOR}${id}`
}

/**
 * Check if a given ID is that of a table.
 * @returns {boolean}
 */
export const isTableId = (id: string) => {
  // this includes datasource plus tables
  return (
    id &&
    (id.startsWith(`${DocumentType.TABLE}${SEPARATOR}`) ||
      id.startsWith(`${DocumentType.DATASOURCE_PLUS}${SEPARATOR}`))
  )
}

/**
 * Check if a given ID is that of a datasource or datasource plus.
 * @returns {boolean}
 */
export const isDatasourceId = (id: string) => {
  // this covers both datasources and datasource plus
  return id && id.startsWith(`${DocumentType.DATASOURCE}${SEPARATOR}`)
}

/**
 * Generates a new workspace ID.
 * @returns {string} The new workspace ID which the workspace doc can be stored under.
 */
export function generateWorkspaceID() {
  return `${DocumentType.WORKSPACE}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving workspaces.
 */
export function getWorkspaceParams(id = "", otherProps = {}) {
  return {
    ...otherProps,
    startkey: `${DocumentType.WORKSPACE}${SEPARATOR}${id}`,
    endkey: `${DocumentType.WORKSPACE}${SEPARATOR}${id}${UNICODE_MAX}`,
  }
}

/**
 * Generates a new global user ID.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
export function generateGlobalUserID(id?: any) {
  return `${DocumentType.USER}${SEPARATOR}${id || newid()}`
}

/**
 * Gets parameters for retrieving users.
 */
export function getGlobalUserParams(globalId: any, otherProps: any = {}) {
  if (!globalId) {
    globalId = ""
  }
  const startkey = otherProps?.startkey
  return {
    ...otherProps,
    // need to include this incase pagination
    startkey: startkey
      ? startkey
      : `${DocumentType.USER}${SEPARATOR}${globalId}`,
    endkey: `${DocumentType.USER}${SEPARATOR}${globalId}${UNICODE_MAX}`,
  }
}

/**
 * Gets parameters for retrieving users, this is a utility function for the getDocParams function.
 */
export function getUserMetadataParams(userId?: string | null, otherProps = {}) {
  return getRowParams(InternalTable.USER_METADATA, userId, otherProps)
}

/**
 * Generates a new user ID based on the passed in global ID.
 * @param {string} globalId The ID of the global user.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
export function generateUserMetadataID(globalId: string) {
  return generateRowID(InternalTable.USER_METADATA, globalId)
}

/**
 * Breaks up the ID to get the global ID.
 */
export function getGlobalIDFromUserMetadataID(id: string) {
  const prefix = `${DocumentType.ROW}${SEPARATOR}${InternalTable.USER_METADATA}${SEPARATOR}`
  if (!id || !id.includes(prefix)) {
    return id
  }
  return id.split(prefix)[1]
}

export function getUsersByAppParams(appId: any, otherProps: any = {}) {
  const prodAppId = getProdAppID(appId)
  return {
    ...otherProps,
    startkey: prodAppId,
    endkey: `${prodAppId}${UNICODE_MAX}`,
  }
}

/**
 * Generates a template ID.
 * @param ownerId The owner/user of the template, this could be global or a workspace level.
 */
export function generateTemplateID(ownerId: any) {
  return `${DocumentType.TEMPLATE}${SEPARATOR}${ownerId}${SEPARATOR}${newid()}`
}

export function generateAppUserID(prodAppId: string, userId: string) {
  return `${prodAppId}${SEPARATOR}${userId}`
}

/**
 * Gets parameters for retrieving templates. Owner ID must be specified, either global or a workspace level.
 */
export function getTemplateParams(
  ownerId: any,
  templateId: any,
  otherProps = {}
) {
  if (!templateId) {
    templateId = ""
  }
  let final
  if (templateId) {
    final = templateId
  } else {
    final = `${DocumentType.TEMPLATE}${SEPARATOR}${ownerId}${SEPARATOR}`
  }
  return {
    ...otherProps,
    startkey: final,
    endkey: `${final}${UNICODE_MAX}`,
  }
}

/**
 * Generates a new role ID.
 * @returns {string} The new role ID which the role doc can be stored under.
 */
export function generateRoleID(id?: any) {
  return `${DocumentType.ROLE}${SEPARATOR}${id || newid()}`
}

/**
 * Gets parameters for retrieving a role, this is a utility function for the getDocParams function.
 */
export function getRoleParams(roleId?: string | null, otherProps = {}) {
  return getDocParams(DocumentType.ROLE, roleId, otherProps)
}

export function getStartEndKeyURL(baseKey: any, tenantId?: string) {
  const tenancy = tenantId ? `${SEPARATOR}${tenantId}` : ""
  return `startkey="${baseKey}${tenancy}"&endkey="${baseKey}${tenancy}${UNICODE_MAX}"`
}

/**
 * if in production this will use the CouchDB _all_dbs call to retrieve a list of databases. If testing
 * when using Pouch it will use the pouchdb-all-dbs package.
 * opts.efficient can be provided to make sure this call is always quick in a multi-tenant environment,
 * but it may not be 100% accurate in full efficiency mode (some tenantless apps may be missed).
 */
export async function getAllDbs(opts = { efficient: false }) {
  const efficient = opts && opts.efficient
  // specifically for testing we use the pouch package for this
  if (env.isTest()) {
    return allDbs()
  }
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
        (result: any) => result.status === "fulfilled" && result.value != null
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

export async function dbExists(dbName: any) {
  return doWithDB(
    dbName,
    async (db: Database) => {
      return await db.exists()
    },
    { skip_setup: true }
  )
}

/**
 * Generates a new configuration ID.
 * @returns {string} The new configuration ID which the config doc can be stored under.
 */
export const generateConfigID = ({ type, workspace, user }: any) => {
  const scope = [type, workspace, user].filter(Boolean).join(SEPARATOR)

  return `${DocumentType.CONFIG}${SEPARATOR}${scope}`
}

/**
 * Gets parameters for retrieving configurations.
 */
export const getConfigParams = (
  { type, workspace, user }: any,
  otherProps = {}
) => {
  const scope = [type, workspace, user].filter(Boolean).join(SEPARATOR)

  return {
    ...otherProps,
    startkey: `${DocumentType.CONFIG}${SEPARATOR}${scope}`,
    endkey: `${DocumentType.CONFIG}${SEPARATOR}${scope}${UNICODE_MAX}`,
  }
}

/**
 * Generates a new dev info document ID - this is scoped to a user.
 * @returns {string} The new dev info ID which info for dev (like api key) can be stored under.
 */
export const generateDevInfoID = (userId: any) => {
  return `${DocumentType.DEV_INFO}${SEPARATOR}${userId}`
}

/**
 * Generates a new plugin ID - to be used in the global DB.
 * @returns {string} The new plugin ID which a plugin metadata document can be stored under.
 */
export const generatePluginID = (name: string) => {
  return `${DocumentType.PLUGIN}${SEPARATOR}${name}`
}

/**
 * Gets parameters for retrieving automations, this is a utility function for the getDocParams function.
 */
export const getPluginParams = (pluginId?: string | null, otherProps = {}) => {
  return getDocParams(DocumentType.PLUGIN, pluginId, otherProps)
}

/**
 * Returns the most granular configuration document from the DB based on the type, workspace and userID passed.
 * @param {Object} db - db instance to query
 * @param {Object} scopes - the type, workspace and userID scopes of the configuration.
 * @returns The most granular configuration document based on the scope.
 */
export const getScopedFullConfig = async function (
  db: any,
  { type, user, workspace }: any
) {
  const response = await db.allDocs(
    getConfigParams(
      { type, user, workspace },
      {
        include_docs: true,
      }
    )
  )

  function determineScore(row: any) {
    const config = row.doc

    // Config is specific to a user and a workspace
    if (config._id.includes(generateConfigID({ type, user, workspace }))) {
      return 4
    } else if (config._id.includes(generateConfigID({ type, user }))) {
      // Config is specific to a user only
      return 3
    } else if (config._id.includes(generateConfigID({ type, workspace }))) {
      // Config is specific to a workspace only
      return 2
    } else if (config._id.includes(generateConfigID({ type }))) {
      // Config is specific to a type only
      return 1
    }
    return 0
  }

  // Find the config with the most granular scope based on context
  let scopedConfig = response.rows.sort(
    (a: any, b: any) => determineScore(a) - determineScore(b)
  )[0]

  // custom logic for settings doc
  if (type === ConfigType.SETTINGS) {
    if (scopedConfig && scopedConfig.doc) {
      // overrides affected by environment variables
      scopedConfig.doc.config.platformUrl = await getPlatformUrl({
        tenantAware: true,
      })
      scopedConfig.doc.config.analyticsEnabled =
        await events.analytics.enabled()
    } else {
      // defaults
      scopedConfig = {
        doc: {
          _id: generateConfigID({ type, user, workspace }),
          config: {
            platformUrl: await getPlatformUrl({ tenantAware: true }),
            analyticsEnabled: await events.analytics.enabled(),
          },
        },
      }
    }
  }

  return scopedConfig && scopedConfig.doc
}

export const getPlatformUrl = async (opts = { tenantAware: true }) => {
  let platformUrl = env.PLATFORM_URL || "http://localhost:10000"

  if (!env.SELF_HOSTED && env.MULTI_TENANCY && opts.tenantAware) {
    // cloud and multi tenant - add the tenant to the default platform url
    const tenantId = getTenantId()
    if (!platformUrl.includes("localhost:")) {
      platformUrl = platformUrl.replace("://", `://${tenantId}.`)
    }
  } else if (env.SELF_HOSTED) {
    const db = getGlobalDB()
    // get the doc directly instead of with getScopedConfig to prevent loop
    let settings
    try {
      settings = await db.get(generateConfigID({ type: ConfigType.SETTINGS }))
    } catch (e: any) {
      if (e.status !== 404) {
        throw e
      }
    }

    // self hosted - check for platform url override
    if (settings && settings.config && settings.config.platformUrl) {
      platformUrl = settings.config.platformUrl
    }
  }

  return platformUrl
}

export function pagination(
  data: any[],
  pageSize: number,
  {
    paginate,
    property,
    getKey,
  }: {
    paginate: boolean
    property: string
    getKey?: (doc: any) => string | undefined
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

export async function getScopedConfig(db: any, params: any) {
  const configDoc = await getScopedFullConfig(db, params)
  return configDoc && configDoc.config ? configDoc.config : configDoc
}
