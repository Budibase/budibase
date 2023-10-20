import newid from "./newid"
import { db as dbCore } from "@budibase/backend-core"
import {
  DocumentType,
  FieldSchema,
  RelationshipFieldMetadata,
  VirtualDocumentType,
} from "@budibase/types"
import { FieldTypes } from "../constants"
export { DocumentType, VirtualDocumentType } from "@budibase/types"

type Optional = string | null

export const enum AppStatus {
  DEV = "development",
  ALL = "all",
  DEPLOYED = "published",
}

export const BudibaseInternalDB = {
  _id: "bb_internal",
  type: dbCore.BUDIBASE_DATASOURCE_TYPE,
  name: "Budibase DB",
  source: "BUDIBASE",
  config: {},
}

export const SEPARATOR = dbCore.SEPARATOR
export const StaticDatabases = dbCore.StaticDatabases
export const APP_PREFIX = dbCore.APP_PREFIX
export const APP_DEV_PREFIX = dbCore.APP_DEV_PREFIX
export const isDevAppID = dbCore.isDevAppID
export const isProdAppID = dbCore.isProdAppID
export const USER_METDATA_PREFIX = `${DocumentType.ROW}${SEPARATOR}${dbCore.InternalTable.USER_METADATA}${SEPARATOR}`
export const LINK_USER_METADATA_PREFIX = `${DocumentType.LINK}${SEPARATOR}${dbCore.InternalTable.USER_METADATA}${SEPARATOR}`
export const TABLE_ROW_PREFIX = `${DocumentType.ROW}${SEPARATOR}${DocumentType.TABLE}`
export const AUTOMATION_LOG_PREFIX = `${DocumentType.AUTOMATION_LOG}${SEPARATOR}`
export const ViewName = dbCore.ViewName
export const InternalTables = dbCore.InternalTable
export const UNICODE_MAX = dbCore.UNICODE_MAX
export const generateAppID = dbCore.generateAppID
export const generateDevAppID = dbCore.getDevelopmentAppID
export const generateRoleID = dbCore.generateRoleID
export const getRoleParams = dbCore.getRoleParams
export const getQueryIndex = dbCore.getQueryIndex
export const getDocParams = dbCore.getDocParams
export const getRowParams = dbCore.getRowParams
export const generateRowID = dbCore.generateRowID
export const getUserMetadataParams = dbCore.getUserMetadataParams
export const generateUserMetadataID = dbCore.generateUserMetadataID
export const getGlobalIDFromUserMetadataID =
  dbCore.getGlobalIDFromUserMetadataID

/**
 * Gets parameters for retrieving tables, this is a utility function for the getDocParams function.
 */
export function getTableParams(tableId?: Optional, otherProps = {}) {
  return getDocParams(DocumentType.TABLE, tableId, otherProps)
}

/**
 * Generates a new table ID.
 * @returns {string} The new table ID which the table doc can be stored under.
 */
export function generateTableID() {
  return `${DocumentType.TABLE}${SEPARATOR}${newid()}`
}

/**
 * Given a row ID this will find the table ID within it (only works for internal tables).
 * @param {string} rowId The ID of the row.
 * @returns {string} The table ID.
 */
export function getTableIDFromRowID(rowId: string) {
  const components = rowId
    .split(DocumentType.TABLE + SEPARATOR)[1]
    .split(SEPARATOR)
  return `${DocumentType.TABLE}${SEPARATOR}${components[0]}`
}

/**
 * Gets parameters for retrieving automations, this is a utility function for the getDocParams function.
 */
export function getAutomationParams(
  automationId?: Optional,
  otherProps: any = {}
) {
  return getDocParams(DocumentType.AUTOMATION, automationId, otherProps)
}

/**
 * Generates a new automation ID.
 * @returns {string} The new automation ID which the automation doc can be stored under.
 */
export function generateAutomationID() {
  return `${DocumentType.AUTOMATION}${SEPARATOR}${newid()}`
}

/**
 * Generates a new link doc ID. This is currently not usable with the alldocs call,
 * instead a view is built to make walking to tree easier.
 * @param {string} tableId1 The ID of the linker table.
 * @param {string} tableId2 The ID of the linked table.
 * @param {string} rowId1 The ID of the linker row.
 * @param {string} rowId2 The ID of the linked row.
 * @param {string} fieldName1 The name of the field in the linker row.
 * @param {string} fieldName2 the name of the field in the linked row.
 * @returns {string} The new link doc ID which the automation doc can be stored under.
 */
export function generateLinkID(
  tableId1: string,
  tableId2: string,
  rowId1: string,
  rowId2: string,
  fieldName1: string,
  fieldName2: string
) {
  const tables = `${SEPARATOR}${tableId1}${SEPARATOR}${tableId2}`
  const rows = `${SEPARATOR}${rowId1}${SEPARATOR}${rowId2}`
  const fields = `${SEPARATOR}${fieldName1}${SEPARATOR}${fieldName2}`
  return `${DocumentType.LINK}${tables}${rows}${fields}`
}

/**
 * Gets parameters for retrieving link docs, this is a utility function for the getDocParams function.
 */
export function getLinkParams(otherProps: any = {}) {
  return getDocParams(DocumentType.LINK, null, otherProps)
}

/**
 * Generates a new layout ID.
 * @returns {string} The new layout ID which the layout doc can be stored under.
 */
export function generateLayoutID(id?: string) {
  return `${DocumentType.LAYOUT}${SEPARATOR}${id || newid()}`
}

