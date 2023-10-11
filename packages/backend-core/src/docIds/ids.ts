import {
  APP_PREFIX,
  DocumentType,
  InternalTable,
  SEPARATOR,
} from "../constants"
import { newid } from "./newid"

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
 * Generates a new workspace ID.
 * @returns {string} The new workspace ID which the workspace doc can be stored under.
 */
export function generateWorkspaceID() {
  return `${DocumentType.WORKSPACE}${SEPARATOR}${newid()}`
}

/**
 * Generates a new global user ID.
 * @returns {string} The new user ID which the user doc can be stored under.
 */
export function generateGlobalUserID(id?: any) {
  return `${DocumentType.USER}${SEPARATOR}${id || newid()}`
}

const isGlobalUserIDRegex = new RegExp(`^${DocumentType.USER}${SEPARATOR}.+`)
export function isGlobalUserID(id: string) {
  return isGlobalUserIDRegex.test(id)
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
 * Generates a new role ID.
 * @returns {string} The new role ID which the role doc can be stored under.
 */
export function generateRoleID(name: string) {
  const prefix = `${DocumentType.ROLE}${SEPARATOR}`
  if (name.startsWith(prefix)) {
    return name
  }
  return `${prefix}${name}`
}

/**
 * Utility function to be more verbose.
 */
export function prefixRoleID(name: string) {
  return generateRoleID(name)
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
