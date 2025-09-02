import { APP_DEV_PREFIX, APP_PREFIX } from "../constants"
import { Workspace } from "@budibase/types"

const NO_WORKSPACE_ERROR = "No workspace provided"

export function isDevWorkspaceID(workspaceId?: string) {
  if (!workspaceId) {
    throw NO_WORKSPACE_ERROR
  }
  return workspaceId.startsWith(APP_DEV_PREFIX)
}

export function isProdWorkspaceID(workspaceId?: string) {
  if (!workspaceId) {
    throw NO_WORKSPACE_ERROR
  }
  return workspaceId.startsWith(APP_PREFIX) && !isDevWorkspaceID(workspaceId)
}

export function isDevWorkspace(workspace: Workspace) {
  if (!workspace) {
    throw NO_WORKSPACE_ERROR
  }
  return isDevWorkspaceID(workspace.appId)
}

/**
 * Generates a development workspace ID from a real workspace ID.
 * @returns the dev workspace ID which can be used for dev database.
 */
export function getDevelopmentWorkspaceID(workspaceId: string) {
  if (!workspaceId || workspaceId.startsWith(APP_DEV_PREFIX)) {
    return workspaceId
  }
  // split to take off the app_ element, then join it together incase any other app_ exist
  const split = workspaceId.split(APP_PREFIX)
  split.shift()
  const rest = split.join(APP_PREFIX)
  return `${APP_DEV_PREFIX}${rest}`
}
export const getDevWorkspaceID = getDevelopmentWorkspaceID

/**
 * Convert a development workspace ID to a deployed workspace ID.
 */
export function getProdWorkspaceID(workspaceId: string) {
  if (!workspaceId || !workspaceId.startsWith(APP_DEV_PREFIX)) {
    return workspaceId
  }
  // split to take off the app_dev element, then join it together incase any other app_ exist
  const split = workspaceId.split(APP_DEV_PREFIX)
  split.shift()
  const rest = split.join(APP_DEV_PREFIX)
  return `${APP_PREFIX}${rest}`
}

export function extractWorkspaceUUID(id: string) {
  const split = id?.split("_") || []
  return split.length ? split[split.length - 1] : null
}