/**
 * Gets parameters for retrieving layout, this is a utility function for the getDocParams function.
 */
export function getLayoutParams(layoutId?: Optional, otherProps: any = {}) {
  return getDocParams(DocumentType.LAYOUT, layoutId, otherProps)
}

/**
 * Generates a new screen ID.
 * @returns {string} The new screen ID which the screen doc can be stored under.
 */
export function generateScreenID() {
  return `${DocumentType.SCREEN}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving screens, this is a utility function for the getDocParams function.
 */
export function getScreenParams(screenId?: Optional, otherProps: any = {}) {
  return getDocParams(DocumentType.SCREEN, screenId, otherProps)
}

/**
 * Generates a new webhook ID.
 * @returns {string} The new webhook ID which the webhook doc can be stored under.
 */
export function generateWebhookID() {
  return `${DocumentType.WEBHOOK}${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving a webhook, this is a utility function for the getDocParams function.
 */
export function getWebhookParams(webhookId?: Optional, otherProps: any = {}) {
  return getDocParams(DocumentType.WEBHOOK, webhookId, otherProps)
}

/**
 * Generates a new datasource ID.
 * @returns {string} The new datasource ID which the webhook doc can be stored under.
 */
export function generateDatasourceID({ plus = false } = {}) {
  return `${
    plus ? DocumentType.DATASOURCE_PLUS : DocumentType.DATASOURCE
  }${SEPARATOR}${newid()}`
}

/**
 * Gets parameters for retrieving a datasource, this is a utility function for the getDocParams function.
 */
export function getDatasourceParams(
  datasourceId?: Optional,
  otherProps: any = {}
) {
  return getDocParams(DocumentType.DATASOURCE, datasourceId, otherProps)
}

export function getDatasourcePlusParams(
  datasourceId?: Optional,
  otherProps?: { include_docs: boolean }
) {
  return getDocParams(DocumentType.DATASOURCE_PLUS, datasourceId, otherProps)
}

/**
 * Generates a new query ID.
 * @returns {string} The new query ID which the query doc can be stored under.
 */
export function generateQueryID(datasourceId: string) {
  return `${
    DocumentType.QUERY
  }${SEPARATOR}${datasourceId}${SEPARATOR}${newid()}`
}

/**
 * Generates a metadata ID for automations, used to track errors in recurring
 * automations etc.
 */
export function generateAutomationMetadataID(automationId: string) {
  return `${DocumentType.AUTOMATION_METADATA}${SEPARATOR}${automationId}`
}

/**
 * Retrieve all automation metadata in an app database.
 */
export function getAutomationMetadataParams(otherProps: any = {}) {
  return getDocParams(DocumentType.AUTOMATION_METADATA, null, otherProps)
}

/**
 * Gets parameters for retrieving a query, this is a utility function for the getDocParams function.
 */
export function getQueryParams(datasourceId?: Optional, otherProps: any = {}) {
  if (datasourceId == null) {
    return getDocParams(DocumentType.QUERY, null, otherProps)
  }

  return getDocParams(
    DocumentType.QUERY,
    `${datasourceId}${SEPARATOR}`,
    otherProps
  )
}

/**
 * Generates a new flag document ID.
 * @returns {string} The ID of the flag document that was generated.
 */
export function generateUserFlagID(userId: string) {
  return `${DocumentType.USER_FLAG}${SEPARATOR}${userId}`
}

export function generateMetadataID(type: string, entityId: string) {
  return `${DocumentType.METADATA}${SEPARATOR}${type}${SEPARATOR}${entityId}`
}

export function getMetadataParams(
  type: string,
  entityId?: Optional,
  otherProps: any = {}
) {
  let docId = `${type}${SEPARATOR}`
  if (entityId != null) {
    docId += entityId
  }
  return getDocParams(DocumentType.METADATA, docId, otherProps)
}

export function generateMemoryViewID(viewName: string) {
  return `${DocumentType.MEM_VIEW}${SEPARATOR}${viewName}`
}

export function getMemoryViewParams(otherProps: any = {}) {
  return getDocParams(DocumentType.MEM_VIEW, null, otherProps)
}

export function generatePluginID(name: string) {
  return `${DocumentType.PLUGIN}${SEPARATOR}${name}`
}

/**
 * This can be used with the db.allDocs to get a list of IDs
 */
export function getMultiIDParams(ids: string[]) {
  return {
    keys: ids,
    include_docs: true,
  }
}

/**
 * Generates a new view ID.
 * @returns {string} The new view ID which the view doc can be stored under.
 */
export function generateViewID(tableId: string) {
  return `${
    VirtualDocumentType.VIEW
  }${SEPARATOR}${tableId}${SEPARATOR}${newid()}`
}

export function isViewID(viewId: string) {
  return viewId?.split(SEPARATOR)[0] === VirtualDocumentType.VIEW
}

export function extractViewInfoFromID(viewId: string) {
  if (!isViewID(viewId)) {
    throw new Error("Unable to extract table ID, is not a view ID")
  }
  const split = viewId.split(SEPARATOR)
  split.shift()
  viewId = split.join(SEPARATOR)
  const regex = new RegExp(`^(?<tableId>.+)${SEPARATOR}([^${SEPARATOR}]+)$`)
  const res = regex.exec(viewId)
  return {
    tableId: res!.groups!["tableId"],
  }
}

export function isRelationshipColumn(
  column: FieldSchema
): column is RelationshipFieldMetadata {
  return column.type === FieldTypes.LINK
}
