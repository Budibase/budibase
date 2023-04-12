import {
  DocumentType,
  InternalTable,
  SEPARATOR,
  UNICODE_MAX,
  ViewName,
} from "../constants"
import { getProdAppID } from "./conversions"

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

export function getUsersByAppParams(appId: any, otherProps: any = {}) {
  const prodAppId = getProdAppID(appId)
  return {
    ...otherProps,
    startkey: prodAppId,
    endkey: `${prodAppId}${UNICODE_MAX}`,
  }
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
 * Gets parameters for retrieving automations, this is a utility function for the getDocParams function.
 */
export const getPluginParams = (pluginId?: string | null, otherProps = {}) => {
  return getDocParams(DocumentType.PLUGIN, pluginId, otherProps)
}
