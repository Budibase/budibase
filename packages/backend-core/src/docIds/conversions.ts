import { Workspace } from "@budibase/types"
import { WORKSPACE_DEV_PREFIX, WORKSPACE_PREFIX } from "../constants"

const NO_WORKSPACE_ERROR = "No app provided"

export function isDevWorkspaceID(workspaceId?: string) {
  if (!workspaceId) {
    throw NO_WORKSPACE_ERROR
  }
  return workspaceId.startsWith(WORKSPACE_DEV_PREFIX)
}

export function isProdWorkspaceID(workspaceId?: string) {
  if (!workspaceId) {
    throw NO_WORKSPACE_ERROR
  }
  return (
    workspaceId.startsWith(WORKSPACE_PREFIX) && !isDevWorkspaceID(workspaceId)
  )
}

export function isDevWorkspace(workspace: Workspace) {
  if (!workspace) {
    throw NO_WORKSPACE_ERROR
  }
  return isDevWorkspaceID(workspace.appId)
}

/**
 * Generates a development app ID from a real app ID.
 * @returns the dev app ID which can be used for dev database.
 */
export function getDevWorkspaceID(workspaceId: string) {
  if (!workspaceId || workspaceId.startsWith(WORKSPACE_DEV_PREFIX)) {
    return workspaceId
  }
  // split to take off the app_ element, then join it together incase any other app_ exist
  const split = workspaceId.split(WORKSPACE_PREFIX)
  split.shift()
  const rest = split.join(WORKSPACE_PREFIX)
  return `${WORKSPACE_DEV_PREFIX}${rest}`
}

/**
 * Convert a development app ID to a deployed app ID.
 */
export function getProdWorkspaceID(appId: string) {
  if (!appId || !appId.startsWith(WORKSPACE_DEV_PREFIX)) {
    return appId
  }
  // split to take off the app_dev element, then join it together incase any other app_ exist
  const split = appId.split(WORKSPACE_DEV_PREFIX)
  split.shift()
  const rest = split.join(WORKSPACE_DEV_PREFIX)
  return `${WORKSPACE_PREFIX}${rest}`
}
